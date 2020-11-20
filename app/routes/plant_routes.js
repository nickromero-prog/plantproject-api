const express = require('express')

const passport = require('passport')

const Plant = require('../models/plant')

// this helps us find where to throw custom errors
const customErrors = require('../../lib/custom_errors')
// we'll use this to send (404) when the right "document" isn't sent
const handle404 = customErrors.handle404

// pulled from custom errors above, we use this when someone is
// attempting to alter a plant that is not theirs
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
const removeBlanks = require('../../lib/remove_blank_fields')

// pass as second argument to routes to require
// a token passage for the route to become available
// also sets 'req.user'
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router which is a mini api that only handles routes
const router = express.Router()

// CREATE PLANT ROUTE
router.post('/plants', requireToken, (req, res, next) => {
  // set owner of new plant to be current user
  req.body.plant.owner = req.user.id

  Plant.create(req.body.plant)
  // respond to successful create with 201 and json of plant
    .then(plant => {
      res.status(201).json({ plant: plant.toObject() })
    })
    // if an error happens, send it to the error handler so it
    // can include the object in its response
    .catch(next)
})

// GET SHOW PLANT ROUTE
router.get('/plants/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the
  // :id in the route
  Plant.findById(req.params.id)
    .then(handle404)
    // if you can find by id, respond (200)
    // and send the client some json
    .then(plant => res.status(200).json({ plant: plant }))
    // if error, pass to handler
    .catch(next)
})

// GET INDEX /plants
router.get('/plants', requireToken, (req, res, next) => {
  // find all the plants
  Plant.find({ owner: req.user.id })
    .then(plants => {
      // plants will be an array of mongoose documents
      // we want to convert each one to a plain old javascript
      // object so we use .map to apply .toObject to each one
      return plants.map(plant => plant.toObject())
    })
  // respond with (200) and json on plants
    .then(plants => res.status(200).json({ plants: plants }))
    // on error, send to handler
    .catch(next)
})

// DESTROY DELETE /plants:id
router.delete('/plants/:id', requireToken, (req, res, next) => {
  Plant.findById(req.params.id)
    .then(handle404)
    .then(plant => {
      // throw error if they dont own plant
      requireOwnership(req, plant)
      plant.deleteOne()
    })
    // send back (204) with no need for JSON
    .then(() => res.sendStatus(204))
    // send to error handler on errors
    .catch(next)
})

// PATCH /plants:id
router.patch('/plants/:id', requireToken, (req, res, next) => {
  Plant.findById(req.params.id)
    .then(handle404)
    .then(plant => {
      requireOwnership(req, plant)
      return plant.updateOne(req.body.plant)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
