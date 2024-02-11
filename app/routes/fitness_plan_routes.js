const express = require('express')
const passport = require('passport')

const HealthDate = require('../models/healthDate')

const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// CREATE fitness plan - must include a type: ClassPlan or type: ExercisePlan
// POST /fitness/5a7db6c74d55bc51bdf39793
router.post('/fitness/:healthDateId', requireToken, (req, res, next) => {

    const fitnessPlan = req.body.fitnessPlan
    const healthDateId = req.params.healthDateId
    console.log('fitnessPlan = ', fitnessPlan)
    console.log('healthDateId = ', healthDateId)

	HealthDate.findById(healthDateId)
        .then(handle404)
        .then((healthDate) => {
            requireOwnership(req, healthDate)
            healthDate.fitnessPlans.push(fitnessPlan)
            return healthDate.save()
        })
		.then((healthDate) => res.status(201).json({ healthDate: healthDate.toObject() }))
		.catch(next)
})

module.exports = router
