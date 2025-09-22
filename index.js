import express from "express";
import fetch from "node-fetch"; // npm install node-fetch
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3001;

const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL; // ton URL webhook

app.post("/api/contact", async (req, res) => {
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

    res.json({ success: true });
  } catch (err) {
    console.error("Erreur webhook Discord:", err);
    res.status(500).json({ success: false, error: "discord_error" });
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
