require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Contact = require('./models/contact');


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('build'));

morgan.token('body', function(req, res) {
  if (Object.keys(req.body).length > 0) return JSON.stringify(req.body);
  return ' ';
});

app.use(morgan(`:method :url :status :res[content-length] - 
                :response-time ms :body`));

app.get('/info', (request, response, next) => {
  Contact
      .count()
      .then((size) => {
        const time = new Date();
        response.send(`<p>phonebook has info for ${size} people</p>
                       <p>${time}</p>`);
      })
      .catch((error) => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  Contact
      .findById(request.params.id)
      .then((contact) => {
        if (contact) {
          response.json(contact);
        } else {
          response.status(404).end();
        }
      })
      .catch((error) => next(error));
});

app.get('/api/persons', (request, response, next) => {
  Contact
      .find({})
      .then((contacts) => {
        response.json(contacts);
      })
      .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Contact
      .findByIdAndRemove(request.params.id)
      .then((result) => {
        response.status(204).end();
      })
      .catch((error) => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const body = request.body;
  // console.log(body)

  if (!body.number || !body.name) {
    return response.status(400).json({
      error: 'name or number missing',
    });
  };

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact
      .save()
      .then((savedContact )=> {
        response.json(savedContact);
      })
      .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const contact = {
    name: body.name,
    number: body.number,
  };

  const opts = {runValidators: true, new: true};

  Contact
      .findByIdAndUpdate(request.params.id, contact, opts)
      .then((updatedContact) => {
        response.json(updatedContact);
      })
      .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'});
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message});
  } else if (error.name === 'MongoServerError') {
    return response.status(400).json({error: error.message});
  }

  next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
