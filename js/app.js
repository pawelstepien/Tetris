import {shapes} from './shapes';

document.addEventListener("DOMContentLoaded", function(){

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');





class Map{
    constructor(){
        //To będzie można rozwiązać bardziej elegancko

        this.gameMap = [[],[],[],[],[],[],[],[],[],[]];
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 20; j++) {
                this.gameMap[i].push("");
            }
        }

        this.currentX = 0;
        this.currentY = 0;
        this.currentType = null;
        this.currentRotation = 0;
        this.gameStarted = false;

    }
    //To będzie można przenieść do game
    //Dodaj shadow
    createRect(x, y, color){
        ctx.strokeStyle="black";
        ctx.fillStyle = color;
        ctx.fillRect(x*25, y*25, 25, 25);
        ctx.strokeRect(x*25, y*25, 25, 25);
    }


    drawMap() {
        window.requestAnimationFrame(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 20; j++) {
                    if(this.gameMap[i][j] !== ""){
                        this.createRect(i, j,this.gameMap[i][j] )
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
    detectCollision(x, y, type, rotation){
        for (let i = 0; i < 4; i++) {
            for(let j = 0; j < 4; j++){
                if(type.rotations[rotation][i][j]){
                    if(this.gameMap[j+x][i+y]!==""){
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
                // this.deleteRow(i);
            }else{
                return false;
            }

        }
    }
    //
    // deleteRow(row){
    //
    //         // for(let j = 0; j < 10; j++){
    //         //     this.gameMap[j][row]=""
    //         // }
    //         let tempMap=[];
    //         for(let i = 0; i < 19; i++){
    //             for(let j = 0; j < 10; j++){
    //             tempMap[j][i]=this.gameMap[j][i];
    //             }
    //         }
    //         console.log(tempMap);
    //         // this.gameMap = tempMap;
    // }


    randomShape(){
        let number = Math.round(Math.random()*6);
        console.log(number);
        switch(number){
            case 0:
                return shapes.o;
            case 1:
                return shapes.j;
            case 2:
                return shapes.l;
            case 3:
                return shapes.i;
            case 4:
                return shapes.t;
            case 5:
                return shapes.s;
            case 6:
                return shapes.z;
        }
    }

    handleKeyUp(event){
        console.log(event);
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
        }
        this.drawMap();
    }

    fallingBlock(type){
        this.currentX=4;
        this.currectY=-2;



        console.log(this.currentY);
        this.currentType = type;
        this.currentRotation = 0;

        if(!this.detectCollision(this.currentX, this.currentY, this.currentType, this.currentRotation)){

        this.createBlock(this.currentX, this.currentY, this.currentType, this.currentRotation );

        const interval = setInterval(()=>{
            this.drawMap();
            this.deleteBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
            if(this.detectCollision(this.currentX, this.currentY+1, this.currentType, this.currentRotation)){
                console.log("kolizja");
                clearInterval(interval);
                this.createBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
                console.log("Interval cleared");
                this.currentX=4;
                this.currentY=0;
                this.fallingBlock(this.randomShape());
            } else{
                this.currentY++;
                this.createBlock(this.currentX, this.currentY, this.currentType, this.currentRotation);
            }
            //Upewnij się czy to dobre miejsce na sprawdzenie pełnego rzędu
            console.log("rząd " + this.detectFullRow());
        }, 1000/5);

        if(!this.gameStarted){
            document.addEventListener("keyup", this.handleKeyUp.bind(this));
        }
        this.gameStarted=true;

    }else{
        console.log("GAME OVER!");
    ctx.clearRect(0,0, canvas.width, canvas.height);
}

}
}

const map = new Map;
map.drawMap();

map.fallingBlock(map.randomShape());








});
