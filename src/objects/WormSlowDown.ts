import { SCALE } from '../services/scaling.service';

export class WormSlowDown extends Phaser.GameObjects.Image {
  constructor(params, velocity) {
    super(params.scene, params.x, params.y, params.key, params.frame);

    // image
    this.setScale(SCALE);
    this.setOrigin(0, 0);

    // physics
    this.scene.physics.world.enable(this);
    this.body.allowGravity = false;
    this.body.setVelocityX(-velocity);
    this.body.setSize(this.body.width * 1.1, this.body.height * .7);

    this.scene.add.existing(this);
  }
}
