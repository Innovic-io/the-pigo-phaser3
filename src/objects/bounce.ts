import { SCALE } from "../services/scaling.service";
import { GameConfigs } from '../assets/game-config';

export class Bounce extends Phaser.GameObjects.Image {
  velocity: number;
  constructor(params, velocity) {
    super(params.scene, params.x, params.y, params.key, params.frame);

    this.velocity = velocity;

    // image
    this.setScale(SCALE * 0.5);
    this.setOrigin(0, 0);

    // physics
    this.scene.physics.world.enable(this);
    this.body.allowGravity = false;
    // this.body.setVelocityX(-velocity);
    this.body.setVelocityY(this.velocity);

    this.body.setSize(this.body.width, this.body.height);

    this.scene.add.existing(this);
  }

  update() {
    if (this.y < 0 || this.y > this.scene.sys.canvas.height - this.body.height) {
      this.body.setVelocityY(-this.body.velocity.y)
    }
  }

  doTheBounce() {
    this.setScale(.45, .45);
    setTimeout(() => {
      this.setScale(SCALE*0.5);
    }, 10)
  }
}
