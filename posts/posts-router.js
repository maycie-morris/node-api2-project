const express = require('express');
const Posts = require('../data/db');
const router = express.Router();


// GET posts

router.get('/', (req, res) => {
    Posts.find(req.query)
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: 'The post information could not be retrieved.'
            })
        })
})

// GET posts/:id

router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ message: 'The post with the specified ID does not exist.' })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: 'The post information could not be retrieved.'
            })
        })
})

router.post('/', (req, res) => {
    const data = req.body
    Posts.insert(data)
        .then (post => {
            if (post) {
                res.status(201).json(post)
            } else {
                res.status(400).json({ errorMessage: "Please provide title and contents for the post."  })
            }
        })
        .catch (err => {
            console.log(err)
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
})

router.put('/:id', (req, res) => {
    const changes = req.body;
    
    Posts.update(req.params.id, changes)
        .then(post => {
            if (!post.title || !post.contents) {
                res.status(400).json({
                    errorMessage: 'Please provide title and contents for the post.'
                })
            } else if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist.'
                })
            }
        }) 
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: 'The post information could not be modified.'
            })
        })
    }) 

module.exports = router