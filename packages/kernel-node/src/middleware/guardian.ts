/**
 * Guardian Interceptor Middleware
 * 
 * Wraps all RPC and HTTP requests with Guardian safety validation.
 * 
 * Three-layer protection:
 * 1. Adversarial pattern filters
 * 2. KL-divergence drift detection
 * 3. Byzantine consensus voting (for critical operations)
 */

import type { Interceptor } from '@connectrpc/connect';
import type { FastifyInstance } from 'fastify';

/**
 * Guardian gRPC Interceptor
 * 
 * Validates all RPC calls via Neurasphere before execution.
 */
export function guardianInterceptor(app: FastifyInstance): Interceptor {
  return (next) => async (req) => {
    const methodName = req.method.name;
    const serviceName = req.method.service.typeName;
    
    app.log.debug(`🛡️  Guardian checking: ${serviceName}.${methodName}`);
    
    // Skip health checks
    if (methodName === 'Health') {
      return next(req);
    }
    
    // ═══════════════════════════════════════════════════════════
    // VALIDATE VIA GUARDIAN
    // ═══════════════════════════════════════════════════════════
    
    if (app.guardian) {
      try {
        const guardResult = await app.guardian.guard({
          source: `${serviceName}.${methodName}`,
          inputJson: JSON.stringify(req.message),
          contextJson: JSON.stringify({
            service: serviceName,
            method: methodName,
            timestamp: new Date().toISOString()
          })
        });
        
        // BLOCKED - Reject request
        if (guardResult.status === 'BLOCKED') {
          app.log.warn(`  🚫 Guardian BLOCKED: ${serviceName}.${methodName}`);
          app.log.warn(`    Violations: ${guardResult.violations.join(', ')}`);
          
          throw new Error(`Blocked by Guardian: ${guardResult.violations.join(', ')}`);
        }
        
        // ROLLBACK - Use sanitized version
        if (guardResult.status === 'ROLLBACK') {
          app.log.info(`  🔄 Guardian sanitized input`);
          
          const sanitized = JSON.parse(guardResult.safeOutputJson);
          req.message = sanitized;
        }
        
        // OK - Proceed
        app.log.debug(`  ✅ Guardian approved`);
        
      } catch (err) {
        app.log.error(`  ⚠️  Guardian error: ${err}`);
        // Fail-open: proceed if Guardian unavailable
      }
    }
    
    // Execute request
    return next(req);
  };
}

/**
 * Guardian HTTP Middleware
 * 
 * Validates HTTP requests via Neurasphere.
 */
export async function guardianHttpMiddleware(
  request: any,
  reply: any,
  app: FastifyInstance
) {
  const path = request.url;
  const method = request.method;
  
  // Skip health checks
  if (path === '/health') {
    return;
  }
  
  app.log.debug(`🛡️  Guardian checking HTTP: ${method} ${path}`);
  
  if (app.guardian) {
    try {
      const guardResult = await app.guardian.guard({
        source: `http:${method}:${path}`,
        inputJson: JSON.stringify(request.body || {}),
        contextJson: JSON.stringify({
          method,
          path,
          headers: request.headers,
          timestamp: new Date().toISOString()
        })
      });
      
      if (guardResult.status === 'BLOCKED') {
        app.log.warn(`  🚫 Guardian BLOCKED: ${method} ${path}`);
        
        return reply.code(403).send({
          error: 'Blocked by Guardian',
          violations: guardResult.violations
        });
      }
      
      if (guardResult.status === 'ROLLBACK') {
        app.log.info(`  🔄 Guardian sanitized request`);
        request.body = JSON.parse(guardResult.safeOutputJson);
      }
      
      app.log.debug(`  ✅ Guardian approved`);
      
    } catch (err) {
      app.log.error(`  ⚠️  Guardian error: ${err}`);
      // Fail-open: proceed if Guardian unavailable
    }
  }
}

/**
 * Register Guardian HTTP middleware
 */
export function registerGuardianMiddleware(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    await guardianHttpMiddleware(request, reply, app);
  });
}

