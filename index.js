// implement your API here
// console.log('its alive');

const express = require('express');
const db = require('./data/db'); // our db database library
const server = express(); // initiate server instance
server.use(express.json()); // middleware to parse json from the client(body of the request)

// routes or endpoints

// GET to '/'
server.get('/', (req, res) => {
  res.send('Server is fired up! 🔥 ');
});

// GET to '/api/users'
server.get('/api/users', (req, res) => {
  db.find()
    .then(users => {
      console.log('Users', users);
      res.status(200).json(users);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        errorMessage: 'The users information could not be retrieved.'
      });
    });
});

// GET to '/api/users/:id'
server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  // storing the dynamic part of our route which is sent as part of the request and found in match.params.id and passing that into the database library method to retrieve that specific user.
  // a promise is a callback function that runs once the asynchronous operation is complete
  db.findById(id)
    .then(user => {
      console.log('User', user);
      res.status(200).json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(404).json({
        message: 'The user with the specified ID does not exist'
      });
    });
});

// POST to '/api/users'
server.post('/api/users', (req, res) => {
  const hobbitData = req.body;
  // never trust the client. validate the data
  if (!hobbitData.name || !hobbitData.bio) {
    res.status(400).json({
      errorMessage: 'Please provide name and bio for the user'
    });
  } else {
    db.insert(hobbitData)
      .then(hobbit => {
        console.log('Hobbit', hobbit);
        res.status(201).json(hobbit);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          errorMessage:
            'There was an error while saving the user to the database'
        });
      });
  }
});

// PUT to '/api/users/:id'

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const hobbitData = req.body;
  if (!hobbitData.name || !hobbitData.bio) {
    res.status(400).json({
      message: 'Please provide name and bio for the user'
    });
  } else {
    db.update(id, hobbitData)
      .then(updated => {
        if (updated) {
          res.status(204).json(updated);
        } else {
          res
            .status(404)
            .json({ message: 'The user with the specified ID does not exist' });
        }
      })
      .catch(err => {
        console.log(err);
        res
          .status(500)
          .json({ errorMessage: 'The user information could not be modified' });
      });
  }
});

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(removed => {
      if (removed) {
        res.status(204).json(removed);
      } else {
        res
          .status(404)
          .json({ message: 'The user with the specified ID does not exist' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ errorMessage: 'The user could not be removed' });
    });
});

// server setup and listening for requests
const port = 8000;
server.listen(port, () => console.log(`\n ** api on port: ${port} ** \n`));
