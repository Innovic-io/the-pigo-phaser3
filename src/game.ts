import 'phaser';
import { GameScene } from './scenes/game-scene';
import { StartScene } from './scenes/start-scene';

const config: GameConfig = {
  width: 1390,
  height: 480,
  parent: 'game',
  scene: [StartScene, GameScene],
  input: {
    keyboard: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 }
    }
  },
  render: { pixelArt: true }
};

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}

window.addEventListener('load', () => {
  let game = new Game(config);
});
