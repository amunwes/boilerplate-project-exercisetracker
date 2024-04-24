const express = require('express')
const app = express()
const cors = require('cors')

const bodyParser = require('body-parser');
const models = require('./models.js');

const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// app.post('/api/users', function(req, res) {
//   console.log(`input username: ${req.body.username}`);
//   models.insertusername(req.body.username);
// });
app.post('/api/users', function(req, res) {
  console.log(`input username: ${req.body.username}`);
  // models.insertusername(req.body.username);
  const newUser = new models.users({
    username: req.body.username
  });

  newUser.save().then((data)=>{
      res.send(data);
  }).catch((err)=>{
      console.log(err);
  })
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
