import {shapes} from './shapes';

document.addEventListener("DOMContentLoaded", function(){

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext('2d');

    const nextBlockWindow = document.querySelector("#next_block");
    const windowCtx = nextBlockWindow.getContext('2d');

    const scoreCounter = document.querySelector(".score_counter");
    const gameSpeed = document.querySelector(".game_speed");

    const audio = new Audio('./sound/tetris_theme.mp3');
    audio.play();
    audio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);


class Map{
    constructor(){
        //To będzie można rozwiązać bardziej elegancko

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
        this.gameStarted = false;
        this.isGameOver=false;
        this.score = 0;
        this.difficulty = 3;

        scoreCounter.innerText=this.score;
        gameSpeed.innerText=this.difficulty;

    }
    //To będzie można przenieść do game

    createRect(x, y, color, ctx){
        ctx.strokeStyle="black";
        ctx.fillStyle = color;
        ctx.shadowBlur=1;
        ctx.shadowColor="black";
        ctx.fillRect(x*25, y*25, 25, 25);
        ctx.strokeRect(x*25, y*25, 25, 25);
    }


    drawMap() {
        window.requestAnimationFrame(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 20; j++) {
                    if(this.gameMap[i][j] !== ""){
                        this.createRect(i, j,this.gameMap[i][j], ctx)
                    }
                }
            }
        });
    }

    createBlock(x, y, type, rotation){
        for (let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++){
                if(type.rotations[rotation][i][j]){
                    this.gameMap[j+x][i+y]=type.color;
                }
            }
        }
    }

    showNextBlock(block){
        windowCtx.clearRect(0,0, 100, 100);
            for (let i = 0; i < 4; i++) {
                for(let j = 0; j < 4; j++){
                    if(block.rotations[0][i][j]){
                        this.createRect(i, j, block.color, windowCtx);
                    }
                }
            }
        }

    deleteBlock(x, y, type, rotation){
        for (let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++){
                if(type.rotations[rotation][i][j]){

                        this.gameMap[j+x][i+y]="";

                }
            }
        }
    }

// Call this function wih parameters of potential block to see if it would collide with other blocks
//Trzeba usprawnić wychodzenie poza mape
    detectCollision(x, y, type, rotation){
        for (let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++){
                if(type.rotations[rotation][i][j]) {
                    if(j+x<0 || j+x>9 || this.gameMap[j+x][i+y]!==""){
                        return true;
                    }
                }
            }
        }
        return false;
    }

//Trzeba będzie to mocno usprawnić.

    detectFullRow(){
        for(let i = 19; i > 0; i--){
            let rowFull = true;
            for(let j = 0; j < 10; j++){
                if(this.gameMap[j][i]===""){
                    rowFull=false;
                    break;
                }
            }
            if(rowFull){
                this.deleteRow(i);
                this.checkDifficultyLevel();
                i=20;
            }

        }
    }

    deleteRow(row){
        let tempMap=[];

        for(let i = 0; i < 10; i++){
            //Lecimy po  kolumnach
            let newCol = [];
            for(let j = 19; j > 0; j--){
                //Lecim po elementach kolumny od końca
                if(j != row){ //Pomijamy rząd do usunięcia, trzeba go będzie uzupełnić
                    newCol.unshift(this.gameMap[i][j]);
                }

            }
            while(newCol.length<20){
                newCol.unshift(""); //Uzupełniam do pełnej kolumny
            }
            //Wpycham kolumnę do mapy
            tempMap.push(newCol)
        }
        this.deleteBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
        this.gameMap = tempMap;
        this.score += this.difficulty;
        scoreCounter.innerText=(this.score);
    }

//To można będzie dodać do shapes

    randomShape(){
        let number = Math.round(Math.random()*7);
        switch(number){
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
    }

    checkDifficultyLevel(){
        if(this.score>3){
            this.difficulty = 3 + Math.ceil(this.score/10);
            gameSpeed.innerText=this.difficulty;
        }
    }

//Do poprawy
    gameOver(){
        this.isGameOver=true;
        ctx.font = "30px Arial";
        ctx.strokeStyle="black";
        ctx.clearRect(0,0,canvas.width, canvas.height)
        ctx.rect(0, 0, canvas.width, canvas.height)
        ctx.strokeText("Game Over",50, canvas.height/2);
        console.log("Game over");
    }

    handleKeyUp(event){
        console.log(event.key);
         if(event.key=="ArrowLeft"){
            this.deleteBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
            if(!this.detectCollision(this.currentX-1, this.currentY, this.currentType, this.currentRotation)){
                this.currentX--;
            }
            this.createBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
        }else if(event.key=="ArrowRight"){
            this.deleteBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
            if(!this.detectCollision(this.currentX+1, this.currentY, this.currentType, this.currentRotation)){
                this.currentX++;
            }
            this.createBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
            //Koniecznie trzeba to usprawnić. Zbyt wiele operacji spowalnia animację
        }else if(event.key=="ArrowUp"){
            this.deleteBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
            this.currentRotation++;
            if(this.currentRotation > 3){
                this.currentRotation = 0;
            }
            if(this.detectCollision(this.currentX, this.currentY, this.currentType, this.currentRotation)){
                this.currentRotation--;
                if(this.currentRotation < 0){
                    this.currentRotation = 3;
                }
                this.createBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
            }
        }else if(event.key=="ArrowDown"){
            this.deleteBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
            if(!this.detectCollision(this.currentX, this.currentY+1, this.currentType, this.currentRotation)){
                this.currentY++;
            }
            this.createBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
        }
        this.drawMap();
    }

    fallingBlock(type){
        this.currentX=4;
        this.currectY=-2;
        this.nextBlock = this.randomShape();
        this.showNextBlock(this.nextBlock);
        this.currentType = type;
        this.currentRotation = 0;

        if(!this.detectCollision(this.currentX, this.currentY, this.currentType, this.currentRotation)){

        this.createBlock(this.currentX, this.currentY, this.currentType, this.currentRotation );

        this.interval = setInterval(()=>{
            this.drawMap();
            this.deleteBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
            if(this.detectCollision(this.currentX, this.currentY+1, this.currentType, this.currentRotation)){
                console.log("kolizja");
                clearInterval(this.interval);
                this.createBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
                //Check if row is full
                this.detectFullRow();

                this.currentX=4;
                this.currentY=0;
                this.fallingBlock(this.nextBlock);
            } else{
                this.currentY++;
                this.createBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
            }

        }, 1000/this.difficulty);

        if(!this.gameStarted){
            document.addEventListener("keyup", this.handleKeyUp.bind(this));
        }
        this.gameStarted=true;

    }else{
        clearInterval(this.interval);
        document.removeEventListener("keyup", this.handleKeyUp.bind(this))
        this.gameOver();
    // ctx.clearRect(0,0, canvas.width, canvas.height);
}

}
}

const map = new Map;
map.drawMap();

map.fallingBlock(map.randomShape());
// map.fallingBlock(shapes.i);









});
