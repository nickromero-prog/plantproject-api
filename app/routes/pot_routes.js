const express = require('express')

const passport = require('passport')

const Pot = require('../models/pot')

// this helps us find where to throw custom customErrors
const customErrors = require('../../lib/custom_errors')
// well use this to send (404) when the right "document" isnt sent
const handle404 = customErrors.handle404
// pulled from custom errors above, we use this when someone is
// attempting to alter a plant that is not theirs
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { plant: { name: '', light: 'medium' } } -> { plant: { text: 'medium' } }
// const removeBlanks = require('../../lib/remove_blank_fields')

// pass as second argument to routes to require
// a token passage for the route to become available
// also sets 'req.user'
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router which is a mini api that only handles routes
const router = express.Router()

// CREATE POT ROUTE
router.post('/pots', requireToken, (req, res, next) => {
  // set the owner of new pot to be current user
  req.body.pot.owner = req.user.id

  Pot.create(req.body.pot)
  // respond to successful create with 201 and json of pot
    .then(pot => {
      res.status(201).json({ pot: pot.toObject() })
    })
    // if an error happens, send it to the error handler so it
    // can include the object in its response
    .catch(next)
})

// GET SHOW POT ROUTE
router.get('/pots/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the
  // :id in the route
  Pot.findById(req.params.id)
    .then(handle404)
    // if you can find by id, respond (200)
    // and send the client some json
    .then(pot => res.status(200).json({ pot: pot }))
    // if error, pass to handler
    .catch(next)
})

router.get('/pots', requireToken, (req, res, next) => {
  // find all the pots
  Pot.find({ owner: req.user.id })
    .then(pots => {
      // pots will be an array of mongoose documents
      // we want to convert each one to a plain old javascript
      // object so we use .map to apply .toObject to each one
      return pots.map(pot => pot.toObject())
    })
  // respond with (200) and json on pots
    .then(pots => res.status(200).json({ pots: pots }))
    // on error send to handler
    .catch(next)
})

// Delete POT
router.delete('pots/:id', requireToken, (req, res, next) => {
  Pot.findById(req.params.id)
    .then(handle404)
    .then(pot => {
      // throw error if they dont own the pot
      requireOwnership(req, pot)
      pot.deleteOne()
    })
    // send back (204) with no need for JSON
    .then(() => res.sendStatus(204))
    // send to error handler on errors
    .catch(next)
})

// PATCH update pots route
router.patch('/pots/:id', requireToken, (req, res, next) => {
  Pot.findById(req.params.id)
    .then(handle404)
    .then(pot => {
      requireOwnership(req, pot)
      return pot.updateOne(req.body.pot)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
