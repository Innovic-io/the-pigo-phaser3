export class BeginScene extends Phaser.Scene {
    piranha;
    piranhaChangeImage = true;


    constructor(private background: Phaser.GameObjects.TileSprite) {
        super({
            key: "BeginScene"
        });
    }

    preload(): void {
        this.load.pack(
            "flappyBirdPack",
            "./src/assets/pack.json",
            "flappyBirdPack"
        );
    }

    create(): void {
        this.background = this.add
            .tileSprite(0, 0, 1390, 1600, "background")
            .setOrigin(0, 0);

        const startGameLogo = this.add.sprite(700, 230, 'startGame');
        startGameLogo.setScale(0.7);

        this.piranha = this.add.sprite(90, 230, 'piranha');
        this.piranha.setScale(1);
        this.changePiranhaImage();

        this.input.keyboard.on('keydown', event => {
            this.scene.start('GameScene');
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
            this.piranha.setTexture('closed-eyes-piranha') : this.piranha.setTexture('piranha');
        this.piranhaChangeImage = !this.piranhaChangeImage;
    }

}
