const express = require('express');

const postsRouter = require('./posts/posts-router')

const server = express();


server.use(express.json());

server.get('/', (req, res) => {
    res.send(`
    <h2>Pooooooooosts, am I right?</h2>
    <p>Here's some posts and messages</p>
    `)
});

server.use('/api/posts', postsRouter)

server.listen(4000, () => {
    console.log('Server is running')
})