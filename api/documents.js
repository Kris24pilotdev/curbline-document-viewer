import "dotenv/config"; // loads .env.local locally
import fetch from "node-fetch";

async function getAccessToken() {
  const params = new URLSearchParams();
  params.append("client_id", process.env.CLIENT_ID);
  params.append("client_secret", process.env.CLIENT_SECRET);
  params.append("scope", "https://graph.microsoft.com/.default");
  params.append("grant_type", "client_credentials");

  const res = await fetch(
    `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    }
  );

  const data = await res.json();
  return data.access_token;
}

export default async function handler(req, res) {
  const { siteId, itemId } = req.query;

  if (!siteId || !itemId) {
    return res.status(400).send("Missing siteId or itemId");
  }

  try {
    const token = await getAccessToken();

    const graphRes = await fetch(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/items/${itemId}/content`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!graphRes.ok) {
      const text = await graphRes.text();
      return res.status(graphRes.status).send(text);
    }

    res.setHeader("Content-Type", graphRes.headers.get("content-type"));
    graphRes.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}
