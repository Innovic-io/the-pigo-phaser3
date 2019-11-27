export class StartScene extends Phaser.Scene {

    constructor(private background: Phaser.GameObjects.TileSprite) {
        super({
            key: "StartScene"
        });
    }

    preload(): void {
        /**
         * PRELOADER START
         */

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(560, 240, 320, 50);

        const loadingText = this.make.text({
            x: 740,
            y: 210,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: 720,
            y: 265,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        this.load.on('progress', value => {
            percentText.setText(parseInt(`${value * 100}`) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(570, 250, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

        /**
         * PRELOADER END
         */

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

        const startBtn = this.add.sprite(700, 380, 'startBtn');
        startBtn.setScale(0.5);
        startBtn.setInteractive();
        startBtn.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        const soundBtn = this.add.sprite(1300, 70, 'volumeOn');
        soundBtn.setInteractive();
        soundBtn.on('pointerdown', () => {
            if (this.sound.mute) {
                this.sound.mute = false;
                soundBtn.setTexture('volumeOn');
                return;
            }

            this.sound.mute = true;
            soundBtn.setTexture('volumeOff');
        });

        const logo = this.add.sprite(700, 170, 'pigoLogo');
        logo.setScale(0.9);

    }

}
