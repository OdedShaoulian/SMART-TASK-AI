# Backend Deployment to Azure App Service

## Overview
This backend is deployed to Azure App Service using Run-From-Package deployment with TypeScript compilation.

## Azure App Service Configuration
The following settings must be configured in the Azure portal:

- **WEBSITE_RUN_FROM_PACKAGE=1** - Enables Run-From-Package deployment
- **SCM_DO_BUILD_DURING_DEPLOYMENT=0** - Disables Kudu build process
- **ENABLE_ORYX_BUILD=false** - Disables Oryx build system

## Deployment Flow
1. **Build**: TypeScript compilation to `dist/` folder
2. **Verify**: Check that `dist/routes/clerkRoutes.js` exists
3. **Package**: Install production dependencies only
4. **Zip**: Create `backend-deployment.zip` containing:
   - `dist/` (compiled TypeScript)
   - `node_modules/` (production dependencies)
   - `package.json`
   - `package-lock.json`
5. **Deploy**: Upload to Azure App Service

## Runtime
- **Entry Point**: `node dist/index.js`
- **Port**: `process.env.PORT` (fallback: 3000)
- **Startup**: Server logs "🚀 SmartTask AI Server running at http://localhost:{PORT}"

## Verification
- Kudu logs should show `node dist/index.js` starting
- No Oryx extraction logs should appear
- App should respond on the configured port

## Troubleshooting
If `dist/routes/clerkRoutes.js` is missing:
1. Check TypeScript compilation in CI logs
2. Verify `src/routes/clerkRoutes.ts` exists
3. Ensure `tsconfig.json` includes `src/**/*.ts`
