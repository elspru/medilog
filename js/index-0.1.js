console.log("initializing script");
var medLogObj = {},
    storageAvailable = false;
medLogObj.entryArray = [];
medLogObj.username = "First Last";
medLogObj.sitGoal = 12;
medLogObj.actGoal = 12;
medLogObj.dayGoal = 60;
medLogObj.setupInfo = "";
medLogObj.grandTotal = 0;
medLogObj.sitTotal = 0;
medLogObj.actTotal = 0;
medLogObj.dayTotal = 0;
function download(filename, text) {
    "use strict";
    /*jslint browser: true*/
    var element = document.createElement('a');
    element.setAttribute('href',
        'data:octet-stream;charset=utf-8,' +
        encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
function comment(message) {
    "use strict";
    /*jslint browser: true*/
    var commentArea = document.getElementById("comment");
    commentArea.innerHTML = message;
}
function minToMinHr(allMinutes) {
    "use strict";
    var hours = Math.floor(allMinutes / 60),
        minutes = allMinutes % 60,
        result = "";
    if (hours > 0) {
        result =  (hours + "hours " + minutes + " minutes");
    } else {
        result = (minutes + " minutes");
    }
    return result;
}
Array.prototype.expand = function (func) {
    "use strict";
    if (typeof func !== "function") {
        throw new TypeError("su expand be need by function ya");
    }
    /*jslint bitwise: true */
    var length = this.length >>> 0,
        result = [],
        providedThis = arguments[1],
        i,
        val,
        res;
    for (i = 0; i < length; i += 1) {
        if (i in this) {
            val = this[i];
            res = func.call(providedThis, val, i, this);
            if (res !== null && res !== undefined) {
                result = result.concat(res);
            }
        }
    }
    return result;
};
function findElementsOfEntries(queryString, length) {
    "use strict";
    var entries = medLogObj.entryArray,
        divEl = document.createElement("div"),
        matches = [];
    matches = entries.expand(function (entry) {
        var result = false;
        divEl.innerHTML = entry;
        result = divEl.querySelectorAll(queryString);
        if (result.length !== length) {
            result = undefined;
        }
        return result;
    });
    return matches;
}
function updateTotal(record) {
    "use strict";
    /*jslint browser: true*/
    console.log("updating total");
    var durationEl = document.getElementsByName("duration")[0],
        duration = parseInt(durationEl.value, 10),
        //mediField = document.getElementById("mediField"),
        mediType = document.getElementsByName("mediType")[0],
        oldActivityTotal = 0,
        oldGrandTotal = 0,
        //oldDayTotal = 0,
        newActivityTotal = 0,
        newGrandTotal = 0,
        activ_total = document.getElementById("activ-total"),
        grand_total = document.getElementById("grand-total"),
        //day_total = document.getElementById("day-total"),
        entries = medLogObj.entryArray,
        divEl = document.createElement("div"),
        lastEntry = entries[entries.length - 1],
        //lastDate,
        mediFields;
    if (lastEntry !== undefined) {
        divEl.innerHTML = lastEntry;
        oldGrandTotal = parseInt(
            divEl.querySelector("#grand-total").dataset.value,
            10
        );
        //lastDate = divEl.querySelector("#dateField").innerHTML;
        //if (lastDate === formatDate(Date.now()) {
        //}
        if (mediType.value === "sit") {
            mediFields = findElementsOfEntries(
                "#mediField[data-value=sit], #activ-total",
                2
            );
            if (mediFields.length > 0) {
                oldActivityTotal = parseInt(
                    mediFields[mediFields.length - 1][1].
                        dataset.value,
                    10
                );
            }
        } else if (mediType.value === "act") {
            mediFields = findElementsOfEntries(
                "#mediField[data-value=act], #activ-total",
                2
            );
            if (mediFields.length > 0) {
                oldActivityTotal = parseInt(
                    mediFields[mediFields.length - 1][1].
                        dataset.value,
                    10
                );
            }
        }
    }
    newActivityTotal = oldActivityTotal + duration;
    newGrandTotal = oldGrandTotal + duration;
    activ_total.innerHTML = minToMinHr(newActivityTotal);
    activ_total.dataset.value = newActivityTotal;
    //day_total.innerHTML = minToMinHr(duration + oldDayTotal);
    grand_total.innerHTML = minToMinHr(newGrandTotal);
    grand_total.dataset.value = newGrandTotal;
    medLogObj.grandTotal = newGrandTotal;
    if (record === true) {
        if (mediType.value === "sit") {
            medLogObj.sitTotal = parseInt(
                String(newActivityTotal),
                10
            );
        } else if (mediType.value === "act") {
            medLogObj.actTotal =
                parseInt(String(newActivityTotal), 10);
        }
    }
}

function setContent(html) {
    "use strict";
    /*jslint browser: true*/
    var content = document.getElementById("content");
    content.innerHTML = html;
}
function initMeditationScreen() {
    "use strict";
    /*jslint browser: true*/
    var meditation_screen = document.getElementById(
        "meditationScreen"
    );
    setContent(meditation_screen.innerHTML);
    /*var check_button = document.getElementById("check");
    check_button.addEventListener("click", updateTotal);*/
}
function updateMediType() {
    "use strict";
    var type_select =
        document.getElementsByName("mediType")[0],
        typeName_field = document.getElementById("typeName"),
        type = type_select.value;
    if (type === "sit") {
        typeName_field.innerHTML = "posture:";
    } else if (type === "act") {
        typeName_field.innerHTML = "activity:";
    }
    updateTotal();
}
function formatDate(date) {
    "use strict";
 //   var day = date.getDay(),
 //       year = date.getYear(),
 //       month = date.getMonth(),
 //       result = day + " " + month + " " + year;
    return date.toDateString();
}
function setDate() {
    "use strict";
    var date_select =
        document.getElementsByName("dateSelect")[0],
        dateSelection = date_select.value,
        date = new Date(),
        date_field = document.getElementById("dateField"),
        timezone = " EST",
        date_text;
    if (dateSelection === "today") {
        date_field.innerHTML = formatDate(date);
    } else if (dateSelection === "yesterday") {
        date.setDate(date.getDate() - 1);
        date_field.innerHTML = date.toDateString();
    } else if (dateSelection === "other") {
        date_field.innerHTML = '<input type="date" ' +
            'name="dateText" value="00 Jan 2016">dd mmm yyyy</input>';
        date_text = document.getElementsByName("dateText")[0];
        date_text.addEventListener("change", function () {
            var string = (date_text.value + timezone);
            date = new Date(string);
            date_field.innerHTML = date.toDateString();
        });
    }
}
function prettyType(mediType) {
    "use strict";
    var result = mediType;
    if (mediType === "sit") {
        result = "Sitting Meditation";
    } else if (mediType === "act") {
        result = "Mindful Activity";
    }
    return result;
}
function recordEntry() {
    "use strict";
    /*jslint browser: true*/
    /* get all relevant elements */
    var mediType = document.getElementsByName("mediType")[0],
        mediField = document.getElementById("mediField"),
        dateField = document.getElementById("dateField"),
        tod = document.getElementsByName("TOD")[0],
        todField = document.getElementById("todField"),
        place = document.getElementsByName("place")[0],
        placeField = document.getElementById("placeField"),
        posture = document.getElementsByName("posture")[0],
        postureField = document.getElementById("postureField"),
        breath = document.getElementsByName("breath")[0],
        breathField = document.getElementById("breathField"),
        eyes = document.getElementsByName("eyes")[0],
        eyesField = document.getElementById("eyesField"),
        focus = document.getElementsByName("focus")[0],
        focusField = document.getElementById("focusField"),
        duration = document.getElementsByName("duration")[0],
        durationField = document.getElementById("durationField"),
        notes = document.getElementById("notes"),
        notesField = document.getElementById("notesField"),
        recordField = document.getElementById("recordField"),
        entry = document.getElementsByClassName("entry")[0];
    /* check all required areas are filled in */
    if (dateField.getElementsByTagName("select")[0] !==
            undefined || notes.value === "") {
        comment('<div class="alert alert-danger">Please fill in' +
            " mandatory fields marked by *</div>");
        return -1;
    }
    updateTotal(true);
    comment("");
    /* convert them to HTML in place*/
    console.log("converting HTML");
    mediField.innerHTML = prettyType(mediType.value);
    mediField.dataset.value = mediType.value;
    todField.innerHTML = tod.value;
    placeField.innerHTML = place.value;
    postureField.innerHTML = posture.value;
    breathField.innerHTML = breath.value;
    eyesField.innerHTML = eyes.value;
    focusField.innerHTML = focus.value;
    durationField.innerHTML = "0:" + duration.value;
    durationField.value = duration.value;
    notesField.innerHTML = "Notes*: <br/> " + notes.value;
    recordField.innerHTML = "";
    /* record HTML as an entry */
    medLogObj.entryArray.push(entry.innerHTML);
    if (storageAvailable) {
        localStorage.setItem("username",
            JSON.stringify(medLogObj));
    }
    /*global initMainMenu*/
    initMainMenu();
}
function initMeditationLog() {
    "use strict";
    /*jslint browser: true*/
    var theEntry =
        document.getElementById("theEntry"),
        type_select,
        durationEl,
        date_select,
        record_button;
    setContent(theEntry.innerHTML);
    updateTotal();
    /* elements */
    durationEl = document.getElementsByName("duration")[0];
    type_select = document.getElementsByName("mediType")[0];
    date_select = document.getElementsByName("dateSelect")[0];
    record_button = document.getElementById("record");
    /* event listeners */
    date_select.addEventListener("change", setDate);
    durationEl.addEventListener("change", updateTotal);
    type_select.addEventListener("change", updateMediType);
    record_button.addEventListener("click", recordEntry);
}
function onlyUnique(value, index, self) {
    "use strict";
    return self.indexOf(value) === index;
}
function countDays() {
    "use strict";
    var dates = findElementsOfEntries("#dateField", 1),
        dateValues = dates.map(function (dateEl) {
            return dateEl[0].innerHTML;
        }),
        numberOfDays = 0;
    numberOfDays = dateValues.filter(onlyUnique).length;
    return numberOfDays;
}
function makePercent(decimal) {
    "use strict";
    return Math.ceil(decimal * 100) + "%";
}
function initStatScreen() {
    "use strict";
    /*jslint browser: true*/
    var stat_screen = document.getElementById("statScreen"),
        sitGoal = medLogObj.sitGoal,
        actGoal = medLogObj.actGoal,
        dayGoal = medLogObj.dayGoal,
        grandGoal = parseInt(actGoal, 10) + parseInt(sitGoal, 10),
        sitTotal = medLogObj.sitTotal,
        actTotal = medLogObj.actTotal,
        grandTotal = medLogObj.grandTotal,
        dayTotal = medLogObj.dayTotal,
        sitTotalField,
        sitPercentField,
        actTotalField,
        actPercentField,
        grandTotalField,
        grandPercentField,
        daysTotalField,
        daysPercentField;
    setContent(stat_screen.innerHTML);
    /* load fields */
    sitTotalField = document.getElementById("sitTotal");
    actTotalField = document.getElementById("actTotal");
    grandTotalField = document.getElementById("combinedTotal");
    daysTotalField = document.getElementById("daysTotal");
    sitPercentField = document.getElementById("sitPercent");
    actPercentField = document.getElementById("actPercent");
    grandPercentField = document.getElementById("combinedPercent");
    daysPercentField = document.getElementById("daysPercent");
    /* set fields */
    sitTotalField.innerHTML = minToMinHr(sitTotal);
    actTotalField.innerHTML = minToMinHr(actTotal);
    grandTotalField.innerHTML = minToMinHr(grandTotal);
    dayTotal = countDays();
    daysTotalField.innerHTML = dayTotal;
    medLogObj.dayTotal = dayTotal;
    sitPercentField.innerHTML = makePercent(
        sitTotal / (sitGoal * 60)
    );
    actPercentField.innerHTML = makePercent(
        actTotal / (actGoal * 60)
    );
    grandPercentField.innerHTML = makePercent(
        grandTotal / (grandGoal * 60)
    );
    daysPercentField.innerHTML = makePercent(
        dayTotal / dayGoal
    );
}
function downloadLog() {
    "use strict";
    var logTemplate = document.getElementById("logTemplate"),
        summaryArea,
        //name,
        entries;
    setContent(logTemplate.innerHTML);
    //name = document.getElementById("name"),
    summaryArea = document.getElementById("summary");
    entries = document.getElementById("entries");
    //name.innerHTML = medLogObj.username;
    summaryArea.innerHTML = medLogObj.setupInfo;
    medLogObj.entryArray.forEach(function (entry) {
        entries.innerHTML += entry;
    });
    download(medLogObj.username + "_meditation_log.html",
        logTemplate.innerHTML);
}
function initRemovalScreen() {
    "use strict";
    var content = document.getElementById("content"),
        divEl = document.createElement("div");
        //removal_button;
    /*display all entries in content*/
    medLogObj.entryArray.forEach(function (entry) {
        /*add remove buttons to end of entries*/
        divEl.innerHTML = entry;
        //divEl.querySelector("#recordField");
        content.innerHTML += "Blah";
    });
    /*add event listeners to each button
        that will remove that particular entry */
}
function initMainMenu() {
    "use strict";
    /*jslint browser: true*/
    var mainMenu_screen = document.getElementById("mainMenu"),
        //meditate_button,
        addEntry_button,
        //delEntry_button,
        stats_button,
        download_button;
    setContent(mainMenu_screen.innerHTML);
    //meditate_button = document.getElementById("meditate");
    addEntry_button = document.getElementById("addEntry");
    //delEntry_button = document.getElementById("delEntry");
    stats_button    = document.getElementById("stats");
    download_button = document.getElementById("download");
    //meditate_button.addEventListener("click", initMeditationScreen);
    addEntry_button.addEventListener("click", initMeditationLog);
    //delEntry_button.addEventListener("click", initRemovalScreen);
    stats_button.addEventListener("click", initStatScreen);
    download_button.addEventListener("click", downloadLog);
}
function initSetup() {
    "use strict";
    /*jslint browser: true*/
    var setupScreen = document.getElementById("setupScreen"),
        name,
        sitGoal,
        actGoal,
        dayGoal,
        acceptField,
        accept_button,
        nameField,
        sitField,
        actField,
        dayField,
        setupDiv;
    setContent(setupScreen.innerHTML);
    name = document.getElementsByName("name")[0];
    sitGoal = document.getElementsByName("sitGoal")[0];
    actGoal = document.getElementsByName("actGoal")[0];
    dayGoal = document.getElementsByName("dayGoal")[0];
    accept_button = document.getElementById("accept");
    acceptField = document.getElementById("acceptField");
    nameField = document.getElementById("nameField");
    sitField = document.getElementById("sitField");
    actField = document.getElementById("actField");
    dayField = document.getElementById("dayField");
    setupDiv = document.getElementById("setupDiv");
    name.value = medLogObj.username;
    sitGoal.value = medLogObj.sitGoal;
    actGoal.value = medLogObj.actGoal;
    dayGoal.value = medLogObj.dayGoal;
    accept_button.addEventListener("click", function () {
        medLogObj.username = name.value;
        medLogObj.sitGoal = sitGoal.value;
        medLogObj.actGoal = actGoal.value;
        medLogObj.dayGoal = dayGoal.value;
        nameField.innerHTML = name.value;
        sitField.innerHTML = sitGoal.value;
        actField.innerHTML = actGoal.value;
        dayField.innerHTML = dayGoal.value;
        acceptField.innerHTML = "";
        medLogObj.setupInfo = setupDiv.innerHTML;
        if (storageAvailable) {
            localStorage.setItem("username",
                JSON.stringify(medLogObj));
        }
        initMainMenu();
    });
}
function checkStorage() {
    "use strict";
    if (typeof (Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
        storageAvailable = true;
    } else {
    // Sorry! No Web Storage support..
        storageAvailable = false;
        comment("no local storage available, so you'll have to " +
            "download your logs before closing the tab");
    }
}
function init() {
    "use strict";
    checkStorage();
    var menu_button = document.getElementById("menu"),
        setup_button = document.getElementById("setup"),
        addEntry_button = document.getElementById("DaddEntry"),
        stats_button    = document.getElementById("Dstats"),
        download_button = document.getElementById("Ddownload"),
        storedMedLogObj;
    if (storageAvailable) {
        storedMedLogObj = localStorage.getItem("username");
        if (storedMedLogObj) {
            medLogObj = JSON.parse(storedMedLogObj);
        }
    }
    menu_button.addEventListener("click", initMainMenu);
    setup_button.addEventListener("click", initSetup);
    addEntry_button.addEventListener("click", initMeditationLog);
    stats_button.addEventListener("click", initStatScreen);
    download_button.addEventListener("click", downloadLog);
    initSetup();
}

init();
