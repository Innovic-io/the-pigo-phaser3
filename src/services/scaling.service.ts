export const SCREEN_WIDTH = window.innerWidth;
export const SCREEN_HEIGHT = window.innerHeight;

export const GAME_MIN_WIDTH = 1067;
export const GAME_MIN_HEIGHT = 600;

export const SCALE_WIDTH = SCREEN_WIDTH / GAME_MIN_WIDTH;
export const SCALE_HEIGHT = SCREEN_HEIGHT / GAME_MIN_HEIGHT;

export const SCALE = SCREEN_WIDTH >= SCREEN_HEIGHT ? SCALE_HEIGHT : SCALE_WIDTH;


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

export const PROGRESS_BAR = {
  x: CENTER_POINT.x - (CENTER_POINT.x * .3),
  y: CENTER_POINT.y,
  width: SCREEN_WIDTH / 3.5,
  height: SCREEN_HEIGHT / 12
};
export const PROGRESS_BAR_INNER = { x: PROGRESS_BAR.x + 10, y: PROGRESS_BAR.y + 10 };
export const LOADING_TXT = { x: CENTER_POINT.x, y: CENTER_POINT.y - (CENTER_POINT.y * .2), size: 20 * SCALE };
export const PERCENT_TXT = {
  x: CENTER_POINT.x - (CENTER_POINT.x * .01),
  y: CENTER_POINT.y + (CENTER_POINT.y * .09),
  size: 16 * SCALE
};
