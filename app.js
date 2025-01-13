require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");

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

app.get("/createTable", async (req, res) => {
  // 简单查询
  try {
    const createTableSql = `
  CREATE TABLE IF NOT EXISTS users (
   id INT AUTO_INCREMENT PRIMARY KEY,
   username VARCHAR(255) NOT NULL,
   password VARCHAR(255) NOT NULL,
   mobile VARCHAR(15) UNIQUE,
   openId VARCHAR(30) UNIQUE,
   email VARCHAR(255) NOT NULL UNIQUE
  )  ENGINE=INNODB;
 `;
    const [results, fields] = await pool.execute(createTableSql);
    console.log(results, fields); // 结果集
    res.send("success");
  } catch (err) {
    console.log(err);
  }
});

// 示例路由
app.get("/getUsers", async (req, res) => {
  // 简单查询
  try {
    const [results, fields] = await pool.query("SELECT * FROM users");
    res.status(200).send({ code: 1, data: results });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Express 应用正在运行，访问地址：http://localhost:${port}`);
});
