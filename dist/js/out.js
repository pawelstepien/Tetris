/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__shapes__ = __webpack_require__(1);


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
                return __WEBPACK_IMPORTED_MODULE_0__shapes__["a" /* shapes */].o;
            case 1:
                return __WEBPACK_IMPORTED_MODULE_0__shapes__["a" /* shapes */].j;
            case 2:
                return __WEBPACK_IMPORTED_MODULE_0__shapes__["a" /* shapes */].l;
            case 3:
                return __WEBPACK_IMPORTED_MODULE_0__shapes__["a" /* shapes */].i;
            case 4:
                return __WEBPACK_IMPORTED_MODULE_0__shapes__["a" /* shapes */].t;
            case 5:
                return __WEBPACK_IMPORTED_MODULE_0__shapes__["a" /* shapes */].s;
            case 6:
                return __WEBPACK_IMPORTED_MODULE_0__shapes__["a" /* shapes */].z;
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


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return shapes; });
// These objects represent each piece in 4x4 grid in each rotation case. They are three dimension arrays [rotation case 0-3][x axis][y axis];

const shapes={

    o: {rotations:[
            [
                [1, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [1, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [1, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [1, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ]
        ],
        color: "red"
    },

    j: {rotations:[
                [
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [1, 1, 0, 0],
                    [0, 0, 0, 0]
                ],
                [
                    [1, 0, 0, 0],
                    [1, 1, 1, 0],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ],
                [
                    [0, 1, 1, 0],
                    [0, 1, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 0, 0]
                ],
                [
                    [0, 0, 0, 0],
                    [1, 1, 1, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 0]
                ]
            ],
            color: "orange"
        },

        l: {rotations:[
                    [
                        [0, 1, 0, 0],
                        [0, 1, 0, 0],
                        [0, 1, 1, 0],
                        [0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0],
                        [1, 1, 1, 0],
                        [1, 0, 0, 0],
                        [0, 0, 0, 0]
                    ],
                    [
                        [1, 1, 0, 0],
                        [0, 1, 0, 0],
                        [0, 1, 0, 0],
                        [0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 1, 0],
                        [1, 1, 1, 0],
                        [0, 0, 0, 0],
                        [0, 0, 0, 0]
                    ]
                ],
                color: "yellow"
            },

            i: {rotations:[
                        [
                            [0, 1, 0, 0],
                            [0, 1, 0, 0],
                            [0, 1, 0, 0],
                            [0, 1, 0, 0]
                        ],
                        [
                            [0, 0, 0, 0],
                            [1, 1, 1, 1],
                            [0, 0, 0, 0],
                            [0, 0, 0, 0]
                        ],
                        [
                            [0, 0, 1, 0],
                            [0, 0, 1, 0],
                            [0, 0, 1, 0],
                            [0, 0, 1, 0]
                        ],
                        [
                            [0, 0, 0, 0],
                            [0, 0, 0, 0],
                            [1, 1, 1, 1],
                            [0, 0, 0, 0]
                        ]
                    ],
                    color: "lime"
                },

                s: {rotations:[
                            [
                                [0, 0, 0, 0],
                                [0, 1, 1, 0],
                                [1, 1, 0, 0],
                                [0, 0, 0, 0]
                            ],
                            [
                                [1, 0, 0, 0],
                                [1, 1, 0, 0],
                                [0, 1, 0, 0],
                                [0, 0, 0, 0]
                            ],
                            [
                                [0, 1, 1, 0],
                                [1, 1, 0, 0],
                                [0, 0, 0, 0],
                                [0, 0, 0, 0]
                            ],
                            [
                                [0, 1, 0, 0],
                                [0, 1, 1, 0],
                                [0, 0, 1, 0],
                                [0, 0, 0, 0]
                            ]
                        ],
                        color: "steelblue"
                    },
                    z: {rotations:[
                                [
                                    [0, 0, 0, 0],
                                    [1, 1, 0, 0],
                                    [0, 1, 1, 0],
                                    [0, 0, 0, 0]
                                ],
                                [
                                    [0, 1, 0, 0],
                                    [1, 1, 0, 0],
                                    [1, 0, 0, 0],
                                    [0, 0, 0, 0]
                                ],
                                [
                                    [1, 1, 0, 0],
                                    [0, 1, 1, 0],
                                    [0, 0, 0, 0],
                                    [0, 0, 0, 0]
                                ],
                                [
                                    [0, 0, 1, 0],
                                    [0, 1, 1, 0],
                                    [0, 1, 0, 0],
                                    [0, 0, 0, 0]
                                ]
                            ],
                            color: "purple"
                        },
                        t: {rotations:[
                                    [
                                        [0, 0, 0, 0],
                                        [1, 1, 1, 0],
                                        [0, 1, 0, 0],
                                        [0, 0, 0, 0]
                                    ],
                                    [
                                        [0, 1, 0, 0],
                                        [1, 1, 0, 0],
                                        [0, 1, 0, 0],
                                        [0, 0, 0, 0]
                                    ],
                                    [
                                        [0, 1, 0, 0],
                                        [1, 1, 1, 0],
                                        [0, 0, 0, 0],
                                        [0, 0, 0, 0]
                                    ],
                                    [
                                        [0, 1, 0, 0],
                                        [0, 1, 1, 0],
                                        [0, 1, 0, 0],
                                        [0, 0, 0, 0]
                                    ]
                                ],
                                color: "green"
                            }
}




/***/ })
/******/ ]);