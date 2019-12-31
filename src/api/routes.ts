import { WebRoute } from '@/api/web-router'
import * as WebController from '@/api/controllers'
import * as Middleware from '@/api/middleware'

export const routes: Array<WebRoute> = [
  /*
   * Audit
   */
  {
    controller: WebController.Audit.getEntries,
    method: 'post',
    name: 'audit-log',
    path: '/api/audit',
    middleware: [Middleware.validateSession]
  },
  /*
   * Available
   */
  {
    controller: WebController.Available.settings,
    method: 'post',
    name: 'available-settings',
    path: '/api/available/settings',
    middleware: [Middleware.validateSession]
  },
  {
    controller: WebController.Available.userGeneric,
    method: 'post',
    name: 'available-user',
    path: '/api/available/user',
    middleware: [Middleware.validateSession]
  },
  /*
   * Lists
   */
  {
    controller: WebController.Lists.get,
    method: 'post',
    name: 'lists-get',
    path: '/api/lists'
  },
  /*
   * Permissions
   */
  {
    controller: WebController.Permissions.getAll,
    method: 'post',
    name: 'permissions-get-all',
    path: '/api/permissions',
    middleware: [Middleware.isAuthenticatedOwner]
  },
  {
    controller: WebController.Permissions.updateGlobal,
    method: 'post',
    name: 'permission-update-global',
    path: '/api/permission/global/update',
    middleware: [Middleware.isAuthenticatedOwner]
  },
  {
    controller: WebController.Permissions.deleteGlobal,
    method: 'delete',
    name: 'permission-delete-global',
    path: '/api/permission/global/delete',
    middleware: [Middleware.isAuthenticatedOwner]
  },
  {
    controller: WebController.Permissions.updateAllowed,
    method: 'post',
    name: 'permission-update-allowed',
    path: '/api/permission/allowed/update',
    middleware: [Middleware.isAuthenticatedOwner]
  },
  /*
   * Server Settings
   */
  {
    controller: WebController.Server.settings,
    method: 'post',
    name: 'server-get-settings',
    path: '/api/server/settings',
    middleware: [Middleware.isAuthenticatedOwner]
  },
  {
    controller: WebController.Server.updateSettings,
    method: 'post',
    name: 'server-update-setting',
    path: '/api/server/setting/update',
    middleware: [Middleware.isAuthenticatedOwner]
  },
  /*
   * Stats
   */
  {
    controller: WebController.Stats.getAll,
    method: 'get',
    name: 'stats-get-all',
    path: '/api/stats'
  },
  /*
   * User
   */
  {
    controller: WebController.User.get,
    method: 'post',
    name: 'user-get',
    path: '/api/user',
    middleware: [Middleware.validateSession]
  },
  {
    controller: WebController.User.update,
    method: 'post',
    name: 'user-update',
    path: '/api/user/update',
    middleware: [Middleware.validateSession]
  },
  {
    controller: WebController.Auth.otl,
    method: 'post',
    name: 'user-otl',
    path: '/api/otl'
  },
  {
    controller: WebController.Auth.verifySession,
    method: 'post',
    name: 'user-session-verify',
    path: '/api/session/verify',
    middleware: [Middleware.validateSession]
  },
  /*
   * Kiera + CK Specific
   */
  // * Kiera+CK Keyholder * //
  {
    controller: WebController.ChastiKey.khData,
    method: 'get',
    name: 'ck-3rd-kh-view',
    path: '/api/ck/keyholder',
    middleware: [Middleware.validateSession]
  },
  // * Kiera+CK Lockee * //
  {
    controller: WebController.ChastiKey.lockeeData,
    method: 'get',
    name: 'ck-3rd-lockee-view',
    path: '/api/ck/lockee',
    middleware: [Middleware.validateSession]
  },
  // * Kiera+CK Stats * //
  {
    controller: WebController.ChastiKeyWebStats.locks,
    method: 'get',
    name: 'ck-stats-locks',
    path: '/api/ck/stats/locks'
  },
  /*
   * Decisions
   */
  {
    controller: WebController.Decisions.getDecisions,
    method: 'get',
    name: 'web-decision-as-owner',
    path: '/api/decisions',
    middleware: [Middleware.validateSession]
  },
  {
    controller: WebController.Decisions.updateDecisionName,
    method: 'patch',
    name: 'web-decision-update-name',
    path: '/api/decision/name',
    middleware: [Middleware.validateSession]
  },
  {
    controller: WebController.Decisions.enableDecision,
    method: 'patch',
    name: 'web-decision-update-enabled',
    path: '/api/decision/enabled',
    middleware: [Middleware.validateSession]
  },
  {
    controller: WebController.Decisions.addDecisionOutcome,
    method: 'put',
    name: 'web-decision-new-outcome',
    path: '/api/decision/outcome',
    middleware: [Middleware.validateSession]
  },
  {
    controller: WebController.Decisions.updateDecisionOutcome,
    method: 'patch',
    name: 'web-decision-update-outcome',
    path: '/api/decision/outcome',
    middleware: [Middleware.validateSession]
  },
  {
    controller: WebController.Decisions.deleteDecisionOutcome,
    method: 'delete',
    name: 'web-decision-new-outcome',
    path: '/api/decision/outcome',
    middleware: [Middleware.validateSession]
  },
  {
    controller: WebController.Decisions.addDecision,
    method: 'put',
    name: 'web-decision-new',
    path: '/api/decision',
    middleware: [Middleware.validateSession]
  },
  {
    controller: WebController.Decisions.deleteDecision,
    method: 'delete',
    name: 'web-decision-delete',
    path: '/api/decision',
    middleware: [Middleware.validateSession]
  }
]
