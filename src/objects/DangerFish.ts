import { SCALE } from "../services/scaling.service";

export class DangerFish extends Phaser.GameObjects.Image {
  constructor(params, velocity) {
    super(params.scene, params.x, params.y, params.key, params.frame);

    // image
    this.setScale(SCALE - ( SCALE * .15));
    this.setOrigin(0, 0);

    // physics
    this.scene.physics.world.enable(this);
    this.body.allowGravity = false;
    this.body.setVelocityX(-velocity);
    this.body.setSize(121, 95);

    this.scene.add.existing(this);
  }
}
