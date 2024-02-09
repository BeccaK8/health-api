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

const healthDateSchema = new mongoose.Schema(
	{
        dateString: {
            type: String,
            required: true,
            unique: true
        },
		goalStatement: {
            type: String,
		},
		focusArea: {
            type: String,
            required: true,
            enum: ['Strength', 'Endurance', 'Recovery']
        },
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

// A date can only be planned if it is today or in the future
healthDateSchema.virtual('isPlannable').get(function() {
    let today = new Date()
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(today)
    const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(today)
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(today)
    const todayString = `${year}-${month}-${day}`
    return this.dateString >= todayString
})

// A date can only be tracked (logged) if it is today or in the future
healthDateSchema.virtual('isTrackable').get(function() {
    let today = new Date()
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(today)
    const month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(today)
    const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(today)
    const todayString = `${year}-${month}-${day}`
    return this.dateString <= todayString
})

module.exports = mongoose.model('HealthDate', healthDateSchema)