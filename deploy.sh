#!/bin/bash

# ============================================
# Script Deployment Otomatis untuk Trinity Inventory App
# ============================================
# Script ini membantu proses deployment dengan cepat dan aman
# Usage: ./deploy.sh [options]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/opt/trinity-app"
BACKUP_DIR="/var/backups/trinity-app"

# Functions
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    print_info "Checking requirements..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if .env file exists
    if [ ! -f "$APP_DIR/.env" ]; then
        print_error ".env file not found. Please create it from env.example first."
        exit 1
    fi
    
    print_info "All requirements met!"
}

backup_database() {
    print_info "Creating database backup..."
    
    # Create backup directory if not exists
    mkdir -p "$BACKUP_DIR"
    
    # Backup database
    BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql.gz"
    
    if docker compose -f "$APP_DIR/docker-compose.yml" exec -T db pg_dump -U ${DB_USER:-trinity_admin} ${DB_NAME:-trinity_asset} | gzip > "$BACKUP_FILE"; then
        print_info "Backup created: $BACKUP_FILE"
    else
        print_warn "Backup failed, but continuing..."
    fi
}

deploy() {
    print_info "Starting deployment..."
    
    cd "$APP_DIR" || exit 1
    
    # Pull latest code (if using git)
    if [ -d ".git" ]; then
        print_info "Pulling latest code..."
        git pull origin main || print_warn "Git pull failed, continuing with existing code..."
    fi
    
    # Build and start containers
    print_info "Building and starting containers..."
    docker compose up -d --build
    
    # Wait for database to be ready
    print_info "Waiting for database to be ready..."
    sleep 15
    
    # Run migrations
    print_info "Running database migrations..."
    if docker compose exec -T api npm run prisma:migrate deploy 2>/dev/null; then
        print_info "Migrations completed successfully!"
    else
        print_warn "Migrations failed or not needed. Continuing..."
    fi
    
    # Check health
    print_info "Checking service health..."
    sleep 5
    
    if docker compose ps | grep -q "Up"; then
        print_info "Services are running!"
    else
        print_error "Some services failed to start. Check logs with: docker compose logs"
        exit 1
    fi
    
    print_info "Deployment completed successfully!"
}

restart() {
    print_info "Restarting services..."
    cd "$APP_DIR" || exit 1
    docker compose restart
    print_info "Services restarted!"
}

stop() {
    print_info "Stopping services..."
    cd "$APP_DIR" || exit 1
    docker compose down
    print_info "Services stopped!"
}

logs() {
    cd "$APP_DIR" || exit 1
    docker compose logs -f "$@"
}

status() {
    print_info "Service status:"
    cd "$APP_DIR" || exit 1
    docker compose ps
}

# Main script
case "${1:-deploy}" in
    deploy)
        check_requirements
        backup_database
        deploy
        ;;
    restart)
        restart
        ;;
    stop)
        stop
        ;;
    start)
        print_info "Starting services..."
        cd "$APP_DIR" || exit 1
        docker compose up -d
        print_info "Services started!"
        ;;
    logs)
        logs "${@:2}"
        ;;
    status)
        status
        ;;
    backup)
        backup_database
        ;;
    *)
        echo "Usage: $0 {deploy|restart|stop|start|logs|status|backup}"
        echo ""
        echo "Commands:"
        echo "  deploy   - Deploy/update application (default)"
        echo "  restart  - Restart all services"
        echo "  stop     - Stop all services"
        echo "  start    - Start all services"
        echo "  logs     - Show logs (optionally specify service: api, web, db)"
        echo "  status   - Show service status"
        echo "  backup   - Create database backup"
        exit 1
        ;;
esac

