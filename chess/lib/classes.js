import { isCheck } from "./bot.js"

export class Piece {
    constructor(type, color, coordinates) {
        this.type = type
        this.color = color
        this.coordinates = coordinates
        this.toggled = false
        this.hasMoved = false
    }
    moves(pieces, check) {
        switch(this.type) {
            case "king" :
                let olist = []
                for (let a = 0; a < 8; a++) {
                    for (let b = 0; b < 8; b++) {
                        if (!((Math.abs(a - this.coordinates[0]) > 1 ||Math.abs(b - this.coordinates[1]) > 1 ) || (a == this.coordinates[0] && b == this.coordinates[1]))) {
                            olist.push([a, b])
                        }
                    }
                }
                let list = []
                for (let move of olist) {
                    let can = false
                    for (let piece of pieces) {
                        if ((piece.color == this.color && (piece.coordinates[0] == move[0] &&  piece.coordinates[1] == move[1]))) {
                            can = true
                        } 
                    }
                    if (!can) {
                        list.push(move)
                    }
                }
                if (check) {
                    let predicte = []
                    for (let piece of pieces) {
                        if (!(piece.coordinates[0] == this.coordinates[0] &&  piece.coordinates[1] == this.coordinates[1])) {
                            predicte.push(piece)
                        }
                    }
                    let newLis = []
                    console.log(list)
                    let i = 0
                    for (let moves of list) {
                        let newBoard = []
                        for (let piece of predicte) {
                            if (!(piece.coordinates[0] == moves[0] && piece.coordinates[1] == moves[1] && piece.color != this.color)) {
                                newBoard.push(piece)
                            }
                        }
                        newBoard.push(new Piece("king", this.color, moves))
                        if (!isCheck(newBoard, this.color)) {
                            newLis.push(moves)
                        }
                    }
                    

                    
                
                    return newLis
                }

                return list
                break;
            case "bishop" :
                let squares = []
                let [a,b] = [this.coordinates[0],this.coordinates[1]]
                while((a >= 0 && b >= 0) && (a < 8 && b < 8)) {
                    if (!(a == this.coordinates[0] && b == this.coordinates[1])) {
                        squares.push([a,b])
                        for (let piece of pieces) {
                            if (a == piece.coordinates[0] && b == piece.coordinates[1]) {
                                a = -10
                                if (piece.color == this.color) {
                                    squares.pop()
                                }
                            }
                        }
                    }
                    a--;
                    b--;
                    
                }
                [a,b] = [this.coordinates[0],this.coordinates[1]]
                while((a >= 0 && b >= 0) && (a < 8 && b < 8)) {
                    if (!(a == this.coordinates[0] && b == this.coordinates[1])) {
                        squares.push([a,b])
                        for (let piece of pieces) {
                            if (a == piece.coordinates[0] && b == piece.coordinates[1]) {
                                a = -10
                                if (piece.color == this.color) {
                                    squares.pop()
                                }
                            }
                        }
                    }
                    a--;
                    b++;
                    
                }
                [a,b] = [this.coordinates[0],this.coordinates[1]]                
                while((a >= 0 && b >= 0) && (a < 8 && b < 8)) {
                    if (!(a == this.coordinates[0] && b == this.coordinates[1])) {
                        squares.push([a,b])
                        for (let piece of pieces) {
                            if (a == piece.coordinates[0] && b == piece.coordinates[1]) {
                                a = -10
                                if (piece.color == this.color) {
                                    squares.pop()
                                }
                            }
                        }
                    }
                    a++;
                    b--;
                    
                }
                [a,b] = [this.coordinates[0],this.coordinates[1]]                
                while((a >= 0 && b >= 0) && (a < 8 && b < 8)) {
                    if (!(a == this.coordinates[0] && b == this.coordinates[1])) {
                        squares.push([a,b])
                        for (let piece of pieces) {
                            if (a == piece.coordinates[0] && b == piece.coordinates[1]) {
                                a = -10
                                if (piece.color == this.color) {
                                    squares.pop()
                                }
                            }
                        }
                    }

                    a++;
                    b++;
                    
                }
                if (check) {
                    let predicte = []
                    let king;
                    for (let piece of pieces) {
                        if (!(piece.coordinates[0] == this.coordinates[0] &&  piece.coordinates[1] == this.coordinates[1])) {
                            predicte.push(piece)
                            if (piece.type == "king" && piece.color == this.color) {
                                king = piece.coordinates
                            }
                        }
                    }
                    let newLis = []
                    for (let moves of squares) {
                        let threath = false
                        predicte.push(new Piece(this.type, this.color, moves))
                        for (let piece of predicte) {
                            if (piece.coordinates[0] == moves[0] && piece.coordinates[1] == moves[1]) {
                            }else {
                                    for (let move of piece.moves(predicte, false)) {
                                        if (move[0] == king[0] && move[1] == king[1]) {
                                            threath = true
                                        }
                                    }
                            }
                        }
                        if (!threath) {
                            newLis.push(moves)
                        }
                        predicte.pop()
                    }


                    
                
                    return newLis
                }
                return squares
                break;
            case "rook":
                let moves = []
                let [x, y] = this.coordinates
                while((x >= 0 && y >= 0) && (x < 8 && y < 8)) {
                    if (!(x == this.coordinates[0] && y == this.coordinates[1])) {
                        moves.push([x,y])
                        for (let piece of pieces) {
                            if (x == piece.coordinates[0] && y == piece.coordinates[1]) {
                                x = -10
                                if (piece.color == this.color) {
                                    moves.pop()
                                }
                            }
                        }
                    }

                    x++;
                }
                [x, y] = this.coordinates
                while((x >= 0 && y >= 0) && (x < 8 && y < 8)) {
                    if (!(x == this.coordinates[0] && y == this.coordinates[1])) {
                        moves.push([x,y])
                        for (let piece of pieces) {
                            if (x == piece.coordinates[0] && y == piece.coordinates[1]) {
                                x = -10
                                if (piece.color == this.color) {
                                    moves.pop()
                                }
                            }
                        }
                    }

                    x--;
                }
                [x, y] = this.coordinates
                while((x >= 0 && y >= 0) && (x < 8 && y < 8)) {
                    if (!(x == this.coordinates[0] && y == this.coordinates[1])) {
                        moves.push([x,y])
                        for (let piece of pieces) {
                            if (x == piece.coordinates[0] && y == piece.coordinates[1]) {
                                x = -10
                                if (piece.color == this.color) {
                                    moves.pop()
                                }
                            }
                        }
                    }

                    y++;
                }
                 [x, y] = this.coordinates
                while((x >= 0 && y >= 0) && (x < 8 && y < 8)) {
                    if (!(x == this.coordinates[0] && y == this.coordinates[1])) {
                        moves.push([x,y])
                        for (let piece of pieces) {
                            if (x == piece.coordinates[0] && y == piece.coordinates[1]) {
                                x = -10
                                if (piece.color == this.color) {
                                    moves.pop()
                                }
                            }
                        }
                    }

                    y--;
                }
                if (check) {
                    let predicte = []
                    let king;
                    for (let piece of pieces) {
                        if (!(piece.coordinates[0] == this.coordinates[0] &&  piece.coordinates[1] == this.coordinates[1])) {
                            predicte.push(piece)
                            if (piece.type == "king" && piece.color == this.color) {
                                king = piece.coordinates
                            }
                        }
                    }
                    let newLis = []
                    for (let movea of moves) {
                        let threath = false
                        predicte.push(new Piece(this.type, this.color, movea))
                        for (let piece of predicte) {
                            if (piece.coordinates[0] == movea[0] && piece.coordinates[1] == movea[1]) {
                            }else {
                                    for (let move of piece.moves(predicte, false)) {
                                        if (move[0] == king[0] && move[1] == king[1]) {
                                            threath = true
                                        }
                                    }
                            }
                        }
                        if (!threath) {
                            newLis.push(movea)
                        }
                        predicte.pop()
                    }


                    
                
                    return newLis
                }
                return moves
                break;
            case "queen":
                let moven =  [new Piece("rook", this.color, this.coordinates).moves(pieces), new Piece("bishop", this.color, this.coordinates).moves(pieces)].flat()
                if (check) {
                    let predicte = []
                    let king;
                    for (let piece of pieces) {
                        if (!(piece.coordinates[0] == this.coordinates[0] &&  piece.coordinates[1] == this.coordinates[1])) {
                            predicte.push(piece)
                            if (piece.type == "king" && piece.color == this.color) {
                                king = piece.coordinates
                            }
                        }
                    }
                    let newLis = []
                    for (let movea of moven) {
                        let threath = false
                        predicte.push(new Piece(this.type, this.color, movea))
                        for (let piece of predicte) {
                            if (piece.coordinates[0] == movea[0] && piece.coordinates[1] == movea[1]) {
                            }else {
                                    for (let move of piece.moves(predicte, false)) {
                                        if (move[0] == king[0] && move[1] == king[1]) {
                                            threath = true
                                        }
                                    }
                            }
                        }
                        if (!threath) {
                            newLis.push(movea)
                        }
                        predicte.pop()
                    }


                    
                
                    return newLis
                }
                return moven
            case "knight":
                let pre = []
                let [an,bn] = this.coordinates
                pre.push([an+2, bn+1])
                pre.push([an+2, bn-1])
                pre.push([an-2, bn+1])
                pre.push([an-2, bn-1])
                pre.push([an+1, bn+2])
                pre.push([an+1, bn-2])
                pre.push([an-1, bn+2])
                pre.push([an-1, bn-2])
                let final = []
                for (let coord of pre) {
                    let illegal = false
                    for (let piece of pieces) {
                        if (piece.color == this.color & (piece.coordinates[0] == coord[0] && piece.coordinates[1] == coord[1])) {
                            illegal = true
                        }
                    }
                    if ((coord[0] >= 0 && coord[0] < 8) && (coord[1] >= 0 && coord[1] < 8) && !illegal) {
                        final.push(coord)
                    } 
                }
                    if (check) {
                    let predicte = []
                    let king;
                    for (let piece of pieces) {
                        if (!(piece.coordinates[0] == this.coordinates[0] &&  piece.coordinates[1] == this.coordinates[1])) {
                            predicte.push(piece)
                            if (piece.type == "king" && piece.color == this.color) {
                                king = piece.coordinates
                            }
                        }
                    }
                    let newLis = []
                    for (let movea of final) {
                        let threath = false
                        predicte.push(new Piece(this.type, this.color, movea))
                        for (let piece of predicte) {
                            if (piece.coordinates[0] == movea[0] && piece.coordinates[1] == movea[1]) {
                            }else {
                                    for (let move of piece.moves(predicte, false)) {
                                        if (move[0] == king[0] && move[1] == king[1]) {
                                            threath = true
                                        }
                                    }
                            }
                        }
                        if (!threath) {
                            newLis.push(movea)
                        }
                        predicte.pop()
                    }


                    
                
                    return newLis
                }
                return final
                break;
            case "pawn":
                let pres = []
                if (this.color == "black") {
                    let ouccupied = false
                    let ouccupiedRight = false
                    let ouccupiedLeft = false 
                    let second = false
                    for (let piece of pieces) {
                        if (((piece.coordinates[0] == this.coordinates[0] && piece.coordinates[1] == this.coordinates[1] + 1))) {
                            ouccupied = true
                        }
                        if (((piece.coordinates[0] == this.coordinates[0] && piece.coordinates[1] == this.coordinates[1] + 2))) {
                            second = true
                        }
                        if (((piece.coordinates[0] == this.coordinates[0] +1 && piece.coordinates[1] == this.coordinates[1] + 1)) && piece.color == "white") {
                            ouccupiedRight = true
                        }
                        if (((piece.coordinates[0] == this.coordinates[0] -1 && piece.coordinates[1] == this.coordinates[1] + 1)) && piece.color == "white") {
                            ouccupiedLeft = true
                        }
                    }
                    if (!ouccupied) {
                        pres.push([this.coordinates[0] , this.coordinates[1] +1 ])
                    }
                    if (ouccupiedRight) {
                        pres.push([this.coordinates[0] + 1, this.coordinates[1] + 1])
                    }
                    if (ouccupiedLeft) {
                        pres.push([this.coordinates[0] - 1, this.coordinates[1] + 1])
    
                    }
                    if (this.coordinates[1] == 1 && !second) {
                       pres.push([this.coordinates[0],3 ]) 
                    }

                } if (this.color == "white") {
                    let ouccupied = false
                    let ouccupiedRight = false
                    let ouccupiedLeft = false 
                    let second
                    for (let piece of pieces) {
                        if (((piece.coordinates[0] == this.coordinates[0] && piece.coordinates[1] == this.coordinates[1] - 1))) {
                            ouccupied = true
                        }
                        if (((piece.coordinates[0] == this.coordinates[0] && piece.coordinates[1] == this.coordinates[1] -2 ))) {
                            second = true
                        }
                        if (((piece.coordinates[0] == this.coordinates[0] +1 && piece.coordinates[1] == this.coordinates[1] - 1)) && piece.color == "black") {
                            ouccupiedRight = true
                        }
                        if (((piece.coordinates[0] == this.coordinates[0] -1 && piece.coordinates[1] == this.coordinates[1] - 1)) && piece.color == "black") {
                            ouccupiedLeft = true
                        }
                    }
                    if (!ouccupied) {
                        pres.push([this.coordinates[0] , this.coordinates[1] -1 ])
                    }
                    if (ouccupiedRight) {
                        pres.push([this.coordinates[0] + 1, this.coordinates[1] - 1])
                    }
                    if (ouccupiedLeft) {
                        pres.push([this.coordinates[0] - 1, this.coordinates[1] - 1])
                    }
                    if ( this.coordinates[1] == 6 && !second) {
                        pres.push([this.coordinates[0], 4])
                    }
                }
                let finals = []
                for (let coord of pres) {
                    if ((coord[0] >= 0 && coord[0] < 8) && (coord[1] >= 0 && coord[1] < 8)) {
                        finals.push(coord)
                    } 
                }
                if (check) {
                    let predicte = []
                    let king;
                    for (let piece of pieces) {
                        if (!(piece.coordinates[0] == this.coordinates[0] &&  piece.coordinates[1] == this.coordinates[1])) {
                            predicte.push(piece)
                            if (piece.type == "king" && piece.color == this.color) {
                                king = piece.coordinates
                            }
                        }
                    }
                    let newLis = []
                    for (let movea of finals) {
                        let threath = false
                        predicte.push(new Piece(this.type, this.color, movea))
                        for (let piece of predicte) {
                            if (piece.coordinates[0] == movea[0] && piece.coordinates[1] == movea[1]) {
                            }else {
                                    for (let move of piece.moves(predicte, false)) {
                                        if (move[0] == king[0] && move[1] == king[1]) {
                                            threath = true
                                        }
                                    }
                            }
                        }
                        if (!threath) {
                            newLis.push(movea)
                        }
                        predicte.pop()
                    }


                    
                
                    return newLis
                }
                return finals
                break;
            default : 
                break;
        }
    }
    move(coords) {
        this.coordinates = coords
        this.hasMoved = true
    }
} 
export function compareCoordinates(coord1, coord2) {
    return (coord1[0] == coord2[0] && coord1[1] == coord2[1])
}
export class Move {
    constructor(type) {
        this.type = type
    }
    resolve(movingPiece, board, starting, ending) {
        if (this.type == "move") {
            let found = false
            let moves = movingPiece.moves(board,true) 
            for (let move of moves) {
                if (compareCoordinates(move, ending)) {
                    found = true
                    movingPiece.move(ending)
                }
            }
            if (!found) {
                console.log("illegal move")
            }
            return board
        }
        if (this.type == "capture") {
            let captured = undefined
            let newBoard = []
            for (let piece of board) {
                if (compareCoordinates(piece.coordinates, ending)) {
                    captured = piece.coordinates
                    console.log("not putting", piece.type, piece.color)
                } else {
                    console.log(ending, piece.coordinates)
                    newBoard.push(piece)
                }
            }
            for (let piece of newBoard) {
                if (compareCoordinates(piece.coordinates, captured)) {
                    console.log("piece not removed")
                }
            }
            if (!(typeof(captured) == "undefined")) {
                let legal = false
                for (let move of movingPiece.moves(board, true)) {
                    if (compareCoordinates(move, ending)) {
                        legal = true
                    }
                }
                for (let piece of newBoard) {
                    if (compareCoordinates(piece.coordinates, captured)) {
                        console.log("piece not removed")
                    }
                }
                if (legal) {
                    movingPiece.move(ending)
                    for (let piece of newBoard) {
                        if (compareCoordinates(piece.coordinates, captured)) {
                            console.log("piece not removed", piece)
                        }
                    }
                } else {
                    console.log("illegal capture")
                }
            } else {
                console.log("did not found captured piece")
                console.log(captured)
            }
            for (let piece of newBoard) {
                if (compareCoordinates(piece.coordinates, captured)) {
                    console.log("piece not removed", piece)
                }
            }
         return newBoard
        }
        if (this.type == "castle") {
            if (compareCoordinates(ending, [6,7])) {
                for (let piece of board) {
                    if (compareCoordinates(piece.coordinates, [4, 7])) {
                        piece.move([6, 7])
                    } else if (compareCoordinates(piece.coordinates, [7, 7])) {
                        piece.move([5,7])
                    }
                }
            }
            if (compareCoordinates(ending, [2,7])) {
                for (let piece of board) {
                    if (compareCoordinates(piece.coordinates, [4, 7])) {
                        piece.move([2, 7])
                    } else if (compareCoordinates(piece.coordinates, [0, 7])) {
                        piece.move([3,7])
                    }
                }
            }
            if (compareCoordinates(ending, [6,0])) {
                for (let piece of board) {
                    if (compareCoordinates(piece.coordinates, [4, 0])) {
                        piece.move([6, 0])
                    } else if (compareCoordinates(piece.coordinates, [7, 0])) {
                        piece.move([5,0])
                    }
                }
            }
            if (compareCoordinates(ending, [2,0])) {
                for (let piece of board) {
                    if (compareCoordinates(piece.coordinates, [4, 0])) {
                        piece.move([2, 0])
                    } else if (compareCoordinates(piece.coordinates, [0, 0])) {
                        piece.move([3,0])
                    }
                }
            }
            return board
        }
    }
}