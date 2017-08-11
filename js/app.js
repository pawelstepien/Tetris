import {shapes} from './shapes';
import {highScores} from './high_scores';


document.addEventListener("DOMContentLoaded", function() {

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext('2d');

    const nextBlockWindow = document.querySelector("#next_block");
    const windowCtx = nextBlockWindow.getContext('2d');

    const scoreCounter = document.querySelector(".score_counter");
    const gameSpeed = document.querySelector(".game_speed");
    const gameOverMessage = document.querySelector(".game_over");

    const audio = new Audio('./sound/tetris_theme.mp3');
    audio.play();
    audio.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);


    class Game {
        constructor() {
            this.gameMap = [];
            for (let i = 0; i < 10; i++) {
                let row = [];
                for (let j = 0; j < 20; j++) {
                    row.push("");
                }
                this.gameMap.push(row);
            }

            this.currentX = 0;
            this.currentY = 0;
            this.currentType = null;
            this.currentRotation = 0;

            this.score = 0;
            this.difficulty = 2;

            scoreCounter.innerText = this.score;
            gameSpeed.innerText = this.difficulty;

            this.gameStarted = false;
            this.isGameOver = false;
        }
        //Draw a single rectangle
        createRect(x, y, color, ctx) {
            ctx.strokeStyle = "black";
            ctx.fillStyle = color;
            ctx.shadowBlur = 1;
            ctx.shadowColor = "black";
            ctx.fillRect(x * 25, y * 25, 25, 25);
            ctx.strokeRect(x * 25, y * 25, 25, 25);
        }
        //Draw map according to gameMap array
        drawMap() {
            window.requestAnimationFrame(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (let i = 0; i < 10; i++) {
                    for (let j = 0; j < 20; j++) {
                        if (this.gameMap[i][j] !== "") {
                            this.createRect(i, j, this.gameMap[i][j], ctx)
                        }
                    }
                }
            });
        }
        //Draw active block
        createBlock(x, y, type, rotation) {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (type.rotations[rotation][i][j]) {
                        this.gameMap[j + x][i + y] = type.color;
                    }
                }
            }
        }
        //Show what next block will be in the bottom menu
        showNextBlock(block) {
            windowCtx.clearRect(0, 0, 100, 100);
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (block.rotations[0][i][j]) {
                        this.createRect(j, i, block.color, windowCtx);
                    }
                }
            }
        }
        //Delete active block. Use it to check for collisions
        deleteBlock(x, y, type, rotation) {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (type.rotations[rotation][i][j]) {

                        this.gameMap[j + x][i + y] = "";

                    }
                }
            }
        }

        // Call this function wih parameters of potential block to see if it would collide with other blocks or map boundaries
        detectCollision(x, y, type, rotation) {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (type.rotations[rotation][i][j]) {
                        if (j + x < 0 || j + x > 9 || this.gameMap[j + x][i + y] !== "") {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        //Check if any row is full. If yes call function to delete it
        detectFullRow() {
            for (let i = 19; i > 0; i--) {
                let rowFull = true;
                for (let j = 0; j < 10; j++) {
                    if (this.gameMap[j][i] === "") {
                        rowFull = false;
                        break;
                    }
                }
                if (rowFull) {
                    this.deleteRow(i);
                    this.checkDifficultyLevel();
                    i = 20;
                }

            }
        }
        //Delete row passed in argument. This one was tricky
        deleteRow(row) {
            let tempMap = [];

            for (let i = 0; i < 10; i++) {
                //Checking all columns
                let newCol = [];
                for (let j = 19; j > 0; j--) {
                    //Checking elements of each column from bottom to top
                    if (j != row) { // Exclude row to delete. It's gonna be filled later.
                        newCol.unshift(this.gameMap[i][j]);
                    }
                }
                while (newCol.length < 20) {
                    newCol.unshift(""); //Filling to full column
                }
                //Pushing column to new map
                tempMap.push(newCol)
            }
            this.deleteBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
            //Deleting active block to switch game map
            this.gameMap = tempMap;
            this.score += 10 + this.difficulty;
            scoreCounter.innerText = (this.score);
        }
        //Generate random shape
        randomShape() {
            let number = Math.round(Math.random() * 7);
            switch (number) {
                case 0:
                    return shapes.o;
                case 1:
                    return shapes.j;
                case 2:
                    return shapes.l;
                case 3:
                    return shapes.z;
                case 4:
                    return shapes.t;
                case 5:
                    return shapes.s;
                case 6:
                    return shapes.i;
                case 7:
                    return shapes.i;
            }
            //'I' shape appears twice to double chance of getting it. I found this block the one I needed and didn't get most of times :)
        }
        //Adjust game speed. Then more you score, then harder it gets. Then harder it is, then more points you get.
        checkDifficultyLevel() {
            if (this.score > 25 && this.difficulty <= 10) {
                this.difficulty = 2 + Math.ceil(this.score / 100);
                gameSpeed.innerText = this.difficulty;
            }
        }
        //Turn off keyboard arrow events, turn on space restart event, print game over
        gameOver() {
            this.isGameOver = true;
            windowCtx.font = "26px Boxy-Bold";
            windowCtx.fillStyle = "red";
            windowCtx.clearRect(0, 0, 100, 100)
            windowCtx.fillText("Game", 3, 40);
            windowCtx.fillText("Over", 5, 70);
            gameOverMessage.innerText = "Press space for new game";
            highScores.sendHighScore(this.score);
        }
        //Dealing with controls
        handleKeyUp(event) {
            if (this.isGameOver) {
                if (event.key == " ") {
                    location.reload();
                }
            } else {
                if (event.key == "ArrowLeft") {
                    this.deleteBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
                    if (!this.detectCollision(this.currentX - 1, this.currentY, this.currentType, this.currentRotation)) {
                        this.currentX--;
                    }
                    this.createBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
                } else if (event.key == "ArrowRight") {
                    this.deleteBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
                    if (!this.detectCollision(this.currentX + 1, this.currentY, this.currentType, this.currentRotation)) {
                        this.currentX++;
                    }
                    this.createBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
                    //This one should be optimised. Animation isn't smooth.
                } else if (event.key == "ArrowUp") {
                    this.deleteBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
                    this.currentRotation++;
                    if (this.currentRotation > 3) {
                        this.currentRotation = 0;
                    }
                    if (this.detectCollision(this.currentX, this.currentY, this.currentType, this.currentRotation)) {
                        this.currentRotation--;
                        if (this.currentRotation < 0) {
                            this.currentRotation = 3;
                        }
                        this.createBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
                    }
                } else if (event.key == "ArrowDown") {
                    this.deleteBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
                    if (!this.detectCollision(this.currentX, this.currentY + 1, this.currentType, this.currentRotation)) {
                        this.currentY++;
                    }
                    this.createBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
                }
            }
            this.drawMap();
        }
        //All stuff related to the active block
        fallingBlock(type) {
            this.currentX = 4;
            this.currectY = -2;
            this.nextBlock = this.randomShape();
            this.showNextBlock(this.nextBlock);
            this.currentType = type;
            this.currentRotation = 0;
            //Check if there would be collision right when the block appears, if so end game
            if (!this.detectCollision(this.currentX, this.currentY, this.currentType, this.currentRotation)) {

                this.createBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);

                this.interval = setInterval(() => {
                    this.drawMap();
                    this.deleteBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
                    if (this.detectCollision(this.currentX, this.currentY + 1, this.currentType, this.currentRotation)) {
                        console.log("kolizja");
                        clearInterval(this.interval);
                        this.createBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
                        //Check if row is full
                        this.detectFullRow();

                        this.currentX = 4;
                        this.currentY = 0;
                        this.fallingBlock(this.nextBlock);
                    } else {
                        this.currentY++;
                        this.createBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
                    }

                }, 1000 / this.difficulty);
                //Prevent event listener from multiplication
                if (!this.gameStarted) {
                    document.addEventListener("keyup", this.handleKeyUp.bind(this));
                }
                this.gameStarted = true;

            } else {
                this.gameOver();
                clearInterval(this.interval);
                document.removeEventListener("keyup", this.handleKeyUp.bind(this))
            }

        }
    }
    //Game starting
    const game = new Game;

    game.drawMap();
    game.fallingBlock(game.randomShape());

});
