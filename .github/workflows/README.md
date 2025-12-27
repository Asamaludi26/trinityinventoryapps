# GitHub Actions Workflows

This directory contains CI/CD workflows for the Trinity Inventory Apps project.

## Workflows

### 1. CI (`ci.yml`)

Runs on every push and pull request to `main` and `develop` branches.

**Jobs:**
- `lint-frontend`: Lints frontend code with ESLint
- `lint-backend`: Lints backend code with ESLint
- `build-frontend`: Builds frontend application
- `build-backend`: Builds backend application
- `security-scan`: Runs security scans (npm audit, Trivy)

### 2. Deploy (`deploy.yml`)

Runs on push to `main` branch or when a version tag is pushed.

**Steps:**
- SSH to production server
- Pull latest code
- Rebuild and restart Docker containers
- Run database migrations
- Health check

**Required Secrets:**
- `SSH_PRIVATE_KEY`: Private SSH key for server access
- `SERVER_HOST`: Production server hostname/IP
- `SERVER_USER`: SSH user for deployment
- `DOMAIN`: Application domain for health check

### 3. Docker Build (`docker-build.yml`)

Builds and pushes Docker images to container registry.

**Jobs:**
- `build-frontend`: Builds frontend Docker image
- `build-backend`: Builds backend Docker image

**Required Secrets:**
- `REGISTRY_URL`: Container registry URL
- `REGISTRY_USERNAME`: Registry username
- `REGISTRY_PASSWORD`: Registry password

## Setup

1. Add required secrets to GitHub repository:
   - Go to Settings → Secrets and variables → Actions
   - Add all required secrets

2. Configure server access:
   - Generate SSH key pair
   - Add public key to server `~/.ssh/authorized_keys`
   - Add private key to GitHub secrets

3. Update workflow files with your specific paths and configurations

## Usage

Workflows run automatically on:
- Push to `main` or `develop` branches
- Pull requests
- Version tags (v*)

You can also trigger workflows manually from the Actions tab.

