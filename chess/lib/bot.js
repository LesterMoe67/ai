import { compareCoordinates, Piece, Move } from "./classes.js"

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
        move.resolve(new Piece("pawn", moving.color, starting), [], starting, moving.coordinates, {"storage" : []})
        
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
    console.log(Object.keys(movelist.storage).length)
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
        console.log(move.moving)
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

    console.log(string)
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
//rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR