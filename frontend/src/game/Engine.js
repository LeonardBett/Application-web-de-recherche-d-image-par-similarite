import Phaser from "phaser";
import Scene from "./Scene.js";

class GameEngine {
    constructor(parent,playerImageId) {
        this.parent=parent;
        this.game=null;
        this.playerImageId = playerImageId;
    }

    initialise() {
        this.game = new Phaser.Game({
            scene: [new Scene(this.playerImageId)],
            width:500,
            height:500,
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