import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>ApolloOS</title>

<style>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

body {
  margin:0;
  background:black;
  color:#00f0ff;
  font-family:'Press Start 2P', cursive;
  overflow:hidden;
}

canvas {
  position:fixed;
  inset:0;
  z-index:0;
}

.ui {
  position:relative;
  z-index:2;
  text-align:center;
  padding-top:40px;
}

h1 {
  font-size:3em;
  text-shadow:0 0 15px #00f0ff;
}

input {
  width:360px;
  padding:10px;
  font-family:'Press Start 2P';
}

button {
  padding:10px 15px;
  font-family:'Press Start 2P';
  cursor:pointer;
}

iframe {
  width:100%;
  height:calc(100vh - 220px);
  border:none;
  margin-top:20px;
  background:black;
}
</style>
</head>

<body>

<canvas id="bg"></canvas>

<div class="ui">
  <h1>ApolloOS</h1>
  <p>Powered by CroxyProxy</p>

  <input id="url" placeholder="https://coolmathgames.com">
  <button onclick="browse()">Visit</button>

  <iframe id="browser"></iframe>
</div>

<script>
function browse(){
  let url = document.getElementById("url").value.trim();
  if(!url) return;
  if(!url.startsWith("http")) url = "https://" + url;

  const croxyUrl = "https://www.croxyproxy.com/" + url;
  document.getElementById("browser").src = croxyUrl;
}

// particles
const c = document.getElementById("bg");
const ctx = c.getContext("2d");
c.width = innerWidth;
c.height = innerHeight;

const dots = Array.from({length:120},()=>({
  x:Math.random()*c.width,
  y:Math.random()*c.height,
  vx:(Math.random()-.5)*0.5,
  vy:(Math.random()-.5)*0.5
}));

function animate(){
  ctx.clearRect(0,0,c.width,c.height);
  ctx.fillStyle="#00f0ff";
  dots.forEach(d=>{
    d.x+=d.vx; d.y+=d.vy;
    if(d.x<0||d.x>c.width||d.y<0||d.y>c.height){
      d.x=Math.random()*c.width;
      d.y=Math.random()*c.height;
    }
    ctx.beginPath();
    ctx.arc(d.x,d.y,2,0,Math.PI*2);
    ctx.fill();
  });
  requestAnimationFrame(animate);
}
animate();
</script>

</body>
</html>
`);
});

app.listen(PORT, () =>
  console.log("ApolloOS running on port " + PORT)
);
