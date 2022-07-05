"use strict";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
import localtunnel from 'localtunnel';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

global.worldSize = 10;

import World from "./Game/World.js";
const world = new World(global.worldSize, global.worldSize);

app.use(cors({credentials: true, origin: true}));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.get("/", (req, res) => {
    res.sendFile(__dirname, '/index.html');
})

import Ship from "./Game/Ship.js";

io.on('connection', (socket) => {
    const ship = new Ship(r(1, 10), r(1, 10), r(1, 5), r(1, 2));
    ship.socket = socket;
    world.newShip(ship);

    socket.emit("updateWorld", world.warpForSend(ship), ship.wantTo, ship.shot, {health: ship.health, maxHealth: ship.size,
        goodShots: ship.goodShots, badShots: ship.badShots, shots: ship.shots});

    socket.on("wantTo", (to) => {
        ship.wantTo = to;
    })

    socket.on("shot", (x, y) => {
        ship.shot = {x: x, y: y, count: 4};
    })

    world.on("update", () => {
        socket.emit("updateWorld", world.warpForSend(ship), ship.wantTo, ship.shot, {health: ship.health, maxHealth: ship.size,
            goodShots: ship.goodShots, badShots: ship.badShots, shots: ship.shots});
    })

    socket.on( "disconnect", () => {
        world.deleteShip(ship.id);
    })
});


server.listen(5000, async () => {
    await (async () => {
        const tunnel = await localtunnel({port: 5000});

        console.log(tunnel.url);

        tunnel.on('close', () => {
            // tunnels are closed
        });
    })();

    console.log('listening on *:5000');
});

function r(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}
