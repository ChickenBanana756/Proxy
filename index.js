import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createBareServer } from "@tomphttp/bare-server-node";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Create bare server
const bare = createBareServer("/bare/");

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/service", express.static(path.join(__dirname, "public")));

// Bare server handler
app.use((req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  }
});

// Required for WebSocket support (games + video)
const server = app.listen(PORT, () => {
  console.log(`🚀 ApolloOS running on port ${PORT}`);
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  }
});
