import express from "express";
import http from "http";
import { createBareServer } from "@tomphttp/bare-server-node";

const app = express();
const server = http.createServer(app);

// Create Bare server at /bare/
const bare = createBareServer("/bare/");

// Serve static frontend from "public" folder
app.use(express.static("public"));

// Bare server handling
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => console.log("ApolloOS running on port", PORT));
