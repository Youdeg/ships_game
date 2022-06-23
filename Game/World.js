import Cell from "./Cell.js";
import { EventEmitter } from "events";

class World extends EventEmitter {
    constructor(size) {
        super();
        this.size = size;
        this.field = [];
        for(let y = 1; y !== size + 1; y++){
            this.field.push([])
            for(let x = 1; x !== size + 1; x++) {
                this.field[y - 1].push(new Cell(x, y, "none"));
            }
        }

        this.ships = [];

        setInterval(this.tick.bind(this), 1000);
    }

    tick() {
        for (const ship of this.ships) {
            this.field[ship.y - 1][ship.x - 1].setColor(ship.color);
        }
        this.emit("update");
    }

    newShip(ship) {
        this.ships.push(ship);
    }

    deleteShip(id) {
        this.ships = this.ships.filter(el => el.id !== id);
    }

    warpForSend(ship) {
        const warped = [];
        for(let y = 1; y !== this.size + 1; y++){
            warped.push([])
            for(let x = 1; x !== this.size + 1; x++) {
                warped[y - 1].push(this.field[y - 1][x - 1].warpForSend(ship));
            }
        }
        return warped;
    }
}

export default World

function r(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}