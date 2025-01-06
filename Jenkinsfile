pipeline {
    agent any
    environment {
        // 从 Jenkins Credentials 获取 DB_PASSWORD
        DB_PASSWORD = credentials('db_password')  // 'db_password' 是你在 Jenkins 中存储的凭证 ID
    }
    stages {
        stage('Checkout') {
            steps {
                // 拉取代码
                checkout scm
            }
        }
        stage('Build') {
            steps {
                script {
                    // 构建 Docker 镜像
                    docker.build('express-backend')
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    // 在此添加测试脚本（可选）
                    echo "Running tests..."
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    // 启动 Docker Compose 服务
                    sh 'docker-compose up -d --build'
                }
            }
        }
    }
}
