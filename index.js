const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const app = express();
app.use(express.json())

//Deactivated tiny version of morgan. Deactivate customized morgan to run tests on tiny.
//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
morgan.token('body', (req, res) => JSON.stringify(req.body));
morgan.token('param', function(req, res, param) {
    return req.params[param];
});
app.use(cors())


let persons = [
  {
   id: 1,
   name: "Arto Hellas",
   number: "040-123456",
 },
 {
   id: 2,
   name: "Ada Lovelace",
   number: "39-44-5323523",
 },
 {
   id: 3,
   name: "Dan Abramov",
   number: "12-43-234345",
 },
 {
   id: 4,
   name: "Mary Poppendieck",
   number: "39-23-6423122",
 },
 {
   id: 5,
   name: "Rasmus Paltschik",
   number: "040-5405646"
 }
]


  //Send all resources
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })


  //Get a single resource
  app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }

  })

  //Delete a resource
  app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
  })


  const generateId = () => {

    const id = Math.floor(Math.random() * 10000000)

    return id
    console.log(id)

  }

  //Add a resource
  app.post('/api/persons', (req, res) => {

    const body = req.body
    console.log(body)

    if (!body.name) {
      return res.status(400).json({
        error: 'Name missing!'
    })
    } else if (!body.number) {
      return res.status(400).json({
        error: 'Number missing!'
      })
    } else if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({
            error: 'Name must be unique!'
        })
    }

    const person = {
      id: generateId(),
      name: body.name,
      number: body.number,
    }

    persons = persons.concat(person)

    res.json(person)

  })


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
