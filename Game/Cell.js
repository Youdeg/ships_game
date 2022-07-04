class Cell {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    setColor(color) {
        this.color = color;
    }

    warpForSend() {
        let color = this.color;
        return {x: this.x, y:  this.y, color: color};
    }
}

export default Cell