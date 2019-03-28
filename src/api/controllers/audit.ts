import * as Validation from '../validations/index';
import * as errors from 'restify-errors';
import { validate } from '../utils/validate';
import { WebRouted } from '../web-router';
import { TrackedNotification } from '../../objects/notification';
import { AuditEntry } from '../../objects/audit';

export namespace Audit {
  export async function getEntries(routed: WebRouted) {
    // const v = await validate(Validation.Audit.getAll(), routed.req.body)
    // User & Token from header
    const id = routed.req.header('id')

    var auditEntries = await routed.Bot.DB.getMultiple<AuditEntry>('audit-log', {
      owner: id
    })

    // Sort Desc on date
    auditEntries.sort((a, b) => {
      var x = a.timestamp;
      var y = b.timestamp;
      if (x > y) { return -1; }
      if (x < y) { return 1; }
      return 0;
    })

    return routed.res.send(auditEntries);
  }
}