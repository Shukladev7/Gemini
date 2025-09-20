import express from "express";
import handler from "./api/gemini.js";

const app = express();
app.use(express.json());

app.post("/api/gemini", (req, res) => handler(req, res));

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
