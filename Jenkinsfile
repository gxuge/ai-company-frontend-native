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
    NPM_CONFIG_REGISTRY = 'https://registry.npmmirror.com'
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
        sh 'pnpm config set registry https://registry.npmmirror.com'
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
        sh 'docker compose down --remove-orphans || true'
        sh 'docker compose up -d --build'
      }
    }
  }
}

