const express = require("express");

const postsRouter = require("../data/posts-router");

const server = express();

server.use(express.json());

server.get("/", (request, response) => {
    response.send(`
    <h2>Moo!</h>
    <p>Get mooed on!</p>
    `);
})

server.use("/api/posts", postsRouter);

module.exports = server;