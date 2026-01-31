import express from "express";
import fetch from "node-fetch";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const PORT = process.env.PORT || 3000;

// Proxy identifier
const PROXY_ID = "ApolloOS";

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Home page with input
app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>ApolloOS Proxy</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

      body { margin:0; height:100vh; background:black; color:#00f0ff; font-family:'Press Start 2P', cursive; overflow:hidden; }
      h1 { text-align:center; font-size:3em; margin-top:50px; color:#00f0ff; text-shadow:0 0 10px #00f0ff,0 0 20px #00f0ff; }
      p { text-align:center; font-size:0.9em; }
      form { text-align:center; margin-top:30px; }
      input[type=text] { width:300px; font-family:'Press Start 2P'; font-size:0.9em; padding:5px; }
      input[type=submit] { font-family:'Press Start 2P'; font-size:0.9em; padding:5px 10px; margin-left:10px; cursor:pointer; }
      canvas { position: fixed; top:0; left:0; }
    </style>
  </head>
  <body>
    <canvas id="particles"></canvas>
    <h1>ApolloOS</h1>
    <p>Type a website URL and press Visit (only sites that allow ApolloOS will load)</p>
    <form method="POST" action="/visit">
      <input type="text" name="url" placeholder="https://example.com" required />
      <input type="submit" value="Visit" />
    </form>

    <script>
      const canvas = document.getElementById('particles');
      const ctx = canvas.getContext('2d');
      let width = canvas.width = window.innerWidth;
      let height = canvas.height = window.innerHeight;
      const particles = [];
      const particleCount = 100;

      function random(min,max){return Math.random()*(max-min)+min}

      class Particle{
        constructor(){this.reset()}
        reset(){this.x=random(0,width);this.y=random(0,height);this.size=random(1,3);this.speedX=random(-0.5,0.5);this.speedY=random(-0.5,0.5)}
        update(){this.x+=this.speedX;this.y+=this.speedY;if(this.x<0||this.x>width||this.y<0||this.y>height)this.reset()}
        draw(){ctx.fillStyle='#00f0ff';ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,Math.PI*2);ctx.fill()}
      }

      for(let i=0;i<particleCount;i++){particles.push(new Particle())}

      function animate(){ctx.clearRect(0,0,width,height);particles.forEach(p=>{p.update();p.draw()});requestAnimationFrame(animate)}

      animate();

      window.addEventListener('resize',()=>{width=canvas.width=window.innerWidth;height=canvas.height=window.innerHeight});
    </script>
  </body>
  </html>
  `);
});

// Handle form submission
app.post("/visit", (req, res) => {
  let siteUrl = req.body.url;
  if (!siteUrl) return res.redirect("/");

  // Ensure protocol is included
  if (!/^https?:\/\//.test(siteUrl)) siteUrl = "http://" + siteUrl;

  // Encode the URL as a query parameter
  const encoded = encodeURIComponent(siteUrl);

  // Redirect to proxy route
  res.redirect(`/site?target=${encoded}`);
});

// Proxy route
app.get("/site", async (req, res, next) => {
  let target = req.query.target;
  if (!target) return res.redirect("/");

  target = decodeURIComponent(target);

  try {
    // Check if target allows proxying
    const response = await fetch(target, { method: "HEAD" });
    const allowHeader = response.headers.get("x-allow-proxy");

    if (allowHeader !== PROXY_ID) {
      return res.status(403).send("⛔ This website has NOT opted in to be proxied.");
    }

    // Proxy the site
    return createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: true,
      pathRewrite: { '^/site': '' }
    })(req, res, next);

  } catch (err) {
    console.error(err);
    return res.status(500).send("❌ Error checking site permission.");
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`ApolloOS proxy running on port ${PORT}`);
});
