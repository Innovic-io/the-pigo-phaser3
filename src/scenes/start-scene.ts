import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  START_BTN_POSITION,
  START_LOGO_POSITION,
  SCALE
} from '../services/scaling.service';

export class StartScene extends Phaser.Scene {
  isPlaying: boolean = false;

  constructor(private background: Phaser.GameObjects.TileSprite) {
    super({
      key: 'StartScene'
    });
  }

  preload(): void {
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

    this.load.pack(
      'flappyBirdPack',
      './src/assets/pack.json',
      'flappyBirdPack'
    );
  }

  create(): void {
    this.background = this.add
      .tileSprite(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 'background')
      .setDisplaySize(SCREEN_WIDTH, SCREEN_HEIGHT)
      .setOrigin(0, 0);

    const startBtn = this.add.sprite(START_BTN_POSITION.x, START_BTN_POSITION.y, 'startBtn');
    startBtn.setScale(0.5);
    startBtn.setInteractive();
    startBtn.on('pointerdown', () => {
      this.scene.start('BeginScene');
    });

    const soundBtn = this.add.sprite(SCREEN_WIDTH - 100,70, 'volumeOn');
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

    const logo = this.add.sprite(START_LOGO_POSITION.x, START_LOGO_POSITION.y, 'pigoLogo');
    logo.setScale(0.9);

  }

}
