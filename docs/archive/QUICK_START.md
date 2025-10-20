# Quick Start Guide - Insider Threat Video Analyzer

## 🚀 Get Started in 3 Steps

### Step 1: Start Services

```bash
./scripts/start.sh dev
```

Wait ~15 seconds for services to initialize.

### Step 2: Seed Database

```bash
./scripts/seed.sh
```

### Step 3: Open Application

- **Frontend:** http://localhost:3000
- **GraphQL:** http://localhost:8000/graphql
- **API Docs:** http://localhost:8000/docs

## 📋 What Changed?

### ✅ Removed

- Old backend implementation
- Backend switching scripts
- Dual backend configuration

### ✅ Now Using

- **FastAPI only** (port 8000)
- **GraphQL** with Strawberry
- **PostgreSQL** database
- **Next.js 15** frontend

## 🎯 Key Commands

```bash
# Start everything
./scripts/start.sh dev

# Stop everything
./scripts/stop.sh

# Clean everything (removes data)
./scripts/clean.sh

# Seed database
./scripts/seed.sh

# View logs
docker-compose -f docker-compose.dev.yml logs -f
```

## 🔧 Ports

- **3000** - Frontend (Next.js)
- **8000** - Backend (FastAPI + GraphQL)
- **5432** - Database (PostgreSQL)

## 📝 Next: Enhance VideoPlayer

See `INSIDER_THREAT_VIDEO_LIBRARY_SPEC.md` for full specification.

**Priority enhancements:**

1. Add playback speed control (0.25x - 8x)
2. Frame-by-frame navigation
3. Keyboard shortcuts (30+)
4. Enhanced annotations (5 types)
5. Timeline zoom
6. Export functionality

## 🆘 Troubleshooting

**Services won't start?**

```bash
./scripts/clean.sh
./scripts/start.sh dev
```

**Port conflicts?**

```bash
./scripts/kill-ports.sh
```

**Database issues?**

```bash
docker-compose -f docker-compose.dev.yml restart postgres
```

---

**Ready to code!** 🎉
