require("dotenv").config();

const path = require("path");

const { createApp } = require("./src-backend/app");
const { connectDatabase } = require("./src-backend/config/db");

const PORT = Number(process.env.PORT || 3000);

async function startServer() {
  await connectDatabase();

  const app = createApp({
    staticDir: __dirname,
    subscribePage: path.join(__dirname, "subscribe", "index.html")
  });

  app.listen(PORT, () => {
    console.log(`Druth site running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
