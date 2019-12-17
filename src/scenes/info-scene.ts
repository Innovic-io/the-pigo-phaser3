import { SCREEN_HEIGHT, SCREEN_WIDTH, SCALE, CENTER_POINT, START_BTN_POSITION } from '../services/scaling.service';
import { ImageScaling, Info, TextConfig } from "../assets/game-config";

export class InfoScene extends Phaser.Scene {
  counter = 0;
  infoText;
  infoImages;
  nextButton;
  backButton;
  info = Info;

  constructor(private background: Phaser.GameObjects.TileSprite) {
    super({
      key: "InfoScene"
    });
  }

  init() {
  }

  preload(): void {
  }

  create(): void {
    this.infoImages = this.add.group();
    this.background = this.add
      .tileSprite(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, "background")
      .setOrigin(0, 0);
    const backgroundImage = this.add.image(CENTER_POINT.x, CENTER_POINT.y, 'backgroundInfo')
      .setScale(SCALE * 1.3);
    this.add.image(CENTER_POINT.x, SCREEN_HEIGHT * 0.9, 'instructions')
      .setScale(SCALE);

    this.addCloseInfoButton();
    this.addNavigationButtons();

    this.infoText = this.add.text(CENTER_POINT.x, CENTER_POINT.y, '')
      .setStyle(TextConfig.infoText)
      .setAlign('center');

    this.addInfo();
  }

  addInfo() {
    this.changeNavigationButtonsVisibility();

    this.infoText.text = this.info[this.counter].text;
    this.infoText.setPosition(CENTER_POINT.x - this.infoText.width / 2, CENTER_POINT.y - this.infoText.height /2);

    this.info[this.counter].images.forEach(image => {
      if (image.texture !== '') {
        this.infoImages.add(
          this.add.image(image.position.x, image.position.y, image.texture)
            .setScale(SCALE)
        );
      }
    });
  }

  addNavigationButtons() {
    this.nextButton = this.add.image(
      ImageScaling.infoNavigationButtons.next.x,
      ImageScaling.infoNavigationButtons.next.y
      , 'nextInfo')
      .setScale(SCALE * 0.8);
    this.backButton = this.add.image(
      ImageScaling.infoNavigationButtons.back.x,
      ImageScaling.infoNavigationButtons.back.y, 'backInfo')
      .setScale(SCALE * 0.8);

    this.nextButton.setInteractive();
    this.nextButton.on('pointerdown', () => {
      this.infoImages.clear(true, true);
      this.counter++;
      this.addInfo();
    });

    this.backButton.setInteractive();
    this.backButton.on('pointerdown', () => {
      this.infoImages.clear(true, true);
      this.counter--;
      this.addInfo();
    });
  }

  changeNavigationButtonsVisibility() {
    this.counter >= this.info.length -1 ? this.nextButton.setVisible(false) : this.nextButton.setVisible(true);
    this.counter <= 0 ? this.backButton.setVisible(false) : this.backButton.setVisible(true);
  }

  addCloseInfoButton() {
    const closeButton = this.add.image(
      ImageScaling.infoNavigationButtons.close.x,
      ImageScaling.infoNavigationButtons.close.y,
      'close')
      .setScale(SCALE);
    closeButton.setInteractive();
    closeButton.on('pointerdown', () => {
      this.scene.start('StartScene');
    });
  }

}
