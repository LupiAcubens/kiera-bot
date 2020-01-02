import * as APIUrls from '@/api-urls'
import { Collections } from '@/db'
import { ChastiKeyAPIFetchAndStore, ChastiKeyAPIFetchAndStoreMethod } from '@/tasks/templates/ck-api-fetch-store'
import { ChastiKeyVerifiedRoleMonitor } from '@/tasks/templates/ck-verified-monitor'
import { ChastiKeyAPIFetchAndStoreLegacy } from './templates/ck-api-fetch-store-legacy'
// import { ChastiKeyEventRoleMonitor } from '@/tasks/templates/ck-locktober-monitor'

export class ChastiKeyAPIRunningLocks extends ChastiKeyAPIFetchAndStore {
  // Setting the props for this Task
  name = 'ChastiKeyAPIRunningLocks'
  method: ChastiKeyAPIFetchAndStoreMethod = 'fetchAPIRunningLocksDataCache'
  frequency = 1800000 / 2 // 15 minutes (this is the refresh rate of this data)
  dbCollection: Collections = 'ck-running-locks'
}

// export class ChastiKeyAPIKeyholders extends ChastiKeyAPIFetchAndStoreLegacy {
//   // Setting the props for this Task
//   name = 'ChastiKeyAPIKeyholders'
//   APIEndpoint = APIUrls.ChastiKey.CachedKeyholderData
//   frequency = 1800000 / 2 // 15 minutes (this is the refresh rate of this data)
//   dbCollection: Collections = 'ck-keyholders'
// }

export class ChastiKeyAPIUsers extends ChastiKeyAPIFetchAndStore {
  // Setting the props for this Task
  name = 'ChastiKeyAPIUsers'
  method: ChastiKeyAPIFetchAndStoreMethod = 'fetchAPIUserDataCache'
  frequency = 1800000 / 2 // 15 minutes
  dbCollection: Collections = 'ck-users'
}

export class ChastiKeyAPILocktober extends ChastiKeyAPIFetchAndStoreLegacy {
  // Setting the props for this Task
  name = 'ChastiKeyAPILocktober'
  APIEndpoint = APIUrls.ChastiKey.CachedLocktober
  frequency = 1800000 / 2 // 15 minutes
  dbCollection: Collections = 'ck-locktober'
}

export class ChastiKeyBackgroundVerifiedMonitor extends ChastiKeyVerifiedRoleMonitor {
  // Setting the props for this Task
  name = 'ChastiKeyBackgroundVerifiedMonitor'
  frequency = 1800000 / 30 // 1 minute
  verifiedRole = 'ChastiKey Verified'
}

// export class ChastiKeyBackgroundLocktoberMonitor extends ChastiKeyEventRoleMonitor {
//   // Setting the props for this Task
//   name = 'ChastiKeyBackgroundLocktoberMonitor'
//   frequency = 1800000 / 2 // 15 minutes
//   dbCollection: Collections = 'ck-locktober'
//   eventRole = 'Locktober 2019'
// }
