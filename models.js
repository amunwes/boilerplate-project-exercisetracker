let mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        Required: true,
        unique: true
    } 
});
const exerciseSchema = new mongoose.Schema(
    {
        username: String,
        description: String,
        duration: Number,
        date: Date
      }
)

const logSchema = new mongoose.Schema({
    username: String,
    count: Number,
    log: [{}]
  })

let users = new mongoose.model('users', usersSchema);
let log = new mongoose.model('log', logSchema);
let exercise = new mongoose.model('exercise', exerciseSchema);
//returns null if doesnt exist or database object if it does.
// const checkDBforURL = (longurl, done) => {
//     URL.findOne({longURL: longurl}, function(err, data) {
//       if (err) console.log(err);
//       done(null, data);
//     });
//   };

// const getURLfromDB = (shorturl, done) => {
//     URL.findOne({shortURL: shorturl}, function(err, data) {
//       if (err) console.log(err);
//       done(null, data);
//     });
// };

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
exports.log = log;
exports.exercise = exercise;
