var express = require('express');
const { route } = require('express/lib/application');
var router = express.Router();
const mongoose = require("mongoose");
const CDSchema = require("../CDSchema");
const dbURI = "mongodb+srv://chiaweil:87W59ga0zleImcRf@jerry.udbr5.mongodb.net/CdDatabase?retryWrites=true&w=majority";
mongoose.set('useFindAndModify', false);

// connect to mongoDB
const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  }
,err => {
  console.log("Error connecting Database instance due to: ", err);
}
);
// ==============================================================

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});


/* log new Order, but don't save */
router.post('/ShowOneOrder', function(req, res) {
  const newOrder = req.body;  // get the object from the req object sent from browser
  console.log(newOrder);

  var response = {
    status  : 200,
    success : 'Received Order Successfully'
  }
  res.end(JSON.stringify(response)); // send reply
});

// Add one CD
router.post('/AddCD', function(req, res){
  let oneNewCD = new CDSchema(req.body);
  console.log(req.body);
  oneNewCD.save((err) => {
    if (err) {
      res.status(500).send(err);
    }
    var response = {
      status: 200,
      success: "Added Successfully"
    };
    res.end(JSON.stringify(response));
  });
});

/* query one */
router.get('/queryone', function(req, res) {
  console.log("doing query one");
  fileManager.read();
  res.status(200).json(ServerOrderArray);
});

/* query two */
router.get('/querytwo', function(req, res) {
  console.log("doing query two");
  fileManager.read();
  res.status(200).json(ServerOrderArray);
});


/* GET all CD data */
router.get('/getAllCDs', function(req, res) {
  CDSchema.find({}, (err, AllCDs) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).json(AllCDs);
  });

});
// // delete CD
// router.route("/Delete:CDId").delete(function(req, res) {
//   const pCdID = req.params.CdID;
//   CDSchema.remove({CdID: pCdID}, function(err, result) {
//     if (err){
//       console.log(err);
//     }else{
//       console.log("Result :", result);
//     }
//   })
// });

module.exports = router;
