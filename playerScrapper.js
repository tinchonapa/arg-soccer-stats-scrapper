const chromeOption = require('selenium-webdriver/chrome');
var webdriver = require('selenium-webdriver'), By = webdriver.By;
var chrome = require('chromedriver');
var fs = require('fs');
var { teams } = require('./teams'); // get db of teams
var driver = new webdriver.Builder()
  .forBrowser('chrome')
  //  .setChromeOptions(new chromeOption.Options().headless()) //headless means work in the background without opening a browser
  .build();

var count = 0;
let totalTeams = teams.length;
var playersData = [];
var finalData = '';
var team = '';

pause(2, goThroughTeams);
function goThroughTeams(){
  if ( count !== totalTeams ) {
    driver.get(`http://resonant.stats.com/arge/rosters.asp?team=${teams[count].id}`)
    team = teams[count].name;
    console.log('Current team: ', team)
    pause(1, getPlayer);
  } else {
    pause(1, appendToArray)
  }
}

function getPlayer() {
  pause(1, () => {
    // create script to grab data and ignore unnecesary fields(titles & players without stats)
    var extractPlayers = function (team) {
      var length = document.getElementsByTagName('tr').length;
      var arrOfElements = document.getElementsByTagName('tr');
      var storage = [];
      var begIndex = 0;
      var id, name, numb, pos, height, weight, dob, pob = ''; // variables for values of obj
      for(var i = 0; i < length; i++) {
          if ( (arrOfElements[i].cells.length > 1) && (arrOfElements[i].cells[0].innerText.length !== 0) ) { // players without shirt# mean that they didn't play. Skip them
              if ( arrOfElements[i].cells[0].innerText !== "No." ) { // skip header rows
                  numb = arrOfElements[i].cells[0].innerText;
                  begIndex = arrOfElements[i].cells[1].firstChild.href.indexOf('?') + 8;
                  id = arrOfElements[i].cells[1].firstChild.href.slice(begIndex);
                  name = arrOfElements[i].cells[1].innerText;
                  pos = arrOfElements[i].cells[2].innerText;
                  height = arrOfElements[i].cells[3].innerText;
                  weight = arrOfElements[i].cells[4].innerText;
                  dob = arrOfElements[i].cells[5].innerText;
                  pob = arrOfElements[i].cells[6].innerText;
                  storage.push({"id": id, "numb": numb, "name": name, "pos": pos, "height": height, "weight": weight, "dob": dob, "pob": pob, "team": team});
                  // console.log('Storage: ', storage)
              }
        }
      }
      return storage;
    }
    driver.executeScript(extractPlayers, team).then((result) => {
      playersData.push(...result);
    });
    count++;
    console.log(count)
    pause(1, goThroughTeams)
  })
}

function appendToArray() {
  finalData = "exports.players = " + JSON.stringify(playersData) + ";";
  pause(1, checkFileExistance);
}

function checkFileExistance() {
  fs.stat('players.js', function (error, stats) {
    if (!error) {
      fs.unlink('players.js', function (error) {
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
  console.log('Data added in players.js file');
  fs.appendFileSync('players.js', '' + finalData + '\n');
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