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

// GET /api/posts/:id/comments

router.get('/:id/comments', (req, res) => {
    Posts.findPostComments(req.params.id)
        .then(post => {
        if (post) {
            res.status(200).json({ data: post })
        } else {
            res.status(404).json({
                message: 'The post with the specified ID does not exist.'
            })
        }
    })
        .catch(err => {
            console.log(err.post)
            res.status(500).json({
                error: 'The comments information could not be retrieved.'
            })
        })
})

// POST to /api/posts

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

// POST to /api/posts/:id/comments

router.post('/:id/comments', (req, res) => {
    const { text } = req.body;
    const { id: post_id } = req.params;

    if (!req.body.text) {
        return res.status(400).json({
            errorMessage: 'Please provide text for the comment.'
        })
    }
    Posts.insertComment({ text, post_id })
        .then(comment => {
            if (!comment.id) {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist.'
                })
            } else {
                res.status(201).json(comment)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: 'There was an error while saving the comment to the database'
            })
        })
})

// PUT to /api/posts/:id

router.put('/:id', (req, res) => {
    if (!req.body.title || !req.body.contents) {
        return res.status(400).json({
            errorMessage: 'Please provide title and contents for the post.'
        })
    }

    Posts.update(req.params.id, req.body)
        .then(post => {
            if (post) {
                console.log(post)
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

// DELETE to /api/posts/:id

router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json({
                    message: 'The post has been deleted.'
                })
            } else {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist.'
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: 'The post could not be removed.'
            })
        })
})


module.exports = router