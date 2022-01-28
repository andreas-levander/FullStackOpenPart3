const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const contactSchema = new mongoose.Schema({
    name: {
      type: String,
      minlength: 3,
      unique: true
    },
    number: {
      type: String,
      
      validate: {
        validator: function(numberString) {
          const numberArray = numberString.split("-")

          if (numberArray.length !== 2) return false

          const firstNum = numberArray[0]
          const secondNum = numberArray[1]

          if(firstNum.length > 3 || firstNum.length < 2) return false
        
          return (!isNaN(firstNum) && !isNaN(secondNum)) 
        },
        message: "is not a phonenumber"
      },
      minlength: 8,
    },
})

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)