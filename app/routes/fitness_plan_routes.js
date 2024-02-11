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

    const healthDateId = req.params.healthDateId
    const fitnessPlan = req.body.fitnessPlan

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

// UPDATE fitness plan
// PATCH /fitness/5a7db6c74d55bc51bdf39793/65c8dd91771a0594e0163f5a
router.patch('/fitness/:healthDateId/:fitnessPlanId', requireToken, (req, res, next) => {

    const { healthDateId, fitnessPlanId } = req.params

	HealthDate.findById(healthDateId)
        .then(handle404)
        .then((healthDate) => {
            requireOwnership(req, healthDate)
            const theFitnessPlan = healthDate.fitnessPlans.id(fitnessPlanId)
            theFitnessPlan.set(req.body.fitnessPlan)
            return healthDate.save()
        })
		.then(() => res.sendStatus(204))
		.catch(next)
})

// DESTROY fitness plan
// DELETE /fitness/5a7db6c74d55bc51bdf39793/65c8dd91771a0594e0163f5a
router.delete('/fitness/:healthDateId/:fitnessPlanId', requireToken, (req, res, next) => {

    const { healthDateId, fitnessPlanId } = req.params

	HealthDate.findById(healthDateId)
        .then(handle404)
        .then((healthDate) => {
            requireOwnership(req, healthDate)
            const theFitnessPlan = healthDate.fitnessPlans.id(fitnessPlanId)
            theFitnessPlan.deleteOne()
            return healthDate.save()
        })
		.then(() => res.sendStatus(204))
		.catch(next)
})

module.exports = router
