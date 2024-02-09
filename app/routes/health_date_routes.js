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
	HealthDate.find().sort( { date: 1 })
		.then((dates) => {
			return dates.map((d) => d.toObject())
		})
		// respond with status 200 and JSON of the examples
		.then((dates) => res.status(200).json({ dates: dates }))
		// if an error occurs, pass it to the handler
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
