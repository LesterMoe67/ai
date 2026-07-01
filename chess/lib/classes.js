export class Piece {
    constructor (type, color) {
        this.type = type
        this.color = color
    }
}
export class Sqaure {
    constructor (color, piece) {
        this.color = color
        this.piece = piece
    }
    draw(ctx, coordinates, x, y) {
        if (typeof(this.piece) != "undefined") {
            let img = new Image()
            img.onload = (e) => {
                ctx.drawImage(img, coordinates[0] * 80 + x, coordinates[1] * 80 + y )
            }
            img.src ="./assets/" + this.piece.color + "-" + this.piece.type + ".png"
        }
    }
}
export class Board  {
    constructor() {
        let rows = []
        for (let a = 0; a < 8; a++) {
            rows.push([])
            for (let b = 0; b < 8; b++) {
                rows[a].push(new Sqaure((a + b) % 2 == 0 ? "white" : "black", undefined))
            }
        }
        this.rows = rows
    }
    render(xOffset, yOffset, ctx, black, white) {
        ctx.clearRect(0, 0, 1920, 800)
        for (let a = 0; a < this.rows.length; a++) {
            for (let b = 0; b < this.rows.length; b++ ) {
                ctx.drawImage((this.rows[a][b].color == "white" ? white : black), a*80 + xOffset, b*80 + yOffset )
                this.rows[a][b].draw(ctx, [a,b], xOffset, yOffset)
            }
        }
    }
    spawn(piece, coordinates) {
        this.rows[coordinates[1]][coordinates[0]].piece = piece
    }
    standard() {
        let standardstring = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR"
        let rows = standardstring.split("/")
        for (let a = 0; a < rows.length; a++) {
            let i = 0
            while (i < 8) {
                let char = rows[a][i]
                let piece = undefined
                switch(char) {
                    case "r" :
                        piece = new Piece("rook", "black")
                        break;
                    case "R" :
                        piece = new Piece("rook", "white")
                        break; 
                    case "q" :
                        piece = new Piece("queen", "black")
                        break;
                    case "Q" :
                        piece = new Piece("queen", "white")
                        break;
                    case "k" :
                        piece = new Piece("king", "black")
                        break;
                    case "K" :
                        piece = new Piece("king", "white")
                        break; 
                    case "b" :
                        piece = new Piece("bishop", "black")
                        break;
                    case "B" :
                        piece = new Piece("bishop", "white")
                        break;  
                    case "n" :
                        piece = new Piece("knight", "black")
                        break;
                    case "N" :
                        piece = new Piece("knight", "white")
                        break; 
                    case "p" :
                        piece = new Piece("pawn", "black")
                        break;
                    case "P" :
                        piece = new Piece("pawn", "white")
                        break;
                    default:
                        piece = undefined;
                        i += Number.parseInt(char)                       
                }
                if (typeof(piece) != "undefined") {
                    this.spawn(piece, [a,i])
                    i++
                }
            }
        }
    }
}