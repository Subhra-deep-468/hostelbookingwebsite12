# Deployment Guide

## Deploying the Student Hostel Booking Application

This guide covers deploying both frontend and backend to production.

## Frontend Deployment (Vercel/Netlify)

### Using Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy to Vercel**
   ```bash
   vercel
   ```

4. **Configure environment**
   - Set `REACT_APP_API_URL` to your backend URL in Vercel dashboard
   - Update `frontend/src/utils/api.js` to use this URL:
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
   ```

### Using Netlify

1. **Build the project**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `build`

3. **Add environment variables**
   - In Netlify dashboard, add `REACT_APP_API_URL`

## Backend Deployment (Heroku/Railway/Render)

### Using Heroku

1. **Install Heroku CLI**
   - Download from [heroku.com](https://www.heroku.com/home)

2. **Login**
   ```bash
   heroku login
   ```

3. **Create app**
   ```bash
   cd backend
   heroku create your-app-name
   ```

4. **Add environment variables**
   ```bash
   heroku config:set PORT=5000
   heroku config:set MONGODB_URL=<your-mongodb-url>
   heroku config:set JWT_SECRET=<your-secret-key>
   heroku config:set JWT_EXPIRE=7d
   ```

5. **Update Procfile**
   Create `backend/Procfile`:
   ```
   web: node server.js
   ```

6. **Deploy**
   ```bash
   git push heroku main
   ```

### Using Railway

1. **Connect GitHub repository**
2. **Add environment variables**
3. **Railway will auto-deploy**

### Using Render

1. **Create account at [render.com](https://render.com)**
2. **Connect GitHub**
3. **Create new Web Service**
4. **Configure:**
   - Build command: `npm install`
   - Start command: `node server.js`
   - Add environment variables
5. **Deploy**

## Update Frontend API URL

Update `frontend/src/utils/api.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.com/api';
```

## Update Backend CORS

Update `backend/server.js`:

```javascript
app.use(cors({
  origin: ['https://your-frontend-url.com', 'http://localhost:3000'],
  credentials: true
}));
```

## Database Considerations

### MongoDB Atlas
- Already configured with `studenthostel` database
- Ensure IP whitelist includes your deployment servers
- Check connection limits for production usage

### Backup
```bash
# Export data
mongodump --uri "mongodb+srv://student:student@cluster0.zzgad9z.mongodb.net/studenthostel"

# Import data
mongorestore --uri "mongodb+srv://student:student@cluster0.zzgad9z.mongodb.net/studenthostel" ./dump
```

## Production Checklist

- [ ] Change JWT_SECRET to a strong random value
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS only
- [ ] Set up proper CORS
- [ ] Add rate limiting to backend
- [ ] Implement logging (e.g., Winston)
- [ ] Add error tracking (e.g., Sentry)
- [ ] Enable MongoDB SSL connection
- [ ] Setup database backups
- [ ] Add CDN for static files
- [ ] Enable compression on backend
- [ ] Add security headers
- [ ] Test all API endpoints
- [ ] Setup monitoring/alerting
- [ ] Document deployment process

## Environment Variables Template

### Backend
```
PORT=5000
MONGODB_URL=mongodb+srv://user:password@cluster.mongodb.net/dbname
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=production
```

### Frontend
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

## Monitoring & Logging

### Backend Logging
```bash
npm install winston
```

### Error Tracking
- Sentry
- Bugsnag
- LogRocket

### Performance Monitoring
- Google Analytics
- Mixpanel
- Hotjar

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main, deploy]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install backend dependencies
        run: cd backend && npm install
      
      - name: Run backend tests
        run: cd backend && npm test
      
      - name: Deploy backend
        run: # your deployment commands
```

## Troubleshooting

### Cold start issues
- Use warmup services like Kping
- Implement health check endpoint

### Database timeout
- Increase connection pool size
- Check network connectivity
- Verify firewall rules

### API rate limiting
- Implement rate limiting middleware
- Use API gateway

### Performance issues
- Enable caching
- Optimize database queries
- Use CDN for assets
- Implement pagination

## Post-Deployment

1. **Test all features**
   - User registration
   - Search functionality
   - Booking system
   - Dashboard operations

2. **Monitor performance**
   - Check response times
   - Monitor error rates
   - Track database metrics

3. **User feedback**
   - Collect bug reports
   - Track usage patterns
   - Plan improvements

## Rollback Procedure

```bash
# Heroku
heroku releases
heroku rollback v<n>

# Vercel
vercel --prod rollback
```

## Support

For deployment issues, refer to:
- [Heroku Docs](https://devcenter.heroku.com/)
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)

---

**Successful deployment! 🚀**
