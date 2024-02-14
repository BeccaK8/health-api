const mongoose = require('mongoose')

const { fitnessPlanSchema, classPlanSchema, exercisePlanSchema } = require('./fitnessPlan')
/*
overallFocusAreas: Strength, Endurance, Recovery
const fitnessFocusAreas = [
    { name: 'Strength', description: 'Strength training to strengthen the body', color: '#FFCCCC', subAreas: [ 'Total Body', 'Upper Body', 'Lower Body'] },
    { name: 'Cardio', description: 'Cardio training to strengthen the body', color: 'FFCC99', subAreas: [] },
    { name: 'Core', description: 'Core training to strengthen the body', color: '#CCCCFF', subAreas: [] },
    { name: 'Recovery', description: 'Recovery training to strengthen the body', color: 'CCFF99', subAreas: [] },
]
*/

const healthDateSchema = new mongoose.Schema(
	{
        dateString: {
            type: String,
            required: true,
        },
		goalStatement: {
            type: String,
		},
		focusArea: {
            type: String,
            required: true,
            enum: ['Strength', 'Endurance', 'Recovery']
        },
        fitnessPlans: [fitnessPlanSchema],
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
	},
	{
		timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
	}
)

// set up discriminators for fitness plans
healthDateSchema.path('fitnessPlans').discriminator('ClassPlan', classPlanSchema)
healthDateSchema.path('fitnessPlans').discriminator('ExercisePlan', exercisePlanSchema)

const getFormattedHealthDate = (aDate) => {
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(aDate)
    const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(aDate)
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(aDate)
    return `${year}-${month}-${day}`
}

// A date can only be planned if it is today or in the future
healthDateSchema.virtual('isPlannable').get(function() {
    return this.dateString >= getFormattedHealthDate(new Date())
})

// A date can only be tracked (logged) if it is today or in the future
healthDateSchema.virtual('isTrackable').get(function() {
    return this.dateString <= getFormattedHealthDate(new Date())
})

module.exports = mongoose.model('HealthDate', healthDateSchema)