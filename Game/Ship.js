class Ship {
    constructor(x, y, size, color, to = "left") {
        this.id = Date.now() + r(1, 2000);
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.to = to;
    }
}

export default Ship

function r(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}