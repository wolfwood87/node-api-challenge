const express = require('express');
const projectRouter = require('./data/routers/projects-router.js');
const helmet = require('helmet')

const server = express();

server.use(express.json());

server.use('/api/projects', projectRouter)


module.exports = server;