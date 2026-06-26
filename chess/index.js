import { fenToBoard, isCheck } from "./lib/bot.js"
import { Piece, Move, compareCoordinates, MoveList } from "./lib/classes.js"
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
let turn = "white"
let xOffset = 1920/2 - 80*8/4*3
let yOffset = 20
let blackLoaded = false
let whiteLoaded = false
let black = new Image(80 ,80)
let movelist = new MoveList()
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
    ctx.clearRect(0, 0, 1920, 800)
    for (let a = 0; a < 8; a++) {
        for (let b = 0; b < 8; b++) {
            if ((a + b) %2 == 0) {
                ctx.drawImage(white, a*80 + xOffset, b*80 + yOffset)
            } else {
                ctx.drawImage(black, a*80 + xOffset, b*80 + yOffset)
            }
        }
    }
}
function allMoves(pieces, color, movelist) {
    let moves = []
    console.log("allgame", movelist)
    for (let pezzo of pieces) {
        if (pezzo.color == color) {
            moves.push(pezzo.moves(pieces, true, movelist))
        }
    }
    return moves.flat()
}
function drawPiece(piece) {
    let img = new Image()
    img.onload = () => {
        console.log("draw")
        ctx.drawImage(img, piece.coordinates[0]*80 + xOffset, piece.coordinates[1]*80 + yOffset)

    }
    img.src = "./assets/" + piece.color + "-" + piece.type + ".png"
}
function checkGame(pieces, turn, movelist) {
    if (allMoves(pieces, turn, movelist).length == 0) {
        let king;
        let checkmate = false
        for (let piece of pieces) {
            if (piece.type == "king" && piece.color == turn) {
                king = piece.coordinates
            }
        } 
        for (let piece of pieces) {
            if (piece.color != turn) {
                let moves = piece.moves(pieces, true, movelist)
                for (let move of moves) {
                    if (move[0] == king[0] && move[1] == king[1]) {
                        checkmate = true
                    }
                }
            }
                
        }
        if (checkmate) {
            alert(turn +  " is checkmated")
        } else {
            alert("stalemate")
        }
    }
}
let pieces = fenToBoard("rnbqkbnr/pppp1ppp/8/8/4p3/8/PPPPPPPP/RNBQKBNR")
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
function handleMove(move, piece, board, starting, ending, movelist) {
    let newList = move.resolve(piece, board,starting, ending, movelist)
    draw()
    for (let piece of newList) {
        drawPiece(piece)
        piece.toggled = false
        console.log("sybau")
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

    for (let piece of pieces) {
        if (piece.coordinates[0] == coords[0] && piece.coordinates[1] == coords[1]) {
            piece.toggled = "true"
        } else {
            if (piece.toggled) {
                console.log(piece)
                if (piece.type == "king" && turn == piece.color) {

                    if (piece.color == "white") {

                        if (!piece.hasMoved) {

                            if (compareCoordinates(coords, [6,7])) {
                                let cond1 = false
                                let cond2 = true
                                console.log(pieces)
                                for (let piece of pieces) {
                                    if (piece.type == "rook" && piece.color == "white"  && (!piece.hasMoved) && (compareCoordinates(piece.coordinates,[7,7]))) {
                                        cond1 = true
                                    }
                                    if (piece.type == "rook" && piece.color == "white") {
                                        console.log((pieces.type == "rook" && piece.color == "white")  && (!piece.hasMoved))
                                    }
                                    if (compareCoordinates(piece.coordinates, [6,7])) {
                                        cond2 = false
                                    }
                                    if (compareCoordinates(piece.coordinates, [5,7])) {
                                        cond2 = false
                                    }
                                }
                                console.log(pieces)
                                if (!isCheck(pieces, "white") && cond2 && cond1) {
                                    console.log("passed controls")
                                    let move = new Move("castle")
                                    pieces =  handleMove(move, piece, pieces, piece.coordinates, [6,7])
                                    if (turn == "white") {
                                        turn = "black"
                                    } else {
                                        turn = "white"

                                    }
                                    checkGame(pieces, turn, movelist)
                                } else {
                                    console.log(cond2, cond1)
                                }

                            }
                            if (compareCoordinates(coords, [2,7])) {
                                let cond1 = false
                                let cond2 = true
                                console.log(pieces)
                                for (let piece of pieces) {
                                    if (piece.type == "rook" && piece.color == "white"  && (!piece.hasMoved) && (compareCoordinates(piece.coordinates,[0,7]))) {
                                        cond1 = true
                                    }
                                    if (piece.type == "rook" && piece.color == "white") {
                                        console.log((pieces.type == "rook" && piece.color == "white")  && (!piece.hasMoved))
                                    }
                                    if (compareCoordinates(piece.coordinates, [3,7])) {
                                        cond2 = false
                                    }
                                    if (compareCoordinates(piece.coordinates, [2,7])) {
                                        cond2 = false
                                    }
                                }
                                console.log(pieces)
                                if (!isCheck(pieces, "white") && cond2 && cond1) {
                                    console.log("passed controls")
                                    let move = new Move("castle")
                                    pieces =  handleMove(move, piece, pieces, piece.coordinates, [2,7])
                                    if (turn == "white") {
                                        turn = "black"
                                    } else {
                                        turn = "white"

                                    }
                                    checkGame(pieces, turn, movelist)
                                } else {
                                    console.log(cond2, cond1)
                                }

                            }  
                        }
                    } else {
                        if (!piece.hasMoved) {

                            if (compareCoordinates(coords, [6,0])) {
                                let cond1 = false
                                let cond2 = true
                                console.log(pieces)
                                for (let piece of pieces) {
                                    if (piece.type == "rook" && piece.color == "black"  && (!piece.hasMoved) && (compareCoordinates(piece.coordinates,[7,0]))){
                                        cond1 = true
                                    }
                                    if (piece.type == "rook" && piece.color == "black") {
                                        console.log((pieces.type == "rook" && piece.color == "black")  && (!piece.hasMoved))
                                    }
                                    if (compareCoordinates(piece.coordinates, [6,0])) {
                                        cond2 = false
                                    }
                                    if (compareCoordinates(piece.coordinates, [5,0])) {
                                        cond2 = false
                                    }
                                }
                                console.log(pieces)
                                if (!isCheck(pieces, "black") && cond2 && cond1) {
                                    console.log("passed controls")
                                    let move = new Move("castle")
                                    pieces =  handleMove(move, piece, pieces, piece.coordinates, [6,0])
                                    if (turn == "white") {
                                        turn = "black"
                                    } else {
                                        turn = "white"

                                    }
                                    checkGame(pieces, turn, movelist)
                                } else {
                                    console.log(cond2, cond1)
                                }

                            }
                            if (compareCoordinates(coords, [2,0])) {
                                let cond1 = false
                                let cond2 = true
                                console.log(pieces)
                                for (let piece of pieces) {
                                    if (piece.type == "rook" && piece.color == "black"  && (!piece.hasMoved) && (compareCoordinates(piece.coordinates,[0,0]))) {
                                        cond1 = true
                                    }
                                    if (piece.type == "rook" && piece.color == "black") {
                                        console.log((pieces.type == "rook" && piece.color == "black")  && (!piece.hasMoved))
                                    }
                                    if (compareCoordinates(piece.coordinates, [3,0])) {
                                        cond2 = false
                                    }
                                    if (compareCoordinates(piece.coordinates, [2,0])) {
                                        cond2 = false
                                    }
                                }
                                console.log(pieces)
                                if (!isCheck(pieces, "black") && cond2 && cond1) {
                                    console.log("passed controls")
                                    let move = new Move("castle")
                                    pieces =  handleMove(move, piece, pieces, piece.coordinates, [2,0])
                                    if (turn == "white") {
                                        turn = "black"
                                    } else {
                                        turn = "white"

                                    }
                                    checkGame(pieces, turn, movelist)
                                } else {
                                    console.log(cond2, cond1)
                                }

                            }  
                        }
                    }
                } 
                for (let coord of piece.moves(pieces, true, movelist)) {
                    if (compareCoordinates(coord, coords)&& turn == piece.color ) {
                        let take = false
                        for (let peice of pieces) {
                            if (compareCoordinates(coords, peice.coordinates)) {
                                take = true
                            }
                        }
                        let move = new Move(take ? "capture" : "move")
                        if (piece.type == "pawn"  && (!take && piece.coordinates[0] != coord[0])) {
                            move = new Move("en passant")
                        }
                        pieces =  handleMove(move, piece, pieces, piece.coordinates, coords, movelist)
                        console.log(movelist)
                        if (turn == "white") {
                            turn = "black"
                        } else {
                            turn = "white"

                        }
                        checkGame(pieces, turn, movelist)
                        console.log(take)
                    }
                }
            }
        }
    }



})
