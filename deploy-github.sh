#!/bin/bash

# GitHub Deployment Script for Attendance Web App
# Usage: ./deploy-github.sh [repository-name] [github-username]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_NAME="${1:-attendance-web}"
GITHUB_USERNAME="${2:-$(git config user.name)}"
COMMIT_MESSAGE="${3:-🚀 Deploy attendance web app}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Attendance Web App - GitHub Deploy${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Run this script from the project root.${NC}"
    exit 1
fi

# Verify package.json has correct name
PACKAGE_NAME=$(node -p "require('./package.json').name")
if [ "$PACKAGE_NAME" != "attendance-web" ]; then
    echo -e "${YELLOW}Warning: package.json name is '$PACKAGE_NAME', expected 'attendance-web'${NC}"
fi

# Check for .env.local
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}Warning: .env.local not found. Copy .env.example and fill in your Firebase config.${NC}"
    echo -e "${YELLOW}   cp .env.example .env.local${NC}"
    echo ""
fi

# Build the project
echo -e "${BLUE}Building project...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed! Fix errors before deploying.${NC}"
    exit 1
fi

echo -e "${GREEN}Build successful!${NC}"
echo ""

# Initialize git if needed
if [ ! -d ".git" ]; then
    echo -e "${BLUE}Initializing Git repository...${NC}"
    git init
    git branch -M main
fi

# Check if remote exists
if git remote get-url origin >/dev/null 2>&1; then
    echo -e "${BLUE}Remote 'origin' already exists.${NC}"
    CURRENT_REMOTE=$(git remote get-url origin)
    echo -e "   Current: $CURRENT_REMOTE"
else
    echo -e "${BLUE}Adding GitHub remote...${NC}"
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    echo -e "   Added: https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
fi

# Create .gitignore if not exists
if [ ! -f ".gitignore" ]; then
    echo -e "${BLUE}Creating .gitignore...${NC}"
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/

# Production
dist/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
Thumbs.db
ehthumbs.db
Desktop.ini
EOF
fi

# Stage all changes
echo -e "${BLUE}Staging changes...${NC}"
git add .

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo -e "${YELLOW}No changes to commit.${NC}"
else
    # Commit
    echo -e "${BLUE}Committing changes...${NC}"
    git commit -m "$COMMIT_MESSAGE"

    # Push to GitHub
    echo -e "${BLUE}Pushing to GitHub...${NC}"
    git push -u origin main

    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Deployment Complete!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "Repository: ${BLUE}https://github.com/$GITHUB_USERNAME/$REPO_NAME${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo -e "1. Go to ${BLUE}https://vercel.com${NC} and import the repository"
    echo -e "2. Add environment variables from .env.local"
    echo -e "3. Deploy!"
    echo ""
    echo -e "${YELLOW}Or deploy with Firebase:${NC}"
    echo -e "   npm install -g firebase-tools"
    echo -e "   firebase login"
    echo -e "   firebase init hosting"
    echo -e "   npm run firebase:deploy"
fi