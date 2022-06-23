"use strict";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import World from "./Game/World.js";
const world = new World(10, 10);

app.use(cors({credentials: true, origin: true}));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
    res.sendFile(__dirname, '/index.html');
})

import Ship from "./Game/Ship.js";

io.on('connection', (socket) => {
    const ship = new Ship(r(1, 10), r(1, 10), 1, "red");
    world.newShip(ship);

    socket.emit("updateWorld", world.warpForSend(ship));

    world.on("update", () => {
        socket.emit("updateWorld", world.warpForSend(ship));
    })

    socket.on( "disconnect", () => {
        world.deleteShip(ship.id);
    })
});


server.listen(5000, async () => {
    console.log('listening on *:5000');
});

function r(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}
