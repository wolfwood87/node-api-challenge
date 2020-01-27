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

router.get('/:id', validateProjectId, (req, res) => {
    res.status(200).json(req.project)
})

//POST request
router.post('/', validateProject, (req, res) => {
    const newProject = req.body
    Projects.insert(newProject)
        .then(project => {
            res.status(201).json(project)
        })
        .catch(err => {
            res.status(500).json({messsage: "There was an error creating the project"})
        })
})

//Delete request
router.delete('/:id', validateProjectId, (req, res) => {
    Projects.remove(req.project.id)
        .then(deleted => {
            res.status(204).end()
        })
        .catch(err => {
            res.status(500).json({error: "The project could not be removed."})
        })
})

//Put request
router.put("/:id", validateProjectId, validateProject, (req, res) => {
    const changes = req.body;
    Projects.update(req.project.id, changes)
        .then(updated => {
            res.status(200).json(updated)
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

router.post('/:id/actions', validateProjectId, validateAction, (req, res) => {
    const newAction = req.body
    newAction.project_id = req.params.id
    Actions.insert(newAction)
        .then(action => {
            res.status(201).json(action)
        })
        .catch(err => {
            res.status(500).json({messsage: "There was an error creating the action"})
        })
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
  function validateProject(req, res, next) {
    const newProject = req.body
  
    if(newProject) {
      if(newProject.name && newProject.description) {
        next();
      }
      else {
        res.status(400).json({message: "missing required name and description"})
      }
    }
    else {
      res.status(400).json({message: "missing project data"})
    }
  }

  function validateAction(req, res, next) {
    const newAction = req.body
  
    if(newAction) {
      if(newAction.description && newAction.notes) {
        next();
      }
      else {
        res.status(400).json({message: "missing required description and notes"})
      }
    }
    else {
      res.status(400).json({message: "missing action data"})
    }
  }

module.exports = router;