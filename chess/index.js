import { fenToBoard } from "./lib/bot.js"
import { Piece } from "./lib/classes.js"
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
let turn = "white"
let xOffset = 1920/2 - 80*8/4*3
let yOffset = 20
let blackLoaded = false
let whiteLoaded = false
let black = new Image(80 ,80)
black.onload= () => {
    blackLoaded = true
    if (whiteLoaded) {
        draw()
    }
}
black.src = "./assets/black-tile.png"
let white = new Image(80, 80)
white.onload = () => {
    whiteLoaded = true
    if (blackLoaded) {
        draw()
    }
}
white.src = "./assets/white-tile.png"
function draw() {
    console.log("cleared")
    ctx.clearRect(0, 0, 1920, 800)
    for (let a = 0; a < 8; a++) {
        for (let b = 0; b < 8; b++) {
            if ((a + b) %2 == 0) {
                ctx.drawImage(white, a*80 + xOffset, b*80 + yOffset)
            } else {
                ctx.drawImage(black, a*80 + xOffset, b*80 + yOffset)
            }
            console.log(black.width, black.height, white.width, white.height)
        }
    }
}
function drawPiece(piece) {
    let img = new Image()
    img.onload = () => {
        ctx.drawImage(img, piece.coordinates[0]*80 + xOffset, piece.coordinates[1]*80 + yOffset)

    }
    img.src = "./assets/" + piece.color + "-" + piece.type + ".png"
}
let pieces = fenToBoard("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR")
for (let peice of pieces) {
    drawPiece(peice)
}
function highlight(coords) {
    let occupied = undefined
    for (let piece of pieces) {
        if (coords[0] == piece.coordinates[0] && coords[1] == piece.coordinates[1]) {
            occupied = piece
        }
    }
    if (typeof(occupied) == "undefined") {
        let img = new Image()
        img.onload = () => {
            ctx.drawImage(img, coords[0] *80 + xOffset, coords[1]*80 + yOffset)
            console.log("drew")
        }
        img.src = "./assets/red-" + ((coords[0] + coords[1]) % 2 == 0 ? "white" : "black")  + "-tile.png"
        console.log(img.src)
        
    } else {
        let img = new Image()
        img.onload = () => {
            ctx.drawImage(img, coords[0] *80 + xOffset, coords[1]*80 + yOffset)
            console.log("drew")
            drawPiece(occupied)
        }
        img.src = "./assets/red-" + ((coords[0] + coords[1]) % 2 == 0 ? "white" : "black")  + "-tile.png" 

    }
}
function handleMove(pieces, coords, moving) {
    let newList = []
    for (let piece of pieces) {
        if (!(piece.coordinates[0] == coords[0] && piece.coordinates[1] == coords[1]) ) {
            piece.toggled = false
            newList.push(piece)
        }
        else {
            console.log("eliminating", piece.color, piece.type)
        }
    }
    console.log(newList)
    moving.move(coords)
    draw()
    for (let piece of newList) {
        drawPiece(piece)
    }
    return newList
}
function handleClick(x, y) {
    if ( x > xOffset && x < (xOffset + 8 * 80)) {
        if (y > yOffset && y < (yOffset + 8 * 80)) {
            x-= xOffset
            y-= yOffset
            let xCord = Math.ceil(x/80)
            let yCord = Math.ceil(y/80)
           return [xCord - 1, yCord - 1]
        }
    }
}
document.getElementsByTagName("body")[0].addEventListener("click", (e) => {

    let coords = handleClick(e.clientX, e.clientY)
    console.log("cliked at ",coords)

    for (let piece of pieces) {
        if (piece.coordinates[0] == coords[0] && piece.coordinates[1] == coords[1]) {
            piece.toggled = !piece.toggled
        } else {
            if (piece.toggled) {
                for (let coord of piece.moves(pieces)) {
                    if ((coord[0] == coords[0] && coord[1] == coords[1]) && turn == piece.color ) {
                        pieces =  handleMove(pieces, coords, piece)
                        if (turn == "white") {
                            turn = "black"
                        } else {
                            turn = "white"
                        }
                    }
                }
            }
        }
    }



})