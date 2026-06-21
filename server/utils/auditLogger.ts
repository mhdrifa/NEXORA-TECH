import { db } from '../../src/db/index.ts';
import { auditLogs } from '../../src/db/schema.ts';
import { Request } from 'express';

export const logAudit = async (
  req: Request | null,
  action: string,
  entity?: string,
  entityId?: string,
  details?: Record<string, any>,
  userId?: number // We can pass this directly if req doesn't have it explicitly mapped yet
) => {
  try {
    const ipAddress = req ? (req.headers['x-forwarded-for'] as string || req.socket.remoteAddress) : undefined;
    const userAgent = req ? req.headers['user-agent'] : undefined;

    await db.insert(auditLogs).values({
      userId,
      action,
      entity,
      entityId: entityId ? String(entityId) : null,
      ipAddress,
      userAgent,
      details: details || null
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
};
