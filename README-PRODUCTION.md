# Production Deployment Issues

## Problem
This application uses a file-based database system that writes to the local filesystem (`data/case-studies.json` and `data/passions.json`). In serverless production environments (like Vercel, Netlify, etc.), the filesystem is **read-only**, which means:

- Creating/updating case studies will fail
- Creating/updating passions will fail  
- Image uploads will fail
- All database writes will fail

## Solutions

### Option 1: Use a Database (Recommended)
Migrate to a proper database solution:

**Recommended:**
- **Vercel Postgres** (if deploying to Vercel)
- **Supabase** (PostgreSQL with free tier)
- **PlanetScale** (MySQL with free tier)
- **MongoDB Atlas** (MongoDB with free tier)

### Option 2: Use File Storage Service + Database
- Store images in **AWS S3**, **Cloudinary**, or **Vercel Blob Storage**
- Store data in a database (see Option 1)

### Option 3: Use a Platform with Persistent Storage
- Deploy to a platform that supports persistent volumes (not serverless)
- Examples: Railway, Render, DigitalOcean App Platform

## Current Status
The application currently has basic error handling, but file write operations will fail in serverless environments. Consider migrating to a database for production use.