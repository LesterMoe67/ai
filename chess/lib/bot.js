import { Piece } from "./classes.js"

export function fenToBoard(string) {
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
export function isCheck(pieces, color) {
    let king;
    console.log(pieces)
    for (let piece of pieces) {
        if (piece.type == "king"  && piece.color == color) {
            king = piece.coordinates

        }
    }
    console.log(pieces)
    for (let piece of pieces) {
        for (let move of piece.moves(pieces)) {
            if (move[0] == king[0] && move[1] == king[1]) {
                return true
            }
        }
    }
    return false
}
//rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR