const express = require('express')

const Projects = require('../helpers/projectModel.js');
const Actions = require('../helpers/actionModel.js');
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

//POST request
router.post('/', (req, res) => {
    const newProject = req.body
    if(newProject.name && newProject.description) {
        Projects.insert(newProject)
            .then(project => {
                res.status(201).json(project)
            })
            .catch(err => {
                res.status(500).json({messsage: "There was an error creating the project"})
            })
    }
    else {
        res.status(400).json({message: "Please provide the name and description for the project"})
    }
})

//Delete request
router.delete('/:id', (req, res) => {
    const {id} = req.params;

    Projects.remove(id)
        .then(deleted => {
            if(deleted) {
                res.status(204).end()
            }
            else {
                res.status(404).json({message: "The project with the specified ID does not exist"})
            }
        })
        .catch(err => {
            res.status(500).json({error: "The project could not be removed."})
        })
})

//Put request
router.put("/:id", (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    Projects.update(id, changes)
        .then(updated => {
            if(updated) {
                if(changes.name && changes.description) {
                    res.status(200).json(updated)
                }
                else{
                    res.status(400).json({errorMessage: "Please provide a name and description."})
                }
            }
            else {
                res.status(404).json({message: "The project with the specified ID does not exist."})
            }
        })
        .catch(err => {
            res.status(500).json({error: "The project information could not be modified."})
        })
})


//get and post actions
router.get('/:id/actions', validateProjectId, (req, res) => {
    Projects.getProjectActions(req.project.id)
      .then(actions => {
        res.status(200).json(actions)
      })
      .catch(err => {
        res.status(500).json({message: "error retrieving the actions."})
      })
  });

router.post('/:id/actions', validateProjectId, (req, res) => {
    const newAction = req.body
    newAction.project_id = req.params.id
    if(newAction.description && newAction.notes) {
        Actions.insert(newAction)
            .then(action => {
                res.status(201).json(action)
            })
            .catch(err => {
                res.status(500).json({messsage: "There was an error creating the action"})
            })
    }
    else {
        res.status(400).json({message: "Please provide the desription and notes for the action"})
    }
  });
 
  
//validate ProjectID middleware
function validateProjectId(req, res, next) {
    const {id} = req.params;
    Projects.get(id)
      .then(project => {
        if(project) {
          req.project=project
          next();
        }
        else {
          res.status(404).json({message: "ID does not exist"})
        }
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({message: "Exception", err})
      })

  }
module.exports = router;