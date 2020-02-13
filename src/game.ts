import 'phaser';
import { GameScene } from './scenes/game-scene';
import { StartScene } from './scenes/start-scene';
import { BeginScene } from './scenes/begin-scene'
import { InfoScene } from './scenes/info-scene'

import { SCREEN_HEIGHT, SCREEN_WIDTH } from './services/scaling.service';

const config = {
  type: Phaser.AUTO,
  dom: {
    createContainer: true
  },
  parent: 'game',
  scale: {
    mode: 'EXACT_FIT',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    zoom: 1/window.devicePixelRatio,
  },
  scene: [StartScene, GameScene, BeginScene, InfoScene],
  input: {
    keyboard: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 + SCREEN_WIDTH * .2 },
      debug: true
    }
  },
  render: { pixelArt: true }
};

export class Game extends Phaser.Game {
  constructor(config) {
    super(config);
  }
}

window.addEventListener('load', () => {
  let game = new Game(config);
});
