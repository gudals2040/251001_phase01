// server.js
// es-module -> import, commonjs -> require
const express = require("express"); // express 안에 있는 이미 구현되어 있는 코드들을 express 객체 형태로 불러오겠다
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js"); // 구조분해 할당

dotenv.config(); // .env -> key
// NODE -> process.env (환경변수) // cf. env file

const supabaseKey = process.env.SUPABASE_KEY;
const supabaseUrl = process.env.SUPABASE_URL;
console.log("supabaseKey : ", supabaseKey); // 확인 방법 : (npm run dev)
console.log("supabaseUrl : ", supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express(); // () -> 호출해서 사용하겠다
// 포트 -> 컴퓨터 서비스가 1개만 있는게 아님. email, db, server 1, server 2...
// 1 ~ 2xxxx. => 이 번호로 오세요...
const port = 3000; // cra. next -> express. / 5173.
// localhost -> 3000. / 5500? <-> 구분해주는 의미.

// CORS 해결을 미들웨어 적용
app.use(cors()); // 모든 출처에 대한 허용 ( 보안적으로 바람적하지 X);

app.use(express.json()) // req.body -> json.
// get, post...
// app.방식(접속경로, 핸들러)
// localhost:3000/
app.get("/", (req, res) => {
  // req -> request -> 전달 받은 데이터나 요청사항
  // res -> response -> 응답할 내용/방식을 담은 객체
  // res.send("hello");
  res.send("bye");
});

app.get("/plans", async (req, res) => {
  // const response = await supabase.from("tour_plan").select("*")
  const { data, error } = await supabase.from("tour_plan").select("*");
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json(data);
});

app.post("/plans", async (req, res) => {
  const plan = req.body;
  const { error } = await supabase.from("tour_plan").insert(plan);
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json();
}); // supabase table edtior db 연결

app.delete("/plans", async (req, res) => {
  const { planId } = req.body;
  const { error } = await supabase
    .from("tour_plan") // table
    .delete() // 삭제
    .eq("id", planId); // eq = equal = id가 planId
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.status(204).json(); // noContent
});
// DOM listener / server '대기' -> 특정한 요청. -> 응답.
app.listen(port, () => {
  console.log(`서버가 ${port}번 포트로 실행 중입니다.`);
});
