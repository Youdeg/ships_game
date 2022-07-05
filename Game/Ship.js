class Ship {
    constructor(x, y, size, team, to = "up") {
        this.id = Date.now() + r(1, 2000);
        this.x = x;
        this.y = y;
        this.size = size;
        this.team = team;
        this.to = to;
        this.wantTo = null;
        this.shot = {x: 0, y: 0, count: 0};
        this.health = this.size;
        this.goodShots = 0;
        this.badShots = 0;
        this.shots = 0;
    }

    tick() {
        switch (this.wantTo) {
            case "right": //по часовой
                switch (this.to) {
                    case "right":
                        this.to = "down";
                        break;
                    case "down":
                        this.to = "left";
                        break;
                    case "left":
                        this.to = "up";
                        break;
                    case "up":
                        this.to = "right";
                        break;
                }
                break
            case "left": //против часовой
                switch (this.to) {
                    case "right":
                        this.to = "up";
                        break;
                    case "up":
                        this.to = "left";
                        break;
                    case "left":
                        this.to = "down";
                        break;
                    case "down":
                        this.to = "right";
                        break;
                }
                break;
        }

        this.wantTo = null;

        switch (this.to) {
            case "left":
                this.x -= 1;
                if (this.x <= 0) this.x = global.worldSize;
                return;
            case "right":
                this.x += 1;
                if (this.x > global.worldSize) this.x = 1;
                return;
            case "up":
                this.y -= 1;
                if (this.y <= 0) this.y = global.worldSize;
                return;
            case "down":
                this.y += 1;
                if (this.y > global.worldSize) this.y = 1;
                return;
        }
    }

    inCell(x, y) {
        const shipCells = []

        switch (this.to) {
            case "left":
                shipCells.push({x: this.x, y: this.y})
                for (let i = 1; i <= this.size - 1; i++) {
                    let x = this.x + i;
                    if (x > global.worldSize) {
                        x -= global.worldSize;
                    }
                    shipCells.push({x: x, y: this.y});
                }
                break
            case "right":
                shipCells.push({x: this.x, y: this.y})
                for (let i = 1; i <= this.size - 1; i++) {
                    let x = this.x - i;
                    if (x <= 0) {
                        x += global.worldSize;
                    }
                    shipCells.push({x: x, y: this.y});
                }
                break
            case "up":
                shipCells.push({x: this.x, y: this.y})
                for (let i = 1; i <= this.size - 1; i++) {
                    let y = this.y + i;
                    if (y > global.worldSize) {
                        y -= global.worldSize;
                    }
                    shipCells.push({x: this.x, y: y});
                }
                break
            case "down":
                shipCells.push({x: this.x, y: this.y})
                for (let i = 1; i <= this.size - 1; i++) {
                    let y = this.y - i;
                    if (y <= 0) {
                        y += global.worldSize;
                    }
                    shipCells.push({x: this.x, y: y});
                }
                break
        }

        for (const shipCell of shipCells) {
            if (shipCell.x === x && shipCell.y === y) {
                return true;
            }
        }

        return false;
    }

    seeShip(ship) {
        if (this.team === ship.team) return true;
        const len = Math.ceil(Math.sqrt(Math.pow(this.x - ship.x, 2) + Math.pow(this.y - ship.y, 2)));
        if (len <= 3) return true;
        return false;
    }
}

export default Ship

function r(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}