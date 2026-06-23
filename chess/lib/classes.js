export class Piece {
    constructor(type, color, coordinates) {
        this.type = type
        this.color = color
        this.coordinates = coordinates
        this.toggled = false
    }
    moves(pieces) {
        switch(this.type) {
            case "king" :
                let list = []
                for (let a = 0; a < 8; a++) {
                    for (let b = 0; b < 8; b++) {
                        if (!((Math.abs(a - this.coordinates[0]) > 1 ||Math.abs(b - this.coordinates[1]) > 1 ) || (a == this.coordinates[0] && b == this.coordinates[1]))) {
                            list.push([a, b])
                        }
                    }
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
                                else {
                                    console.log(piece.color)
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
                                else {
                                    console.log(piece.color)
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
                                else {
                                    console.log(piece.color)
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
                                else {
                                    console.log(piece.color)
                                }
                            }
                        }
                    }

                    a++;
                    b++;
                    
                }
                console.log(squares)
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
                                else {
                                    console.log(piece.color)
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
                                else {
                                    console.log(piece.color)
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
                                else {
                                    console.log(piece.color)
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
                                else {
                                    console.log(piece.color)
                                }
                            }
                        }
                    }

                    y--;
                }
                return moves
                break;
            case "queen":
                return [new Piece("rook", this.color, this.coordinates).moves(pieces), new Piece("bishop", this.color, this.coordinates).moves(pieces)].flat()
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
                console.log(final)
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
                        console.log("forward",[this.coordinates[0] , this.coordinates[1] +1 ] )
                    }
                    if (ouccupiedRight) {
                        pres.push([this.coordinates[0] + 1, this.coordinates[1] + 1])
                        console.log("right", [this.coordinates[0] - 1, this.coordinates[1] + 1])
                    }
                    if (ouccupiedLeft) {
                        pres.push([this.coordinates[0] - 1, this.coordinates[1] + 1])
                        console.log("left", [this.coordinates[0] - 1, this.coordinates[1] + 1])
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
                return finals
                break;
            default : 
                break;
        }
    }
    move(coords) {
        this.coordinates = coords
        console.log("moved")
    }
} 