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
            ship.tick();

            if (ship.shot.x === 0) continue;
            ship.shot.count -= 1;
            if (!ship.shot.count) {
                ship.shots += 1;
                for (const target of this.ships) {
                    if (target.inCell(ship.shot.x, ship.shot.y)) {
                        target.health -= 1;

                        if (target.health <= 0) {
                            target.socket.emit("dead");
                            this.deleteShip(target);
                        }

                        if (ship.color === target.color) {
                            ship.badShots += 1;
                        } else {
                            ship.goodShots += 1;
                        }
                    }
                }
                ship.shot = {x: 0, y: 0, count: 0}
            }
        }


        this.emit("update");
    }

    newShip(ship) {
        this.ships.push(ship);
    }

    deleteShip(id) {
        this.ships = this.ships.filter(el => el.id !== id);
    }

    warpForSend(playerShip) {
        const warped = [];
        for(let y = 1; y !== this.size + 1; y++){
            warped.push([])
            for(let x = 1; x !== this.size + 1; x++) {
                let color = "none";
                for (const ship of this.ships) {
                    if (!ship.seeShip(playerShip)) continue;
                    if (ship.inCell(x, y)) {
                        color = ship.color;
                        color = (x === ship.x && y === ship.y && ship.color === "red") ? "rgb(133, 13, 13)" : color;
                        color = (x === ship.x && y === ship.y && ship.color === "green") ? "rgb(23,88,8)" : color;
                        break;
                    }
                }
                warped[y - 1].push(new Cell(x, y, color).warpForSend());
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