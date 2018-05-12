module.exports = function Ball(props) {
  // Random X, Y speed
  this.speedX = Math.random() > 0.5 ? Math.random() : - Math.random();
  this.speedY = (-Math.random() * 5) - 2;
  this.x = props.x;
  this.y = props.y;
  // Draw ball
  this.update = () => {
    const ctx = props.context;
    ctx.beginPath();
    ctx.lineWidth = props.ballSize*2;
    ctx.lineCap = "round";
    ctx.strokeStyle = `rgba(255,255,255,${Math.abs(this.speedY) / 70})`;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.speedX * 20, (this.y) - this.speedY * 20);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.x, this.y, props.ballSize, 0, 2 * Math.PI, false);
    ctx.fillStyle = props.color;
    ctx.fill();
  }
  // check changed positions
  this.newPos = () => {
    this.speedY += props.gravity;
    this.x += this.speedX;
    this.y += this.speedY;
    this.hitBottom();
    this.hitSides();
  }
  // check if ball hit ground
  this.hitBottom = () => {
    var rockbottom = props.canvas.height - props.ballSize;
    if (this.y >= rockbottom) {
      if (this.speedY > 1) {
        this.y = rockbottom - 1;
        // add bouncing effect
        this.speedY = -(this.speedY*props.bouncing);
      } else {
        this.y = rockbottom;
        // friction on ground
        this.speedX /= props.friction;
        this.speedY = 0;
      }
    }
  }

  this.hitSides = () => {
    var rightSide = props.canvas.width - props.ballSize, leftSide = props.ballSize;
    if (this.x >= rightSide || this.x <= leftSide) {
      this.speedX = -this.speedX;
    }
  }
}