pipeline {
  agent any

  tools {
    nodejs 'node-22.19.0'
  }

  options {
    timestamps()
  }

  environment {
    NODE_ENV = 'production'
    PNPM_HOME = "${WORKSPACE}/.pnpm"
    PATH = "${PNPM_HOME}:${env.PATH}"
    NPM_CONFIG_REGISTRY = 'https://registry.npmjs.org'
    EXPO_PUBLIC_API_URL = '/jeecg-boot'
    BACKEND_DOCKER_NETWORK = 'jeecg_boot'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Clean') {
      steps {
        sh 'rm -rf node_modules dist .expo'
      }
    }

    stage('Setup') {
      steps {
        sh 'corepack enable'
        sh 'corepack prepare pnpm@10.12.3 --activate'
        sh 'pnpm config set registry https://registry.npmjs.org'
      }
    }

    stage('Install') {
      steps {
        sh 'pnpm install --frozen-lockfile'
      }
    }

    stage('Build Web') {
      steps {
        sh 'pnpm run build:web:prod'
      }
    }

    stage('Deploy') {
      steps {
        sh 'docker network inspect ${BACKEND_DOCKER_NETWORK} >/dev/null 2>&1 || docker network create ${BACKEND_DOCKER_NETWORK}'
        sh 'docker compose -f docker-compose.yml down --remove-orphans || true'
        sh 'docker compose -f docker-compose.yml up -d --build'
      }
    }
  }
}

