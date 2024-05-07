let mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        Required: true
    } 
});
const exerciseSchema = new mongoose.Schema({
        userId: String,
        username: String,
        description: {
            type: String,
        Required: true
    },
        duration:{
            type: Number,
            Required: true
        },
        date: Date
      }
)
const logSchema = new mongoose.Schema({
    description: String,
    duration: Number,
    date: Date
},
{ _id : false })

const logbookSchema = new mongoose.Schema({
    username: String,
    count: Number,
    log: [logSchema]
  })

let users = new mongoose.model('users', usersSchema);
let logbook = new mongoose.model('logbook', logbookSchema);
// let log = new mongoose.model('log', logSchema);
let exercise = new mongoose.model('exercise', exerciseSchema);
//returns null if doesnt exist or database object if it does.
// const checkDBforURL = (longurl, done) => {
//     URL.findOne({longURL: longurl}, function(err, data) {
//       if (err) console.log(err);
//       done(null, data);
//     });
//   };


const getFromDB = async (id) => {
    return await users.findById(id);
};

const insertExercise = async (id, username, desc, dur, date) => {
    try{
        const newExercise = new exercise({
          userId: id,
          username: username,
          description: desc,
          duration: dur,
          date: date
        })
        return await newExercise.save();

    }catch (err){
        console.log(err);
        return (err);
    }
}

const updateLogbook = async (id, desc, dur, date) => {
    try{
        const filter = { _id: id };
        const update = { 
            $inc: {'count': 1}, 
            $push: {
                "log": {
                    description: desc,
                    duration: dur,
                    date: date
                }
            }
            
        };
        await logbook.findOneAndUpdate(filter, update, {new:true});

    }catch(err){
        console.log(err);
        return (err);
    }
}

// const createCounter = (done) => {
//     var count = new Counter({
//         _id: "userid",
//         seq: 0  
//     });
//     count.save(function(err, data) {
//         if (err) return done(err);
//         done(null, data);
//     });
// }

// const getNextSequence = (id, done) => {
//     Counter.findOneAndUpdate(
//         {_id: id}, {$inc: { seq: 1 }}, {new: true}, function(err, count){
//         if (err) console.log(err);
//         done(null, count);
//     });
// }

// const insertusername = (username) => {
//     const user = new users({
//         username: username
//     });
//     user.save().then(()=>{
//         console.log("saved!");
//     }).catch((err)=>{
//         console.log(err);
//     })
// }
exports.users = users;
exports.logbook = logbook;
exports.exercise = exercise;
exports.getFromDB = getFromDB;
exports.insertExercise = insertExercise;
exports.updateLogbook = updateLogbook;
