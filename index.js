const chromeOption = require('selenium-webdriver/chrome');
var webdriver = require('selenium-webdriver'), By = webdriver.By;
var chrome = require('chromedriver');
var fs = require('fs');
var driver = new webdriver.Builder()
 .forBrowser('chrome')
//  .setChromeOptions(new chromeOption.Options().headless()) //headless means work in the background without opening a browser
 .build();
driver.get('http://resonant.stats.com/arge/teams.asp'); // getting the URL

var length = 24; // total of rows(teams)
var lengthId = 72; // total of ids that will be retrieved since HTML it's not properly designed
var count = 0;
var storage = { // storage of names and ids
  teamN: [],
  teamId: []
};
var storageId = []; // place where it will be stored the raw data of id
let uniqueId = []; // place where storage
var finalData = '';
var teamTable = driver.findElement(By.className('shsTable shsBorderTable'));

pause(2, getTeams);

function getTeams(){
  console.log('Starting...')
  pause(3, function(){
    var getRowsTeams = teamTable.findElements(By.className('shs1stCol shsNamD'));
    if ( count !== length ) {
      getRowsTeams.then((element) => { // element is the total of rows
        element[count].getText().then(function(txt) {
          storage.teamN.push(txt);
          console.log('Equipo: ', txt);
          count++;
          getTeams();
        });  
      });
    } else {
      count = 0;
      pause(1, getId)
    }
  });
}

function getId(){
  pause(1, function(){
    // new variable for length to === length*3 since there are 3 links per row
    if ( count !== lengthId ) {
      var getRows = teamTable.findElements(By.css('a'));
      getRows.then((element) => {
        element[count].getAttribute('href').then((value) => {
            var begIndex = value.indexOf('?') + 6;
            var id = value.slice(begIndex);
            // we store raw data into array
            storageId.push(id);
          count++;
          getId();
        });
      });
    } else {
      // through the Set object remove duplicates
      uniqueId = [...new Set(storageId)];
      pause(2, appendToArray); // appendToArray
    }
  });
}

function appendToArray() {
  var objStorage = [], team = {}; 
  // go through uniqueId and push element to storage.teamId 
  for (var i = 0; i < uniqueId.length; i++){
    storage.teamId.push(uniqueId[i]);
  }
  // create final team object
    // should I have a list of objects team.name: storage.teamN[j], team.id: storage.teamCode[j];
    // or an object with names as key and id as value
  for (var j = 0; j < length; j++) {
    objStorage.push({name: storage.teamN[j], id: storage.teamId[j]});
  }
  finalData = "exports.teams = " + JSON.stringify(objStorage) + ";";
  pause(1, checkFileExistance);
}

function checkFileExistance() {
  fs.stat('teams.js', function(error, stats){
    if (!error){
      fs.unlink('teams.js', function(error){
        if(error) { error }
        console.log('The previous file is deleted and replaced with a new file');
        appendToFile();
      });
    } else {
      appendToFile();
    }
  });
}

function appendToFile() {
  console.log('Data added in teams.js file');
  fs.appendFileSync('teams.js', '' + finalData + '\n');
  quitDriver();
}


function pause(time, callback) {
  setTimeout(callback, time * 1000);
}

// closing and quiting the driver after scrapping has been done
function quitDriver() {
  driver.close();
  driver.quit();
}