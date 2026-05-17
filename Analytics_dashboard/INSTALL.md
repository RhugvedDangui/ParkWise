# 📦 ParkWise Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js) or **yarn**

Check your versions:
```bash
node --version  # Should be v16.0.0 or higher
npm --version   # Should be 7.0.0 or higher
```

## Installation Steps

### Option 1: Quick Install (Recommended)

```bash
# Navigate to project directory
cd parkwise-goa

# Install all dependencies
npm install

# Start development server
npm run dev
```

The app will open automatically at `http://localhost:3000`

### Option 2: Using Yarn

```bash
# Navigate to project directory
cd parkwise-goa

# Install all dependencies
yarn install

# Start development server
yarn dev
```

### Option 3: Clean Install

If you encounter any issues:

```bash
# Remove existing node_modules and lock files
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install

# Start development server
npm run dev
```

## Verify Installation

After running `npm run dev`, you should see:

```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

Open your browser and navigate to `http://localhost:3000`

## What Gets Installed

### Main Dependencies
- **react** (^18.2.0) - UI library
- **react-dom** (^18.2.0) - React DOM renderer
- **recharts** (^2.10.3) - Charting library
- **lucide-react** (^0.294.0) - Icon library

### Dev Dependencies
- **@vitejs/plugin-react** (^4.2.1) - Vite React plugin
- **autoprefixer** (^10.4.16) - PostCSS plugin
- **postcss** (^8.4.32) - CSS transformer
- **tailwindcss** (^3.3.6) - CSS framework
- **vite** (^5.0.8) - Build tool

Total install size: ~250 MB

## Build for Production

To create an optimized production build:

```bash
npm run build
```

This creates a `dist/` folder with optimized files.

To preview the production build:

```bash
npm run preview
```

## Troubleshooting

### Port 3000 Already in Use

```bash
# Option 1: Kill the process using port 3000
npx kill-port 3000

# Option 2: Use a different port
npm run dev -- --port 3001
```

### Module Not Found Errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Tailwind CSS Not Working

```bash
# Rebuild Tailwind
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch
```

### Vite Build Errors

```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

### Permission Errors (Linux/Mac)

```bash
# Fix permissions
sudo chown -R $USER:$USER .
npm install
```

### Windows-Specific Issues

If you encounter issues on Windows:

```bash
# Use PowerShell as Administrator
npm install --force

# Or use Windows Subsystem for Linux (WSL)
wsl
cd /mnt/c/path/to/parkwise-goa
npm install
npm run dev
```

## Environment Setup

### VS Code (Recommended)

Install these extensions for the best experience:

1. **ES7+ React/Redux/React-Native snippets**
2. **Tailwind CSS IntelliSense**
3. **Prettier - Code formatter**
4. **ESLint**

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## System Requirements

### Minimum
- **CPU**: Dual-core processor
- **RAM**: 4 GB
- **Storage**: 500 MB free space
- **OS**: Windows 10, macOS 10.14, or Linux

### Recommended
- **CPU**: Quad-core processor
- **RAM**: 8 GB or more
- **Storage**: 1 GB free space
- **OS**: Latest version of Windows, macOS, or Linux

## Browser Compatibility

ParkWise works best on:

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Development Tools

### Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for outdated packages
npm outdated

# Update packages
npm update

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Hot Module Replacement (HMR)

Vite provides instant HMR. Changes to your code will reflect immediately in the browser without a full page reload.

## Docker Setup (Optional)

If you prefer using Docker:

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  parkwise:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
```

Run with Docker:

```bash
docker-compose up
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### GitHub Pages

```bash
# Build
npm run build

# Deploy (requires gh-pages package)
npm run deploy
```

## Next Steps

After successful installation:

1. ✅ Read `QUICKSTART.md` for a quick tour
2. ✅ Check `README.md` for detailed documentation
3. ✅ Review `PROJECT_SUMMARY.md` for architecture details
4. ✅ Start customizing the dashboard!

## Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. Review the error message carefully
3. Search for the error on Google/Stack Overflow
4. Check Node.js and npm versions
5. Try a clean install

## Success Checklist

- [ ] Node.js 16+ installed
- [ ] Dependencies installed successfully
- [ ] Development server running
- [ ] Browser opens to localhost:3000
- [ ] Dashboard loads without errors
- [ ] Theme toggle works
- [ ] Navigation works
- [ ] Charts render correctly

If all items are checked, you're ready to go! 🎉

---

**Happy Coding! 🚀**
