/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2019 Digitsensitive
 * @description  Flappy Piranha: Game Scene
 * @license      Digitsensitive
 */

import { Piranha } from "../objects/piranha";
import { BlueFish } from "../objects/blueFish";
import { Wood } from "../objects/wood"
import { YellowFish } from '../objects/YellowFish';

export class GameScene extends Phaser.Scene {
  private piranha: Piranha;
  private blueFishes: Phaser.GameObjects.Group;
  private woods: Phaser.GameObjects.Group;
  private yellowFish: Phaser.GameObjects.Group;
  private background: Phaser.GameObjects.TileSprite;
  private scoreText: Phaser.GameObjects.BitmapText;
  private timedEvent: any;

  constructor() {
    super({
      key: "GameScene"
    });
  }

  init(): void {
    this.registry.set("score", 0);
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

    this.blueFishes = this.add.group({ classType: BlueFish });
    this.woods = this.add.group({ classType: Wood });
    this.yellowFish = this.add.group({ classType: YellowFish });

    this.piranha = new Piranha({
      scene: this,
      x: 50,
      y: 200,
      key: "piranha"
    });

    // *****************************************************************
    // TIMER
    // *****************************************************************
    this.addNewBlueFish();
    this.setTimerForBlueFishes();

    this.addNewWood();
    this.setTimerForWoods();

    this.addNewRowsOfYellowFish();
    this.setTimerForYellowFish();

  }

  update(): void {
    if (!this.piranha.getDead()) {
      this.background.tilePositionX += 4;
      this.piranha.update();
      this.physics.overlap(
        this.piranha,
        this.blueFishes,
        function() {
          this.piranha.setDead(true);
        },
        null,
        this
      );
      this.physics.overlap(
          this.piranha,
          this.woods,
          function() {
            this.piranha.setDead(true);
          },
          null,
          this
      );
      this.physics.overlap(this.piranha, this.yellowFish,
          () => {
            this.registry.values.score += 1;

            Phaser.Actions.Call(
                this.yellowFish.getChildren(),
                function(fish) {
                  fish.destroy();
                },
                this
            );

            this.scoreText.setText(this.registry.values.score);
          }, null, this);
    } else {
      Phaser.Actions.Call(
        this.blueFishes.getChildren(),
        function(blueFish) {
          blueFish.body.setVelocityX(0);
        },
        this
      );

      Phaser.Actions.Call(
          this.woods.getChildren(),
          function(wood) {
            wood.body.setVelocityX(0);
          },
          this
      );

      if (this.piranha.y > this.sys.canvas.height) {
        this.scene.restart();
      }
    }
  }

  private addNewBlueFish(): void {
    // update the score

    // randomly pick a number between 1 and 5
    let i = this.getRandomInt(2, 9);

    // add 6 pipes with one big hole at position hole and hole + 1
    // for (let i = 0; i < 10; i++) {
    //   if (i !== hole && i !== hole + 1 && i !== hole + 2) {
    //     if (i === hole - 1) {
    //       this.addBlueFish(400, i * 60, 0);
    //     } else if (i === hole + 3) {
    //       this.addBlueFish(400, i * 60, 1);
    //     } else {
    //       this.addBlueFish(400, i * 60, 2);
    //     }
    //   }
    // }
    this.addBlueFish(1400, i * 48);
  }

  private addNewRowsOfYellowFish(): void {
    let i = this.getRandomInt(2, 9);
    this.   addYellowFish(1400, i * 48);
  }

  private addBlueFish(x: number, y: number): void {
    // create a new pipe at the position x and y and add it to group
    this.blueFishes.add(
      new BlueFish({
        scene: this,
        x: x,
        y: y,
        key: "blue-fish"
      })
    );
  }

  private addYellowFish(x: number, y: number): void {
    this.yellowFish.add(
        new YellowFish({
          scene: this,
          x: x,
          y: y,
          key: "yellowFish"
        })
    );
  }

  private setTimerForBlueFishes() {
      this.timedEvent =  this.time.addEvent({
      delay: 1000,
      callback: this.addNewBlueFish,
      callbackScope: this,
      loop: true
    });
  }

  private setTimerForYellowFish() {
    this.timedEvent =  this.time.addEvent({
      delay: 5000,
      callback: this.addNewRowsOfYellowFish,
      callbackScope: this,
      loop: true
    });
  }

  private addNewWood(): void {
    // create a new pipe at the position x and y and add it to group
    this.woods.add(
        new Wood({
          scene: this,
          x: 1400,
          y: 38,
          key: "wood"
        })
    );
  }
  private setTimerForWoods() {
    this.timedEvent =  this.time.addEvent({
      delay: 4500,
      callback: this.addNewWood,
      callbackScope: this,
      loop: true
    });
  }

  private getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

}
