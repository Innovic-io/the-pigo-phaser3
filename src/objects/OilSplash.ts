import { OilSplashConfigs } from '../assets/game-config';

export class OilSplash extends Phaser.GameObjects.Image {
  constructor(params, velocity) {
    super(params.scene, params.x, params.y, params.key, params.frame);

    this.setScale(1);
    this.setOrigin(0, 0);

    this.scene.physics.world.enable(this);
    this.body.allowGravity = false;
    this.body.setVelocityX(-velocity);
    this.body.setSize(282, 87);

    this.scene.add.existing(this);

    this.changeImage();
  }

  public changeImage() {
    this.setTexture('oil-stein1');
    setTimeout(() => {
      this.setTexture('oil-stein2');
      setTimeout(() => {
        // debugger;
        this.setTexture('oil-stein3');
        setTimeout(() => {
          this.changeImage();
        }, OilSplashConfigs.imageChangeInterval);
      }, OilSplashConfigs.imageChangeInterval);
    }, OilSplashConfigs.imageChangeInterval);
  }
}
