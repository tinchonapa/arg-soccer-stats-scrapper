const chromeOption = require('selenium-webdriver/chrome');
var webdriver = require('selenium-webdriver'), By = webdriver.By;
var chrome = require('chromedriver');
var fs = require('fs');
var driver = new webdriver.Builder()
 .forBrowser('chrome')
//  .setChromeOptions(new chromeOption.Options().headless()) //headless means work in the background without opening a browser
 .build();
driver.get('http://resonant.stats.com/arge/teamstats.asp?team=3105'); // getting the URL


pause(2, getId);
var length = 24;
var count = 0;
var storage = {
  teamN: [],
  teamId: []
};
var finalData = '';
var teamTable = driver.findElement(By.className('sortable shsTable shsBorderTable'));
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
    if ( count !== length ) {
      var getRows = teamTable.findElements(By.css('a'));
      // var getRows = teamTable.findElements(By.className('shsRow0Row'));
      // var getCells = getRows.findElements(By.css('a'));
      getRows.then((element) => {
        // element[count].getAttribute('href').then((value) => {
        element[count].getAttribute('href').then((value) => {
          console.log('Current value in getID out if ', value);
            var begIndex = value.indexOf('?') + 1;
            var id = value.slice(begIndex);
            console.log('This is id', id);
            storage.teamId.push(id);
          count++;
          getId();
        });
      });
    } else {
      pause(2, quitDriver); // appendToArray
    }
  });
}

function appendToArray() {
  var teams = {}, teamName = '', teamCode = '';
  for ( var i = 0; i < length; i++ ) {
    teamName = storage.teamN[i];
    teamCode = storage.teamId[i];
    teams[teamName] = teamCode;
  }
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

/*
function screenShot() {
  console.log('Taking a ScreenShot! 3 2 1');
  driver.takeScreenshot().then(
    function (image, err) {
      fs.writeFile('./images/porfolio.jpg', image, 'base64', function (err) {
        console.log(err);
        if (err == null) {
          console.log('ScreenShot has been captured and saved succesfully');
        }
      });
    }
  );
}
*/

// pause(6, quitDriver);

// closing and quiting the driver after scrapping has been done
function quitDriver() {
  driver.close();
  driver.quit();
}