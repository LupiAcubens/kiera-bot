import { ObjectID } from 'mongodb';
import { Device } from '../integration/lovense/device';

export type SessionTypes =
  | 'Device'
  | 'lovense';

/**
 * Anything that requires a session should extend off this.
 * 
 * Sessions will be anything that are generated by a user and are bot managed
 * tasks for a defined timelimt
 * 
 * @export
 * @class Session
 */
export class Session {
  /**
   * Will be used as the session id
   * @type {ObjectID | string}
   * @memberof DeviceSession
   */
  public _id: ObjectID
  /**
   * User's ID reference to their 'users' collection record
   * @type {ObjectID | string}
   * @memberof DeviceSession
   */
  public uid: ObjectID
  /**
   * Server ID that the message originated from
   * @type {ObjectID | string}
   * @memberof Session
   */
  public sid: ObjectID
  public type: SessionTypes
  public isActive: boolean = false
  public isDeactivated: boolean = false
  public isCompleted: boolean = false
  public activateTimestamp: number = 0
  public deactivateTimestamp: number = 0
  public timeRemaining: number = 0
  public activatedBy: ObjectID
  public deactivatedBy: ObjectID
  public name: string = ''
}

/**
 * A device session is with a toy such as Lovense to accept reactions
 * to adjust time or intensity
 * @export
 * @class DeviceSession
 * @extends {Session}
 * @template T
 */
export class DeviceSession extends Session {
  // /**
  //  * Will be the reference to the specific device like from /integrations/lovense/device.ts
  //  * @type {T}
  //  * @memberof DeviceSession
  //  */
  // public device: T
  public react: {
    /**
     * Time per react
     * @type {number}
     */
    time: number
  }
  public duration: {
    /**
     * Base duration (reacts can modify this)
     * @type {number}
     */
    min: number
    /**
     * Max duration (reacts cannot surpass if set, user limit overrides)
     * @type {number}
     */
    max: number
  }
  public intensity: {
    /**
     * Intensity minimum per react
     * @type {number}
     */
    min: number
    max: number
    modifier: number
  }
  public limit: {
    time: number
    intensity: number
  }
  public reacts: Array<number>

  constructor(init: Partial<DeviceSession | Device>) {
    super()
    Object.assign(
      this,
      {
        // KH
        react: { time: 1 },                             // Time to run each emote
        duration: { min: 0, max: 0 },                   // Base duration (not a max), max cannot be exceeded
        intensity: { min: 0, max: 100, modifier: 10 },  // Minimum & Maximum intensity, min used as starting
        // Lockee
        limit: { time: 0, intensity: 100 },              // User hard limits
        // Reacts tracked by system
        reacts: [3],
        reactsCompleted: 0
      },
      init)
  }

  public activate(uid: ObjectID) {
    this.activateTimestamp = Date.now()
    this.isActive = true
    this.activatedBy = uid
    // Calculate the current end time and store it
    this.deactivateTimestamp = this.getDeactivateTime()
    // Calculate the time remaining value, this should be used by clients fetching
    // from the API in order to not spoof their actual end time (or clock drifting)
    this.timeRemaining = this.getRemainingTime()
  }

  public update() {
    // Calculate the current end time and store it
    this.deactivateTimestamp = this.getDeactivateTime()
    // Calculate the time remaining value, this should be used by clients fetching
    // from the API in order to not spoof their actual end time (or clock drifting)
    this.timeRemaining = this.getRemainingTime()
    // Determine if it should still be active, if not change it
    this.isActive = this.timeRemaining <= 0 ? false : true
    this.isDeactivated = this.timeRemaining <= 0 ? true : false
    this.isCompleted = this.timeRemaining <= 0 ? true : false
  }

  public getDeactivateTime() {
    return (this.activateTimestamp + (this.getTotalReactTime() * 60000))
  }

  public getRemainingTime() {
    const nowDiff = (this.deactivateTimestamp - Date.now())
    const isPastEnd = nowDiff <= 0
    return !isPastEnd ? nowDiff : 0
  }

  public getTotalReactTime() {
    return ((this.reacts.length) * this.react.time)
  }

  public apiOutput() {
    const output = new DeviceSession(this)
    return output
  }
}