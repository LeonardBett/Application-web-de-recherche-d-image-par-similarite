import Phaser from "phaser";
import Scene from "./Scene.js";

class GameEngine {
    constructor(parent,playerImageId,ennemieList,backgroundId,bonus_active) {
        this.parent=parent;
        this.game=null;
        this.playerImageId = playerImageId;
        this.ennemieList= ennemieList;
        this.backgroundId=backgroundId;
        this.bonus_active=bonus_active;
    }

    initialise() {
        this.game = new Phaser.Game({
            scene: [new Scene(this.playerImageId,this.ennemieList,this.backgroundId,this.bonus_active)],
            width:innerWidth/1.5,
            height:innerHeight/1.5,
            parent: this.parent,
            type: Phaser.AUTO,
            physics: {
                default: 'arcade',
                fps: 60,
                arcade: {
                    debug: true
                }
            }
        });
    }
}

export default GameEngine;