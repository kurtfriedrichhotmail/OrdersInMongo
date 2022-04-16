let CDArray = [];
// Used to generate random data from these lists
const storeIDArray = ['98053', '98007', '98077', '98055', '98011', '98046'];
const cdIdArray = ['123456', '123654', '321456', '321654', '654123', '654321', '543216', '354126', '621453', '623451'];


// define a constructor to create CD Orders
let orderObject = function (pStoreID, pSalesPersonID, pCdID, pPricePaid, pDate) {
    this.StoreID = pStoreID
    this.SalesPersonID = pSalesPersonID;
    this.CdID = pCdID;
    this.PricePaid = pPricePaid;  // action  comedy  drama  horrow scifi  musical  western
    this.Date = pDate;
}

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

// function PostOneOrder(){
//     CreateOneOrder();  // create and store in the HTML
//     // use the HTML values with the constructore to make a new Order object
//     let newOrder = new orderObject(
//     document.getElementById("storeID").value, 
//     document.getElementById("salesPersonID").value, 
//     document.getElementById("cdID").value, 
//     document.getElementById("pricePaid").value,
//     document.getElementById("date").value);

//     // Post it to the server in a method that just logs, does not save
//     fetch('/ShowOneOrder', {
//         method: "POST",
//         body: JSON.stringify(newOrder),
//         headers: {"Content-type": "application/json; charset=UTF-8"}
//         })
//         .then(response => response.json()) 
//         .then(json => console.log(json))
//         .catch(err => console.log(err));

// };


// function WriteOneOrder(){
//     CreateOneOrder();   // create and store in the HTML
//     // use the HTML values with the constructore to make a new Order object
//     let newOrder = new orderObject(
//     document.getElementById("storeID").value, 
//     document.getElementById("salesPersonID").value, 
//     document.getElementById("cdID").value, 
//     document.getElementById("pricePaid").value,
//     document.getElementById("date").value);

//     // Post it to the server in a method that adds it to the json file
//     fetch('/StoreOneOrder', {
//         method: "POST",
//         body: JSON.stringify(newOrder),
//         headers: {"Content-type": "application/json; charset=UTF-8"}
//         })
//         .then(response => response.json()) 
//         .then(json => console.log(json))
//         .catch(err => console.log(err));

// };

function createList() {
// update local array from server
    fetch('/getAllCDs')
    // Handle success
    .then(response => response.json())  // get the data out of the response object
    .then( responseData => fillUL(responseData))    //update our array and li's
    .catch(err => console.log('Request Failed', err)); // Catch errors
};

function QueryOne() {
    // update local array from server
        let CdIDDropdownList = document.getElementById("CdIDDropdownList");
        let selectedValue = CdIDDropdownList.options[CdIDDropdownList.selectedIndex].text;
        
        fetch(`/queryone/${selectedValue}`)
        // Handle success
        .then(response => response.json())  // get the data out of the response object
        .then( responseData => fillUL(responseData))    //update our array and li's
        .catch(err => console.log('Request Failed', err)); // Catch errors
};

function QueryTwo() {
    // update local array from server
        fetch('/querytwo')
        // Handle success
        .then(response => response.json())  // get the data out of the response object
        .then( responseData => fillUL(responseData))    //update our array and li's
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
    let count = CDArray.length;
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
    divCDCount.innerHTML = `Count: ${count}`;
    divCDList.appendChild(ul)
};