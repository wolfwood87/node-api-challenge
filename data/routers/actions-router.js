const express = require('express')

const Actions = require('../helpers/actionModel.js');

const router = express.Router();

//GET
router.get('/', (req,res) => {
    Actions.get()
        .then(action => {
            res.status(200).json(action)
        })
        .catch(err => {
            res.status(500).json({message: "Error retrieving the actions"})
        })
})

router.get('/:id', validateActionId, (req, res) => {
    res.status(200).json(req.action)
});



//Delete request
router.delete('/:id', validateActionId, (req, res) => {
    const {id} = req.params;

    Actions.remove(id)
        .then(deleted => {
            res.status(204).end()
        })
        .catch(err => {
            res.status(500).json({error: "The action could not be removed."})
        })
})

//Put request
router.put("/:id", validateActionId, (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    Actions.update(id, changes)
        .then(updated => {
            res.status(200).json(updated)
        })
        .catch(err => {
            res.status(500).json({error: "The action information could not be modified."})
        })
})

function validateActionId(req, res, next) {
    // do your magic!
    const {id} = req.params;
    Actions.get(id)
      .then(action => {
        if(action) {
          req.action=action
          next();
        }
        else {
          res.status(404).json({message: "ID does not exist"})
        }
      })
      .catch(err=> {
        res.status(500).json({message: "Exception", err})
      })
  }

module.exports = router;