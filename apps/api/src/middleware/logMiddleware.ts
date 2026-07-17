import { Request, Response, NextFunction } from 'express';
import { ActivityLog } from '../models/ActivityLog';
import { AuthRequest } from './authMiddleware';

export const logActivity = (resource: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    // We only log modifying actions for this requirement (POST, PUT, DELETE)
    // Optionally we can log GET if needed, but usually we just want updates
    
    // We want to run the next function first to see if it succeeds, but express middleware doesn't easily await next().
    // So we hook into the finish event of response to log it after the fact.
    
    res.on('finish', async () => {
      // Only log if successful or if it's a specific action
      if (res.statusCode >= 200 && res.statusCode < 400 && req.user) {
        let action = 'READ';
        if (req.method === 'POST') action = 'CREATE';
        if (req.method === 'PUT' || req.method === 'PATCH') action = 'UPDATE';
        if (req.method === 'DELETE') action = 'DELETE';

        if (action !== 'READ') { // only log creations/updates/deletions
          try {
            await ActivityLog.create({
              user: req.user._id,
              action: `${action}_${resource.toUpperCase()}`,
              resource,
              ipAddress: req.ip || req.socket.remoteAddress
            });
          } catch (error) {
            console.error('Error logging activity:', error);
          }
        }
      }
    });

    next();
  };
};
