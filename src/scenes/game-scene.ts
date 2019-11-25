/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2019 Digitsensitive
 * @description  Flappy Bird: Game Scene
 * @license      Digitsensitive
 */

import { Bird } from "../objects/bird";
import { Pipe } from "../objects/pipe";

export class GameScene extends Phaser.Scene {
  private bird: Bird;
  private pipes: Phaser.GameObjects.Group;
  private background: Phaser.GameObjects.TileSprite;
  private scoreText: Phaser.GameObjects.BitmapText;
  private timedEvent: any;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  init(): void {
    this.registry.set("score", -1);
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

    this.scoreText = this.add
      .bitmapText(
        this.sys.canvas.width / 2 - 14,
        30,
        "font",
        this.registry.values.score
      )
      .setDepth(2);

    this.pipes = this.add.group({ classType: Pipe });

    this.bird = new Bird({
      scene: this,
      x: 50,
      y: 200,
      key: "bird"
    });

    // *****************************************************************
    // TIMER
    // *****************************************************************
    this.addNewRowOfPipes();
    this.setTimerForPipes();


  }

  update(): void {
    if (!this.bird.getDead()) {
      this.background.tilePositionX += 4;
      this.bird.update();
      this.physics.overlap(
        this.bird,
        this.pipes,
        function() {
          this.bird.setDead(true);
        },
        null,
        this
      );
    } else {
      Phaser.Actions.Call(
        this.pipes.getChildren(),
        function(pipe) {
          pipe.body.setVelocityX(0);
        },
        this
      );

      if (this.bird.y > this.sys.canvas.height) {
        this.scene.restart();
      }
    }
  }

  private addNewRowOfPipes(): void {
    // update the score

    this.registry.values.score += 1;
    this.scoreText.setText(this.registry.values.score);

    // randomly pick a number between 1 and 5
    let i = this.getRandomInt(2, 9);

    // add 6 pipes with one big hole at position hole and hole + 1
    // for (let i = 0; i < 10; i++) {
    //   if (i !== hole && i !== hole + 1 && i !== hole + 2) {
    //     if (i === hole - 1) {
    //       this.addPipe(400, i * 60, 0);
    //     } else if (i === hole + 3) {
    //       this.addPipe(400, i * 60, 1);
    //     } else {
    //       this.addPipe(400, i * 60, 2);
    //     }
    //   }
    // }
    this.addPipe(400, i * 60);
    this.resetTimer();
  }

  private addPipe(x: number, y: number): void {
    // create a new pipe at the position x and y and add it to group
    this.pipes.add(
      new Pipe({
        scene: this,
        x: 1400,
        y: y,
        key: "pipe"
      })
    );
  }

  private getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  private setTimerForPipes() {
      this.timedEvent =  this.time.addEvent({
      delay: 2500,
      callback: this.addNewRowOfPipes,
      callbackScope: this,
      loop: true
    });
  }

  private resetTimer(): void {
    // this.timedEvent.reset({
    //   delay: Phaser.Math.Between(1500,5000),
    //   callback: this.addNewRowOfPipes,
    //   callbackScope: this,
    //   loop: true
    // });
  }
}
