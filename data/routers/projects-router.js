const express = require('express')

const Projects = require('../helpers/projectModel.js');

const router = express.Router();

//GET
router.get('/', (req,res) => {
    Projects.get()
        .then(project => {
            res.status(200).json(project)
        })
        .catch(err => {
            res.status(500).json({message: "Error retrieving the projects"})
        })
})

router.get('/:id', (req, res) => {
    const {id} = req.params;
    Projects.get(id)
        .then(project => {
            if(project) {
                res.status(201).json(project)
            }
            else {
                res.status(404).json({message: "The project with the specified ID does not exist"})
            }     
        })
        .catch(err => {
            res.status(500).json({message: "The project information could not be retrieved"})
        })
})

module.exports = router;