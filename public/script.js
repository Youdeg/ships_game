class Cell {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }
}

class World {
    constructor(size) {
        this.size = size;
        this.field = [];
        for(let y = 1; y !== size + 1; y++){
            this.field.push([])
            for(let x = 1; x !== size + 1; x++) {
                this.field[y - 1].push(new Cell(x, y, "none"));
            }
        }
    }

    updateField(field) {
        this.field = [];
        for(let y = 1; y !== this.size + 1; y++){
            this.field.push([])
            for(let x = 1; x !== this.size + 1; x++) {
                this.field[y - 1].push(new Cell(field[y - 1][x - 1].x, field[y - 1][x - 1].y, field[y - 1][x - 1].color));
            }
        }
    }
}

const App = new World(10, 10);

let canvas, ctx;

window.onload = function () {
    canvas = document.getElementsByClassName("game")[0];
    ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const socket = io();

    socket.on("updateWorld", (field) => {
        App.updateField(field);
        updateField(ctx, canvas);
    })

    updateField(ctx, canvas);
}

function updateField(ctx, canvas) {
    for (let y = 1; y !== App.field.length + 1; y++) {
        for (let x = 1; x !== App.field[y - 1].length + 1; x++) {
            ctx.beginPath();

            ctx.moveTo(canvas.width / App.field[y - 1].length * (x - 1), canvas.height / App.field.length * (y - 1));
            ctx.lineTo(canvas.width / App.field[y - 1].length * x, canvas.height / App.field.length * (y - 1)); // линия вправо
            ctx.lineTo(canvas.width / App.field[y - 1].length * x, canvas.height / App.field.length * y); // линия вниз
            ctx.lineTo(canvas.width / App.field[y - 1].length * (x - 1), canvas.height / App.field.length * y); // линия влево
            ctx.strokeStyle = 'black'; // тёмно-синий цвет
            ctx.lineWidth = 3; // толщина линии в 5px
            ctx.closePath(); // смыкание начала и конца рисунка (левая стена)

            if (App.field[y - 1][x - 1].color !== "none") {
                ctx.fillStyle = App.field[y - 1][x - 1].color;
                ctx.fill();
            }
            ctx.stroke();
        }
    }
}