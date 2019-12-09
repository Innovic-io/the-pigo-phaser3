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
  allowedSpaceBelowCanvas: 100
};

export const OilSplashConfigs = {
  imageChangeInterval: 500
};

export const PiranhaConfig = {
  velocity: 400
};

export const TextConfig = {
  bonus10PtsStyle: {
    fontSize: 35,
    fontFamily: 'Comic Sans MS',
    color: '#000'  }
};

export const FilePaths = {
  piranhaPack: './src/assets/piranha-pack.json'
};
