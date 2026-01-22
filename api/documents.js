import "dotenv/config"; // loads .env.local locally
import fetch from "node-fetch";

function normalizeSiteName(siteName) {
  return String(siteName || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_]/g, "_");
}

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
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`Token error ${res.status}: ${JSON.stringify(data)}`);
  }

  if (!data.access_token) {
    throw new Error(`No access_token in response: ${JSON.stringify(data)}`);
  }

  return data.access_token;
}

export default async function handler(req, res) {
  const { siteName, itemId } = req.query;

  if (!siteName || !itemId) {
    return res.status(400).send("Missing siteName or itemId");
  }

  const tenantHostName = process.env.TENANT_HOST_NAME;
  if (!tenantHostName) {
    return res
      .status(500)
      .send("Server misconfiguration: missing TENANT_HOST_NAME");
  }

  const envKey = `SITE_${normalizeSiteName(siteName)}`; // example: SITE_PROPERTIES
  const siteWebIds = process.env[envKey];

  if (!siteWebIds) {
    return res
      .status(400)
      .send(`Unknown siteName. No env var found for ${envKey}`);
  }

  const siteId = `${tenantHostName},${siteWebIds}`;

  try {
    const token = await getAccessToken();

    const graphRes = await fetch(
      `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/items/${itemId}/content`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
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
