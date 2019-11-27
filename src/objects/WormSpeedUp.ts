export class WormSpeedUp extends Phaser.GameObjects.Image {
    constructor(params, velocity) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        // image
        this.setScale(1);
        this.setOrigin(0, 0);

        // physics
        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setVelocityX(-velocity);
        this.body.setSize(121, 95);

        this.scene.add.existing(this);
    }
}