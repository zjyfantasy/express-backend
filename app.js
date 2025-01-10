const express = require("express");
const mysql = require("mysql2");

const app = express();
const port = 3000;

console.log("process.env.DB_PASSWORD", process.env.DB_PASSWORD);

// 从环境变量获取数据库连接信息
const pool = mysql.createPool({
  host: "mysql", // 指定 MySQL 服务容器名称
  user: "root", // MySQL 用户
  password: process.env.DB_PASSWORD, // 从环境变量获取密码
  database: "express_db", // MySQL 数据库名
});

// 测试数据库连接
pool.getConnection((err, connection) => {
  if (err) {
    console.error("数据库连接失败：", err);
  } else {
    console.log("成功连接到数据库！");
    connection.release();
  }
});

// 示例路由
app.get("/", (req, res) => {
  res.send("Hello from Express.js!");
});

app.listen(port, () => {
  console.log(`Express 应用正在运行，访问地址：http://localhost:${port}`);
});
