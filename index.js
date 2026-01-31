import express from "express";
import fetch from "node-fetch";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const PORT = process.env.PORT || 3000;

// Proxy identifier
const PROXY_ID = "ApolloOS";

// Home page
app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>ApolloOS Proxy</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

      body {
        margin:0;
        height:100vh;
        background:black;
        color:#00f0ff;
        font-family:'Press Start 2P', cursive;
        overflow:hidden;
      }

      canvas {
        position: fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        z-index:0;
      }

      .overlay {
        position: relative;
        z-index: 10;
        text-align: center;
        margin-top: 50px;
      }

      h1 {
        font-size:3em;
        color:#00f0ff;
        text-shadow:0 0 10px #00f0ff,0 0 20px #00f0ff;
      }

      p { font-size:0.9em; }
      form { margin-top:30px; }
      input[type=text] {
        width:300px;
        font-family:'Press Start 2P';
        font-size:0.9em;
        padding:5px;
      }
      input[type=submit] {
        font-family:'Press Start 2P';
        font-size:0.9em;
        padding:5px 10px;
        margin-left:10px;
        cursor:pointer;
      }
    </style>
  </head>
  <body>
    <canvas id="particles"></canvas>

    <div class="overlay">
      <h1>ApolloOS</h1>
      <p>Type a website URL and click Visit (only sites that allow ApolloOS will load)</p>
      <form method="GET" action="/site">
        <input type="text" name="target" placeholder="https://example.com" required />
        <input type="submit" value="Visit" />
      </form>
    </div>

    <script>
      const canvas = document.getElementById('particles');
      const ctx = canvas.getContext('2d');
      let width = canvas.width = window.innerWidth;
      let height = canvas.height = window.innerHeight;
      const particles = [];
      const particleCount = 100;

      function random(min,max){ return Math.random()*(max-min)+min }

      class Particle {
        constructor(){ this.reset() }
        reset() {
          this.x=random(0,width);
          this.y=random(0,height);
          this.size=random(1,3);
