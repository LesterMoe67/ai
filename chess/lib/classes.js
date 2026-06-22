export class Piece {
    constructor(type, color, coordinates) {
        this.type = type
        this.color = color
        this.coordinates = coordinates
    }
    moves() {
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
                    }
                    a--;
                    b--;
                    
                }
                [a,b] = [this.coordinates[0],this.coordinates[1]]
                while((a >= 0 && b >= 0) && (a < 8 && b < 8)) {
                    if (!(a == this.coordinates[0] && b == this.coordinates[1])) {
                        squares.push([a,b])
                    }
                    a--;
                    b++;
                    
                }
                [a,b] = [this.coordinates[0],this.coordinates[1]]                
                while((a >= 0 && b >= 0) && (a < 8 && b < 8)) {
                    if (!(a == this.coordinates[0] && b == this.coordinates[1])) {
                        squares.push([a,b])
                    }
                    a++;
                    b--;
                    
                }
                [a,b] = [this.coordinates[0],this.coordinates[1]]                
                while((a >= 0 && b >= 0) && (a < 8 && b < 8)) {
                    if (!(a == this.coordinates[0] && b == this.coordinates[1])) {
                        squares.push([a,b])
                    }
                    a++;
                    b++;
                    
                }
                console.log(squares)
                return squares
                break;
            case "rook":
                let moves = []
                for (let a = 0; a <  8; a++) {
                    for (let b = 0; b < 8; b++) {
                        if ((a == this.coordinates[0] || b == this.coordinates[1]) && !(a == this.coordinates[0] && b == this.coordinates[1])){
                            moves.push([a,b])
                    
                        }
                    }
                }
                return moves
                break;
            case "queen":
                return [new Piece("rook", this.color, this.coordinates).moves(), new Piece("bishop", this.color, this.coordinates).moves()].flat()
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
                    if ((coord[0] >= 0 && coord[0] < 8) && (coord[1] >= 0 && coord[1] < 8)) {
                        final.push(coord)
                    } 
                }
                console.log(final)
                return final
                break;
            case "pawn":
                let pres = []
                if (this.color == "black") {
                    pres.push([this.coordinates[0] , this.coordinates[1] +1 ])
                } if (this.color == "white") {
                    pres.push([this.coordinates[0]  , this.coordinates[1] -1 ])                  
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
} 