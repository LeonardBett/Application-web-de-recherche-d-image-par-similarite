
import Phaser from "phaser";

class Scene extends Phaser.Scene {
    constructor(playerImageId, ennemieList, backgroundId, bonus_active) {
        super({key : "Scene"});
        this.playerImageId = playerImageId;
        this.ennemieList = ennemieList;
        this.backgroundId=backgroundId;

        if(bonus_active.id===1){
            this.score = 10;
        } else {
            this.score = 0;
        }

        this.perdu = false;

        this.spawnDelay = 4000;
        this.vitesseScrolling = 1;
        this.vitesseEnnemis = 100;
    }

    preload(){
        this.load.setBaseURL("http://localhost:8080");
        this.load.setPath("images/");
        this.load.image("player",this.playerImageId.toString());
        for(let i=0; i<this.ennemieList.length;i++){
            this.load.image(`ennemi_${this.ennemieList[i]}`,this.ennemieList[i].toString());
        }
        this.load.image("fond",this.backgroundId.toString());
    }

    create(){
        this.background= this.add.tileSprite(0,0,this.scale.width,this.scale.height,"fond").setOrigin(0);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.player = this.physics.add.image(50, 50, "player");
        this.player.setScale(100/this.textures.get("player").getSourceImage().width);

        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(1000);

        this.enemiesAlive=[];
        this.spawnGestion();

        this.scoreText = this.add.text(10, 10, 'Score: '+this.score, {
            font: '20px Arial',
            fill: '#ffffff'
        }).setOrigin(0, 0);
    }

    update() {
        if(this.perdu){
            return;
        }
        if(this.cursors.right.isDown){
            this.player.setVelocityX(250);
        }
        else if(this.cursors.left.isDown){
            this.player.setVelocityX(-250);
        }
        else {
            this.player.setVelocityX(0);
        }
        if(this.cursors.space.isDown && this.player.body.blocked.down){
            this.player.setVelocityY(-600);
        }
        this.background.tilePositionX+= this.vitesseScrolling;
        this.enemiesAlive= this.enemiesAlive.filter(ennemi => {
            if(-50 >ennemi.x){
                ennemi.destroy();
                this.scorePlusUn();
                return false;
            } else {
                return true;
            }
        })
    }

    //fonction rec qui permet de reduire la duree entre les sspawn entre chaque spawn
    spawnGestion(){
        if(this.perdu){
            return;
        }
        this.spawn();
        this.time.addEvent({
            callback: () => {
                this.spawnGestion()
            },
            delay: this.spawnDelay,
            callbackScope: this
        });
    }

    spawn() {
        this.spawnDelay=Math.max(this.spawnDelay-250, 749);
        this.vitesseEnnemis=Math.min(this.vitesseEnnemis+10, 800);
        this.vitesseScrolling=Math.min(this.vitesseScrolling+0.5, 10);

        const randomIndex= Phaser.Math.Between(0, this.ennemieList.length-1);
        const ennemi = this.physics.add.image(this.scale.width , this.scale.height-30, `ennemi_${this.ennemieList[randomIndex]}`);
        ennemi.setVelocityX(-this.vitesseEnnemis);
        ennemi.setScale(100/this.textures.get(`ennemi_${this.ennemieList[randomIndex]}`).getSourceImage().width);
        this.enemiesAlive.push(ennemi);
        this.physics.add.collider(this.player, ennemi, this.collisionFun, null, this);
    }

    collisionFun(player,ennemi) {
        if(player.body.touching.left || player.body.touching.right) {
            this.gameOver();
        } else if(player.y < ennemi.y) {
            ennemi.destroy();
            player.setVelocityY(-600);
            this.scorePlusUn();
        }
    }

    scorePlusUn() {
        this.score+= 1;
        this.scoreText.setText('Score : '+this.score);
    }

    gameOver() {
        this.perdu=true;

        this.background.tilePositionX=0;
        this.add.text(this.scale.width /2, this.scale.height/2-50, 'GAME OVER', {
            font: '40px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);

        this.add.text(this.scale.width / 2, this.scale.height /2+10, 'SCORE : '+this.score, {
            font: '20px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5, 0.5);

        let retry = this.add.text(this.scale.width/ 2, this.scale.height / 2 + 60, 'RETRY', {
            font: '20px Arial',
            fill: '#ffffff'
        }).setOrigin(0, 0);

        retry.setInteractive();
        retry.on('pointerdown',() => {
            window.location.reload();
        });
    }
}

export default Scene;