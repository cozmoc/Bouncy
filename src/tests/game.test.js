import { h } from 'preact';
import Game from '../routes/game';
import { shallow } from 'preact-render-spy';
import { backGrounds, cursorImage } from './../../config';
import canvasMock from './__mocks__/canvasMock';

describe('Game Component', () => {
  // shallow rendering
  let game, component;

  beforeEach(() => {
    game = shallow(<Game />);
    component = new game[0].nodeName();
  });

  test('Should render canvas and all sliders', () => {
    expect(game.find('canvas').length).toEqual(1);
    expect(game.find('.slider').length).toEqual(6);
  });

  test('Should have default values set', () => {
    let cursorImage2 = new Image();
    cursorImage2.src = cursorImage;
    setTimeout(() => {
      let {state, balls, frameNo, cursorImage, backGround} = component;
      expect(balls).toEqual([]);
      expect(frameNo).toEqual(0);
      expect(cursorImage).toEqual(cursorImage2);
      expect(backGround).toEqual(new Image());
    });
  });

  test('Should add a ball on click', () => {
    component.canvas = canvasMock;
    component.componentDidMount();
    expect(component.balls.length).toEqual(0);

    component.addBall({clientX: 50, clientY: 20});
    expect(component.balls.length).toEqual(1);
    expect(component.frameNo).not.toEqual(0);

    component.addBall({clientX: 50, clientY: 20});
    expect(component.balls[0]).not.toEqual(component.balls[1]);
  });

  test('Should handle changes in sliders', () => {
    component.canvas = canvasMock;
    component.componentDidMount();
    expect(component.state).not.toEqual({});

    component.handleChange({target:{value: '0.7'}}, 'bouncing');
    expect(component.state.bouncing).toEqual(0.7);
    expect(component.frameNo).not.toEqual(0);

    component.handleChange({target:{value: '200'}}, 'fps');
    expect(component.state.fps).toEqual(200);
    expect(component.frameNo).toEqual(1);
  });

  test('Should limit balls to Balls Limit value', () => {
    component.canvas = canvasMock;
    component.componentDidMount();
    for (var i = 0; i < component.state.ballsLimit + 20; i++) {
      component.addBall({clientX: 50, clientY: 20});
      component.updateGameArea();
    }
    expect(component.balls.length).toEqual(component.state.ballsLimit);
  });
  
  test('Should change background after clicking on the next button', () => {
    component.canvas = canvasMock;
    component.componentDidMount();
    expect(component.backGround.src.replace(window.location.href, '')).toEqual(backGrounds[0]);

    component.nextBackground();
    expect(component.backGround.src.replace(window.location.href, '')).toEqual(backGrounds[1]);

    component.backGround.src = backGrounds[backGrounds.length - 1];
    component.nextBackground();
    expect(component.backGround.src.replace(window.location.href, '')).toEqual(backGrounds[0]);
  });
});
