import { diagonal, SCALE, SCREEN_HEIGHT, SCREEN_WIDTH } from "../services/scaling.service";

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
  bonus10PtsDuration: 800,
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
  gameOver: SCALE * 0.8
};

function calculatePiranhaVelocity() {
  let addVelocity = (SCREEN_WIDTH/ SCREEN_HEIGHT);
  addVelocity = addVelocity >= 1 ? -addVelocity  * 10 : (1/addVelocity)  * 10;
  return   400 + addVelocity;
}
