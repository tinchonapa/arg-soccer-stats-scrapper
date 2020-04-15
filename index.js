const chromeOption = require('selenium-webdriver/chrome');
var webdriver = require('selenium-webdriver'), By = webdriver.By;
var chrome = require('chromedriver');
var fs = require('fs');
var driver = new webdriver.Builder()
 .forBrowser('chrome')
//  .setChromeOptions(new chromeOption.Options().headless()) //headless means work in the background without opening a browser
 .build();
driver.get('http://resonant.stats.com/arge/teams.asp'); // getting the URL


pause(2, getTeams);
var length = 24;
var lengthId = 72;
var count = 0;
var storage = {
  teamN: [],
  teamId: []
};
var storageId = [];
let uniqueId = [];
var finalData = '';
var teamTable = driver.findElement(By.className('shsTable shsBorderTable'));
function getTeams(){
  console.log('Starting...')
  pause(3, function(){
    // var teamTable = driver.findElement(By.className('shsTable shsBorderTable'));
    // var getRows = teamTable.findElements(By.css('tr'));
    // var getCells = getRows.findElements(By.css('td'));
    // var getTeams = getRows.findElements(By.className('shs1stCol shsNamD'));
    // console.log('Team ', getTeams);
    /*var getRows = teamTable.findElements(By.className('shs1stCol shsNamD'));
    getRows.then(function(element){
       console.log('Equipos: ', element[i]);
       for (var i = 0; i < element.length; i++) {
        //  if ( element[i].)
         element[i].getText().then(function(txt){
          if ( txt != 'undefined' ) {
            name = txt;
            storage.push(name)
            console.log(storage);
          }
        });
      }
    });*/
    var getRowsTeams = teamTable.findElements(By.className('shs1stCol shsNamD'));
    if ( count !== length ) {
      getRowsTeams.then((element) => {
        console.log(element.length)
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
    if ( count !== lengthId ) { // *** make new variable for length to === length*3 instead of length ***
      var getRows = teamTable.findElements(By.css('a'));
      // var getRows = teamTable.findElements(By.className('shsRow0Row'));
      // var getCells = getRows.findElements(By.css('a'));
      getRows.then((element) => {
        // element[count].getAttribute('href').then((value) => {
        element[count].getAttribute('href').then((value) => {
            var begIndex = value.indexOf('?') + 1;
            var id = value.slice(begIndex);
            // *** what if we push first to an array where it would store all values ***
            storageId.push(id);
            // *** then reduce it from triplicates(duplicates) ***
            // *** then do the storage.teamId.push() ***
            // storage.teamId.push(id);
          count++;
          getId();
        });
      });
    } else {
      uniqueId = [...new Set(storageId)];
      pause(2, appendToArray); // appendToArray
    }
  });
}

function appendToArray() {
  var teams = {}, teamName = '', teamCode = '';
  for (var i = 0; i < uniqueId.length; i++){
    storage.teamId.push(uniqueId[i]);
  }
  for (var j = 0; j < length; j++) {
    teamName = storage.teamN[j];
    teamCode = storage.teamId[j];
    teams[teamName] = teamCode;
  }
  console.log(teams)
  finalData = "exports.teams = [" + JSON.stringify(teams) + "];";
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