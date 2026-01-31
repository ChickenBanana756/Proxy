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
}

.container {
  position:relative;
  z-index:2;
  text-align:center;
  margin-top:80px;
}

h1 {
  font-size:3em;
  text-shadow:0 0 15px #00f0ff;
}

input {
  width:340px;
  padding:10px;
  font-family:'Press Start 2P';
}

button {
  margin-left:10px;
  padding:10px 15px;
  font-family:'Press Start 2P';
  cursor:pointer;
}

.cards {
  margin-top:40px;
  display:flex;
  justify-content:center;
  gap:20px;
  flex-wrap:wrap;
}

.card {
  border:2px solid #00f0ff;
  padding:15px;
  cursor:pointer;
}

.card:hover {
  background:#00f0ff;
  color:black;
}
</style>
</head>

<body>

<canvas id="bg"></canvas>

<div class="container">
  <h1>ApolloOS</h1>
  <p>Type a website or click a card</p>

  <input id="url" placeholder="https://coolmathgames.com">
  <button onclick="visit()">Visit</button>

  <div class="cards">
    <div class="card" onclick="openSite('https://www.coolmathgames.com')">CoolMathGames</div>
    <div class="card" onclick="openSite('https://www.crazygames.com')">CrazyGames</div>
    <div class="card" onclick="openSite('https://www.youtube.com')">YouTube</div>
  </div>
</div>

<script>
function visit() {
  let url = document.getElementById("url").value.trim();
  if (!url) return;
  if (!url.startsWith("http")) url = "https://" + url;
  window.open(url, "_blank");
}

function openSite(url) {
  window.open(url, "_blank");
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
