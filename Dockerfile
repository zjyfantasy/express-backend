# 使用官方 Node.js 镜像
FROM node:16

# 创建和设置应用目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制应用源代码
COPY . .

# 公开应用的端口
EXPOSE 3000

# 启动应用
CMD ["node", "app.js"]
