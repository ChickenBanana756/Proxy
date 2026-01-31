import express from "express";
import fetch from "node-fetch";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * 🔐 PROXY ID
 * Websites must explicitly allow THIS value
 * via:  X-Allow-Proxy: my-proxy-name
 */
const PROXY_ID = "my-proxy-name";

/**
 * 🌍 Sites users are allowed to REQUEST
 * (They are still BLOCKED unless the site owner opts in)
 */
const REQUESTABLE_SITES = {
  example: "https://example.com"
};

/**
 * Home page
 */
app.get("/", (req, res) => {
  res.send(`
    <h2>Opt-In Proxy</h2>
    <p>Only websites that explicitly allow this proxy can be viewed.</p>
    <ul>
      ${Object.keys(REQUESTABLE_SITES)
        .map(
          site => `<li><a href="/site/${site}">${site}</a></li>`
        )
        .join("")}
    </ul>
  `);
});

/**
 * Proxy route
 */
app.use("/site/:site", async (req, res, next) => {
  const siteKey = req.params.site;
  const target = REQUESTABLE_SITES[siteKey];

  if (!target) {
    return res.status(404).send("⛔ Site not registered.");
  }

  try {
    // 🔍 Check if site owner allows proxying
    const response = await fetch(target, { method: "HEAD" });
    const allowHeader = response.headers.get("x-allow-proxy");

    if (allowHeader !== PROXY_ID) {
      return res
        .status(403)
        .send("⛔ This website has NOT opted in to be proxied.");
    }

    // ✅ Proxy allowed
    return createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: true,
      pathRewrite: {
        [`^/site/${siteKey}`]: ""
      }
    })(req, res, next);

  } catch (err) {
    console.error(err);
    return res.status(500).send("❌ Error checking site permission.");
  }
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`Opt-in proxy running on port ${PORT}`);
});
