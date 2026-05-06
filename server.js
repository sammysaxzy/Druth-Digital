require("dotenv").config();

const path = require("path");
const express = require("express");

const subscribeRouter = require("./routes/subscribe");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const rootDir = __dirname;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(rootDir));
app.use(subscribeRouter);

app.get("/subscribe", (req, res) => {
  res.sendFile(path.join(rootDir, "subscribe", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Druth site running on http://localhost:${PORT}`);
});
