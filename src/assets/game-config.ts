import {
  CENTER_POINT,
  diagonal,
  INFO_IMAGE_CENTER_POSITION,
  SCALE,
  SCREEN_HEIGHT,
  SCREEN_WIDTH
} from "../services/scaling.service";

export const GameConfigs = {
  backgroundInitialSpeed: 5,
  backgroundSpeedIncreaseBy: 4,
  backgroundSpeedDecreaseBy: 2,
  obstacleStartingVelocities: {
    blueFish: 500,
    yellowFish: 400,
    dangerFish: 1000,
    wood: 800,
    worms: 302,
    oilSplash: 302
  },
  gameObjectsTimers: {
    blueFish: 1500,
    yellowFish: 3500,
    dangerFish: 10000,
    wood: 4500,
    worms: 10000,
    oilSplash: 8000
  },
  speedUpBy: 230,
  slowDownBy: 100,
  rewardTime: 10000,
  bonus10PtsDuration: 1000,
  allowedSpaceBelowCanvas: 120
};

export const OilSplashConfigs = {
  imageChangeInterval: 500
};

export const PiranhaConfig = {
  velocity: calculatePiranhaVelocity()
};

export const TextConfig = {
  bonus10PtsStyle: {
    fontSize: 35,
    fontFamily: 'Comic Sans MS',
    color: '#000'  },
  stopwatch: {
    fontSize: diagonal * 0.02,
    fontFamily: 'Comic Sans MS',
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 5
  },
  score: {
    fontSize: diagonal * .02,
    fontFamily: 'Comic Sans MS',
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 5
  },
  highScore: {
    fontSize: diagonal * .04,
    fontFamily: 'Comic Sans MS',
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 5
  },
  speedUpText: {
    fontSize: diagonal * .03,
    fontFamily: 'Comic Sans MS',
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 5
  },
  imageButtonText: {
    fontSize: diagonal * .016,
    fontFamily: 'Comic Sans MS',
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 1
  },
  infoText: {
    fontSize: diagonal * .015,
    fontFamily: 'Comic Sans MS',
    color: '#ffffff',
    stroke: '#000000',
    strokeThickness: 1
  }
};

export const FilePaths = {
  piranhaPack: './src/assets/piranha-pack.json'
};

export const ImageScaling = {
  splashImage: SCALE * 1.3,
  navigationButtons: {
    alignmentFromTop: 0.13,
    alignmentFromSide: 0.07,
  },
  gameOver: SCALE * 0.8,
  infoNavigationButtons: {
    close: { x: SCREEN_WIDTH * .94, y: SCREEN_WIDTH * .05 },
    next: { x: SCREEN_WIDTH * 0.94, y: CENTER_POINT.y },
    back:  { x: SCREEN_WIDTH * 0.05, y: CENTER_POINT.y }
  }
};

export const Info = [
  {
    text: 'Eat always\nexcept when Pigo\nis in speed mode',
    images: [{
      texture: 'yellowFish',
      position: INFO_IMAGE_CENTER_POSITION
    }]
  },
  {
    text: 'Only eat\nif Pigo\nis in slow mode',
    images: [{
      texture: 'blue-fish',
      position: { x: INFO_IMAGE_CENTER_POSITION.x + SCREEN_WIDTH * .02, y: INFO_IMAGE_CENTER_POSITION.y - SCREEN_HEIGHT * .1 }
    },
      {
        texture: 'danger-fish',
        position: { x: INFO_IMAGE_CENTER_POSITION.x + SCREEN_WIDTH * .02, y: INFO_IMAGE_CENTER_POSITION.y + SCREEN_HEIGHT * .1 }
      }]
  },
  {
    text: 'Always avoid',
    images: [{
      texture: 'wood',
      position: { x: INFO_IMAGE_CENTER_POSITION.x + SCREEN_WIDTH * .02, y: INFO_IMAGE_CENTER_POSITION.y - SCREEN_HEIGHT * .1 }
    },
      {
        texture: 'oil-stein1',
        position: { x: INFO_IMAGE_CENTER_POSITION.x + SCREEN_WIDTH * .02, y: INFO_IMAGE_CENTER_POSITION.y + SCREEN_HEIGHT * .1 }
      }]
  },
  {
    text: 'SPEED (CRAZY) MODE\nYou can\'t eat anything,\nbut if you survive\nyou will get\nextra 10 points',
    images: [{
      texture: 'worm-speed-up',
      position: INFO_IMAGE_CENTER_POSITION
    }]
  },
  {
    text: 'SLOW MODE\nYou can eat\nall fishes \nfor the\nnext 10 seconds',
    images: [{
      texture: 'worm-slow-down',
      position: INFO_IMAGE_CENTER_POSITION
    }]
  },
  {
    text: 'Every 5 seconds\ngame speeds up\nand more fishes\nare added',
    images: [{
      texture: '',
      position: INFO_IMAGE_CENTER_POSITION
    }]
  },
  {
    text: 'Total score\nis calculates as:\nnumber of boost passed\n* number of fishes eaten',
    images: [{
      texture: '',
      position: INFO_IMAGE_CENTER_POSITION
    }]
  }
];

function calculatePiranhaVelocity() {
  return   250 + diagonal * 0.1;
}
