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

    stage('Build Web SSR') {
      steps {
        sh 'pnpm run build:web:ssr'
      }
    }

    stage('Deploy SSR') {
      steps {
        sh 'docker compose -f docker-compose.ssr.yml down --remove-orphans || true'
        sh 'docker compose -f docker-compose.ssr.yml up -d --build'
      }
    }
  }
}

