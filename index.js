import express from "express";
import http from "http";
import { createBareServer } from "@tomphttp/bare-server-node";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const bare = createBareServer("/bare/");

const PORT = process.env.PORT || 3000;

/* ---------- Static frontend ---------- */
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>ApolloOS</title>
  <style>
    body {
      background:black;
      color:#00f0ff;
      font-family: monospace;
      text-align:center;
      margin-top:40px;
    }
    input {
      padding:10px;
      width:300px;
    }
    button {
      padding:10px;
      margin-left:10px;
    }
    iframe {
      width:100%;
      height:85vh;
      border:none;
      margin-top:20px;
    }
  </style>
</head>
<body>
  <h1>ApolloOS</h1>
  <input id="url" placeholder="https://example.com">
  <button onclick="go()">Visit</button>
  <iframe id="frame"></iframe>

  <script src="https://cdn.jsdelivr.net/npm/@titaniumnetwork-dev/ultraviolet/dist/uv.bundle.js"></script>
  <script>
    const uv = new Ultraviolet({
      bare: "/bare/",
      prefix: "/service/",
      encodeUrl: Ultraviolet.codec.plain.encode,
      decodeUrl: Ultraviolet.codec.plain.decode
    });

    function go() {
      let url = document.getElementById("url").value;
      if (!url.startsWith("http")) url = "https://" + url;
      document.getElementById("frame").src = uv.rewriteUrl(url);
    }
  </script>
</body>
</html>
`);
});

/* ---------- Bare server handling ---------- */
server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("ApolloOS running on port", PORT);
});
