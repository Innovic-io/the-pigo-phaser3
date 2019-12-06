import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  START_BTN_POSITION,
  START_LOGO_POSITION,
  SCALE, PROGRESS_BAR, PROGRESS_BAR_INNER, LOADING_TXT, PERCENT_TXT
} from '../services/scaling.service';
import { FilePaths } from "../assets/game-config";

export class StartScene extends Phaser.Scene {
  isPlaying: boolean = false;
  piranhaStates = {};
  addObstaclesFrequency = 0;

  constructor(private background: Phaser.GameObjects.Sprite) {
    super({
      key: 'StartScene'
    });
  }

  async preload() {
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(PROGRESS_BAR.x, PROGRESS_BAR.y, PROGRESS_BAR.width, PROGRESS_BAR.height);

    const loadingText = this.make.text({
      x: LOADING_TXT.x,
      y: LOADING_TXT.y,
      text: 'Loading...',
      style: {
        font: `${LOADING_TXT.size}px monospace`,
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.make.text({
      x: PERCENT_TXT.x,
      y: PERCENT_TXT.y,
      text: '0%',
      style: {
        font: `${PERCENT_TXT.size}px monospace`,
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    this.load.on('progress', value => {
      percentText.setText(parseInt(`${value * 100}`) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(PROGRESS_BAR_INNER.x, PROGRESS_BAR_INNER.y, (PROGRESS_BAR.width - 20) * value, PROGRESS_BAR.height - 20);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });

    this.load.pack(
      'pigoPack',
      './src/assets/pack.json',
      'pigoPack'
    );
    this.piranhaStates = await this.readJSON(FilePaths.piranhaPack);
    this.loadExistingPiranhaImageStates();
    this.setObstaclesFreqency();
  }

  create(): void {
    this.background = this.add
      .sprite(0, 0, 'background')
      .setDisplaySize(SCREEN_WIDTH, SCREEN_HEIGHT)
      .setOrigin(0, 0);

    const startBtn = this.add.sprite(START_BTN_POSITION.x, START_BTN_POSITION.y, 'startBtn');
    startBtn.setScale(SCALE - (SCALE * .4));
    startBtn.setInteractive();
    startBtn.on('pointerdown', () => {
      this.scene.start('BeginScene', {piranha: this.getPiranhaState(), addObstaclesFreqency: this.addObstaclesFrequency});
    });

    const soundBtn = this.add.sprite(SCREEN_WIDTH * .95,SCREEN_HEIGHT * .11, 'volumeOn');
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
    soundBtn.setScale(SCALE);

    const logo = this.add.sprite(START_LOGO_POSITION.x, START_LOGO_POSITION.y, 'pigoLogo');
    logo.setScale(SCALE);

  }

  getPiranhaState() {
    const piranhaStates = {};
    Object.keys(this.piranhaStates).forEach(state=> {
      piranhaStates[state] = this.piranhaStates[state]['stateKey']
    });
    return piranhaStates;
  }

  async loadExistingPiranhaImageStates() {
    const PiranhaStates = await this.readJSON(FilePaths.piranhaPack);
    Object.keys(PiranhaStates).forEach(state => {
      this.verifyImageURL(PiranhaStates[state], state);
    });
  }

  setObstaclesFreqency() {
    if(SCREEN_WIDTH / SCREEN_HEIGHT < 0.9) {
      this.addObstaclesFrequency = -1000;
    }
  }

  verifyImageURL(state, stateName) {
    if (state.url.length) {
      this.load.image(state.stateKey, state.url);
    } else {
      this.piranhaStates[stateName]['stateKey'] = this.piranhaStates[stateName]['defaultKey'];
    }
  }

  async readJSON(file) {
    const response = await fetch(file);
    return await response.json();
  }

}
