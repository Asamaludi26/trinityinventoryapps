#!/bin/bash
#
# =============================================================================
# Trinity Asset Flow - Application Deployment Script
# =============================================================================
#
# This script automates the deployment of the Trinity Inventory App
# after the server has been set up using server-setup.sh
#
# Usage:
#   chmod +x deploy-app.sh
#   ./deploy-app.sh [OPTIONS]
#
# Options:
#   --backend-only    Deploy backend only
#   --frontend-only   Deploy frontend only
#   --full            Full deployment (default)
#
# Author: Trinity Media Indonesia
# Version: 1.0.0
# Date: 2026-01-17
#
# =============================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
APP_DIR="/home/deploy/app"
WEB_DIR="/var/www/assetflow"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

# =============================================================================
# Helper Functions
# =============================================================================

print_step() {
    echo ""
    echo -e "${BLUE}==>${NC} ${GREEN}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
    exit 1
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# =============================================================================
# Deployment Functions
# =============================================================================

check_prerequisites() {
    print_step "Checking prerequisites..."
    
    # Check if app directory exists
    if [ ! -d "$APP_DIR" ]; then
        print_error "Application directory not found: $APP_DIR"
    fi
    
    # Check if node is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
    fi
    
    # Check if pnpm is installed
    if ! command -v pnpm &> /dev/null; then
        print_error "pnpm is not installed"
    fi
    
    print_success "All prerequisites met"
}

pull_latest_code() {
    print_step "Pulling latest code from repository..."
    
    cd $APP_DIR
    
    # Stash any local changes
    git stash
    
    # Pull latest
    git pull origin main
    
    print_success "Code updated"
}

deploy_backend() {
    print_step "Deploying Backend..."
    
    cd $BACKEND_DIR
    
    # Install dependencies
    echo "Installing dependencies..."
    pnpm install --frozen-lockfile
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        print_warning ".env file not found! Copying from template..."
        if [ -f "/home/deploy/.env.template" ]; then
            cp /home/deploy/.env.template .env
            print_warning "Please update .env with correct values!"
        else
            print_error ".env file required. Create one from .env.example"
        fi
    fi
    
    # Run migrations
    echo "Running database migrations..."
    npx prisma generate
    npx prisma migrate deploy
    
    # Build
    echo "Building backend..."
    pnpm build
    
    # Restart PM2
    if pm2 describe assetflow-backend > /dev/null 2>&1; then
        echo "Restarting backend service..."
        pm2 restart assetflow-backend
    else
        echo "Starting backend service for the first time..."
        pm2 start dist/main.js --name assetflow-backend --cwd $BACKEND_DIR
        pm2 save
    fi
    
    print_success "Backend deployed"
}

deploy_frontend() {
    print_step "Deploying Frontend..."
    
    cd $FRONTEND_DIR
    
    # Install dependencies
    echo "Installing dependencies..."
    pnpm install --frozen-lockfile
    
    # Create .env.production if not exists
    if [ ! -f ".env.production" ]; then
        echo "Creating .env.production..."
        cat > .env.production << EOF
VITE_API_URL=https://$(hostname -f)/api
VITE_USE_MOCK=false
EOF
    fi
    
    # Build
    echo "Building frontend..."
    pnpm build
    
    # Deploy to web directory
    echo "Copying files to web directory..."
    sudo rm -rf $WEB_DIR/frontend/*
    sudo cp -r dist/* $WEB_DIR/frontend/
    sudo chown -R www-data:www-data $WEB_DIR/frontend
    
    print_success "Frontend deployed"
}

reload_services() {
    print_step "Reloading services..."
    
    # Reload nginx
    sudo nginx -t && sudo systemctl reload nginx
    
    print_success "Services reloaded"
}

show_status() {
    print_step "Deployment Status"
    
    echo ""
    echo "PM2 Status:"
    pm2 list
    
    echo ""
    echo "Nginx Status:"
    sudo systemctl status nginx --no-pager -l | head -5
    
    echo ""
    echo -e "${GREEN}Deployment completed successfully!${NC}"
    echo ""
    echo "Application URL: https://$(hostname -f)"
}

# =============================================================================
# Main
# =============================================================================

DEPLOY_BACKEND=true
DEPLOY_FRONTEND=true

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --backend-only)
            DEPLOY_FRONTEND=false
            shift
            ;;
        --frontend-only)
            DEPLOY_BACKEND=false
            shift
            ;;
        --full)
            DEPLOY_BACKEND=true
            DEPLOY_FRONTEND=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

main() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║     Trinity Asset Flow - Deployment Script                 ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    
    check_prerequisites
    pull_latest_code
    
    if [ "$DEPLOY_BACKEND" = true ]; then
        deploy_backend
    fi
    
    if [ "$DEPLOY_FRONTEND" = true ]; then
        deploy_frontend
    fi
    
    reload_services
    show_status
}

main
