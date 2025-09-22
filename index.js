import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import serverless from "serverless-http";

dotenv.config();

const app = express();
app.use(express.json());

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// route API
app.post("/contact", async (req, res) => { 
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `📨 Nouveau message de **${name}** (${email}) :\n${message}`,
      }),
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("Erreur webhook Discord:", err);
    return res.status(500).json({ success: false, error: "discord_error" });
  }
});

export default serverless(app);
