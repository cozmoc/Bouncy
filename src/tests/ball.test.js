import Ball from '../components/Ball';

describe('Balls Component', () => {
  let context, canvas, balls;
  beforeEach(() => {
    context = {
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
    };
    canvas = {
      width: 100,
      height: 100,      
    }
    balls = [
      new Ball({context, canvas, x:100, y:100, ballSize:10, bouncing:0.5, friction: 1.01, color: 'rgba(255,255,255,1)', gravity: 0.05}),
      new Ball({context, canvas, x:100, y:100, ballSize:20, bouncing:0.9, friction: 1.1, color: 'rgba(127,127,127,1)', gravity: 0.1}),
    ];
  });

  test('Should set Default values for Balls', () => {
    expect(balls[0].speedX).toBeTruthy();
    expect(balls[0].speedY).toBeTruthy();
    expect(balls[0].speedX).not.toEqual(balls[1].speedX);
  });

  test('Should update to new position on next frame', () => {
    let oldBall = {...balls[0]};
    balls.forEach((ball) => ball.newPos());
    expect(balls[0].x).not.toEqual(oldBall.x);
    expect(balls[0].y).not.toEqual(oldBall.y);
  });

  test('Should bounce if it hits bottom', () => {
    balls[0].y = canvas.height;
    let oldBall = {...balls[0]};
    balls.forEach((ball) => ball.newPos());
    expect(balls[0].speedY).not.toEqual(oldBall.speedY);
    balls.forEach((ball) => ball.newPos());
    expect(balls[0].speedY).not.toEqual(oldBall.speedY);
  });

  test('Should bounce if it hits sides', () => {
    balls[0].x = canvas.width;
    let oldBall = {...balls[0]};
    balls.forEach((ball) => ball.newPos());
    expect(balls[0].speedX).not.toEqual(oldBall.speedX);
    balls.forEach((ball) => ball.newPos());
    expect(balls[0].speedX).not.toEqual(oldBall.speedX);
  });
});