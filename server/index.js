const session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const cors = require('cors');

const server = express();
const db = require('./data/db');

server.use(express.json());
server.use(cors());

const PORT = 5000

server.get('/notes', (req, res) => {
    db('notes')
    .select('id', 'title', 'content')
    .then(notes => {
        res.json(notes);
    })
    .catch(err => res.send(err));

})

server.post('/addnote', function(req, res) {
    const note = req.body;

    db('notes')
    .insert(note)
    .then(function(ids) {
        db('notes')
        .where({id: ids[0]})
        .first()
        .then(note => {
            res.send(`New note added, ${note.title}!`)
        });
    })
    .catch(function(error) {
        res.status(500).json({ error});
    })
})

server.get('/notes/:id', (req, res) =>{
    const id = req.params.id;
    db('notes')
    .where({id})
    
    .then(response => {
        res.status(200).json(response)
    })
    .catch(() => {
        res.status(500).json({error})
    })
})

server.delete('/notes/:id', (req, res) => {
    const id = req.params.id;
    db('notes')
    .where({id})
    .del()
    .then(response => {
        res.status(200).json(response)
    })
    .catch(() => {
        res.status(500).json({error})
    })
})

server.put('/notes/:id', (req, res) => {
    const note = req.body;
    const { id } = req.params;
    db('notes')
        .where({ id })
        .update({ title: note.title, content: note.content })
        .into('notes')
        .then(note => {
            if (note){
                res.status(200).json(note)
            } else {
                res.status(404).json({ message: 'The note with the specified ID could not be found' })
            }
        })
})




server.listen(PORT, () => {
    console.log(`Server up and running on ${PORT} m8`)
})