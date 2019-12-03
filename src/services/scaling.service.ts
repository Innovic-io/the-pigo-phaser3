export const SCREEN_WIDTH = window.innerWidth;
export const SCREEN_HEIGHT = window.innerHeight;

export const GAME_MIN_WIDTH = 1067;
export const GAME_MIN_HEIGHT = 600;

export const SCALE_WIDTH = SCREEN_WIDTH / GAME_MIN_WIDTH;
export const SCALE_HEIGHT = SCREEN_HEIGHT / GAME_MIN_HEIGHT;

export const SCALE = SCALE_WIDTH >= SCREEN_HEIGHT ? SCALE_HEIGHT : SCALE_WIDTH;


export const START_BACKGROUND_SPRITE = {
  x: 0,
  y: 0,
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  texture: 'background'
};
export const CENTER_POINT = {
  x: SCREEN_WIDTH/2,
  y: SCREEN_HEIGHT/2
};

export const START_LOGO_POSITION = {
  x: CENTER_POINT.x,
  y: CENTER_POINT.y - (CENTER_POINT.y*0.2)
};

export const START_BTN_POSITION = {
  x: CENTER_POINT.x,
  y: START_LOGO_POSITION.y * 2
};

export const GAME_HEIGHT_BLOCK = SCREEN_HEIGHT / 10;
