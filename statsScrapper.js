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
    driver.get(`http://resonant.stats.com/arge/teamstats.asp?team=${teams[count].id}`)
    team = teams[count].name;
    console.log('Current team: ', team)
    pause(1, getPlayerStats);
  } else {
    pause(1, appendToArray);
  }
}

function getPlayerStats() {
  pause(1, () => {
    // create script to grab data and ignore unnecesary fields(titles & players without stats)
    var extractGK = function (team) {
      var length = document.getElementsByClassName('sortable')[0].childNodes[0].childNodes.length;
      var arrOfElements = document.getElementsByClassName('sortable')[0].childNodes[0].childNodes;
      var storage = [];
      var begIndex = 0;
      var id, gp, min, gc, gaa, pg, pa, pksa, saves, shots, sog, ssa, cs, yc, rc = ''; // variables for values of obj
      for(var i = 1; i < length-1; i++) {
        begIndex = arrOfElements[i].cells[0].firstChild.href.indexOf('?') + 8;
        id = arrOfElements[i].cells[0].firstChild.href.slice(begIndex);
        gp = arrOfElements[i].cells[1].innerText;
        min = arrOfElements[i].cells[2].innerText;
        gc = arrOfElements[i].cells[3].innerText;
        gaa = arrOfElements[i].cells[4].innerText;
        pg = arrOfElements[i].cells[5].innerText;
        pa = arrOfElements[i].cells[6].innerText;
        pksa = arrOfElements[i].cells[7].innerText;
        saves = arrOfElements[i].cells[8].innerText;
        shots = arrOfElements[i].cells[9].innerText;
        sog = arrOfElements[i].cells[10].innerText;
        ssa = arrOfElements[i].cells[11].innerText;
        cs = arrOfElements[i].cells[12].innerText;
        yc = arrOfElements[i].cells[13].innerText;
        rc = arrOfElements[i].cells[14].innerText;
        storage.push({"id": id, "min": min, "gp": gp, "gc": gc, "gaa": gaa, "pg": pg, "pa": pa, "pksa": pksa,
          "saves": saves, "shots": shots, "sog": sog, "ssa": ssa, "cs": cs, "yc": yc, "rc": rc, "team": team});
        // console.log('Storage: ', storage)
      }
      return storage;
    }

    /*var extractPlayers = function (team) {
      var length = document.getElementsByClassName('sortable')[1].childNodes[0].childNodes.length;
      var arrOfElements = document.getElementsByClassName('sortable')[1].childNodes[0].childNodes;
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
    }*/
    driver.executeScript(extractGK, team).then((result) => {
      playersData.push(...result);
    });
    count++;
    console.log(count)
    pause(1, goThroughTeams)
  })
}

function appendToArray() {
  finalData = "exports.stats = " + JSON.stringify(playersData) + ";";
  pause(1, checkFileExistance);
}

function checkFileExistance() {
  fs.stat('stats.js', function (error, stats) {
    if (!error) {
      fs.unlink('stats.js', function (error) {
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
  console.log('Data added in stats.js file');
  fs.appendFileSync('stats.js', '' + finalData + '\n');
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