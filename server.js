const express = require('express');
const projectRouter = require('./data/routers/projects-router.js');
const actionRouter = require('./data/routers/actions-router.js');
const helmet = require('helmet')

const server = express();

server.use(express.json());

server.use('/api/projects', projectRouter)
server.use('/api/projects/:id/actions', actionRouter)

module.exports = server;