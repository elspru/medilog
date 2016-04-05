#!/usr/bin/js
var jsdom = require("jsdom").jsdom;
var document = jsdom("hello world");
var window = document.defaultView;
var prevDate = "";
var total = 0;
const fs = require('fs');
var medLogObj;

function setContent(html) {
    "use strict";
    /*jslint browser: true*/
    var content = document.getElementsByTagName("body");
    content[0].innerHTML = html;
}
function recordArEntry() {
    "use strict";
    /*jslint browser: true*/
    /* get all relevant elements */
        entryObj = {};
    entryObj.date = dateField.innerHTML;
}
function convertEntryArrayToObj() {
    var i = 0,
        dateField,
        objArray = medLogObj.entryObjArray,
        entryArray = medLogObj.entryArray,
        length = entryArray.length;
    for (i = 0; i < length; i += 1) {
        setContent(entryArray[i]); 
        dateField = document.getElementById("dateField");
        objArray[i].date = dateField.innerHTML;
    }
    medLogObj.entryObjArray = objArray;
}
function getLogHTML() {
    "use strict";
    var logTemplate = document.getElementById("logTemplate"),
        summaryArea,
        summaryInfo,
        //name,
        entries;
    setContent("Calculating Stats");
    initStatScreen();// make sure stats have been calculated
    setContent(logTemplate.innerHTML);
    //name = document.getElementById("name"),
    summaryArea = document.getElementById("summary");
    entries = document.getElementById("entries");
    //name.innerHTML = medLogObj.username;
    summaryInfo = medLogObj.setupInfo + medLogObj.statInfo;
    summaryArea.innerHTML = summaryInfo;
    entries.innerHTML += "<center><h4>Meditation Log Entries" +
        "</h4></center>";
    medLogObj.entryArray.forEach(function (entry) {
        entries.innerHTML = entry + entries.innerHTML;
    });
    return logTemplate.innerHTML;
}

function minHrToMin(hoursMinutes) {
    "use strict";
    var hours = hoursMinutes.match(/^./),
        minutes = hoursMinutes.match(/..$/),
        result = parseInt(hours, 10)*60 + parseInt(minutes);
    return result;
}
function minToMinHr(allMinutes) {
    "use strict";
    var hours = Math.floor(allMinutes / 60),
        minutes = allMinutes % 60,
        result = "";
    if (hours > 0) {
        result =  (hours + "hr " + minutes + "min");
    } else {
        result = (minutes + " min");
    }
    return result;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}    

function reviewCalculate(notes) {
    return Math.ceil(notes.length/100) + getRandomInt(0, 2);
}
function printEntry(entry) {
    "use strict";
    const date = new Date(entry.date),
          baseDate = new Date("Feb 02 2016");
    if (!(entry.activityType === "sit" && 
            date > baseDate) || 
            entry.date === prevDate) {
        return false;
    }
    console.log("----------------------------");
    console.log(entry.date);
    if (entry.duration.length > 0) {
        var duration = entry.duration;
        var prepTime = getRandomInt(1,5);
        var reviewTime = reviewCalculate(entry.notes);
        var sessionTime = 0;
        console.log("prep time " + prepTime);
        console.log("practice time " + duration);
        console.log("review time " + reviewTime);
        if (/:/.test(duration)) {
            duration = minHrToMin(duration);
        } 
        duration = parseInt(duration, 10) + parseInt(prepTime, 10) + parseInt(reviewTime, 10);
        console.log("session time " + minToMinHr(duration));
        if (duration > 60) {
            duration = 60;
        }
        total += parseInt(duration, 10);
        console.log("total " + minToMinHr(total));
    } 
    if (entry.tod && entry.tod.length > 0) {
        console.log("tod " + entry.tod);
    } 
    if (entry.place.length > 0) {
        console.log("place " + entry.place);
    } 
    if (entry.posture.length > 0) {
        console.log("posture " + entry.posture);
    } 
    if (entry.breath.length > 0) {
        console.log("breath " + entry.breath);
    } 
    if (entry.eyes.length > 0) {
        console.log("eyes " + entry.eyes);
    } 
    if (entry.focus.length > 0) {
        console.log("focus " + entry.focus);
    } 
    if (entry.notes.length > 0) {
        console.log("notes " + entry.notes);
    } 
    prevDate = entry.date;
}

function sortByDates() {
    medLogObj.entryObjArray.sort(function (first, match) {
        return (new Date(first.date)) - (new Date(match.date));
    });
}
function init() {
    const logFile = fs.readFileSync("../.logs/" + 
        "Logan Streondj" + ".json", "utf8"),
        logFileObj = JSON.parse(logFile);
    medLogObj = logFileObj;
    //getLogHTML();
    convertEntryArrayToObj();
    sortByDates();
    medLogObj.entryObjArray.forEach(printEntry);
}

init();
