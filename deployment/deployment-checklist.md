# Deployment Checklist

> Complete this checklist before every production deployment.

---

## Pre-Deployment

### Code Quality
- [ ] All linting passes (`npm run lint` in client and server)
- [ ] No TypeScript errors (`npm run build` in client)
- [ ] All tests pass (if applicable)
- [ ] No `console.log` statements in production code (use structured logger)
- [ ] No hardcoded secrets or API keys in source code
- [ ] All environment variables use `process.env`

### Environment Variables
- [ ] `MONGODB_URI` is set to the production Atlas cluster
- [ ] `JWT_SECRET` is a unique, random 64+ character string
- [ ] `GEMINI_API_KEY` is valid and has sufficient quota
- [ ] `CLIENT_URL` matches the Vercel deployment URL
- [ ] `NEXT_PUBLIC_API_URL` matches the Render deployment URL
- [ ] `NEXT_PUBLIC_SOCKET_URL` matches the Render deployment URL
- [ ] All Firebase environment variables are set on Vercel
- [ ] Firebase service account is configured on Render

### Database
- [ ] MongoDB Atlas cluster is running
- [ ] IP whitelist includes Render's IP addresses (or `0.0.0.0/0`)
- [ ] Database indexes are created for frequently queried fields
- [ ] Database user has appropriate permissions (read/write, not admin)

### Security
- [ ] CORS origins are restricted to production domains only
- [ ] Rate limiting is enabled on authentication endpoints
- [ ] Helmet middleware is active
- [ ] JWT tokens have a reasonable expiry (e.g., 7 days)
- [ ] Password hashing uses bcrypt with >= 10 salt rounds

---

## Deployment

### Backend (Render)
- [ ] Push code to the deployment branch
- [ ] Verify Render detects the new commit
- [ ] Monitor deployment logs for errors
- [ ] Verify the health check endpoint returns `200`
- [ ] Verify Socket.IO connection works

### Frontend (Vercel)
- [ ] Push code to the deployment branch (or run `vercel --prod`)
- [ ] Verify Vercel build completes without errors
- [ ] Verify the deployment URL is accessible
- [ ] Check that environment variables are correctly injected

---

## Post-Deployment Verification

### Functional Tests
- [ ] Landing page loads correctly
- [ ] User can sign up with a new account
- [ ] User can log in with existing credentials
- [ ] Dashboard displays correctly after login
- [ ] Emergency trigger button works
- [ ] Emergency session is created and visible in the dashboard
- [ ] AI risk assessment is generated and displayed
- [ ] Trusted contacts receive notifications (if FCM is configured)
- [ ] Heartbeat pings are sent and acknowledged
- [ ] Map loads and displays user location
- [ ] Safe route suggestions are generated
- [ ] Reports can be generated and downloaded
- [ ] User can update their profile
- [ ] User can add/remove trusted contacts
- [ ] Logout works and redirects to the home page

### Performance
- [ ] Page load time is under 3 seconds (Lighthouse)
- [ ] API response time is under 500ms for standard endpoints
- [ ] AI response time is under 15 seconds for all tasks
- [ ] Socket.IO connection is stable with no frequent disconnects

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

---

## Rollback Plan

If issues are detected post-deployment:

1. **Immediate**: Roll back via Vercel/Render dashboard
2. **Database**: If schema changes were made, ensure backward compatibility
3. **Communication**: Notify the team of the rollback and root cause
4. **Fix**: Address the issue, test, and re-deploy

---

## Sign-Off

| Role | Name | Date | Status |
|---|---|---|---|
| Developer | | | ☐ Approved |
| Reviewer | | | ☐ Approved |
| Deployer | | | ☐ Deployed |
