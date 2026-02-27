window.p5Sketches = window.p5Sketches || {};
window.p5Sketches['particles'] = function(p, container) {
  var particles = [];
  var NUM_PARTICLES = 300;
  var NOISE_SCALE = 0.003;
  var NOISE_SPEED = 0.0008;
  var BASE_SPEED = 1.8;
  var REPULSION_RADIUS = 100;
  var REPULSION_STRENGTH = 3.5;
  var t = 0;
  var mx = -9999;
  var my = -9999;

  function makeParticle() {
    return {
      x: p.random(p.width),
      y: p.random(p.height),
      vx: 0,
      vy: 0,
      alpha: p.random(80, 200),
      size: p.random(1.5, 3.5)
    };
  }

  p.setup = function() {
    var canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
    canvas.style('display', 'block');
    p.colorMode(p.RGB, 255, 255, 255, 255);
    for (var i = 0; i < NUM_PARTICLES; i++) {
      particles.push(makeParticle());
    }
  };

  p.draw = function() {
    p.background(10, 10, 14);
    t += NOISE_SPEED;

    for (var i = 0; i < particles.length; i++) {
      var pt = particles[i];

      // Flow field angle from Perlin noise
      var angle = p.noise(pt.x * NOISE_SCALE, pt.y * NOISE_SCALE, t) * p.TWO_PI * 2.5;
      var fx = p.cos(angle) * BASE_SPEED;
      var fy = p.sin(angle) * BASE_SPEED;

      // Mouse repulsion
      var dx = pt.x - mx;
      var dy = pt.y - my;
      var dist = p.sqrt(dx * dx + dy * dy);
      if (dist < REPULSION_RADIUS && dist > 0) {
        var force = (REPULSION_RADIUS - dist) / REPULSION_RADIUS;
        fx += (dx / dist) * force * REPULSION_STRENGTH;
        fy += (dy / dist) * force * REPULSION_STRENGTH;
      }

      pt.vx = pt.vx * 0.7 + fx * 0.3;
      pt.vy = pt.vy * 0.7 + fy * 0.3;
      pt.x += pt.vx;
      pt.y += pt.vy;

      // Wrap edges
      if (pt.x < -2) pt.x = p.width + 2;
      if (pt.x > p.width + 2) pt.x = -2;
      if (pt.y < -2) pt.y = p.height + 2;
      if (pt.y > p.height + 2) pt.y = -2;

      p.noStroke();
      p.fill(255, 255, 255, pt.alpha);
      p.ellipse(pt.x, pt.y, pt.size, pt.size);
    }
  };

  p.mouseMoved = function() {
    // Convert page coords to canvas-local coords
    var rect = container.getBoundingClientRect();
    mx = p.mouseX;
    my = p.mouseY;
  };

  p.windowResized = function() {
    p.resizeCanvas(container.offsetWidth, container.offsetHeight);
  };
};
