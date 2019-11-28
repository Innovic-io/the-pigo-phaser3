import { Piranha } from "../objects/piranha";
import { BlueFish } from "../objects/blueFish";
import { Wood } from "../objects/wood"
import { YellowFish } from '../objects/YellowFish';
import { DangerFish } from "../objects/DangerFish";
import { WormSpeedUp } from "../objects/WormSpeedUp";
import { WormSlowDown } from "../objects/WormSlowDown";
import { OilSplash } from "../objects/OilSplash";

export class GameScene extends Phaser.Scene {
    private piranha: Piranha;
    private blueFishes: Phaser.GameObjects.Group;
    private dangerFishes: Phaser.GameObjects.Group;
    private speedUpWorms: Phaser.GameObjects.Group;
    private slowDownWorms: Phaser.GameObjects.Group;
    private woods: Phaser.GameObjects.Group;
    oilSplashes: Phaser.GameObjects.Group;
    private yellowFishes: Phaser.GameObjects.Group;
    private background: Phaser.GameObjects.TileSprite;
    private scoreText: Phaser.GameObjects.BitmapText;
    private timedEvent: any;
    private backgroundMovementSpeed;
    private piranhaChangeImage = false;
    private backgroundInitialSpeed = 4;
    private backgroundSpeedIncreaseBy = 3;
    private obstacleVelocities;
    obstacleStartingVelocities = {
        blueFish: 500,
        yellowFish: 400,
        dangerFish: 1000,
        wood: 800,
        worms: 240,
        oilSplash: 240
    };
    gameObjectsTimers = {
        blueFish: 1500,
        yellowFish: 3500,
        dangerFish: 10000,
        wood: 4500,
        worms: 10000,
        oilSplash: 8000
    };
    gameTimeouts = [];
    private speedUpBy = 200;
    private isPlaying: boolean = false;
    private piranhaInMode = false;
    private rewardTime = 10000;

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
        if (!this.isPlaying) {
            this.isPlaying = true;
            const music = this.sound.add('pigoLoop', {loop: true});
            music.play();
        }
    }

    create(): void {
        this.background = this.add
            .tileSprite(0, 0, 1390, 1600, "background")
            .setOrigin(0, 0);
        this.backgroundMovementSpeed = this.backgroundInitialSpeed;
        this.obstacleVelocities = {...this.obstacleStartingVelocities};

        this.scoreText = this.add
            .bitmapText(
                this.sys.canvas.width / 2 - 14,
                30,
                "font",
                this.registry.values.score
            )
            .setDepth(2);

        this.blueFishes = this.add.group({classType: BlueFish});
        this.dangerFishes = this.add.group({classType: BlueFish});
        this.speedUpWorms = this.add.group({classType: WormSpeedUp});
        this.slowDownWorms = this.add.group({classType: WormSlowDown});
        this.woods = this.add.group({classType: Wood});
        this.oilSplashes = this.add.group({classType: OilSplash});
        this.yellowFishes = this.add.group({classType: YellowFish});

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
        this.setTimerForOilSplashes();

        this.changePiranhaImage();

    }

    update(): void {
        if (!this.piranha.getDead()) {
            this.background.tilePositionX += this.backgroundMovementSpeed;
            if (this.piranha.y > 20) {
                this.piranha.update();
            }
            this.detectCollisions();
        } else {
            this.piranha.setTexture('dead-piranha');
            this.clearTimeoutsValues();

            if (this.speedUpWorms.children.entries.length) {
                Phaser.Actions.Call(
                    this.speedUpWorms.getChildren(),
                    function (worm) {
                        worm.body.setVelocity(0);
                    },
                    this
                );
            }
            if (this.slowDownWorms.children.entries.length) {
                Phaser.Actions.Call(
                    this.slowDownWorms.getChildren(),
                    function (worm) {
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
                this.setGameOptionsToDefault();
                this.scene.restart();
            }
        }
    }

    changePiranhaImage() {
        this.timedEvent = this.time.addEvent({
            delay: 500,
            callback: this.togglePiranhaImage,
            callbackScope: this,
            loop: true
        });
    }

    togglePiranhaImage() {
        if (this.piranhaInMode) {
            return
        }
        this.piranhaChangeImage ?
            this.piranha.setTexture('closed-eyes-piranha') : this.piranha.setTexture('piranha');
        this.piranhaChangeImage = !this.piranhaChangeImage;
    }

    moveMouths() {
        if (this.piranhaInMode) {
            return;
        }
        this.piranha.setTexture('open-mouths-piranha');
        setTimeout(() => {
            this.piranha.setTexture('piranha');
        }, 100);
    }
    slowDown() {
        this.piranhaInMode = true;
        this.updateBackground('background-slow-down', false);
        this.updatePiranha('slow-down-piranha');
        this.increaseObstaclesSpeeds(false);
        Phaser.Actions.Call(
            this.slowDownWorms.getChildren(),
            function (worm) {
                worm.destroy();
            },
            this
        );
        this.gameTimeouts.push(
            setTimeout(() => {
                this.setGameOptionsToDefault();
            }, this.rewardTime)
        );
    }

    speedUp() {
        this.piranha.setInSpeed(true);
        this.piranhaInMode = true;
        this.updateBackground('background-speed-up', true);
        this.updatePiranha('speed-up-piranha');
        this.increaseObstaclesSpeeds(true);
        Phaser.Actions.Call(
            this.speedUpWorms.getChildren(),
            function (worm) {
                worm.destroy();
            },
            this
        );
        this.gameTimeouts.push(
            setTimeout(() => {
                this.registry.values.score += 10;
                this.scoreText.setText(this.registry.values.score);
                this.setGameOptionsToDefault();
            }, this.rewardTime)
        )
    }

    increaseObstaclesSpeeds(increase) {
        this.changeSpeedOfObstacle(this.blueFishes, 'blueFish', increase);
        this.changeSpeedOfObstacle(this.yellowFishes, 'yellowFish', increase);
        this.changeSpeedOfObstacle(this.woods, 'wood', increase);
        this.changeSpeedOfObstacle(this.oilSplashes, 'oilSplash', increase);
        this.changeSpeedOfObstacle(this.dangerFishes, 'dangerFish', increase);
        this.changeSpeedOfObstacle(this.speedUpWorms, 'worms', increase);
        this.changeSpeedOfObstacle(this.slowDownWorms, 'worms', increase);
    }

    updateBackground(backgroundKey, speedUp) {
        this.background.setTexture(backgroundKey);
        speedUp ? this.backgroundMovementSpeed += this.backgroundSpeedIncreaseBy
            : this.backgroundMovementSpeed -= this.backgroundSpeedIncreaseBy;
        console.log(this.backgroundMovementSpeed);
    }

    updatePiranha(piranha) {
        this.piranha.setTexture(piranha);
    }

    setGameOptionsToDefault() {
        this.piranha.setInSpeed(false);
        this.resetObstacleVelocities();
        this.piranhaInMode = false;
        this.backgroundMovementSpeed = this.backgroundInitialSpeed;
        this.background.setTexture('background');
        this.updatePiranha('piranha');
    }

    addNewBlueFish(): void {
        let i = this.getRandomInt(2, 9);
        this.addBlueFish(1400, i * 48);
    }

    addNewDangerFish(): void {
        let i = this.getRandomInt(2, 9);
        this.addDangerFish(1400, i * 48);
    }

    addNewYellowFish(): void {
        let i = this.getRandomInt(2, 9);
        this.addYellowFish(1400, i * 48);
    }

    addNewOilSplash(): void {
        let i = this.getRandomInt(2, 7);
        this.addOilSplash(1400, i * 48);
    }

    addBlueFish(x: number, y: number): void {
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

    addDangerFish(x: number, y: number): void {
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

    addReward(): void {
        if(this.piranhaInMode) {
            return;
        }
        const position = {
            x: this.getRandomInt(1400, 1800),
            y: this.getRandomInt(50, 320),
        };
        this.getRandomInt(0, 2) ? this.addSpeedUpWorm(position) : this.addSlowDownWorm(position);
    }

    addSpeedUpWorm(postition) {
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

    addSlowDownWorm(position): void {
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

    setTimerForDangerFishes() {
        this.timedEvent = this.time.addEvent({
            delay: this.gameObjectsTimers.dangerFish,
            callback: this.addNewDangerFish,
            callbackScope: this,
            loop: true
        });
    }

    addYellowFish(x: number, y: number): void {
        this.yellowFishes.add(
            new YellowFish({
                    scene: this,
                    x: x,
                    y: y,
                    key: "yellowFish"
                },
                this.obstacleVelocities.yellowFish)
        );
    }

    setTimerForBlueFishes() {
        this.timedEvent = this.time.addEvent({
            delay: this.gameObjectsTimers.blueFish,
            callback: this.addNewBlueFish,
            callbackScope: this,
            loop: true
        });
    }

    setTimerForYellowFish() {
        this.timedEvent = this.time.addEvent({
            delay: this.gameObjectsTimers.yellowFish,
            callback: this.addNewYellowFish,
            callbackScope: this,
            loop: true
        });
    }

    setTimerForRewards() {
        this.timedEvent = this.time.addEvent({
            delay: this.gameObjectsTimers.worms,
            callback: this.addReward,
            callbackScope: this,
            loop: true
        });
    }

    addNewWood() {
        this.woods.add(
            new Wood({
                    scene: this,
                    x: 1400,
                    y: 38,
                    key: "wood"
                },
                this.obstacleVelocities.wood)
        );
    }

    addOilSplash(x, y) {
        this.oilSplashes.add(
            new OilSplash({
                    scene: this,
                    x: x,
                    y: y,
                    key: "oil-stein1"
                },
                this.obstacleVelocities.oilSplash)
        );
    }

    setTimerForWoods() {
        this.timedEvent = this.time.addEvent({
            delay: this.gameObjectsTimers.wood,
            callback: this.addNewWood,
            callbackScope: this,
            loop: true
        });
    }

    setTimerForOilSplashes() {
        this.time.addEvent({
            delay: this.gameObjectsTimers.oilSplash,
            callback: this.addNewOilSplash,
            callbackScope: this,
            loop: true
        });
    }

    changeSpeedOfObstacle(listOfObstacles, obstacle, increase) {
        const speedUpVelocity = increase ?
            this.obstacleVelocities[obstacle] + this.speedUpBy
            : this.obstacleVelocities[obstacle] - this.speedUpBy;
        listOfObstacles.children.entries.forEach(obstacle => {
            obstacle.body.setVelocity(-speedUpVelocity, 0);
        });
        this.obstacleVelocities[obstacle] = speedUpVelocity;
    }

    detectCollisions() {
        this.physics.overlap(
            this.piranha,
            this.blueFishes,
            (piranha, blueFish) => {
                this.eatBigFish(blueFish);
            },
            null,
            this
        );

        this.physics.overlap(
            this.piranha,
            this.woods,
            function () {
                this.piranha.setDead(true);
            },
            null,
            this
        );

        this.physics.overlap(
            this.piranha,
            this.oilSplashes,
            () => {
                this.piranha.setDead(true);
            },
            null,
            this
        );

        this.physics.overlap(
            this.piranha,
            this.dangerFishes,
            (piranha, dangerFish) => {
                this.eatBigFish(dangerFish)
            },
            null,
            this
        );

        this.physics.overlap(this.piranha, this.yellowFishes,
            (piranha, yellowFish) => {
                this.eatSmallFish(yellowFish)
            }, null, this);
        this.physics.overlap(this.piranha, this.speedUpWorms,
            () => {
                this.speedUp();
            }, null, this);
        this.physics.overlap(this.piranha, this.slowDownWorms,
            () => {
                this.slowDown();
            }, null, this);
    }

    eatBigFish(fish) {
        this.piranhaInMode ? this.piranha.getInSpeed() ? this.piranha.setDead(true) : this.eatFish(fish)
            : this.piranha.setDead(true);
    }

    eatSmallFish(fish) {
        this.piranhaInMode ? this.piranha.getInSpeed() ? this.piranha.setDead(true) : this.eatFish(fish)
            : this.eatFish(fish);
    }

    eatFish(fish) {
        this.registry.values.score++;
        this.moveMouths();
        fish.destroy();

        this.scoreText.setText(this.registry.values.score);
    }

    private resetObstacleVelocities() {
        this.obstacleVelocities = {...this.obstacleStartingVelocities};

        this.blueFishes.children.entries.forEach(fish => {
            fish.body.setVelocity(-this.obstacleStartingVelocities.blueFish, 0);
        });
        this.yellowFishes.children.entries.forEach(fish => {
            fish.body.setVelocity(-this.obstacleStartingVelocities.yellowFish, 0);
        });
        this.dangerFishes.children.entries.forEach(fish => {
            fish.body.setVelocity(-this.obstacleStartingVelocities.dangerFish, 0);
        });
        this.woods.children.entries.forEach(wood => {
            wood.body.setVelocity(-this.obstacleStartingVelocities.wood, 0);
        });
        this.oilSplashes.children.entries.forEach(oilSplash => {
            oilSplash.body.setVelocity(-this.obstacleStartingVelocities.oilSplash, 0);
        });
        this.slowDownWorms.children.entries.forEach(worm => {
            worm.body.setVelocity(-this.obstacleStartingVelocities.worms, 0);
        });
        this.speedUpWorms.children.entries.forEach(worm => {
            worm.body.setVelocity(-this.obstacleStartingVelocities.worms, 0);
        });
    }

    clearTimeoutsValues() {
        this.gameTimeouts.forEach(timeout => window.clearTimeout(timeout));
    }

    private getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

}
