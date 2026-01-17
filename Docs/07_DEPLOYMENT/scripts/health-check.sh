#!/bin/bash
#
# =============================================================================
# Trinity Asset Flow - Health Check Script
# =============================================================================
#
# This script checks the health of all services and sends alerts if needed.
#
# Usage:
#   chmod +x health-check.sh
#   ./health-check.sh
#
# For monitoring, add to cron:
#   */5 * * * * /home/deploy/scripts/health-check.sh >> /var/log/health-check.log 2>&1
#
# =============================================================================

# Configuration
DOMAIN="aset.trinitimedia.com"
BACKEND_PORT=3001
ALERT_EMAIL="admin@trinitimedia.com"  # Set to empty to disable email alerts

# Colors (for terminal output)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Status tracking
ERRORS=()
WARNINGS=()

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

check_nginx() {
    log "Checking Nginx..."
    
    if systemctl is-active --quiet nginx; then
        echo -e "${GREEN}✓ Nginx is running${NC}"
    else
        ERRORS+=("Nginx is not running")
        echo -e "${RED}✗ Nginx is not running${NC}"
    fi
}

check_postgresql() {
    log "Checking PostgreSQL..."
    
    if systemctl is-active --quiet postgresql; then
        echo -e "${GREEN}✓ PostgreSQL is running${NC}"
    else
        ERRORS+=("PostgreSQL is not running")
        echo -e "${RED}✗ PostgreSQL is not running${NC}"
    fi
}

check_pm2() {
    log "Checking PM2 processes..."
    
    if pm2 describe assetflow-backend > /dev/null 2>&1; then
        STATUS=$(pm2 jlist | jq -r '.[] | select(.name=="assetflow-backend") | .pm2_env.status')
        if [ "$STATUS" = "online" ]; then
            echo -e "${GREEN}✓ Backend is running (PM2)${NC}"
        else
            ERRORS+=("Backend PM2 process is not online (status: $STATUS)")
            echo -e "${RED}✗ Backend is not online (status: $STATUS)${NC}"
        fi
    else
        ERRORS+=("Backend PM2 process not found")
        echo -e "${RED}✗ Backend process not found in PM2${NC}"
    fi
}

check_backend_api() {
    log "Checking Backend API..."
    
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$BACKEND_PORT/api/health 2>/dev/null || echo "000")
    
    if [ "$RESPONSE" = "200" ]; then
        echo -e "${GREEN}✓ Backend API is responding (HTTP $RESPONSE)${NC}"
    elif [ "$RESPONSE" = "000" ]; then
        ERRORS+=("Backend API is not reachable")
        echo -e "${RED}✗ Backend API is not reachable${NC}"
    else
        WARNINGS+=("Backend API returned HTTP $RESPONSE")
        echo -e "${YELLOW}⚠ Backend API returned HTTP $RESPONSE${NC}"
    fi
}

check_frontend() {
    log "Checking Frontend..."
    
    if [ -f "/var/www/assetflow/frontend/index.html" ]; then
        echo -e "${GREEN}✓ Frontend files exist${NC}"
    else
        ERRORS+=("Frontend index.html not found")
        echo -e "${RED}✗ Frontend files not found${NC}"
    fi
}

check_disk_space() {
    log "Checking Disk Space..."
    
    USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$USAGE" -lt 80 ]; then
        echo -e "${GREEN}✓ Disk usage: ${USAGE}%${NC}"
    elif [ "$USAGE" -lt 90 ]; then
        WARNINGS+=("Disk usage is at ${USAGE}%")
        echo -e "${YELLOW}⚠ Disk usage: ${USAGE}%${NC}"
    else
        ERRORS+=("Disk usage critical: ${USAGE}%")
        echo -e "${RED}✗ Disk usage critical: ${USAGE}%${NC}"
    fi
}

check_memory() {
    log "Checking Memory..."
    
    MEM_TOTAL=$(free -m | awk 'NR==2 {print $2}')
    MEM_USED=$(free -m | awk 'NR==2 {print $3}')
    MEM_PERCENT=$((MEM_USED * 100 / MEM_TOTAL))
    
    if [ "$MEM_PERCENT" -lt 80 ]; then
        echo -e "${GREEN}✓ Memory usage: ${MEM_PERCENT}% (${MEM_USED}MB / ${MEM_TOTAL}MB)${NC}"
    elif [ "$MEM_PERCENT" -lt 90 ]; then
        WARNINGS+=("Memory usage is at ${MEM_PERCENT}%")
        echo -e "${YELLOW}⚠ Memory usage: ${MEM_PERCENT}%${NC}"
    else
        ERRORS+=("Memory usage critical: ${MEM_PERCENT}%")
        echo -e "${RED}✗ Memory usage critical: ${MEM_PERCENT}%${NC}"
    fi
}

check_ssl() {
    log "Checking SSL Certificate..."
    
    if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
        EXPIRY=$(openssl x509 -enddate -noout -in "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" | cut -d= -f2)
        EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s)
        NOW_EPOCH=$(date +%s)
        DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))
        
        if [ "$DAYS_LEFT" -gt 30 ]; then
            echo -e "${GREEN}✓ SSL certificate valid for $DAYS_LEFT days${NC}"
        elif [ "$DAYS_LEFT" -gt 7 ]; then
            WARNINGS+=("SSL certificate expires in $DAYS_LEFT days")
            echo -e "${YELLOW}⚠ SSL certificate expires in $DAYS_LEFT days${NC}"
        else
            ERRORS+=("SSL certificate expires in $DAYS_LEFT days!")
            echo -e "${RED}✗ SSL certificate expires in $DAYS_LEFT days!${NC}"
        fi
    else
        WARNINGS+=("SSL certificate not found (might be using HTTP)")
        echo -e "${YELLOW}⚠ SSL certificate not found${NC}"
    fi
}

send_alert() {
    if [ -n "$ALERT_EMAIL" ] && [ ${#ERRORS[@]} -gt 0 ]; then
        log "Sending alert email..."
        
        SUBJECT="[ALERT] Trinity Asset Flow - Health Check Failed"
        BODY="Health check detected the following issues:\n\n"
        
        for error in "${ERRORS[@]}"; do
            BODY+="ERROR: $error\n"
        done
        
        for warning in "${WARNINGS[@]}"; do
            BODY+="WARNING: $warning\n"
        done
        
        BODY+="\n\nServer: $(hostname)\nTime: $(date)\n"
        
        echo -e "$BODY" | mail -s "$SUBJECT" "$ALERT_EMAIL" 2>/dev/null || true
    fi
}

print_summary() {
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo "Health Check Summary - $(date)"
    echo "════════════════════════════════════════════════════════════"
    
    if [ ${#ERRORS[@]} -eq 0 ] && [ ${#WARNINGS[@]} -eq 0 ]; then
        echo -e "${GREEN}All systems operational!${NC}"
    else
        if [ ${#ERRORS[@]} -gt 0 ]; then
            echo -e "${RED}Errors: ${#ERRORS[@]}${NC}"
            for error in "${ERRORS[@]}"; do
                echo "  - $error"
            done
        fi
        
        if [ ${#WARNINGS[@]} -gt 0 ]; then
            echo -e "${YELLOW}Warnings: ${#WARNINGS[@]}${NC}"
            for warning in "${WARNINGS[@]}"; do
                echo "  - $warning"
            done
        fi
    fi
    echo ""
}

# =============================================================================
# Main
# =============================================================================

main() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║     Trinity Asset Flow - Health Check                      ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    
    check_nginx
    check_postgresql
    check_pm2
    check_backend_api
    check_frontend
    check_disk_space
    check_memory
    check_ssl
    
    print_summary
    send_alert
    
    # Exit with error code if there were errors
    if [ ${#ERRORS[@]} -gt 0 ]; then
        exit 1
    fi
}

main
