import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Home page
app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>ApolloOS</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

      body { margin:0; height:100vh; background:black; color:#00f0ff; font-family:'Press Start 2P', cursive; overflow:hidden; }
      canvas { position: fixed; top:0; left:0; width:100%; height:100%; z-index:0; }

      .overlay { position: relative; z-index:10; text-align:center; margin-top:50px; }

      h1 { font-size:3em; color:#00f0ff; text-shadow:0 0 10px #00f0ff,0 0 20px #00f0ff; }
      p { font-size:0.9em; }
      form { margin-top:30px; }
      input[type=text] { width:300px; font-family:'Press Start 2P'; font-size:0.9em; padding:5px; }
      input[type=submit] { font-family:'Press Start 2P'; font-size:0.9em; padding:5px 10px; margin-left:10px; cursor:pointer; }

      .cards { margin-top:40px; display:flex; justify-content:center; flex-wrap:wrap; gap:20px; }
      .card { background:#111; border:2px solid #00f0ff; padding:15px; width:250px; text-align:center; cursor:pointer; transition:0.2s; }
      .card:hover { background:#00f0ff; color:black; transform:scale(1.05); }

      iframe { width:80%; height:500px; margin-top:30px; border:none; }
    </style>
  </head>
  <body>
    <canvas id="particles"></canvas>

    <div class="overlay">
      <h1>ApolloOS</h1>
      <p>Type a URL or click a demo site below</p>
      <form id="urlForm">
        <input type="text" id="urlInput" placeholder="https://example.com" />
        <input type="submit" value="Visit" />
      </form>

      <div class="cards">
        <div class="card" onclick="loadDemo('youtube')">YouTube Video</div>
        <div class="card" onclick="loadDemo('mathgame')">Playable Math Game</div>
        <div class="card" onclick="loadDemo('snake')">Snake Game</div>
      </div>

      <div id="demoContainer"></div>
    </div>

    <script>
      // Particles
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

      // URL form
      const form = document.getElementById('urlForm');
      const input = document.getElementById('urlInput');
      const demoContainer = document.getElementById('demoContainer');

      form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const url = input.value;
        if(url) {
          demoContainer.innerHTML = '<iframe src="'+url+'" allowfullscreen></iframe>';
        }
      });

      // Demo loader
      function loadDemo(site){
        let url = '';
        if(site==='youtube') url='https://www.youtube.com/embed/dQw4w9WgXcQ';
        else if(site==='mathgame') url='https://www.coolmathgames.com/0-candy-chase'; // example playable game
        else if(site==='snake') url='https://playsnake.org/';

        demoContainer.innerHTML = '<iframe src="'+url+'" allowfullscreen></iframe>';
      }
    </script>
  </body>
  </html>
  `);
});

app.listen(PORT, ()=>console.log(`ApolloOS running on port ${PORT}`));
