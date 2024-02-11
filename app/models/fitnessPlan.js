const mongoose = require('mongoose')

/*
overallFocusAreas: Strength, Endurance, Recovery
const fitnessFocusAreas = [
    { name: 'Strength', description: 'Strength training to strengthen the body', color: '#FFCCCC', subAreas: [ 'Total Body', 'Upper Body', 'Lower Body'] },
    { name: 'Cardio', description: 'Cardio training to strengthen the body', color: 'FFCC99', subAreas: [] },
    { name: 'Core', description: 'Core training to strengthen the body', color: '#CCCCFF', subAreas: [] },
    { name: 'Recovery', description: 'Recovery training to strengthen the body', color: 'CCFF99', subAreas: [] },
]
*/
const fitnessPlanSchema = new mongoose.Schema(
	{
        fitnessFocusArea: {
            type: String,
            required: true,
            enum: [ 'Strength', 'Cardio', 'Core', 'Recovery', 'Combination' ]
        },
        fitnessSubFocusArea: {
            type: String,
        },
		completed: {
            type: Boolean,
            required: true,
            default: false
		}
	},
	{
		timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
        discriminatorKey: 'type'
	}
)

// Create discriminator schemas (aka sub-classes) of FitnessPlan
const classPlanSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        host: {
            type: String,
            required: true,
        },
        location: {
            type: String,
        },
        time: {
            type: String,
        },
        isVirtual: {
            type: Boolean,
            required: true,
            default: false
        }
    }, 
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
)

classPlanSchema.methods.displayName = () => {
    return `${this.type}: ${this.name}`
}

const exercisePlanSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        reps: {
            type: Number,
        },
        sets: {
            type: Number,
        },
    }, 
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
)

exercisePlanSchema.methods.displayName = () => {
    return `${this.type}: ${this.name}`
}

// A date can only be planned if it is today or in the future
fitnessPlanSchema.virtual('isClass').get(function() {
    return false
})

// A date can only be tracked (logged) if it is today or in the future
fitnessPlanSchema.virtual('isExercise').get(function() {
    return true
})

module.exports = { 
    fitnessPlanSchema,
    classPlanSchema,
    exercisePlanSchema
}