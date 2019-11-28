import { PiranhaConfig } from '../assets/game-config';

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
    this.setScale(1);
    this.setOrigin(0, 0);

    // variables
    this.isDead = false;
    this.isFlapping = false;

    // physics
    this.scene.physics.world.enable(this);
    this.body.setGravityY(1000);
    this.body.setSize(46, 36);

    // input
    this.jumpKey = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.scene.add.existing(this);
  }

  update(): void {
    // handle angle change
    // if (this.angle < 30) {
    //   this.angle += 2;
    // }

    // handle input
    if (this.jumpKey.isDown && !this.isFlapping) {
      // flap
      this.isFlapping = true;
      this.body.setVelocityY(-PiranhaConfig.velocity);
      this.scene.tweens.add({
        targets: this,
        // props: { angle: -20 },
        duration: 150,
        ease: 'Power0'
      });
    } else if (this.jumpKey.isUp && this.isFlapping) {
      this.isFlapping = false;
    }

    // check if off the screen
    if (this.y + this.height > this.scene.sys.canvas.height + 80) {
      this.isDead = true;
    }
  }
}
