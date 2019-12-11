import { SCREEN_HEIGHT, SCREEN_WIDTH, SCALE, CENTER_POINT } from '../services/scaling.service';

export class BeginScene extends Phaser.Scene {
  piranha;
  piranhaConfigs;
  piranhaChangeImage = true;

  constructor(private background: Phaser.GameObjects.TileSprite) {
    super({
      key: "BeginScene"
    });
  }

  init(data) {
    this.piranhaConfigs = data;
  }

    preload(): void {
    }

    create(): void {
        this.background = this.add
            .tileSprite(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, "background")
            .setOrigin(0, 0);

        const startGameLogo = this.add.sprite(CENTER_POINT.x, CENTER_POINT.y, 'startGame');
        startGameLogo.setScale(SCALE - (SCALE * .2));

        this.piranha = this.add.sprite(CENTER_POINT.x * .15, CENTER_POINT.y, 'piranha');
        this.piranha.setScale(SCALE );
        this.changePiranhaImage();

        this.input.keyboard.on('keydown', event => {
            this.scene.start('GameScene', { piranhaStates: this.piranhaConfigs});
        });

      this.input.on('pointerdown', event => {
        this.scene.start('GameScene', {piranhaStates: this.piranhaConfigs});
      });
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
        this.piranhaChangeImage ?
            this.piranha.setTexture(this.piranhaConfigs.piranha.blinkingPiranha) : this.piranha.setTexture(this.piranhaConfigs.piranha.piranha);
        this.piranhaChangeImage = !this.piranhaChangeImage;
    }

}
