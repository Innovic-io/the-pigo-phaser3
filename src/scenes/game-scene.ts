import { Piranha } from '../objects/piranha';
import { BlueFish } from '../objects/blueFish';
import { Wood } from '../objects/wood';
import { YellowFish } from '../objects/YellowFish';
import { DangerFish } from '../objects/DangerFish';
import { WormSpeedUp } from '../objects/WormSpeedUp';
import { WormSlowDown } from '../objects/WormSlowDown';
import { OilSplash } from '../objects/OilSplash';

import { GameConfigs, TextConfig } from '../assets/game-config';
import {
  CENTER_POINT,
  GAME_HEIGHT_BLOCK,
  SCALE,
  SCREEN_HEIGHT,
  SCREEN_WIDTH
} from '../services/scaling.service';

export class GameScene extends Phaser.Scene {
  private piranha: Piranha;
  private blueFishes: Phaser.GameObjects.Group;
  private dangerFishes: Phaser.GameObjects.Group;
  private speedUpWorms: Phaser.GameObjects.Group;
  private slowDownWorms: Phaser.GameObjects.Group;
  private woods: Phaser.GameObjects.Group;
  oilSplashes: Phaser.GameObjects.Group;
  private yellowFishes: Phaser.GameObjects.Group;
  private background: Phaser.GameObjects.TileSprite;
  private scoreText: Phaser.GameObjects.Text;
  speedUpText: Phaser.GameObjects.Text;
  private bonusPointsText: Phaser.GameObjects.Text;
  private backgroundMovementSpeed;
  private piranhaChangeImage = false;
  private  obstacleVelocities;
  piranhaStates;

  obstacleTimers = [];

  addObstaclesFrequency;
  obstaclesSpeedIncreasing = 0;

  stopwatchText: Phaser.GameObjects.Text;
  stopwatchCounter = {seconds: 0, tenthOfASecond: 0};

  gameTimeouts = [];
  eatFishSound;
  deathSound;
  playDeathSoundExecuted = false;

  speedUpBy = 0;

  private isPlaying: boolean = false;
  private piranhaInMode = false;

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  init(data) {
    this.piranhaStates = data.piranhaStates.piranha;
    this.addObstaclesFrequency = data.piranhaStates.addObstaclesFreqency;

    this.registry.set('score', 0);
  }

  preload(): void {
    // @TODO this should go into separate function
    if (!this.isPlaying) {
      this.isPlaying = true;
      const music = this.sound.add('pigoLoop', { loop: true });
      music.play();

      this.eatFishSound = this.sound.add('eatFish', { loop: false });
      this.deathSound = this.sound.add('pigoDeath', { loop: false });
    }
  }

  create(): void {
    this.background = this.add
      .tileSprite(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 'background')
      .setOrigin(0, 0);

    this.backgroundMovementSpeed = GameConfigs.backgroundInitialSpeed;
    this.obstacleVelocities = { ...GameConfigs.obstacleStartingVelocities };
    this.playDeathSoundExecuted = false;

    this.scoreText = this.add
      .text(
        SCREEN_WIDTH - .10 * SCREEN_WIDTH,
        SCREEN_HEIGHT * .06,
        this.registry.values.score,
        TextConfig.score
      )
      .setDepth(2);

    this.stopwatchText = this.add
      .text(
        0.05 * SCREEN_WIDTH,
        SCREEN_HEIGHT * .06,
        this.stopwatchCounter.seconds + ',' + this.stopwatchCounter.tenthOfASecond,
        TextConfig.stopwatch
      )
      .setDepth(2);

    this.speedUpText = this.add
      .text(
        0,
        0,
        'LEVEL UP',
        TextConfig.speedUpText
      )
      .setDepth(2);
    this.speedUpText.setVisible(false);

    this.blueFishes = this.add.group({ classType: BlueFish });

    this.dangerFishes = this.add.group({ classType: BlueFish });
    this.speedUpWorms = this.add.group({ classType: WormSpeedUp });
    this.slowDownWorms = this.add.group({ classType: WormSlowDown });
    this.woods = this.add.group({ classType: Wood });
    this.oilSplashes = this.add.group({ classType: OilSplash });
    this.yellowFishes = this.add.group({ classType: YellowFish });

    this.piranha = new Piranha({
      scene: this,
      x: CENTER_POINT.x * .05,
      y: CENTER_POINT.y,
      key: 'piranha'
    });
    this.piranha.jump();
    this.piranha.setScale(SCALE);

    this.addNewBlueFish();

    // *****************************************************************
    // TIMER
    // *****************************************************************
    this.setTimerForStopwatch();

    this.setTimerForBlueFishes();
    this.setTimerForDangerFishes();
    this.setTimerForWoods();
    this.setTimerForYellowFish();
    this.setTimerForRewards();
    this.setTimerForOilSplashes();

    this.changePiranhaImage();

    this.setTimerForRemovingUnusedObjects();
    this.timerForIncreaseSpeedOfObstaclesByTime();

  }

  update(): void {
    if (!this.piranha.getDead()) {
      this.background.tilePositionX += this.backgroundMovementSpeed;
      if (this.piranha.y > 20) {
        this.piranha.update();
      }
      this.detectCollisions();
    } else {
      this.endGame();
    }
  }

  changePiranhaImage() {
    this.time.addEvent({
      delay: 500,
      callback: this.togglePiranhaImage,
      callbackScope: this,
      loop: true
    });
  }

  togglePiranhaImage() {
    if (this.piranhaInMode) {
      return;
    }
      this.piranhaChangeImage ?
        this.piranha.setTexture(this.piranhaStates.blinkingPiranha) : this.piranha.setTexture(this.piranhaStates.piranha);
      this.piranhaChangeImage = !this.piranhaChangeImage;
  }

  moveMouths() {
    if (this.piranhaInMode) {
      return;
    }
    this.piranha.setTexture(this.piranhaStates.eatingPiranha);
    setTimeout(() => {
      this.piranha.setTexture(this.piranhaStates.piranha);
    }, 100);
  }

  slowDown() {
    this.speedUpBy = -GameConfigs.slowDownBy;
    this.piranhaInMode = true;
    this.updateBackground('background-slow-down', false);
    this.updatePiranha(this.piranhaStates.slowedPiranha);
    this.increaseObstaclesSpeeds(-GameConfigs.slowDownBy);
    Phaser.Actions.Call(
      this.slowDownWorms.getChildren(),
      (worm) => worm.destroy(),
      this
    );
    this.gameTimeouts.push(
      setTimeout(() => {
        this.restartAfterSpeedRun(GameConfigs.slowDownBy);
      }, GameConfigs.rewardTime)
    );
  }

  speedUp() {
    this.speedUpBy = GameConfigs.speedUpBy;
    this.piranha.setInSpeed(true);
    this.piranhaInMode = true;
    this.updateBackground('background-speed-up', true);
    this.updatePiranha(this.piranhaStates.speedUpPiranha);
    this.increaseObstaclesSpeeds(GameConfigs.speedUpBy);

    Phaser.Actions.Call(
      this.speedUpWorms.getChildren(),
      function (worm) {
        worm.destroy();
      },
      this
    );
    this.gameTimeouts.push(
      setTimeout(() => {
        this.registry.values.score += 10;
        this.addBonusText();
        this.scoreText.setText(this.registry.values.score);
        this.restartAfterSpeedRun(-GameConfigs.speedUpBy);
      }, GameConfigs.rewardTime)
    );
  }

  increaseObstaclesSpeeds(speedUpBy) {
    this.changeSpeedOfObstacle(this.blueFishes, 'blueFish', speedUpBy);
    this.changeSpeedOfObstacle(this.yellowFishes, 'yellowFish', speedUpBy);
    this.changeSpeedOfObstacle(this.woods, 'wood', speedUpBy);
    this.changeSpeedOfObstacle(this.oilSplashes, 'oilSplash', speedUpBy);
    this.changeSpeedOfObstacle(this.dangerFishes, 'dangerFish', speedUpBy);
    this.changeSpeedOfObstacle(this.speedUpWorms, 'worms', speedUpBy);
    this.changeSpeedOfObstacle(this.slowDownWorms, 'worms', speedUpBy);
  }

  decreaseObstaclesSpeeds(slowDownBy) {
    this.changeSpeedOfObstacle(this.blueFishes, 'blueFish', slowDownBy);
    this.changeSpeedOfObstacle(this.yellowFishes, 'yellowFish', slowDownBy);
    this.changeSpeedOfObstacle(this.woods, 'wood', slowDownBy);
    this.changeSpeedOfObstacle(this.oilSplashes, 'oilSplash', slowDownBy);
    this.changeSpeedOfObstacle(this.dangerFishes, 'dangerFish', slowDownBy);
    this.changeSpeedOfObstacle(this.speedUpWorms, 'worms', slowDownBy);
    this.changeSpeedOfObstacle(this.slowDownWorms, 'worms', slowDownBy);
  }

  updateBackground(backgroundKey, speedUp) {
    this.background.setTexture(backgroundKey);
    speedUp ? this.backgroundMovementSpeed += GameConfigs.backgroundSpeedIncreaseBy
      : this.backgroundMovementSpeed -= GameConfigs.backgroundSpeedDecreaseBy;
  }

  updatePiranha(piranha) {
    this.piranha.setTexture(piranha);
  }

  setGameOptionsToDefault() {
    this.speedUpBy = 0;
    this.piranha.setInSpeed(false);
    this.piranhaInMode = false;
    Object.keys(this.stopwatchCounter).forEach(counter => this.stopwatchCounter[counter] = 0);
    this.obstaclesSpeedIncreasing = 0;
  }

  restartAfterSpeedRun(resetVelocityBy) {
    this.piranha.setInSpeed(false);
    this.increaseObstaclesSpeeds(resetVelocityBy);
    this.speedUpBy = 0;
    this.piranhaInMode = false;
    this.backgroundMovementSpeed = GameConfigs.backgroundInitialSpeed;
    this.background.setTexture('background');
    this.updatePiranha(this.piranhaStates.piranha);
  }

  addNewBlueFish(): void {
    let i = this.getRandomInt(2, 9);
    this.addBlueFish(SCREEN_WIDTH, i * GAME_HEIGHT_BLOCK);
    this.addBlueFish(SCREEN_WIDTH, i * GAME_HEIGHT_BLOCK);
  }

  addNewDangerFish(): void {
    let i = this.getRandomInt(2, 9);
    this.addDangerFish(SCREEN_WIDTH, i * GAME_HEIGHT_BLOCK);
  }

  addNewYellowFish(): void {
    let i = this.getRandomInt(2, 9);
    this.addYellowFish(SCREEN_WIDTH, i * GAME_HEIGHT_BLOCK);
  }

  addNewOilSplash(): void {
    let i = this.getRandomInt(2, 7);
    this.addOilSplash(SCREEN_WIDTH, i * GAME_HEIGHT_BLOCK);
  }

  addBlueFish(x: number, y: number): void {
    this.blueFishes.add(
      new BlueFish({
          scene: this,
          x: x,
          y: y,
          key: 'blue-fish'
        },
        this.obstacleVelocities.blueFish + this.obstaclesSpeedIncreasing + this.speedUpBy)
    );
  }

  addDangerFish(x: number, y: number): void {
    this.dangerFishes.add(
      new DangerFish({
          scene: this,
          x: x,
          y: y,
          key: 'danger-fish'
        },
        this.obstacleVelocities.dangerFish + this.obstaclesSpeedIncreasing + this.speedUpBy)
    );
  }

  addReward(): void {
    if (this.piranhaInMode) {
      return;
    }
    const position = {
      x: this.getRandomInt(SCREEN_WIDTH, SCREEN_WIDTH * 1.2),
      y: this.getRandomInt(SCREEN_HEIGHT * .1, SCREEN_HEIGHT * .66),
    };
    this.getRandomInt(0, 2) ? this.addSpeedUpWorm(position) : this.addSlowDownWorm(position);
  }

  addSpeedUpWorm(postition) {
    this.speedUpWorms.add(
      new WormSpeedUp({
          scene: this,
          x: postition.x,
          y: postition.y,
          key: 'worm-speed-up'
        },
        this.obstacleVelocities.worms)
    );
  }

  addSlowDownWorm(position): void {
    this.slowDownWorms.add(
      new WormSlowDown({
          scene: this,
          x: position.x,
          y: position.y,
          key: 'worm-slow-down'
        },
        this.obstacleVelocities.worms)
    );
  }

  setTimerForStopwatch() {
      this.time.addEvent({
        delay: 100,
        callback: this.tickStopwatch,
        callbackScope: this,
        loop: true
      });
  }

  tickStopwatch() {
    this.stopwatchCounter.tenthOfASecond++;
    if(this.stopwatchCounter.tenthOfASecond >= 10) {
      this.stopwatchCounter.seconds++;
      this.stopwatchCounter.tenthOfASecond = 0;
    }
    this.stopwatchText.setText(this.stopwatchCounter.seconds + ',' + this.stopwatchCounter.tenthOfASecond);
  }

  setTimerForDangerFishes() {
    this.obstacleTimers.push(
      this.time.addEvent({
        delay: GameConfigs.gameObjectsTimers.dangerFish + this.addObstaclesFrequency,
        callback: this.addNewDangerFish,
        callbackScope: this,
        loop: true
      })
    )
  }

  addYellowFish(x: number, y: number): void {
    this.yellowFishes.add(
      new YellowFish({
          scene: this,
          x: x,
          y: y,
          key: 'yellowFish'
        },
        this.obstacleVelocities.yellowFish + this.obstaclesSpeedIncreasing + this.speedUpBy)
    );
  }

  setTimerForBlueFishes() {
    this.obstacleTimers.push(this.time.addEvent({
        delay: GameConfigs.gameObjectsTimers.blueFish + this.addObstaclesFrequency,
        callback: this.addNewBlueFish,
        callbackScope: this,
        loop: true
      })
    )
  }

  setTimerForYellowFish() {
    this.time.addEvent({
      delay: GameConfigs.gameObjectsTimers.yellowFish,
      callback: this.addNewYellowFish,
      callbackScope: this,
      loop: true
    });
  }

  setTimerForRewards() {
    this.time.addEvent({
      delay: GameConfigs.gameObjectsTimers.worms,
      callback: this.addReward,
      callbackScope: this,
      loop: true
    });
  }

  addNewWood() {
    this.woods.add(
      new Wood({
          scene: this,
          x: SCREEN_WIDTH,
          y: SCREEN_HEIGHT * .08,
          key: 'wood'
        },
        this.obstacleVelocities.wood + this.obstaclesSpeedIncreasing + this.speedUpBy)
    );
  }

  addOilSplash(x, y) {
    this.oilSplashes.add(
      new OilSplash({
          scene: this,
          x: x,
          y: y,
          key: 'oil-stein1'
        },
        this.obstacleVelocities.oilSplash + this.speedUpBy)
    );
  }

  setTimerForWoods() {
    this.time.addEvent({
      delay: GameConfigs.gameObjectsTimers.wood + this.addObstaclesFrequency,
      callback: this.addNewWood,
      callbackScope: this,
      loop: true
    });
  }

  setTimerForOilSplashes() {
    this.obstacleTimers.push(
      this.time.addEvent({
        delay: GameConfigs.gameObjectsTimers.oilSplash + this.addObstaclesFrequency,
        callback: this.addNewOilSplash,
        callbackScope: this,
        loop: true
      })
    )
  }

  timerForIncreaseSpeedOfObstaclesByTime() {
    this.time.addEvent({
      delay: 10000,
      callback: this.increaseObstaclesSpeedOverTime,
      callbackScope: this,
      loop: true
    });
  }

  increaseObstaclesSpeedOverTime() {
    if(this.obstaclesSpeedIncreasing > 500) {
      return;
    }

    this.speedUpText.setPosition(CENTER_POINT.x - this.speedUpText.width/2, SCREEN_HEIGHT * .06);
    this.speedUpText.setVisible(true);
    setTimeout(() => {
      this.speedUpText.setVisible(false);
    }, 2000);

    this.obstaclesSpeedIncreasing += 50;
    this.addObstaclesFrequency -= 18;
    this.obstacleTimers.forEach(timer => {
      timer.delay += this.addObstaclesFrequency;
    });
  }

  changeSpeedOfObstacle(listOfObstacles, obstacle, increaseBy) {
    listOfObstacles.children.entries.forEach(obstacle => {
      obstacle.body.setVelocity(obstacle.body.velocity.x - increaseBy, 0);
    });
  }

  detectCollisions() {
    this.physics.overlap(
      this.piranha,
      this.blueFishes,
      (piranha, blueFish) => {
        this.eatBigFish(blueFish);
      },
      null,
      this
    );

    this.physics.overlap(
      this.piranha,
      this.woods,
      () => {
        this.piranha.setDead(true);
      },
      null,
      this
    );

    this.physics.overlap(
      this.piranha,
      this.oilSplashes,
      () => {
        this.piranha.setDead(true);
      },
      null,
      this
    );

    this.physics.overlap(
      this.piranha,
      this.dangerFishes,
      (piranha, dangerFish) => {
        this.eatBigFish(dangerFish);
      },
      null,
      this
    );

    this.physics.overlap(this.piranha, this.yellowFishes,
      (piranha, yellowFish) => {
        this.eatSmallFish(yellowFish);
      }, null, this);
    this.physics.overlap(this.piranha, this.speedUpWorms,
      () => {
        this.speedUp();
      }, null, this);
    this.physics.overlap(this.piranha, this.slowDownWorms,
      () => {
        this.slowDown();
      }, null, this);
  }

  eatBigFish(fish) {
    this.piranhaInMode ? this.piranha.getInSpeed() ? this.piranha.setDead(true) : this.eatFish(fish)
      : this.piranha.setDead(true);
  }

  eatSmallFish(fish) {
    this.piranhaInMode ? this.piranha.getInSpeed() ? this.piranha.setDead(true) : this.eatFish(fish)
      : this.eatFish(fish);
  }

  eatFish(fish) {
    this.eatFishSound.play();
    this.registry.values.score++;
    this.moveMouths();
    fish.destroy();

    this.scoreText.setText(this.registry.values.score);
  }

  addBonusText() {
    this.bonusPointsText = this.add
      .text(
        this.piranha.x+10,
        this.piranha.y-10,
        '+10',
        TextConfig.bonus10PtsStyle
      )
      .setDepth(2);
    this.gameTimeouts.push(setTimeout(() => {
      this.bonusPointsText.destroy();
    },GameConfigs.bonus10PtsDuration)
    )
  }

  endGame() {
    this.piranha.setTexture(this.piranhaStates.deadPiranha);
    this.clearTimeoutsValues();
    if (!this.playDeathSoundExecuted) {
      this.deathSound.play();
      this.playDeathSoundExecuted = true;
    }

    if (this.speedUpWorms.children.entries.length) {
      Phaser.Actions.Call(
        this.speedUpWorms.getChildren(),
        function (worm) {
          worm.body.setVelocity(0);
        },
        this
      );
    }
    if (this.slowDownWorms.children.entries.length) {
      Phaser.Actions.Call(
        this.slowDownWorms.getChildren(),
        function (worm) {
          worm.body.setVelocity(0);
        },
        this
      );
    }
    if (this.oilSplashes.children.entries.length) {
      Phaser.Actions.Call(
        this.oilSplashes.getChildren(),
        function (oilSplash) {
          oilSplash.body.setVelocity(0);
        },
        this
      );
    }

    if (this.piranha.y > this.sys.canvas.height) {
      this.setGameOptionsToDefault();
      this.scene.start('BeginScene');
    }
  }

  private resetObstacleVelocities() {
    this.obstacleVelocities = { ...GameConfigs.obstacleStartingVelocities };

    this.blueFishes.children.entries.forEach(fish => {
      fish.body.setVelocity(-GameConfigs.obstacleStartingVelocities.blueFish, 0);
    });
    this.yellowFishes.children.entries.forEach(fish => {
      fish.body.setVelocity(-GameConfigs.obstacleStartingVelocities.yellowFish, 0);
    });
    this.dangerFishes.children.entries.forEach(fish => {
      fish.body.setVelocity(-GameConfigs.obstacleStartingVelocities.dangerFish, 0);
    });
    this.woods.children.entries.forEach(wood => {
      wood.body.setVelocity(-GameConfigs.obstacleStartingVelocities.wood, 0);
    });
    this.oilSplashes.children.entries.forEach(oilSplash => {
      oilSplash.body.setVelocity(-GameConfigs.obstacleStartingVelocities.oilSplash, 0);
    });
    this.slowDownWorms.children.entries.forEach(worm => {
      worm.body.setVelocity(-GameConfigs.obstacleStartingVelocities.worms, 0);
    });
    this.speedUpWorms.children.entries.forEach(worm => {
      worm.body.setVelocity(-GameConfigs.obstacleStartingVelocities.worms, 0);
    });
  }

  setTimerForRemovingUnusedObjects() {
    this.time.addEvent({
      delay: 10000,
      callback: this.removeUnusedObjects,
      callbackScope: this,
      loop: true
    });
  }

  removeUnusedObjects() {
    this.remove(this.blueFishes);
    this.remove(this.yellowFishes);
    this.remove(this.dangerFishes);
    this.remove(this.woods);
    this.remove(this.speedUpWorms);
    this.remove(this.slowDownWorms);
    this.remove(this.oilSplashes);
  }

  remove(objects) {
    objects.children.iterate((object) => {
        if(object && object.x < -10) {
          objects.children.delete(object);
          object.destroy();
        }
    });
  }

  clearTimeoutsValues() {
    this.gameTimeouts.forEach(timeout => window.clearTimeout(timeout));
  }

  private getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

}
