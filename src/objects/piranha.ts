import { GameConfigs, PiranhaConfig } from '../assets/game-config';
import { SCALE } from '../services/scaling.service';

export class Piranha extends Phaser.GameObjects.Sprite {
  private jumpKey: Phaser.Input.Keyboard.Key;
  private isDead: boolean;
  private isFlapping: boolean;
  inSpeed = false;

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
    this.isFlapping = false;

    // physics
    this.scene.physics.world.enable(this);
    this.body.setGravityY(1000);
    this.body.setSize(this.body.width/3, this.body.height/3);


    // input
    this.jumpKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.scene.add.existing(this);
  }

  update(): void {
    if (this.jumpKey.isDown && !this.isFlapping) {
      this.isFlapping = true;
      this.jump();
    } else if (this.jumpKey.isUp && this.isFlapping) {
      this.isFlapping = false;
    }

    // check if off the screen
    if (this.y + this.height > this.scene.sys.canvas.height + GameConfigs.allowedSpaceBelowCanvas) {
      this.isDead = true;
    }
  }

  jump() {
    this.body.setVelocityY(-PiranhaConfig.velocity);
  }
}
