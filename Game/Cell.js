class Cell {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    setColor(color) {
        this.color = color;
    }

    warpForSend(ship) {
        let color = this.color;
        if (this.x === ship.x && this.y === ship.y) color = "green"
        return {x: this.x, y:  this.y, color: color};
    }
}

export default Cell