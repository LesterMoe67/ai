import { fenToBoard, isCheck, BoardToFen} from "./lib/bot.js"
import { Piece, Move, compareCoordinates, MoveList } from "./lib/classes.js"
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
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
let position = "rnbqkbnr/1pp1pppp/p7/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 3"
let result = fenToBoard(position, movelist)
let pieces = result[0]
let turn = result[1]
movelist = result[2]
console.log(movelist)
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
    console.log(movelist)
    if (move.type == "en passant") {
        console.log("handling en passant")
    }
    let newList = move.resolve(piece, board,starting, ending, movelist)
    draw()
    for (let piece of newList) {
        drawPiece(piece)
        piece.toggled = false
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
function countPieces(color, pieces) {
    let value = 0
    for (let piece of pieces) {
        if (piece.color == color) {
            switch (piece.type) {
                case "pawn" : 
                    value += 100
                    break;
                case "bishop" :
                    value += 330
                    break;
                case "knight":
                    value += 320
                    break;
                case "king":
                    value += 500000
                    break;
                case  "queen":
                    value += 900
                    break;
                case "rook":
                    value += 500
                    break;
            }
        }
    }
    return value
}
function evaluatePawns(pieces, color) {
    let score = 0
    for (let piece of pieces) {
        if (piece.type == "pawn" && piece.color == color) {
            let passed = true
            let isolated = true
            let defendedByPawn = false
            for (let next of pieces) {
                if (next.type =="pawn") {
                    if (next.color!= color&& next.coordinates[1] == piece.coordinates[1]) {
                        passed = false
                    }
                    if (next.color == color && Math.abs(piece.coordinates[0] - next.coordinates[0]) == 1) {
                        isolated = false
                    }
                    if (next.color == color &&  (compareCoordinates(next, [piece.coordinates[0] + 1, piece.coordinates[1] - 1]) || compareCoordinates(next, [piece.coordinates[0] - 1, piece.coordinates[1] - 1]))) {
                        defendedByPawn = true
                    }
                }
            }
            if (passed) {
                score += 30
            } if (isolated) {
                score -= 15
            } if (defendedByPawn) {
                score += 15
            }
        }
    }
    return score
}
function evaluateBoard(pieces, movelist) {
    let score = 0
    let whiteMaterial = countPieces("white", pieces)
    let blackMaterial = countPieces("black", pieces) 
    let whiteMobility = allMoves(pieces, "white", movelist).length
    let blackMobility = allMoves(pieces, "white", movelist).length
    let whitepawns = evaluatePawns(pieces, "white")
    let blackPawns = evaluatePawns(pieces, "black")
    let whiteBishops = 0
    let blackBishops = 0
    for (let piece of pieces) {
        if (piece.type == "bishop") {
            if (piece.color == "white") {
                whiteBishops ++
            } else {
                blackBishops
            }
        }
    }
    score += whiteMaterial + (whiteMobility * 2) + whitepawns + (whiteBishops == 2 ? 30 : 0)
    score -= blackMaterial + (blackMobility * 2) + blackPawns + (blackBishops == 2 ? 30 : 0)
    return score
}
document.getElementsByTagName("body")[0].addEventListener("click", (e) => {

    let coords = handleClick(e.clientX, e.clientY)

    for (let piece of pieces) {
        if (piece.coordinates[0] == coords[0] && piece.coordinates[1] == coords[1]) {
            piece.toggled = "true"
        } else {
            if (piece.toggled) {
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
                                if (!isCheck(pieces, "white", movelist) && cond2 && cond1) {
                                    console.log("passed controls")
                                    let move = new Move("castle")
                                    pieces =  handleMove(move, piece, pieces, piece.coordinates, [6,7], movelist)
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
                                if (!isCheck(pieces, "white", movelist) && cond2 && cond1) {
                                    console.log("passed controls")
                                    let move = new Move("castle")
                                    pieces =  handleMove(move, piece, pieces, piece.coordinates, [2,7], movelist)
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
                                for (let piece of pieces) {
                                    if (piece.type == "rook" && piece.color == "black"  && (!piece.hasMoved) && (compareCoordinates(piece.coordinates,[7,0]))){
                                        cond1 = true
                                    }
                                    if (compareCoordinates(piece.coordinates, [6,0])) {
                                        cond2 = false
                                    }
                                    if (compareCoordinates(piece.coordinates, [5,0])) {
                                        cond2 = false
                                    }
                                }
                                if (!isCheck(pieces, "black", movelist) && cond2 && cond1) {
                                    console.log("passed controls")
                                    let move = new Move("castle")
                                    pieces =  handleMove(move, piece, pieces, piece.coordinates, [6,0], movelist)
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
                                for (let piece of pieces) {
                                    if (piece.type == "rook" && piece.color == "black"  && (!piece.hasMoved) && (compareCoordinates(piece.coordinates,[0,0]))) {
                                        cond1 = true
                                    }
                                    if (compareCoordinates(piece.coordinates, [3,0])) {
                                        cond2 = false
                                    }
                                    if (compareCoordinates(piece.coordinates, [2,0])) {
                                        cond2 = false
                                    }
                                }
                                if (!isCheck(pieces, "black", movelist) && cond2 && cond1) {
                                    console.log("passed controls")
                                    let move = new Move("castle")
                                    pieces =  handleMove(move, piece, pieces, piece.coordinates, [2,0], movelist)
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
                        console.log(move)
                        pieces =  handleMove(move, piece, pieces, piece.coordinates, coords, movelist)
                        if (turn == "white") {
                            turn = "black"
                        } else {
                            turn = "white"

                        }
                        checkGame(pieces, turn, movelist)
                        console.log(evaluateBoard(pieces, movelist))
                        BoardToFen(pieces, movelist, turn)
                    }
                }
            }
        }
    }



})
