pipeline {
    agent any

    environment {
        // Environment variables for Docker/Docker-Compose
        DOCKER_BUILDKIT = '1'
        COMPOSE_PROJECT_NAME = 'madadnow'
    }

    stages {
        stage('Checkout') {
            steps {
                // Jenkins automatically checks out the repository when using Pipeline from SCM
                // But if run as a standalone script, this fetches the code.
                checkout scm
                echo "Repository cloned successfully"
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    sh 'chmod +x mvnw'
                    sh './mvnw clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm install --legacy-peer-deps'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                // Build all containers defined in docker-compose.yml
                sh 'docker compose build'
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                // Stop old containers, rebuild, and start new ones in detached mode
                sh 'docker compose up -d --remove-orphans'
                echo "Stack deployed successfully at http://localhost:5173"
            }
        }
    }

    post {
        always {
            echo "Pipeline finished."
        }
        success {
            echo "Deployment Successful!"
        }
        failure {
            echo "Deployment Failed. Check logs."
            // In a real scenario, we might want to run: sh 'docker-compose logs'
        }
    }
}
