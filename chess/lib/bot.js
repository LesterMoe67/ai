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
//rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR