const express = require('express')
const passport = require('passport')

const HealthDate = require('../models/healthDate')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX of MY health dates
// GET /healthDates
router.get('/dates', requireToken, (req, res, next) => {
	HealthDate.find({ owner: req.user.id }).sort( { dateString: 1 })
		.then((healthDates) => {
			return healthDates.map((d) => d.toObject())
		})
		// respond with status 200 and JSON of the examples
		.then((healthDates) => res.status(200).json({ healthDates: healthDates }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// SHOW
// GET /healthDates/5a7db6c74d55bc51bdf39793
router.get('/dates/:id', requireToken, (req, res, next) => {

	HealthDate.findById(req.params.id)
		.then(handle404)
		.then((healthDate) => res.status(200).json({ healthDate: healthDate.toObject() }))
		.catch(next)
})

// CREATE
// POST /dates
router.post('/dates', requireToken, (req, res, next) => {

	req.body.healthDate.owner = req.user.id
	HealthDate.create(req.body.healthDate)
		.then((healthDate) => {
			res.status(201).json({ healthDate: healthDate.toObject() })
		})
		.catch(next)
})

module.exports = router
