import { h, Component } from 'preact';
import Ball from '../../components/Ball';
import style from './style';
import { backGrounds, cursorImage } from '../../../config';

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.balls = [];
    this.frameNo = 0;
    this.cursorImage = new Image();
    this.backGround = new Image();
    this.cursorImage.src = cursorImage;
    this.nextBackground();
  }

  componentDidMount() {
    this.defaults();
    this.cursor({x: window.innerWidth/2, y: window.innerHeight/2});
  }

  componentDidUnmount() { // free up memory after unmount
    clearInterval(this.interval);
  }

  randomColor() { // 16 million color combination
    return `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)},1)`;
  }

  start() {
    this.frameNo = 0;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.context = this.canvas.getContext("2d");
    clearInterval(this.interval);
    this.updateGameArea();
  }

  clear() { // cleaning the screen function called every frame
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.drawImage(this.backGround, 0, 0, this.canvas.width, this.canvas.height);
  }

  cursor(evt) {
    // detects changes in mouse position and fires start function on first frame
    this.mousePosition = evt;
    if (!this.state.frameNo) {
      this.start();
      this.interval = setInterval(() => {this.updateGameArea()}, 1000/this.state.fps);
    }
  }

  getMousePos(evt) { // get real click position on canvas
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  addBall(evt) {
    const {x, y} = this.getMousePos(evt);
    const {bouncing, gravity, ballSize, ballsLimit, friction} = this.state;
    // adding ball
    this.balls = [].concat(this.balls,
      new Ball({
        bouncing, gravity, ballSize, ballsLimit, friction,
        color: this.randomColor(),
        canvas: this.canvas,
        context: this.context,
        x, y
      })
    );
  }

  updateGameArea() {
    // clearing screen
    this.clear();
    this.frameNo++;
    // setting balls limit
    this.balls = this.balls.slice(-this.state.ballsLimit);
    // updating positions then drawing each ball
    this.balls.forEach((ball) => { ball.newPos() });
    this.balls.forEach((ball) => { ball.update() });
    // drawing cursor image in mouse position
    this.context.drawImage(
      this.cursorImage,
      this.mousePosition.x - this.state.ballSize*2,
      this.mousePosition.y,
      this.state.ballSize*4,
      this.state.ballSize*6
    );
  }

  restartFps() {
    clearInterval(this.interval);
    this.frameNo = 0;
  }
  // change in sliders
  handleChange(evt, target) {
    this.setState({[target]: Number(evt.target.value)});
    if (target == 'fps') {
      // restarting interval
      this.restartFps();
      this.cursor(this.mousePosition);
    }
  }
  // default slider values
  defaults() {
    this.setState({
      bouncing: 0.5,
      gravity: 0.05,
      ballSize: 25,
      fps: 150,
      ballsLimit: 100,
      friction: 1.007
    });
    this.restartFps();
  }
  // loading next backgrounds from assets
  nextBackground() {
    const oldSrc = this.backGround.src.replace(window.location.href, '');
    const next = backGrounds[backGrounds.indexOf(oldSrc) + 1] || backGrounds[0];
    this.backGround.src = next;
  }

  render({ }, { bouncing, gravity, ballSize, fps, ballsLimit, friction }) {
    const sliders = [
      {key: 'bouncing', value: bouncing, range: [0.01, 0.9], name: 'Bouncing'},
      {key: 'gravity', value: gravity, range: [0.01, 0.1], name: 'Gravity'},
      {key: 'ballSize', value: ballSize, range: [1, 100], name: 'Ball Size'},
      {key: 'ballsLimit', value: ballsLimit, range: [1, 1000], name: 'Balls Limit'},
      {key: 'friction', value: friction, range: [1.001, 1.1], name: 'Friction'},
      {key: 'fps', value: fps, range: [1, 240], name: `FPS: ${Math.floor(fps)}`},
    ];
    let buttons = [
      {onClick: () => this.defaults(), name: 'Defaults'},
      {onClick: () => this.balls = [], name: 'Clear'},
      {onClick: () => this.nextBackground(), name: 'Next Background'},
    ];
    return (
      <div>
        <canvas ref={ c => this.canvas = c } onClick={ evt => this.addBall(evt) } onMouseMove={ evt => this.cursor(evt) }></canvas>
        <div class={style.inputs}>
          {
            sliders.map(el => (
              <span>
                <b>{el.name}</b>&emsp;
                <input
                  onChange={evt => this.handleChange(evt, el.key)}
                  value={el.value}
                  min={el.range[0]}
                  max={el.range[1]}
                  class={style.slider} type="range" step="any"
                />&emsp;
              </span>
            ))
          }
          {buttons.map(el => (<a onClick={el.onClick} class={style.button1} href="javascript:;">{el.name}</a>))}
        </div>
      </div>
    );
  }
}
