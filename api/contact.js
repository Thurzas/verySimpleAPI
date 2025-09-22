export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, message } = req.body;

    // Vérification basique
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    // Exemple Discord webhook
    try {
      await fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `📩 Nouveau message de **${name}** (${email}):\n${message}`,
        }),
      });
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: "Webhook failed" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
