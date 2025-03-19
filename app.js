require("dotenv").config();
const fetch = require("node-fetch");
const express = require("express");
const mysql = require("mysql2/promise");

const app = express();
const port = 3001;

// 从环境变量获取数据库连接信息
const pool = mysql.createPool({
  host: "47.117.173.54", // 指定 MySQL 服务容器名称
  user: "zaoyinjiance", // MySQL 用户
  password: "wxnETRf8YH8646bm", // 从环境变量获取密码
  database: "zaoyinjiance", // MySQL 数据库名
});

// 测试数据库连接
pool.getConnection((err, connection) => {
  if (err) {
    console.log(123);
    console.error("process.env.DB_PASSWORD", process.env.DB_PASSWORD);
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
    await pool.execute(createTableSql);
    res.status(200).send({ code: 1, data: "success" });
  } catch (err) {
    console.log(err);
  }
});

app.get("/createOpenIdTable", async (req, res) => {
  // 简单查询
  try {
    const createTableSql = `
  CREATE TABLE IF NOT EXISTS openids (
   id INT AUTO_INCREMENT PRIMARY KEY,
   openId VARCHAR(255) UNIQUE
  )  ENGINE=INNODB;
 `;
    await pool.execute(createTableSql);
    res.status(200).send({ code: 0, data: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});

app.get("/get_openid", async (req, res) => {
  try {
    const openid = req.query.openid;
    console.log(openid, !!openid);

    if (!openid) {
      res.status(400).send({ code: 1, message: "请输入openid" });
      return;
    }
    const response = await fetch(
      `https://api.weixin.qq.com/sns/jscode2session?appid=wxf131dc126ea994e9&secret=c6aa9181c25cc449ecd90a93c630f5ed&js_code=${openid}&grant_type=authorization_code`
    );
    const result = await response.json();
    if (result.errcode) {
      res.status(400).send({ message: result.errmsg });
      return;
    }
    res.status(200).send({ code: 1, data: result.openid });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});

app.get("/get_openids", async (req, res) => {
  try {
    console.log(req);
    const [results, fields] = await pool.query("SELECT * FROM openids");
    console.log(fields);
    res.status(200).send({ code: 1, data: results });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message });
  }
});

app.get("/store_openid", async (req, res) => {
  try {
    const openid = req.query.openid;
    console.log(openid, !!openid);

    if (!openid) {
      res.status(400).send({ code: 1, message: "请输入openid" });
      return;
    }
    const [results] = await pool.query(
      `SELECT * FROM openids WHERE openId = ?`,
      [openid]
    );
    if (results.length) {
      res.status(200).send({ code: 1, message: "openId已存在" });
      return;
    }
    const [results2] = await pool.execute(
      `INSERT INTO openids (openId) VALUES (?)`,
      [openid]
    );
    if (results2.affectedRows) {
      res.status(200).send({ code: 0, data: openid });
    } else {
      res.status(400).send({ code: 1, message: "保存失败" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.get("/remove_openid", async (req, res) => {
  try {
    const openid = req.query.openid;
    if (!openid) {
      res.status(400).send({ code: 1, message: "请输入openid" });
      return;
    }
    const [results] = await pool.query(
      `SELECT * FROM openids WHERE openId = ?`,
      [openid]
    );
    if (results.length === 0) {
      res.status(200).send({ code: 1, message: "openId不存在" });
      return;
    }
    const [results2] = await pool.execute(
      `DELETE FROM openids WHERE openId = ?`,
      [openid]
    );
    if (results2.affectedRows) {
      res.status(200).send({ code: 0, data: openid });
    } else {
      res.status(400).send({ code: 1, message: "删除失败" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.get("/clear_openids", async (req, res) => {
  try {
    await pool.execute(`
      DELETE FROM openids
    `);
    res.status(200).send({ code: 0, data: "删除成功" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Express 应用正在运行，访问地址：http://localhost:${port}`);
});
