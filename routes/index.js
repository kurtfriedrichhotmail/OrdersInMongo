var express = require('express');
const { route } = require('express/lib/application');
var router = express.Router();
const mongoose = require("mongoose");
const CDSchema = require("../CDSchema");
//const dbURI = "mongodb+srv://chiaweil:87W59ga0zleImcRf@jerry.udbr5.mongodb.net/CdDatabase?retryWrites=true&w=majority";

const dbURI = "mongodb+srv://bcuser:bcuser@cluster0.nbt1n.mongodb.net/CdDatabase?retryWrites=true&w=majority";

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


router.get('/queryone', function(req, res) {
  CDSchema.aggregate([
    {
      $group: {
        _id: '$CdID',
        count: {$sum: 1}
      }
    }
  ])
  .sort('-count')
  .exec(function (err, CD) {
    if (err) {
      console.log(err)
      res.status(500).send(err)
    }
    console.log(CD)
    res.status(200).json(CD)
  })
});

  /* GET ranking of stores which sold song 621453   Piece By Piece */
  router.get('/getStoreRanking', function(req, res) {

    CDSchema.aggregate([

      { $match : { CdID : "621453" } },

      {$group: {_id: "$StoreID", count:{ $sum: 1}}}
    ])

    .sort('-count')

    .exec(function (err, storeRanking) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    console.log(storeRanking);
    res.status(200).json(storeRanking);
    });
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



  // route get total cash sales per salesperson
  // $project === Passes along the documents with the requested fields to the next stage in the pipeline.
  // The specified fields can be existing fields from the input documents or newly computed fields.

  router.get('/getSalesPersonAggregate', function(req, res) {
    // find {  takes values, but leaving it blank gets all}
   // new date generated on date of query
    var currentDate = new Date();
  
    CDSchema.aggregate([
    { $group : { _id: {StoreID : '$StoreID', SalesPersonID : '$SalesPersonID',}, TotalSales: {$sum: "$PricePaid"}}},
    { $project : {StoreID : '$_id.StoreID', SalesPersonID: '$_id.SalesPersonID', PricePaid: '$TotalSales', _id:0}},  // _id:0  Specifies the suppression of the _id field.
    { $sort : {PricePaid : -1}},
    { $set : {Date: currentDate}}
  
  ])
  .exec (function (err, salesPerson) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    console.log(salesPerson);
    res.status(200).json(salesPerson);
  });
  
  });


module.exports = router;
