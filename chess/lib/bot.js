import { compareCoordinates, Piece, Move, MoveList } from "./classes.js"
import { allMoves, draw, checkGame, drawPiece } from "../index.js"
export function fenPositionToBoard(string) {
    let rows = string.split("/")
    let pieces = []
    for (let r  = 0; r < rows.length; r++) {
        let i = 0
        for (let char of rows[r]) {
            switch(char) {
                case "r":
                    pieces.push(new Piece("rook", "black", [i,r]))
                    i++
                    break;
                case "R":
                    pieces.push(new Piece("rook", "white", [i,r]))
                    i++
                    break;
                case "n":
                    pieces.push(new Piece("knight", "black", [i,r]))
                    i++
                    break;
                case "N":
                    pieces.push(new Piece("knight", "white", [i,r]))
                    i++
                    break;
                case "b":
                    pieces.push(new Piece("bishop", "black", [i,r]))
                    i++
                    break;
                case "B":
                    pieces.push(new Piece("bishop", "white", [i,r]))
                    i++
                    break;
                case "q":
                    pieces.push(new Piece("queen", "black", [i,r]))
                    i++
                    break;
                case "Q":
                    pieces.push(new Piece("queen", "white", [i,r]))
                    i++
                    break;
                case "k":
                    pieces.push(new Piece("king", "black", [i,r]))
                    i++
                    break;
                case "K":
                    pieces.push(new Piece("king", "white", [i,r]))
                    i++
                    break;
                case "p":
                    pieces.push(new Piece("pawn", "black", [i,r]))
                    i++
                    break;
                case "P":
                    pieces.push(new Piece("pawn", "white", [i,r]))
                    i++
                    break;
                default: 
                    i += Number.parseInt(char)
                    break;
            }
        }
    }
    return pieces
}
export function fenToBoard(string, movelist) {
    let board = fenPositionToBoard(string.split(" ")[0])
    let turn = string.split(" ")[1] == "w" ? "white" : "black"
    let castling = string.split(" ")[2]
    let K = false
    let k = false
    let Q = false
    let q = false
    for (let char of castling) {
        switch (char) {
            case "k":
                k = true
                break;
            case "K":
                K = true
                break;
            case "q":
                q = true
                break;
            case "Q":
                Q = true
                break;
        }
    }
    for (let piece of board) {
        if (piece.type == "rook") {
            switch (piece.color) {
                case "white":
                    switch(piece.coordinates[0]){
                        case 0:
                            piece.hasMoved = !Q
                            break;
                        case 1:
                            piece.hasMoved = !K
                            break;
                    }
                    break;
                case "black" :
                    switch(piece.coordinates[0]){
                        case 0:
                            piece.hasMoved = !q
                            break;
                        case 1:
                            piece.hasMoved = !k
                            break;
                    }
                    
            }
        }
    }
    let enPassant = string.split(" ")[3]
    if (!(enPassant == "-")) {
        let rows = "abcdefgh"
        let cols = "87654321"
        let target = [rows.indexOf(enPassant.split("")[0]), cols.indexOf((enPassant.split("")[1]))]
        let moving =undefined
        for (let piece of board) {
            if (compareCoordinates(piece.coordinates, [target[0], target[1] +1 ] || compareCoordinates(piece.coordinates, [target[0], target[1] -1 ]))) {
                moving = piece
            }
        }
        let starting = [target[0],target[1] * 2 - moving.coordinates[1]]
        let move = new Move("move")
        let fake = new Move("move")
        fake.ending = [9,9]
        fake.moving = new Piece(undefined, undefined, undefined)
        fake.starting = [9,9]
        move.resolve(new Piece("pawn", moving.color, starting), [], starting, moving.coordinates, new MoveList())
        
        if (turn == "white") {
            movelist.storage[(string.split(" ")[5] - 1).toString()] = [new Move("move"), move]
        } else {
            movelist.storage[(string.split(" ")[5] - 1).toString()] = [movelist.storage[(string.split(" ")[5] - 1).toString()][0], move]
        }
    }
    return [board, turn, movelist]
}
export function BoardToFen(pieces, movelist, turn) {
    let string = ""
    for (let i = 0; i < 8; i++ ) {
        string += "/"
        let spaces = 0
        for (let a = 0; a < 8; a++) {
            let occupied = undefined
            for (let piece of pieces) {
                if (compareCoordinates(piece.coordinates, [a, i])) {
                    occupied = piece
                }
            }
            if (typeof(occupied) == "undefined") {
                spaces++
                if (a == 7) {
                    string += ""+ spaces
                    spaces = 0
                }
            } else {
                if (spaces > 0 ) {
                    let str = String.toString(spaces)
                    string += ""+ spaces
                    spaces = 0
                }
                switch(occupied.type) {
                    case "knight":
                        string += (occupied.color == "white" ? "N" : "n")
                        break;
                    default :
                        string += occupied.color == "black"? occupied.type.slice(0, 1) : occupied.type.slice(0, 1).toUpperCase()
                }
            }
            
        }
    }
    string = string.split("")
    string.reverse()
    string.pop()
    string.reverse()
    string = string.join("")
    string += " " + (turn == "white" ? "b" : "w") + " "
    pieces = pieces.reverse()
    let nulled = true
    for (let piece of pieces) {
        if (piece.type == "king" && piece.color == "white") {
            if (!piece.hasMoved) {
                for (let rook of pieces) {
                    if (rook.type == "rook" && rook.color == piece.color) {
                        if (rook.coordinates[0] == 7) {
                            string += ((piece.color == "white" ? "K" : "k"))
                            nulled = false
                        }
                    }
                }
            }
        }
    }
    for (let piece of pieces) {
        if (piece.type == "king" && piece.color == "white") {
            if (!piece.hasMoved) {
                for (let rook of pieces) {
                    if (rook.type == "rook" && rook.color == piece.color) {
                        if (rook.coordinates[0] == 0) {
                            string += ((piece.color == "white" ? "Q" : "q"))
                            nulled = false
                        }
                    }
                }
            }
        }
    }
    for (let piece of pieces) {
        if (piece.type == "king" && piece.color == "black") {
            if (!piece.hasMoved) {
                for (let rook of pieces) {
                    if (rook.type == "rook" && rook.color == piece.color) {
                        if (rook.coordinates[0] == 7) {
                            string += ((piece.color == "white" ? "K" : "k"))
                            nulled = false
                        }
                    }
                }
            }
        }
    }
    for (let piece of pieces) {
        if (piece.type == "king" && piece.color == "black") {
            if (!piece.hasMoved) {
                for (let rook of pieces) {
                    if (rook.type == "rook" && rook.color == piece.color) {
                        if (rook.coordinates[0] == 0) {
                            string += ((piece.color == "white" ? "Q" : "q"))
                            nulled = false
                        }
                    }
                }
            }
        }
    }
    if (nulled) {
        string += " - "
    }
    string += " "
    let found = false
    let inde = movelist.storage[Object.keys(movelist.storage)[Object.keys(movelist.storage).length - 1]].length - 1
    let last = movelist.storage[Object.keys(movelist.storage)[Object.keys(movelist.storage).length - 1]][inde]
    if (last.moving.type == "pawn" && Math.abs(last.starting[1] - last.ending[1]) == 2) {
        for (let piece of pieces) {
            if (piece.type == "pawn") {
                for (let move of piece.moves(pieces, true, movelist)) {
                    if (compareCoordinates(move, [last.starting[0], (last.starting[1] + last.ending[1]) / 2])) {
                        let rows = "abcdefgh"
                        let cols = "87654321"
                        string += rows[move[0]] + cols[move[1]]
                        found = true
                    }
                }
            }
        }
    }
    if (!found) {
        string += "-"
    }
    let moves = 0
    let index = movelist.storage[Object.keys(movelist.storage)[Object.keys(movelist.storage).length - 1]].length - 1
    let Cmove = Object.keys(movelist.storage)[Object.keys(movelist.storage).length - 1]
    let move = movelist.storage[Cmove][index]
    while (!((move.moving.type == "pawn" ) || move.type == "capture") && (Cmove >= 0)) {
        moves ++
        if (index == 1) {
            index --
        } else {
            index ++
            Cmove--
        }
         move = movelist.storage[Cmove][index]
    }
    string += " " + moves + " " + (turn == "white" ? Object.keys(movelist.storage).length +1 : Object.keys(movelist.storage)[Object.keys(movelist.storage).length - 1])
    return string
}
export function isCheck(pieces, color, movelist) {
    let king;
    for (let piece of pieces) {
        if (piece.type == "king"  && piece.color == color) {
            king = piece.coordinates

        }
    }
    for (let piece of pieces) {
        for (let move of piece.moves(pieces, false, movelist)) {
            if (move[0] == king[0] && move[1] == king[1]) {
                return true
            }
        }
    }
    return false
}
export function countPieces(color, pieces) {
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
export function evaluatePawns(pieces, color) {
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
export function handleMove(move, piece, board, starting, ending, movelist) {
    console.log("handling", piece.color)
    let newList = move.resolve(piece, board,starting, ending, movelist)
    draw()
    for (let piecen of newList) {
        if (!compareCoordinates(piecen.coordinates, starting))
        drawPiece(piecen)
        piecen.toggled = false
    }
    return newList
}
export function evaluateBoard(pieces, movelist) {
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
export function comparePiece(piece1, piece2) {
    return (piece1.type == piece2.type) && (piece1.color == piece2.color) && (compareCoordinates(piece1.coordinates, piece2.coordinates))
}
export function getBestMove(board, color, movelist) {
    movelist.block()
    let moves = allMoves(board, color, movelist)
    let startCode = BoardToFen(board, movelist, color)
    let values = []
    for (let move of moves) {
        let piece = undefined
        let boardCopy = fenToBoard(startCode, movelist)[0]
        for (let pezzo of boardCopy) {
            let second = move.moving
            if (comparePiece(pezzo, second)) {
                piece = new Piece(pezzo.type, pezzo.color, pezzo.coordinates)
                piece.hasMoved = pezzo.hasMoved
                piece.toggled = pezzo.toogled
            }
        }
        let movelistCopy = fenToBoard(startCode, movelist)[2]
        movelistCopy.block()
        let newPosition = move.resolve(move.moving, boardCopy, move.starting, move.ending, movelistCopy)
        move.moving.coordinates = move.starting
        values.push([move, evaluateBoard(newPosition, movelistCopy) * (color == "white" ? 1 : -1)])
    }
    let best = values[0]
    for (let value of values) {
        if (value[1] > best[1]) {
            best = value
        } 
    }
    movelist.blocked = false
    for (let piece of board) {
        if (comparePiece(piece, best[0].moving)) {
            best[0].moving = piece
        }
    }
    return best
}
export function search(depth, board, color, movelister) {
    let moves = []
    let turn = color == "white" ? "white" : "black"
    for (let i = 0; i <= depth; i++) {
        if (i == 0) {

        }
    }
}
//rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR