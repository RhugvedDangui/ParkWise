# ParkWise Deployment Guide

Complete guide for deploying ParkWise to production environments.

---

## 🚀 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)
**Best for:** Quick deployment, automatic scaling

### Option 2: AWS (Full Stack)
**Best for:** Enterprise, custom infrastructure

### Option 3: Docker + Any Cloud Provider
**Best for:** Containerized deployment, portability

---

## 📦 Option 1: Vercel + Railway

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Prepare Frontend**
```bash
cd frontend
npm run build
```

3. **Deploy**
```bash
vercel
```

4. **Configure Environment Variables** in Vercel Dashboard:
```
VITE_API_URL=https://your-backend.railway.app/api
```

5. **Custom Domain** (Optional):
- Go to Vercel Dashboard → Settings → Domains
- Add your custom domain

### Backend Deployment (Railway)

1. **Create Railway Account**: https://railway.app

2. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

3. **Login**
```bash
railway login
```

4. **Initialize Project**
```bash
cd backend
railway init
```

5. **Deploy**
```bash
railway up
```

6. **Get Public URL**
```bash
railway domain
```

7. **Update Frontend** with the Railway URL

---

## 🐳 Option 2: Docker Deployment

### Create Dockerfiles

**Backend Dockerfile** (`backend/Dockerfile`):
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
```

**Frontend Dockerfile** (`frontend/Dockerfile`):
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Frontend nginx.conf** (`frontend/nginx.conf`):
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Docker Compose

**docker-compose.yml** (root directory):
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

### Deploy with Docker

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## ☁️ Option 3: AWS Deployment

### Architecture
- **Frontend**: S3 + CloudFront
- **Backend**: EC2 or ECS
- **Database**: RDS (if adding database)

### Frontend to S3

1. **Build Frontend**
```bash
cd frontend
npm run build
```

2. **Create S3 Bucket**
```bash
aws s3 mb s3://parkwise-frontend
```

3. **Upload Build**
```bash
aws s3 sync dist/ s3://parkwise-frontend --delete
```

4. **Configure Bucket for Static Hosting**
```bash
aws s3 website s3://parkwise-frontend --index-document index.html
```

5. **Setup CloudFront** (Optional but recommended)
- Create CloudFront distribution
- Point to S3 bucket
- Configure SSL certificate

### Backend to EC2

1. **Launch EC2 Instance**
- Ubuntu 22.04 LTS
- t2.micro (or larger)
- Security group: Allow ports 22, 80, 443, 3001

2. **SSH into Instance**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

3. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Install PM2**
```bash
sudo npm install -g pm2
```

5. **Clone and Setup**
```bash
git clone your-repo
cd ParkWise/backend
npm install
```

6. **Start with PM2**
```bash
pm2 start server.js --name parkwise-backend
pm2 startup
pm2 save
```

7. **Setup Nginx Reverse Proxy**
```bash
sudo apt install nginx

sudo nano /etc/nginx/sites-available/parkwise
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/parkwise /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 Security Checklist

### Environment Variables
- [ ] Never commit `.env` files
- [ ] Use environment-specific configs
- [ ] Rotate API keys regularly

### HTTPS
- [ ] Enable SSL/TLS certificates
- [ ] Use Let's Encrypt for free certificates
- [ ] Force HTTPS redirects

### CORS
- [ ] Configure proper CORS origins
- [ ] Don't use `*` in production

**Update backend/server.js:**
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://your-frontend-domain.com');
  // ... rest of CORS config
});
```

### API Security
- [ ] Add rate limiting
- [ ] Implement authentication (JWT)
- [ ] Validate all inputs
- [ ] Use HTTPS only

**Add rate limiting:**
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 📊 Monitoring & Analytics

### Add Application Monitoring

**Install Sentry (Error Tracking)**
```bash
npm install @sentry/react @sentry/node
```

**Frontend (main.tsx):**
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

**Backend (server.js):**
```javascript
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

### Add Analytics

**Google Analytics (Frontend)**
```bash
npm install react-ga4
```

```typescript
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');
ReactGA.send("pageview");
```

---

## 🗄️ Database Migration

### From In-Memory to PostgreSQL

1. **Install PostgreSQL**
```bash
npm install pg
```

2. **Create Database Schema**
```sql
CREATE TABLE parking_spots (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  spot_type VARCHAR(50),
  price_per_hour DECIMAL(10, 2),
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
  id VARCHAR(50) PRIMARY KEY,
  spot_id VARCHAR(50) REFERENCES parking_spots(id),
  user_id VARCHAR(50),
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  license_plate VARCHAR(20),
  total_price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reports (
  id VARCHAR(50) PRIMARY KEY,
  spot_id VARCHAR(50) REFERENCES parking_spots(id),
  user_id VARCHAR(50),
  is_free BOOLEAN,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. **Update Backend** to use database queries instead of arrays

---

## 🔄 CI/CD Pipeline

### GitHub Actions

**Create `.github/workflows/deploy.yml`:**
```yaml
name: Deploy ParkWise

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install and Build
        run: |
          cd frontend
          npm ci
          npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend
```

---

## 📈 Performance Optimization

### Frontend Optimizations

1. **Code Splitting**
```typescript
// Lazy load components
const BookingModal = lazy(() => import('./components/BookingModal'));
```

2. **Image Optimization**
- Use WebP format
- Implement lazy loading
- Add CDN for assets

3. **Bundle Analysis**
```bash
npm install --save-dev vite-plugin-bundle-analyzer
```

### Backend Optimizations

1. **Caching**
```bash
npm install node-cache
```

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 });

app.get('/api/spots', (req, res) => {
  const cacheKey = 'all-spots';
  const cached = cache.get(cacheKey);
  
  if (cached) {
    return res.json(cached);
  }
  
  // ... fetch data
  cache.set(cacheKey, data);
  res.json(data);
});
```

2. **Database Connection Pooling**
3. **Gzip Compression**

```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

---

## 🧪 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Error tracking setup (Sentry)
- [ ] Analytics configured
- [ ] Database backups scheduled
- [ ] Monitoring alerts configured
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Rollback plan prepared

---

## 🆘 Troubleshooting

### Common Issues

**Issue: CORS errors in production**
- Check backend CORS configuration
- Ensure frontend URL is whitelisted

**Issue: Map not loading**
- Verify internet connectivity
- Check OpenStreetMap tile server status

**Issue: API calls failing**
- Verify API URL in environment variables
- Check network tab for errors
- Ensure backend is running

**Issue: Build fails**
- Clear node_modules and reinstall
- Check Node.js version compatibility
- Review build logs for specific errors

---

## 📞 Support

For deployment issues:
1. Check logs first
2. Review this guide
3. Check component documentation
4. Open an issue on GitHub

---

**Happy Deploying! 🚀**
