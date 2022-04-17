let CDArray = [];
// Used to generate random data from these lists
const storeIDArray = ['98053', '98007', '98077', '98055', '98011', '98046'];
const cdIdArray = ['123456', '123654', '321456', '321654', '654123', '654321', '543216', '354126', '621453', '623451'];

let timeElapsed;

document.addEventListener("DOMContentLoaded", function () {

    timeElapsed = Date.now();

//  button events ************************************************************************
    // show all from db
    document.getElementById("buttonGet").addEventListener("click", function () {
        createList();      
        let divCDCount = document.getElementById("divCDCount");
        divCDCount.style.display = "block";
    });

    document.getElementById("buttonQueryOne").addEventListener("click", function () {
        QueryOne();      
        let divCDCount = document.getElementById("divCDCount");
        divCDCount.style.display = "block";
    });

    document.getElementById("buttonQueryTwo").addEventListener("click", function () {
        QueryTwo();      
    });

    document.getElementById("buttonCreate").addEventListener("click", function () {
        CreateOneOrder();
    });

    document.getElementById("buttonSubmitOne").addEventListener("click", function () {
        WriteOneOrder();
    });

    document.getElementById("buttonSubmit500").addEventListener("click", function () {
        for (let i = 0; i < 500; i++) {
            WriteOneOrder();
        }; 
    });

    document.getElementById("buttonSalesPersonTotalCashSales").addEventListener("click", function() {
        createListOfSalesTotalPerSalesPerson();
    });
    
});  
// end of wait until document has loaded event  *************************************************************************

// returns a time in ISO format ranging from at least 5 minutes and up to 30 minutes from the last time
function GetTimeString(){
    timeElapsed = timeElapsed + ( ( Math.floor(Math.random() * 25000) + 5000) * 60 );
    let rightNow = new Date(timeElapsed);
    return rightNow.toISOString();
};
// one sample run showed orders from when I ran it, April 11 at 21:33  (GMT)
//  until April 18th ar 3:11
//     2022-04-18T 03:11:29
//     2022-04-11T 21:33:41

function createListOfSalesTotalPerSalesPerson(){
    fetch('/getSalesPersonAggregate')
    .then(response => response.json())  // get the data out of the response object
    .then( responseData => fillTotalCashSalesUL(responseData))    //update our array and li's
    .catch(err => console.log('Request Failed', err)); // Catch errors
};

// total cash sales populate div
function fillTotalCashSalesUL(data) {
    console.log(data);
     // Div container displaying queries
    var queryDisplay = document.getElementById("QueryDisplay");
    queryDisplay.style.visibility = "visible";
     
     queryDisplay.innerHTML = 
      "<h2>Total Cash Sales Made by Each Sales Person (Sorted by High to Low)</h2>" + 
      "<div id=\"textString\"> StoreID: &nbsp &nbsp  &nbsp &nbsp " + 
      "SalesPersonID: &nbsp &nbsp  &nbsp &nbsp " +
      "Total Cash Sales($): &nbsp  &nbsp &nbsp  &nbsp" + 
      " As of (Date Today):   </div>" + 
      "<div id=\"divTotalCashSales\"></div>";
    
     orderArray = data;
    // clear prior data
     var divTotalCashSales = document.getElementById("divTotalCashSales");
     while (divTotalCashSales.firstChild) {    // remove any old data so don't get duplicates
        divTotalCashSales.removeChild(divTotalCashSales.firstChild);
     };
 
     var ul = document.createElement('ul');
    
     orderArray.forEach(function (element,) {   // use handy array forEach method
         var li = document.createElement('li');
         li.innerHTML = 
             element.StoreID + "&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp" +
             element.SalesPersonID + " &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp " +
             element.PricePaid + " &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp" + 
             element.Date;
         ul.appendChild(li);
     });
     divTotalCashSales.appendChild(ul)
     
 };


// Generates valid Order values and writes them to the HTML elements
function CreateOneOrder(){
    let storeNumberPointer =  Math.floor(Math.random() * storeIDArray.length);
    let randomStoreID = storeIDArray[storeNumberPointer];
    
    let salesPersonPointer =  (Math.floor(Math.random() * 4)) + 1;
    let salesPersonID = (storeNumberPointer * 4) + salesPersonPointer
    
    let cdId = cdIdArray[Math.floor(Math.random() * cdIdArray.length)];
    let pricePaid = Math.floor(Math.random() * 11) + 5;
    let randomTimeValue = GetTimeString();

    document.getElementById("storeID").value = randomStoreID;
    document.getElementById("salesPersonID").value = salesPersonID;
    document.getElementById("cdID").value = cdId;
    document.getElementById("pricePaid").value = pricePaid;
    document.getElementById("date").value =  randomTimeValue;
};

function createList() {
// update local array from server
    fetch('/getAllCDs')
    // Handle success
    .then(response => response.json())  // get the data out of the response object
    .then( responseData => fillUL(responseData))    //update our array and li's
    .catch(err => console.log('Request Failed', err)); // Catch errors
};

function QueryOne() {
        fetch(`/queryone`)
        .then(response => response.json())  // get the data out of the response object
        .then( responseData => fillULOne(responseData))    //update our array and li's
        .catch(err => console.log('Request Failed', err)); // Catch errors
};

function QueryTwo() {
        fetch('/getStoreRanking')
        .then(response => response.json())  // get the data out of the response object
        .then( responseData => fillULtwo(responseData))    //update our array and li's
        .catch(err => console.log('Request Failed', err)); // Catch errors
};

// Add one CD into MongoDB
function WriteOneOrder() {
    CreateOneOrder();   // create and store in the HTML
    // use the HTML values with the constructore to make a new Order object
    let newOrder = new orderObject(
    document.getElementById("storeID").value, 
    document.getElementById("salesPersonID").value, 
    document.getElementById("cdID").value, 
    document.getElementById("pricePaid").value,
    document.getElementById("date").value);

    // Post it to the server in a method that adds it to the json file
    fetch('/AddCD', {
        method: "POST",
        body: JSON.stringify(newOrder),
        headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => console.log(json))
        .catch(err => console.log(err));

}

function fillUL(data) {
        // clear prior data
    var divCDList = document.getElementById("divCDList");
    while (divCDList.firstChild) {    // remove any old data so don't get duplicates
        divCDList.removeChild(divCDList.firstChild);
    };

    var ul = document.createElement('ul');
    CDArray = data;
    // let count = CDArray.length;
    CDArray.forEach(function (element,) {   // use handy array forEach method
        var li = document.createElement('li');
        li.innerHTML = element.StoreID + ":&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp" + 
        element.SalesPersonID + "  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp"  + 
        element.CdID + " &nbsp &nbsp &nbsp &nbsp &nbsp" + 
        element.PricePaid + "&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp" + 
        element.Date;
        ul.appendChild(li);
    });
    var divCDCount = document.getElementById("divCDCount");
    // divCDCount.innerHTML = `Count: ${count}`;
    divCDList.appendChild(ul)
};


function fillULtwo(data) {
    // clear prior data
var divCDList = document.getElementById("divCDList");
while (divCDList.firstChild) {    // remove any old data so don't get duplicates
    divCDList.removeChild(divCDList.firstChild);
};

var ul = document.createElement('ul');

var li = document.createElement('li');
li.innerHTML = "Store ID" + ":&nbsp &nbsp &nbsp " + "Number of 'Piece By Piece' CDs sold" ;
ul.appendChild(li);

let CDsubsetArray = data;
let count = CDsubsetArray.length;
CDsubsetArray.forEach(function (element,) {   // use handy array forEach method
    var li = document.createElement('li');
    li.innerHTML = element._id + ":&nbsp &nbsp &nbsp " + element.count ;
    ul.appendChild(li);
});
var divCDCount = document.getElementById("divCDCount");
divCDCount.innerHTML = "";
divCDList.appendChild(ul)
};

function fillULOne(data) {
        // clear prior data
    while (divCDList.firstChild) {    // remove any old data so don't get duplicates
        divCDList.removeChild(divCDList.firstChild);
    };
    var ul = document.createElement('ul');

    var li = document.createElement('li');
    li.innerHTML = "CdID" + ":&nbsp &nbsp &nbsp " + "Number of CDs sold" ;
    ul.appendChild(li);
    CDArray = data;
    console.log(data);
    CDArray.forEach(function (element,) {   // use handy array forEach method
        var li = document.createElement('li');
        li.innerHTML = element._id + ":&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp" + element.count;
        ul.appendChild(li);
    });
    var divCDCount = document.getElementById("divCDCount");
    divCDCount.innerHTML = "";
    divCDList.appendChild(ul)
};