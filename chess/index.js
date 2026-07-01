import {Board, Sqaure, Piece, Move, Transport} from "./lib/classes.js"
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
let xOffset = 1920/2 - 80*8/4*3
let yOffset = 20
let blackLoaded = false
let whiteLoaded = false
let black = new Image(80 ,80)
black.onload= () => {
    blackLoaded = true
    if (whiteLoaded) {
        board.render(xOffset, yOffset, ctx, black, white)
    }
}
black.src = "./assets/black-tile.png"
let white = new Image(80, 80)
white.onload = () => {
    whiteLoaded = true
    if (blackLoaded) {
        board.render(xOffset, yOffset, ctx, black, white)
    }
}
white.src = "./assets/white-tile.png"
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
        }
        img.src = "./assets/red-" + ((coords[0] + coords[1]) % 2 == 0 ? "white" : "black")  + "-tile.png"
        
    } else {
        let img = new Image()
        img.onload = () => {
            ctx.drawImage(img, coords[0] *80 + xOffset, coords[1]*80 + yOffset)
            drawPiece(occupied)
        }
        img.src = "./assets/red-" + ((coords[0] + coords[1]) % 2 == 0 ? "white" : "black")  + "-tile.png" 

    }
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
let board = new Board()
board.standard()

let test = new Move(new Piece("pawn", "white"), [0, 6], [0, 4])
let test2 = new Move(new Piece("pawn", "white"), [0, 4], [0, 2])
board = new Transport([test, test2]).resolve(board)
board.render(xOffset, yOffset, ctx, black, white)
