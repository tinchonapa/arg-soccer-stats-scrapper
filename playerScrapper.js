const chromeOption = require('selenium-webdriver/chrome');
var webdriver = require('selenium-webdriver'), By = webdriver.By;
var chrome = require('chromedriver');
var fs = require('fs');
var driver = new webdriver.Builder()
  .forBrowser('chrome')
  //  .setChromeOptions(new chromeOption.Options().headless()) //headless means work in the background without opening a browser
  .build();
driver.get('http://resonant.stats.com/arge/rosters.asp?team=3105'); // getting the URL

var { teams } = require('./teams');
// console.log('teams: ', teams);

let playersData;
var finalData = '';
var teamTable = driver.findElements(By.css('tr'));
/*function goThroughTeams(){
  for (var i = 0; i < exportedTeams.teams.length)
  driver.get(`http://resonant.stats.com/arg/rosters.asp?${teams[i].id}`)
}*/

pause(2, getTableLength);

function getTableLength() {
  console.log('Starting...')
  teamTable.then((element) => {
    tableLength = element.length;
    console.log(tableLength)
  });
  pause(4, getPlayer);
}

function getPlayer() {
  pause(1, () => {
    // create script to grab data and ignore unnecesary fields(titles & players without stats)
    var extractPlayers = function () {
      var length = document.getElementsByTagName('tr').length;
      var arrOfElements = document.getElementsByTagName('tr');
      var storage = [];
      var name, numb, pos, height, weight, dob, pob = '';
      for(var i = 0; i < length; i++) {
          if ( (arrOfElements[i].cells.length > 1) && (arrOfElements[i].cells[0].innerText.length !== 0) ) {
              if ( arrOfElements[i].cells[0].innerText !== "No." ) {
                  console.log('current plyr ', arrOfElements[i].innerText)
                  numb = arrOfElements[i].cells[0].innerText;
                  name = arrOfElements[i].cells[1].innerText;
                  pos = arrOfElements[i].cells[2].innerText;
                  height = arrOfElements[i].cells[3].innerText;
                  weight = arrOfElements[i].cells[4].innerText;
                  dob = arrOfElements[i].cells[5].innerText;
                  birthPlace = arrOfElements[i].cells[6].innerText;
                  storage.push({"numb": numb, "name": name, "pos": pos, "height": height, "weight": weight, "dob": dob, "pob": pob});
                  // console.log('Storage: ', storage)
              }
        }
      }
      return storage;
    }
    driver.executeScript(extractPlayers).then((result) => {
      playersData = result;
    });
    pause(1, appendToArray)
  })
}

function appendToArray() {
  var objStorage = [], team = {};
  // go through uniqueId and push element to storage.teamId 
  /*for (var i = 0; i < uniqueId.length; i++) {
    storage.teamId.push(uniqueId[i]);
  }*/
  // create final team object
  // should I have a list of objects team.name: storage.teamN[j], team.id: storage.teamCode[j];
  // or an object with names as key and id as value
  /*for (var j = 0; j < length; j++) {
    objStorage.push({ name: storage.teamN[j], id: storage.teamId[j] });
  }*/
  console.log('Players data ', playersData);
  finalData = "exports.players = " + JSON.stringify(playersData) + ";";
  pause(1, checkFileExistance);
}

function checkFileExistance() {
  fs.stat('aldosivi.js', function (error, stats) {
    if (!error) {
      fs.unlink('aldosivi.js', function (error) {
        if (error) { error }
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
  fs.appendFileSync('aldosivi.js', '' + finalData + '\n');
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