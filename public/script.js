let to = null;
let socket;
let shot = {x: 0, y: 0, count: 0}

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

const App = new World(10);

let canvas, ctx;

window.onload = function () {
    canvas = document.getElementsByClassName("game")[0];
    ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    socket = io();

    canvas.addEventListener('mouseup', function (e) {
        let x = e.pageX - e.target.offsetLeft,
            y = e.pageY - e.target.offsetTop;

        for (let i = 1; i <= App.size; i++) {
            const j = i * canvas.height / App.field.length;
            if (x <= j) {
                x = i;
                break
            }
        }

        for (let i = 1; i <= App.size; i++) {
            const j = i * canvas.height / App.field.length;
            if (y <= j) {
                y = i;
                break
            }
        }

        shot = {x: x, y: y, count: 3}
        document.getElementsByClassName("shot")[0].innerHTML = `(${shot.x};${shot.y}) через ${shot.count} ходов`;
        socket.emit("shot", x, y);
    });

    socket.on("updateWorld", (field, wantTo, shotTo, info) => {
        App.updateField(field);
        updateField(ctx, canvas);

        if (wantTo === null) {
            document.getElementsByClassName("left")[0].classList.remove("red");
            document.getElementsByClassName("right")[0].classList.remove("red");
            to = null;
        }

        shot = shotTo
        document.getElementsByClassName("shot")[0].innerHTML = `(${shot.x};${shot.y}) через ${shot.count} ходов`;
        document.getElementsByClassName("health")[0].innerHTML = `ЗДОРОВЬЕ - ${info.health}/${info.maxHealth} ед.`;
        document.getElementsByClassName("shots")[0].innerHTML = `ВЫСТРЕЛЫ/ХОРОШИЕ/ПЛОХИЕ - ${info.shots}/${info.goodShots}/${info.badShots}`;
    })

    socket.on("dead", () => {
        alert("Вы проиграли!");
        socket.disconnect();
    })

    updateField(ctx, canvas);
}

function updateField(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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

            ctx.beginPath();
            ctx.fillStyle = 'black';
            ctx.font = "16px serif";
            ctx.fillText(`(${x};${y})`, (canvas.width / App.field[y - 1].length * (x - 1)) + 3, (canvas.height / App.field.length * (y - 1)) + 15);
            ctx.closePath();
        }
    }
}

function right() {
    if (to === "right") {
        document.getElementsByClassName("right")[0].classList.remove("red");
        to = "null";
        socket.emit("wantTo", to);
        return;
    }
    document.getElementsByClassName("left")[0].classList.remove("red");
    document.getElementsByClassName("right")[0].classList.add("red");

    to = "right";
    socket.emit("wantTo", to);
}

function left() {
    if (to === "left") {
        document.getElementsByClassName("left")[0].classList.remove("red");
        to = "null";
        socket.emit("wantTo", to);
        return;
    }
    document.getElementsByClassName("right")[0].classList.remove("red");
    document.getElementsByClassName("left")[0].classList.add("red");

    to = "left";
    socket.emit("wantTo", to);
}