import * as errors from 'restify-errors'
import * as Middleware from '@/api/middleware'
import * as Validation from '@/api/validations'
import { validate } from '@/api/utils/validate'
import { WebRouted, WebRoute } from '@/api/web-router'
import { TrackedDecision, TrackedDecisionOption } from '@/objects/decision'
import { ObjectID } from 'bson'
import { TrackedUser } from '@/objects/user'

export const Routes: Array<WebRoute> = [
  {
    controller: getDecision,
    method: 'post',
    name: 'web-decision-as-owner',
    path: '/api/decision',
    middleware: [Middleware.validateSession]
  },
  {
    controller: getDecisions,
    method: 'get',
    name: 'web-decisions-as-owner',
    path: '/api/decisions',
    middleware: [Middleware.validateSession]
  },
  {
    controller: updateDecisionName,
    method: 'patch',
    name: 'web-decision-update-name',
    path: '/api/decision/name',
    middleware: [Middleware.validateSession]
  },
  {
    controller: updateDecisionDescription,
    method: 'patch',
    name: 'web-decision-update-description',
    path: '/api/decision/description',
    middleware: [Middleware.validateSession]
  },
  {
    controller: enableDecision,
    method: 'patch',
    name: 'web-decision-update-enabled',
    path: '/api/decision/enabled',
    middleware: [Middleware.validateSession]
  },
  {
    controller: addDecisionOutcome,
    method: 'put',
    name: 'web-decision-new-outcome',
    path: '/api/decision/outcome',
    middleware: [Middleware.validateSession]
  },
  {
    controller: updateDecisionOutcome,
    method: 'patch',
    name: 'web-decision-update-outcome',
    path: '/api/decision/outcome',
    middleware: [Middleware.validateSession]
  },
  {
    controller: deleteDecisionOutcome,
    method: 'delete',
    name: 'web-decision-new-outcome',
    path: '/api/decision/outcome',
    middleware: [Middleware.validateSession]
  },
  {
    controller: addDecision,
    method: 'put',
    name: 'web-decision-new',
    path: '/api/decision',
    middleware: [Middleware.validateSession]
  },
  {
    controller: deleteDecision,
    method: 'delete',
    name: 'web-decision-delete',
    path: '/api/decision',
    middleware: [Middleware.validateSession]
  }
]

export async function getDecision(routed: WebRouted) {
  const v = await validate(Validation.Decisions.getDecision(), routed.req.body)
  if (v.valid) {
    const decision = await routed.Bot.DB.get<TrackedDecision>('decision', {
      _id: new ObjectID(v.o._id),
      authorID: routed.session.userID
    })

    if (decision) return routed.res.send({ status: 'fetchedOne', success: true, data: new TrackedDecision(decision) })
    return routed.res.send({ status: 'failed', success: false })
  }

  return routed.next(new errors.BadRequestError())
}

export async function getDecisions(routed: WebRouted) {
  const decisions = await routed.Bot.DB.getMultiple<TrackedDecision>('decision', {
    authorID: routed.session.userID
  })

  if (decisions.length) {
    return routed.res.send(decisions.map(d => new TrackedDecision(d)))
  }

  return routed.next(new errors.BadRequestError())
}

export async function deleteDecision(routed: WebRouted) {
  const v = await validate(Validation.Decisions.deleteDecision(), routed.req.body)

  if (v.valid) {
    // Get user from users collection
    const user = new TrackedUser(
      await routed.Bot.DB.get<TrackedUser>('users', { id: routed.session.userID })
    )

    var deleteCount = await routed.Bot.DB.remove<TrackedDecision>('decision', {
      _id: new ObjectID(v.o._id),
      authorID: user.id
    })

    if (deleteCount > 0) return routed.res.send({ status: 'deleted', success: true })
    return routed.res.send({ status: 'failed', success: false })
  }

  // On error
  return routed.next(new errors.BadRequestError())
}

export async function updateDecisionOutcome(routed: WebRouted) {
  const v = await validate(Validation.Decisions.update(), routed.req.body)

  if (v.valid) {
    // Get user from users collection
    const user = new TrackedUser(
      await routed.Bot.DB.get<TrackedUser>('users', { id: routed.session.userID })
    )

    const updateCount = await routed.Bot.DB.update(
      'decision',
      { authorID: user.id, 'options._id': new ObjectID(v.o._id) },
      {
        $set: {
          'options.$.text': v.o.text,
          'options.$.type': v.o.type
        }
      },
      { atomic: true }
    )

    if (updateCount > 0) return routed.res.send({ status: 'updated', success: true })
    return routed.res.send({ status: 'failed', success: false })
  }

  // On error
  return routed.next(new errors.BadRequestError())
}

export async function updateDecisionName(routed: WebRouted) {
  const v = await validate(Validation.Decisions.updateOutcomeName(), routed.req.body)

  if (v.valid) {
    // Get user from users collection
    const user = new TrackedUser(
      await routed.Bot.DB.get<TrackedUser>('users', { id: routed.session.userID })
    )

    const updateCount = await routed.Bot.DB.update(
      'decision',
      { authorID: user.id, _id: new ObjectID(v.o._id) },
      {
        $set: {
          name: v.o.name
        }
      },
      { atomic: true }
    )

    if (updateCount > 0) return routed.res.send({ status: 'updated', success: true })
    return routed.res.send({ status: 'failed', success: false })
  }

  // On error
  return routed.next(new errors.BadRequestError())
}

export async function updateDecisionDescription(routed: WebRouted) {
  const v = await validate(Validation.Decisions.updateOutcomeDescription(), routed.req.body)

  if (v.valid) {
    // Get user from users collection
    const user = new TrackedUser(
      await routed.Bot.DB.get<TrackedUser>('users', { id: routed.session.userID })
    )

    const updateCount = await routed.Bot.DB.update(
      'decision',
      { authorID: user.id, _id: new ObjectID(v.o._id) },
      {
        $set: {
          description: v.o.description
        }
      },
      { atomic: true }
    )

    if (updateCount > 0) return routed.res.send({ status: 'updated', success: true })
    return routed.res.send({ status: 'failed', success: false })
  }

  // On error
  return routed.next(new errors.BadRequestError())
}

export async function deleteDecisionOutcome(routed: WebRouted) {
  const v = await validate(Validation.Decisions.deleteOutcome(), routed.req.body)

  if (v.valid) {
    // Get user from users collection
    const user = new TrackedUser(
      await routed.Bot.DB.get<TrackedUser>('users', { id: routed.session.userID })
    )

    var deleteCount = await routed.Bot.DB.update<TrackedDecision>(
      'decision',
      <any>{ authorID: user.id, 'options._id': new ObjectID(v.o._id) },
      { $pull: { options: { _id: new ObjectID(v.o._id) } } },
      { atomic: true }
    )

    if (deleteCount > 0) return routed.res.send({ status: 'deleted', success: true })
    return routed.res.send({ status: 'failed', success: false })
  }

  // On error
  return routed.next(new errors.BadRequestError())
}

export async function addDecisionOutcome(routed: WebRouted) {
  const v = await validate(Validation.Decisions.addOutcome(), routed.req.body)

  if (v.valid) {
    // Get user from users collection
    const user = new TrackedUser(
      await routed.Bot.DB.get<TrackedUser>('users', { id: routed.session.userID })
    )
    const newDecisionOutcome = new TrackedDecisionOption({ text: v.o.text, type: v.o.type })

    const addOutcome = await routed.Bot.DB.update<TrackedDecision>(
      'decision',
      { _id: new ObjectID(v.o._id), authorID: user.id },
      { $push: { options: newDecisionOutcome } },
      { atomic: true }
    )

    if (addOutcome > 0)
      return routed.res.send({
        status: 'added',
        success: true,
        data: newDecisionOutcome
      })
    return routed.res.send({ status: 'failed', success: false })
  }

  // On error
  return routed.next(new errors.BadRequestError())
}

export async function addDecision(routed: WebRouted) {
  const v = await validate(Validation.Decisions.addDecision(), routed.req.body)

  if (v.valid) {
    // Get user from users collection
    const user = new TrackedUser(
      await routed.Bot.DB.get<TrackedUser>('users', { id: routed.session.userID })
    )
    const newDeicison = new TrackedDecision({ name: v.o.name, authorID: user.id, serverID: '473856867768991744' })

    const decisionId = await routed.Bot.DB.add<TrackedDecision>('decision', newDeicison)

    if (decisionId) {
      return routed.res.send({
        status: 'added',
        success: true,
        id: decisionId
      })
    }

    return routed.res.send({ status: 'failed', success: false })
  }

  // On error
  return routed.next(new errors.BadRequestError())
}

export async function enableDecision(routed: WebRouted) {
  const v = await validate(Validation.Decisions.enableDecision(), routed.req.body)

  if (v.valid) {
    // Get user from users collection
    const user = new TrackedUser(
      await routed.Bot.DB.get<TrackedUser>('users', { id: routed.session.userID })
    )

    const updateCount = await routed.Bot.DB.update(
      'decision',
      { authorID: user.id, _id: new ObjectID(v.o._id) },
      {
        $set: {
          enabled: v.o.enabled
        }
      },
      { atomic: true }
    )

    if (updateCount > 0) return routed.res.send({ status: 'updated', success: true })
    return routed.res.send({ status: 'failed', success: false })
  }

  // On error
  return routed.next(new errors.BadRequestError())
}