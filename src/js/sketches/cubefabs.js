window.p5Sketches = window.p5Sketches || {};
window.p5Sketches['cubefabs'] = function(p, container) {

  const cubesLogo = [
    [ 0,-1, 1],
    [-1,-1, 1],
    [-1,-1, 0],
    [-1,-1,-1],
    [-1, 0,-1],
    [-1, 1,-1],
    [ 0, 1,-1],
    [ 1, 1,-1],
    [ 1, 1, 0]
  ];

  let cubes = [
    [ 0,-1, 1],
    [-1,-1, 1],
    [-1,-1, 0],
    [-1,-1,-1],
    [-1, 0,-1],
    [-1, 1,-1],
    [ 0, 1,-1],
    [ 1, 1,-1],
    [ 1, 1, 0]
  ];

  let targetCubes = [
    [ 0,-1, 1],
    [-1,-1, 1],
    [-1,-1, 0],
    [-1,-1,-1],
    [-1, 0,-1],
    [-1, 1,-1],
    [ 0, 1,-1],
    [ 1, 1,-1],
    [ 1, 1, 0]
  ];

  const cubelerpAmount = 0.1;

  let angleX = 0;
  let angleY = 0;
  let targetAngleX = 0;
  let targetAngleY = 0;

  const PI = 3.14159;

  const homeX = PI / 5.1;
  const homeY = PI / 4.0;

  let lastMouseX = 0;
  let lastMouseY = 0;

  let mouseDownX = 0;
  let mouseDownY = 0;

  const lerpAmount = 0.1;

  let cubeSize = 500;
  let timeOfLastInteraction = -5000;

  let opacity = 0;
  const idleDuration_ms = 2000;
  const durationFadeIn_ms = 1000;
  const delayFadeIn_ms = 1500;

  let isDarkMode = true;
  let isOrtho = true;

  p.setup = function() {
    p.createCanvas(container.offsetWidth, container.offsetHeight, p.WEBGL);
    p.background(242, 242, 242);
    p.smooth();
    p.pixelDensity(p.displayDensity());
    p.ortho(-p.width/2, p.width/2, -p.height/2, p.height/2, -10000, 10000);
  };

  p.draw = function() {
    p.noStroke();
    if (isDarkMode) {
      p.fill(20, 20, 20);
    } else {
      p.fill(0, 0, 0, 10);
    }
    p.rect(-p.width/2, -p.height/2, p.width, p.height);

    // Set up rotation based on target angle
    angleX = p.lerp(angleX, targetAngleX, lerpAmount);
    angleY = p.lerp(angleY, targetAngleY, lerpAmount);

    // Apply rotations and draw the cube
    p.push();
    if (isOrtho) {
      p.translate(0, 0, cubeSize);
    } else {
      p.scale(0.75);
      p.translate(0, 0, cubeSize);
    }

    p.rotateX(angleX + homeX);
    p.rotateY(angleY + homeY);
    p.noFill();

    // Draw cubes
    if (isDarkMode) {
      p.stroke(255, 212, 81);
      p.noFill();
    } else {
      p.stroke(0, 0, 0);
      p.fill(255, 212, 81);
    }
    p.strokeWeight(2);

    // Update cube positions
    for (let i = 0; i < cubes.length; i++) {
      cubes[i][0] = p.lerp(cubes[i][0], targetCubes[i][0], cubelerpAmount);
      cubes[i][1] = p.lerp(cubes[i][1], targetCubes[i][1], cubelerpAmount);
      cubes[i][2] = p.lerp(cubes[i][2], targetCubes[i][2], cubelerpAmount);
    }

    // Draw cubes
    for (let i = 0; i < cubes.length; i++) {
      let cube = cubes[i];
      drawBox(cube[0], cube[1], cube[2]);
    }

    p.pop();

    if (isDarkMode) {
      p.fill(255);
    } else {
      p.fill(0);
    }

    if (p.mouseX > 250 || p.mouseY > 80) {
      // Rotate the view
      targetAngleY += 0.003;

      // Change formation every 5 seconds if no interaction
      if ((p.millis() - timeOfLastInteraction > 3000) && (p.millis() % 5000 < 20)) {
        moveAllCubes();
      }
    } else {
      resetCube();
      targetAngleX = angleX - (angleX % p.TAU);
      targetAngleY = angleY - (angleY % p.TAU);
    }
  };

  p.windowResized = function() {
    p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    if (isOrtho) {
      p.ortho(-p.width/2, p.width/2, -p.height/2, p.height/2, -10000, 10000);
    }
  };

  p.mousePressed = function() {
    lastMouseX = p.mouseX;
    lastMouseY = p.mouseY;
    mouseDownX = p.mouseX;
    mouseDownY = p.mouseY;
    timeOfLastInteraction = p.millis();
  };

  p.mouseDragged = function() {
    let dx = p.mouseX - lastMouseX;
    let dy = p.mouseY - lastMouseY;
    targetAngleY += dx * 0.01;
    targetAngleX -= dy * 0.01;
    lastMouseX = p.mouseX;
    lastMouseY = p.mouseY;
    timeOfLastInteraction = p.millis();
  };

  p.mouseReleased = function() {
    if (mouseDownX == p.mouseX && mouseDownY == p.mouseY) {
      moveAllCubes();
    }
  };

  p.keyPressed = function() {
    timeOfLastInteraction = p.millis();

    switch (p.key) {
      case 'd':
      case 'l':
        isDarkMode = !isDarkMode;
        break;
      case '0':
        console.log("There is no cube.");
        break;
      case '1': moveCube(1); break;
      case '2': moveCube(2); break;
      case '3': moveCube(3); break;
      case '4': moveCube(4); break;
      case '5': moveCube(5); break;
      case '6': moveCube(6); break;
      case '7': moveCube(7); break;
      case '8': moveCube(8); break;
      case '9': moveCube(0); break;
      case ' ':
        moveAllCubes();
        break;
      case 'o':
        p.ortho(-p.width/2, p.width/2, -p.height/2, p.height/2, -10000, 10000);
        isOrtho = true;
        break;
      case 'p':
        p.perspective();
        isOrtho = false;
        break;
    }
  };

  function drawBox(x, y, z) {
    p.push();
    p.strokeWeight(3);
    p.translate(x * cubeSize/3, y * cubeSize/3, z * cubeSize/3);
    if (isCubeHome()) {
      drawThreePlanes();
    } else {
      p.box(cubeSize/3);
    }
    p.pop();
  }

  function drawThreePlanes() {
    p.translate(-cubeSize/6, -cubeSize/6, -cubeSize/6);
    p.beginShape();
      p.vertex(0, 0, 0);
      p.vertex(cubeSize/3, 0, 0);
      p.vertex(cubeSize/3, cubeSize/3, 0);
      p.vertex(0, cubeSize/3, 0);
    p.endShape(p.CLOSE);
    p.beginShape();
      p.vertex(cubeSize/3, 0, 0);
      p.vertex(cubeSize/3, cubeSize/3, 0);
      p.vertex(cubeSize/3, cubeSize/3, cubeSize/3);
      p.vertex(cubeSize/3, 0, cubeSize/3);
    p.endShape(p.CLOSE);
    p.beginShape();
      p.vertex(0, 0, 0);
      p.vertex(0, 0, cubeSize/3);
      p.vertex(cubeSize/3, 0, cubeSize/3);
      p.vertex(cubeSize/3, 0, 0);
    p.endShape(p.CLOSE);
  }

  function resetCube() {
    for (let i = 0; i < cubes.length; i++) {
      targetCubes[i][0] = cubesLogo[i][0];
      targetCubes[i][1] = cubesLogo[i][1];
      targetCubes[i][2] = cubesLogo[i][2];
    }
  }

  function isCubeHome() {
    return (
      angleX % (2*PI) <  0.001 && angleX % (2*PI) > -0.001 &&
      angleY % (2*PI) <  0.001 && angleY % (2*PI) > -0.001
    );
  }

  function moveCube(id) {
    let targetDim = p.floor(p.random(3));
    while (!doesDimHaveAvailability(id, targetDim)) {
      targetDim = p.floor(p.random(3));
    }
    let targetLoc = targetCubes[id][targetDim];
    while (!doesDimHaveAvailabilityInLoc(id, targetDim, targetLoc)) {
      targetLoc = -1 + p.floor(p.random(3));
    }
    targetCubes[id][targetDim] = targetLoc;
  }

  function moveAllCubes() {
    for (let i = 0; i < cubes.length; i++) {
      moveCube(i);
    }
  }

  function doesDimHaveAvailability(id, dim) {
    for (let i = 0; i < 3; i++) {
      if (dim == 0) {
        if (isXYZempty(i-1, targetCubes[id][1], targetCubes[id][2])) return true;
      } else if (dim == 1) {
        if (isXYZempty(targetCubes[id][0], i-1, targetCubes[id][2])) return true;
      } else if (dim == 2) {
        if (isXYZempty(targetCubes[id][0], targetCubes[id][1], i-1)) return true;
      }
    }
    return false;
  }

  function doesDimHaveAvailabilityInLoc(id, dim, loc) {
    if (dim == 0) return isXYZempty(loc, targetCubes[id][1], targetCubes[id][2]);
    else if (dim == 1) return isXYZempty(targetCubes[id][0], loc, targetCubes[id][2]);
    else if (dim == 2) return isXYZempty(targetCubes[id][0], targetCubes[id][1], loc);
  }

  function isXYZempty(x, y, z) {
    for (let i = 0; i < cubes.length; i++) {
      if (targetCubes[i][0] == x && targetCubes[i][1] == y && targetCubes[i][2] == z) {
        return false;
      }
    }
    return true;
  }

};
