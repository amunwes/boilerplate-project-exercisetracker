const express = require('express')
const app = express()
const cors = require('cors')

const bodyParser = require('body-parser');
const models = require('./models.js');

const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI)
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
  const newUser = new models.users({
    username: req.body.username
  });
  newUser.save()
  .then((data)=>{
    const newLogbook = new models.logbook({
      _id: data._id,
      username: data.username,
      count: 0
    });
    newLogbook.save().catch((err)=>{
      console.log(err);
    });

    res.json(newUser);
  })
  .catch((err)=>{
      console.log(err);
  })

});

// example of handler using promise chain
app.get('/api/users', function(req, res){
  models.users.find().then((data)=>{
    res.send(data);
  }).catch((err)=>{
    console.log(err);
  });
});

//example of handler using await/async
app.post("/api/users/:_id/exercises", async function(req, res){
  const {_id} = req.params;
  const {description, duration} = req.body;
  // deal with date
  var dateStr = req.body.date;
  var date = new Date(dateStr);
  if (!dateStr){
    date = new Date(Date.now())
  }
  if(isNaN(date) || isNaN(date.getTime())){
    console.log(dateStr);
    res.json({ error : "Invalid Date" })
  }
  try{
    const user = await models.users.findById(_id);
    if(!user){
      res.send("Couldn't find user!")
    }else{
      const username = user.username;
      const newExercise = await models.insertExercise(_id, username, description, duration, date);
    }
    // retrieve username from _id
    // const newExercise = await models.insertExercise(_id, username, description, duration, date);
    models.updateLogbook(_id, description, duration, date);
    
    res.json({"_id": _id, "username": username, "date": date.toDateString(), "duration":duration, "description":description});
  
  }catch (err){
    console.log(err);
    res.send(err);
  }

});

app.get("/api/users/:_id/logs", async function(req, res){
  // You can add from, to and limit parameters to a GET /api/users/:_id/logs request to retrieve part of the log of any user. from and to are dates in yyyy-mm-dd format. limit is an integer of how many logs to send back.
  let maxDate = new Date(8640000000000000);
  let minDate = new Date(-8640000000000000);
  
  const from = req.query.from ? new Date(req.query.from) : minDate;
  const to = req.query.to ? new Date(req.query.to) : maxDate;
  const limit = req.query.limit ? Number(req.query.limit) : null;
  var {_id} = req.params;
  _id = new mongoose.Types.ObjectId(_id);
  var now = new Date(Date.now())
  console.log(`date now: ${now.toDateString()}`)
  console.log(`from: ${from} type:${typeof from}\nto: ${to} type:${typeof to}\nlimit: ${limit} type:${typeof limit}\nid: ${_id}`);

  models.logbook.aggregate([
    {
        $match: {
            _id: _id
        }
    },
    {
        $project: {
            _id: 1,
            username: 1,
            count: 1,
            log: { 
                $filter: { 
                    input: "$log", 
                    as: "log", 
                    cond: {
                      "$and":[
                        {
                          $gte: [ "$$log.date", from ]
                        },
                        {
                          $lte: [ "$$log.date", to ]
                        }
                      ]  
                    },
                    limit: limit
                }
            }
        }
    }])
    .exec()
    .then((data) => {
        res.json(data);
    })
    .catch((err)=>{
      console.log(err);
      res.send(err);
    }); 
   
// }

  // models.logbook.findById(_id)
  // .select({__v : 0})
  // .then((data)=>{;
  //   console.log(data);
  //   res.send(data);
  // })
  // .catch((err)=>{
  //   console.log(err);
  // })
});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
