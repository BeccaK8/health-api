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
// GET /dates
router.get('/dates', requireToken, (req, res, next) => {
	HealthDate.find({ owner: req.user.id }).sort( { dateString: 1 })
		.then((healthDates) => {
			return healthDates.map((d) => d.toObject())
		})
		.then((healthDates) => res.status(200).json({ healthDates: healthDates }))
		.catch(next)
})

// SHOW
// GET /dates/5a7db6c74d55bc51bdf39793
router.get('/dates/:id', requireToken, (req, res, next) => {

	HealthDate.findById(req.params.id)
		.then(handle404)
		.then((healthDate) => res.status(200).json({ healthDate: healthDate.toObject() }))
		.catch(next)
})

// SHOW
// GET /dates/byDate/2024-02-09
router.get('/dates/byDate/:dateStr', requireToken, (req, res, next) => {
    console.log('make it here!!!')
    console.log('req.params.dateStr = ', req.params.dateStr)
    console.log('req.user = ', req.user)
	HealthDate.findOne({ 'dateString': req.params.dateStr, owner: req.user })
		.then((healthDate) => res.status(200).json({ healthDate: healthDate ? healthDate.toObject() : {} }))
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

// UPDATE
// PATCH /dates/5a7db6c74d55bc51bdf39793
router.patch('/dates/:id', requireToken, removeBlanks, (req, res, next) => {
	delete req.body.healthDate.owner

	HealthDate.findById(req.params.id)
		.then(handle404)
		.then((healthDate) => {
			requireOwnership(req, healthDate)
			return healthDate.updateOne(req.body.healthDate)
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})

// DESTROY
// DELETE /dates/5a7db6c74d55bc51bdf39793
router.delete('/dates/:id', requireToken, (req, res, next) => {
	HealthDate.findById(req.params.id)
		.then(handle404)
		.then((healthDate) => {
			requireOwnership(req, healthDate)
			// delete the healthDate ONLY IF the above didn't throw
			healthDate.deleteOne()
		})
		// send back 204 and no content if the deletion succeeded
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

module.exports = router
