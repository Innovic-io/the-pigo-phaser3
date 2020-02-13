import { GameConfigs, PiranhaConfig } from '../assets/game-config';
import { SCALE } from '../services/scaling.service';

export class MainCharacter extends Phaser.GameObjects.Sprite {
  private jumpKey: Phaser.Input.Keyboard.Key;
  private tapJumpKey = this.scene.input.activePointer;
  private isDead: boolean;
  // private isFlapping: boolean;
  changeDirection = true;
  inSpeed = false;
  velocity = {
    x: 300,
    y: -300
  };

  public getDead(): boolean {
    return this.isDead;
  }

  public setDead(dead): void {
    this.isDead = dead;
  }

  getInSpeed() {
    return this.inSpeed;
  }

  setInSpeed(inSpeed) {
    this.inSpeed = inSpeed;
  }

  constructor(params) {
    super(params.scene, params.x, params.y, params.key, params.frame);

    // sprite
    this.setScale(SCALE);
    this.setOrigin(0, 0);

    // variables
    this.isDead = false;
    // this.isFlapping = false;

    // physics
    this.scene.physics.world.enable(this);
    this.body.setGravityY(1000);
    this.body.setSize(this.body.width/1.2, this.body.height/1.2);

    // input
    this.jumpKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.scene.add.existing(this);
  }

  update(): void {
    if ((this.jumpKey.isDown || this.tapJumpKey.isDown)) {
      this.jump();
    }

    // check if off the screen
    if (this.y + this.height > this.scene.sys.canvas.height + GameConfigs.allowedSpaceBelowCanvas) {
      this.isDead = true;
    }
  }

  jump() {
    this.body.setVelocityX(this.velocity.x);
    this.body.setVelocityY(this.velocity.y);
  }

  changeCharacterDirection() {
    if (this.changeDirection) {
      this.velocity.x = - this.velocity.x;
      this.changeDirection = false;
      setTimeout(() => {
        this.changeDirection = true;
      }, 2000)
    }
  }
}
