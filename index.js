const express = require('express')
const morgan = require('morgan')
const cors = require('cors')



const app = express()

app.use(cors())
app.use(express.json())

morgan.token('body', function (req, res) { 
    if (Object.keys(req.body).length > 0) return JSON.stringify(req.body) 
    return " "
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
    

let contacts = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

app.get('/info', (request, response) => {
    const size = contacts.length
    const time = new Date()
    response.send(`<p>phonebook has info for ${size} people</p><p>${time}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = contacts.find(contact => contact.id === id)

    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
})

app.get('/api/persons', (request, response) => {
    response.json(contacts)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(contact => contact.id !== id)
  
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    //console.log(body)
  
    
    if (!body.number || !body.name) {
        return response.status(400).json({ 
          error: 'name or number missing' 
        })
    } else if (contacts.find(person => person.name === body.name) !== undefined) {
        return response.status(400).json({ 
          error: 'name already exists in contacts' 
        })
    }
  
    const contact = {
      id: Math.floor(Math.random() * 1000000),
      name: body.name,
      number: body.number
    }
  
    contacts = contacts.concat(contact)
  
    response.json(contact)
})




const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})