import { Piranha } from "../objects/piranha";
import { BlueFish } from "../objects/blueFish";
import { Wood } from "../objects/wood"
import { YellowFish } from '../objects/YellowFish';
import { DangerFish } from "../objects/DangerFish";
import { WormSpeedUp } from "../objects/WormSpeedUp";
import { WormSlowDown } from "../objects/WormSlowDown";

export class GameScene extends Phaser.Scene {
  private piranha: Piranha;
  private blueFishes: Phaser.GameObjects.Group;
  private dangerFishes: Phaser.GameObjects.Group;
  private speedUpWorms: Phaser.GameObjects.Group;
  private slowDownWorms: Phaser.GameObjects.Group;
  private woods: Phaser.GameObjects.Group;
  private yellowFish: Phaser.GameObjects.Group;
  private background: Phaser.GameObjects.TileSprite;
  private scoreText: Phaser.GameObjects.BitmapText;
  private timedEvent: any;
  private piranhaChangeImage = false;
  private backgroundMovementSpeed = 4;
  private obstacleVelocities = {
      blueFish: 500,
      yellowFish: 400,
      dangerFish: 1000,
      wood: 800,
      worms: 240
  };
  private speedUpBy = 300;

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
    this.dangerFishes = this.add.group({ classType: BlueFish });
    this.speedUpWorms = this.add.group({ classType: WormSpeedUp });
    this.slowDownWorms = this.add.group({ classType: WormSlowDown });
    this.woods = this.add.group({ classType: Wood });
    this.yellowFish = this.add.group({ classType: YellowFish });

    this.piranha = new Piranha({
      scene: this,
      x: 50,
      y: 200,
      key: "piranha"
    });

    this.addNewBlueFish();

      // *****************************************************************
    // TIMER
    // *****************************************************************
    this.setTimerForBlueFishes();
    this.setTimerForDangerFishes();
    this.setTimerForWoods();
    this.setTimerForYellowFish();
    this.setTimerForRewards();

    this.changePiranhaImage();

  }

  update(): void {
    if (!this.piranha.getDead()) {
      this.background.tilePositionX += this.backgroundMovementSpeed;
        if(this.piranha.y > 20) {
            this.piranha.update();
        }
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
      this.physics.overlap(
          this.piranha,
          this.dangerFishes,
          function() {
              this.piranha.setDead(true);
          },
          null,
          this
      );
      this.physics.overlap(this.piranha, this.yellowFish,
          () => {
            this.registry.values.score += 1;
            this.moveMouths();

            Phaser.Actions.Call(
                this.yellowFish.getChildren(),
                function(fish) {
                  fish.destroy();
                },
                this
            );

            this.scoreText.setText(this.registry.values.score);
          }, null, this);
        this.physics.overlap(this.piranha, this.speedUpWorms,
            () => {
                this.speedUp();
                Phaser.Actions.Call(
                    this.speedUpWorms.getChildren(),
                    function(worm) {
                        worm.destroy();
                    },
                    this
                );
            }, null, this);
    } else {
        this.piranha.setTexture('dead-piranha');

        if(this.speedUpWorms.children.entries.length) {
            Phaser.Actions.Call(
                this.speedUpWorms.getChildren(),
                function(worm) {
                    worm.body.setVelocity(0);
                },
                this
            );
        }
        if(this.slowDownWorms.children.entries.length) {
            Phaser.Actions.Call(
                this.slowDownWorms.getChildren(),
                function(worm) {
                    worm.body.setVelocity(0);
                },
                this
            );
        }
        // Phaser.Actions.Call(
      //   this.blueFishes.getChildren(),
      //   function(blueFish) {
      //     // blueFish.body.setVelocityX(0);
      //   },
      //   this
      // );
      //
      // Phaser.Actions.Call(
      //     this.woods.getChildren(),
      //     function(wood) {
      //       // wood.body.setVelocityX(0);
      //     },
      //     this
      // );

      if (this.piranha.y > this.sys.canvas.height) {
        this.scene.restart();
      }
    }
  }

  private changePiranhaImage() {
      this.timedEvent =  this.time.addEvent({
          delay: 500,
          callback: this.togglePiranhaImage,
          callbackScope: this,
          loop: true
      });
  }

  private togglePiranhaImage() {
        if (this.piranhaChangeImage) {
            this.piranha.setTexture('closed-eyes-piranha');
        }
        else {
            this.piranha.setTexture('piranha');
        }
        this.piranhaChangeImage = !this.piranhaChangeImage;
    }

   private moveMouths() {
       this.piranha.setTexture('open-mouths-piranha');
       setTimeout(() => {
           this.piranha.setTexture('piranha');
       },100)
   }

    private speedUp() {
        this.backgroundMovementSpeed = 7;
        this.increaseSpeedOfObstacle(this.blueFishes, 'blueFish');
        this.increaseSpeedOfObstacle(this.yellowFish, 'yellowFish');
        this.increaseSpeedOfObstacle(this.woods, 'wood');
        this.increaseSpeedOfObstacle(this.dangerFishes, 'dangerFish');
        this.increaseSpeedOfObstacle(this.speedUpWorms, 'worms');
        this.increaseSpeedOfObstacle(this.slowDownWorms, 'worms');

        setTimeout(() => {
            this.resetObstacleVelocities();
            this.backgroundMovementSpeed = 4;
        }, 10000)
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

    private addNewDangerFish(): void {
        let i = this.getRandomInt(2, 9);

        this.addDangerFish(1400, i * 48);
    }

  private addNewRowsOfYellowFish(): void {
    let i = this.getRandomInt(2, 9);
    this.   addYellowFish(1400, i * 48);
  }

  private addBlueFish(x: number, y: number): void {
    this.blueFishes.add(
      new BlueFish({
        scene: this,
        x: x,
        y: y,
        key: "blue-fish"
      },
          this.obstacleVelocities.blueFish)
    );
  }

  private addDangerFish(x: number, y: number): void {
      this.dangerFishes.add(
          new DangerFish({
              scene: this,
              x: x,
              y: y,
              key: "danger-fish"
          },
              this.obstacleVelocities.dangerFish)
      );
  }

    private addReward(): void {
        const position = {
            x: this.getRandomInt(1400, 1800),
            y: this.getRandomInt(50, 320),
        };
        this.getRandomInt(0,2) ? this.addSpeedUpWorm(position) : this.addSlowDownWorm(position);
    }

    private addSpeedUpWorm(postition) {
        this.speedUpWorms.add(
            new WormSpeedUp({
                scene: this,
                x: postition.x,
                y: postition.y,
                key: "worm-speed-up"
            },
                this.obstacleVelocities.worms)
        );
    }

    private addSlowDownWorm(position): void {
        this.slowDownWorms.add(
            new WormSlowDown({
                scene: this,
                x: position.x,
                y: position.y,
                key: "worm-slow-down"
            },
                this.obstacleVelocities.worms)
        );
    }

  private setTimerForDangerFishes() {
      this.timedEvent = this.time.addEvent({
          delay: 10000,
          callback: this.addNewDangerFish,
          callbackScope: this,
          loop: true
      });
  }

  private addYellowFish(x: number, y: number): void {
    this.yellowFish.add(
        new YellowFish({
          scene: this,
          x: x,
          y: y,
          key: "yellowFish"
        },
            this.obstacleVelocities.yellowFish)
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
      delay: 4000,
      callback: this.addNewRowsOfYellowFish,
      callbackScope: this,
      loop: true
    });
  }

    setTimerForRewards() {
      this.timedEvent =  this.time.addEvent({
          delay: 10000,
          callback: this.addReward,
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
        },
        this.obstacleVelocities.dangerFish)
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

  private increaseSpeedOfObstacle(listOfObstacles, obstacle) {
      const speedUpVelocity = this.obstacleVelocities[obstacle] + this.speedUpBy;
      listOfObstacles.children.entries.forEach(obstacle => {
          obstacle.body.setVelocity(-speedUpVelocity, 0);
      });
      this.obstacleVelocities[obstacle] = speedUpVelocity
  }

  private resetObstacleVelocities() {
      this.obstacleVelocities = {
          blueFish: 500,
          yellowFish: 400,
          dangerFish: 1000,
          wood: 800,
          worms: 240
      };
  }

  private getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

}
