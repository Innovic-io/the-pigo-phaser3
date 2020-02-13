import { MainCharacter } from '../objects/mainCharacter';
import { BlueFish } from '../objects/blueFish';

import { GameConfigs, ImageScaling, TextConfig } from '../assets/game-config';
import {
  CENTER_POINT, diagonal,
  GAME_HEIGHT_BLOCK, GAME_MIN_HEIGHT,
  SCALE,
  SCREEN_HEIGHT,
  SCREEN_WIDTH
} from '../services/scaling.service';
import { Bounce } from '../objects/bounce';

export class GameScene extends Phaser.Scene {
  private bounces: Phaser.GameObjects.Group;
  private mainCharacter: MainCharacter;
  private blueFishes: Phaser.GameObjects.Group;

  private background: Phaser.GameObjects.Image;
  private scoreText: Phaser.GameObjects.Text;

  piranhaStates;

  addObstaclesFrequency;
  eatFishSound;
  deathSound;
  gameOverExecuted = false;

  speedUpBy = 0;

  private isPlaying: boolean = false;
  private piranhaInMode = false;

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  init(data) {
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
    this.setUpBackground();

    this.gameOverExecuted = false;

    this.scoreText = this.add
      .text(
        SCREEN_WIDTH - diagonal * 0.055,
        SCREEN_HEIGHT * .03,
        this.registry.values.score,
        TextConfig.score
      )
      .setDepth(2);

    this.blueFishes = this.add.group({ classType: BlueFish });
    this.bounces = this.add.group({ classType: Bounce });

    this.mainCharacter = new MainCharacter({
      scene: this,
      x: CENTER_POINT.x,
      y: CENTER_POINT.y,
      key: 'face_happy'
    });
    this.mainCharacter.jump();
    this.addBounces();
  }

  update(): void {
    this.bounces.children.entries.forEach(bounce => bounce.update());
    if (!this.mainCharacter.getDead()) {
        this.mainCharacter.update();
      this.detectCollisions();
    } else {
      this.endGame();
    }
  }

  setUpBackground() {
    this.background = this.add.image(CENTER_POINT.x,CENTER_POINT.y, 'background');
  }

  moveMouths() {
    if (this.piranhaInMode) {
      return;
    }
    this.mainCharacter.setTexture(this.piranhaStates.eatingPiranha);
    setTimeout(() => {
      this.mainCharacter.setTexture(this.piranhaStates.mainCharacter);
    }, 100);
  }

  updateBackground(backgroundKey, speedUp) {
    this.background.setTexture(backgroundKey);
  }

  updatePiranha(piranha) {
    this.mainCharacter.setTexture(piranha);
  }

  addBounces(): void {
    this.bounces.add(
      new Bounce({
          scene: this,
          x: SCREEN_WIDTH * .91,
          y: CENTER_POINT.y,
          key: 'right_bounce'
        },
        200)
    );
    this.bounces.add(
      new Bounce({
          scene: this,
          x: 0,
          y: CENTER_POINT.y,
          key: 'left_bounce'
        },
        -200)
    );
  }

  detectCollisions() {
    this.physics.overlap(
      this.mainCharacter,
      this.bounces,
      (character, bounce) => {
        this.mainCharacter.changeCharacterDirection();

        // To avoid typescript errors
        const obj = bounce as any;
        obj.doTheBounce();
      },
      null,
      this
    );
  }

  eatBigFish(fish) {
    this.piranhaInMode ? this.mainCharacter.getInSpeed() ? this.mainCharacter.setDead(true) : this.eatFish(fish)
      : this.mainCharacter.setDead(true);
  }

  eatSmallFish(fish) {
    this.piranhaInMode ? this.mainCharacter.getInSpeed() ? this.mainCharacter.setDead(true) : this.eatFish(fish)
      : this.eatFish(fish);
  }

  eatFish(fish) {
    this.eatFishSound.play();
    this.registry.values.score++;
    this.moveMouths();
    fish.destroy();

    this.scoreText.setText(this.registry.values.score);
  }

  endGame() {
    localStorage.setItem('currentScore', (0).toString());
    if (!this.gameOverExecuted) {
      this.deathSound.play();
      this.gameOverExecuted = true;

      this.showHighScore();
    }

  }

  remove(objects) {
    objects.children.iterate((object) => {
        if(object && object.x < -10) {
          objects.children.delete(object);
          object.destroy();
        }
    });
  }

  showHighScore() {
    const splashImage = this.add.image(CENTER_POINT.x, CENTER_POINT.y, 'splash')
      .setDepth(3)
      .setScale(ImageScaling.splashImage);

    const gameOver =this.add.image(
      CENTER_POINT.x,
      splashImage.getCenter().y - (splashImage.displayHeight * 0.7) / 2,
      'gameOver')
      .setDepth(3)
      .setScale(ImageScaling.gameOver);

    this.addGameNavigationButton({
        x: splashImage.getTopLeft().x + splashImage.displayWidth * ImageScaling.navigationButtons.alignmentFromSide,
        y: splashImage.getTopLeft().y + splashImage.displayHeight * ImageScaling.navigationButtons.alignmentFromTop
      },
      'restart',
      this.startBeginScene,
    );

    this.addGameNavigationButton({
        x: splashImage.getTopRight().x - splashImage.displayWidth * ImageScaling.navigationButtons.alignmentFromSide,
        y: splashImage.getTopRight().y + splashImage.displayHeight * ImageScaling.navigationButtons.alignmentFromTop,
      },
      'main_menu_button',
      this.startStartScene
    );
  }

  get highScore() {
    if(!localStorage.getItem('highScore')) {
      localStorage.setItem('highScore', '0');
    }
    return parseInt(localStorage.getItem('highScore'))
  }

  addGameNavigationButton(position, texture, callback) {
    const piranhaButtonRestart = this.add.image(
      position.x,
      position.y, texture).setDepth(4).setScale(SCALE * 0.9);

    //Refactor
    piranhaButtonRestart.setInteractive().on('pointerdown', () => {
    });
    piranhaButtonRestart.on('pointerup', () => {
      callback(this, this.piranhaStates, this.addObstaclesFrequency);
    });
  }

  startBeginScene(game, piranhaStates, addObstaclesFrequency) {
    game.scene.start('BeginScene',
      { piranha: piranhaStates, addObstaclesFrequency: addObstaclesFrequency});
  }

  startStartScene(game) {
    game.scene.start('StartScene');
  }

  private getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

}
