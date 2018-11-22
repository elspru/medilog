console.log("initializing script");
    
var medLogObj = {},
    storageAvailable = false,
    socket,
    online = false,
    stat = {}, 
    defaultObj = {},
    Entry = function () {
        "use strict";
        this.type = "";
        this.date = new Date();
        this.tod = "";
        this.place = "";
        this.posture = "";
        this.breath = "";
        this.eyes = "";
        this.focus  = "";
        this.duration = 0;
        this.notes = "";
    };
function Stat() {
    this.total = 0;
    this.actTotal = 0;
    this.sitTotal = 0;
    this.daysTotal = 0;
    this.totalDays = 0;
    this.actDays = 0;
    this.sitDays = 0;
    this.prevDate = new Date(0);
    this.prevSitDate = new Date(0);
    this.prevActDate = new Date(0);
}
stat = new Stat();
function getUser(name) {
    var tempLog = localStorage.getItem(name),
        resultLog;
    if (tempLog) {
        resultLog = JSON.parse(tempLog);
    } else {
        resultLog = new LogObj(name);
    }
    return resultLog;
}
function storeLocally  () {
    if (storageAvailable) {
        localStorage.setItem("username",
            JSON.stringify(medLogObj));
        localStorage.setItem(medLogObj.username.toLowerCase(),
            JSON.stringify(medLogObj));
    }
}


/* start daylight savings time checker */
Date.prototype.stdTimezoneOffset = function() {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}


Date.prototype.dst = function() {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
}
Date.prototype.getLocalHours = function() {
    var utcHours = this.getUTCHours(),
        offsetHours = this.getTimezoneOffset()/60;
    if (utcHours < offsetHours) {
        utcHours += 24;
    }   
    return utcHours - offsetHours;
}
function nodeListToArray(nl) {
    var arr = [];
    for(var i = 0, n; n = nl[i]; ++i) arr.push(n);
    return arr;
}
/* end daylight savings time checker */
defaultObj.username = "First Last";
function LogObj(username) {
    this.entryArray = [];
    if (username) {
        this.username = username;
    } else {
        this.username = defaultObj.username;
    }
    this.theme = "auto";
    this.sitGoal = 4;
    this.actGoal = 4;
    this.dayGoal = 20;
    this.setupInfo = "";
    this.statInfo = "";
    this.grandTotal = 0;
    this.sitTotal = 0;
    this.actTotal = 0;
    this.dayTotal = 0;
    this.entryObjArray = [];
}
medLogObj.entryArray = [];
medLogObj.username = defaultObj.username;
medLogObj.theme = "auto";
medLogObj.sitGoal = 4;
medLogObj.actGoal = 4;
medLogObj.dayGoal = 20;
medLogObj.setupInfo = "";
medLogObj.statInfo = "";
medLogObj.grandTotal = 0;
medLogObj.sitTotal = 0;
medLogObj.actTotal = 0;
medLogObj.dayTotal = 0;
medLogObj.entryObjArray = [];

function ping(ip, callback) {

    if (!this.inUse) {
        this.status = 'unchecked';
        this.inUse = true;
        this.callback = callback;
        this.ip = ip;
        var _that = this;
        this.img = new Image();
        this.img.onload = function () {
            _that.inUse = false;
            _that.callback('responded');
        };
        this.img.onerror = function (e) {
            if (_that.inUse) {
                _that.inUse = false;
                _that.callback('error', e);
            }
        };
        this.start = new Date().getTime();
        this.img.src = "http://" + ip;
        this.timer = setTimeout(function () {
            if (_that.inUse) {
                _that.inUse = false;
                _that.callback('timeout');
            }
        }, 1500);
    }
}

function setTheme(theme) {
    var cssElem,
        date,
        hour;
    console.log("theme " + theme);
    cssElem = document.getElementById("appStyleSheet");
            cssElem.href = "css/style-day.css";
    if (theme === "day") {
            cssElem.href = "css/style-day.css";
    } else if (theme === "night") {
            cssElem.href = "css/style-night.css";
    } else if (theme === "auto") {
        date = new Date();
        hour = date.getLocalHours();
        if (date.dst()) {
            hour -= 1;
        }
        if (hour > 6 && hour < 18) {
            cssElem.href = "css/style-day.css";
        } else {
            cssElem.href = "css/style-night.css";
        }
    }
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
        if (this.hasOwnProperty(i)) {
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
function initMeditation(mediObj) {
    function endMeditation() {
        setFlashing(0);
        clearInterval(reentrainInterval);
        clearTimeout(meditationTimer);
        clearTimeout(meditationEnder);
        audioEntrain.pause();
        audioReentrain.pause();
        audioTimer.pause();
        audioOutro = new Audio("sounds/medi-complete.opus");
        audioOutro.play();
        endTime = new Date();
        duration = Math.round((endTime - startTime)/1000/60);
        if (duration < 1) { 
            initMeditationScreen();
        } else {
            mediObj.realDuration = duration;
            initMeditationLog(mediObj);
        }
    }
    function setFlashing(hertz) {
        if (hertz === 0) {
            imgStyle.innerHTML = "";
            return "";
        }
        animationDuration = Math.round(1/hertz*1000)/1000;
        numberOfIterations = 1*60*hertz;
        imgStyle.innerHTML = "";
        imgStyle.innerHTML = "ellipse{animation-duration:" +
            animationDuration +"s;animation-iteration-count:" +
            numberOfIterations + ";}";
    }
    var startTime = new Date(),
        endTime,
        duration,
        phiCirc,
        imgStyle,
        meditationTimer,
        meditationEnder,
        entrainFile,
        outroFile,
        hertz = 0,
        ohertz = 0,
        audioEntrain = new Audio(),
        audioReentrain = new Audio(),
        audioTimer = new Audio(),
        audioOutro = new Audio(),
        waveLength = 0,
        numberOfIterations,
        animationDuration,
        reentrainInterval,
        meditation_screen = document.
            getElementById("meditatingScreen");
    medLogObj.mediObj = mediObj;
    storeLocally();
    setContent(meditatingScreen.innerHTML);
    imgStyle = document.getElementById("imgStyle");
    phiCirc = document.getElementById("phiCirc");
    phiCirc.addEventListener("click", function () {
        endMeditation();
    });
    if (mediObj.brainwave === "sigma") {
        hertz = 13;
        entrainFile = "sounds/sigma-intro.opus";
    } else if (mediObj.brainwave === "none") {
        hertz = 0;
        entrainFile = "";
    } else if (mediObj.brainwave === "theta") {
        hertz = 6.3;
        entrainFile = "sounds/theta-intro.opus";
    } else if (mediObj.brainwave === "alpha") {
        hertz = 10;
        entrainFile = "sounds/alpha-intro.opus";
    } else if (mediObj.brainwave === "delta") {
        hertz = 3.5;
        entrainFile = "sounds/delta-intro.opus";
    } else if (mediObj.brainwave === "schuman") {
        hertz = 7.83;
        entrainFile = "sounds/schuman-intro.opus";
    } else if (mediObj.brainwave === "beta") {
        hertz = 22;
        entrainFile = "sounds/beta-intro.opus";
    } else if (mediObj.brainwave === "gamma") {
        hertz = 39.5;
        entrainFile = "sounds/gamma-intro.opus";
    }
    if (mediObj.reentrain > 0) {
        reentrainInterval = setInterval(function () {
            setFlashing(hertz);
            audioReentrain = new Audio(entrainFile);
            audioReentrain.play();
        }, (mediObj.reentrain) * 60 * 1000);
    }
    if (mediObj.timer === true) {
        if (mediObj.duration >= 2) {
            if (mediObj.outro === "sigma") {
                ohertz = 13;
                outroFile = "sounds/sigma-intro.opus";
            } else if (mediObj.outro === "none") {
                ohertz = 0;
                outroFile = "";
            } else if (mediObj.outro === "theta") {
                ohertz = 6.3;
                outroFile = "sounds/theta-intro.opus";
            } else if (mediObj.outro === "alpha") {
                ohertz = 10;
                outroFile = "sounds/alpha-intro.opus";
            } else if (mediObj.outro === "delta") {
                ohertz = 3.5;
                outroFile = "sounds/delta-intro.opus";
            } else if (mediObj.outro === "schuman") {
                ohertz = 7.83;
                outroFile = "sounds/schuman-intro.opus";
            } else if (mediObj.outro === "beta") {
                ohertz = 22;
                outroFile = "sounds/beta-intro.opus";
            } else if (mediObj.outro === "gamma") {
                ohertz = 39.5;
                outroFile = "sounds/gamma-intro.opus";
            }
        }
        meditationTimer = setTimeout(function () {
            setFlashing(ohertz);
            audioReentrain.pause();
            audioTimer = new Audio(outroFile);
            audioTimer.play();
            meditationEnder = setTimeout(function () {
                endMeditation();
            }, 60000);
        }, (mediObj.duration - 1) * 60 * 1000 + 200);
    }
    if (mediObj.flashing) {
        setFlashing(hertz);
    }
    audioEntrain = new Audio(entrainFile);
    audioEntrain.play();
}
function initMeditationScreen() {
    "use strict";
    /*jslint browser: true*/
    var meditation_screen = document.
            getElementById("meditationScreen"),
        brainwave_select,
        stopwatch_button,
        timer_button,
        timer_select,
        outro_select,
        elOption,
        reentrain_select,
        flashing_box,
        begin_button,
        mediObj = {};
    setContent(meditation_screen.innerHTML);
    /* get elements */
    brainwave_select = document.getElementById("brainwave");
    stopwatch_button = document.getElementById("watchButton");
    timer_button = document.getElementById("timerButton");
    timer_select = document.getElementById("timer");
    outro_select = document.getElementById("outro");
    reentrain_select = document.getElementById("reentrain");
    flashing_box = document.getElementById("flashing");
    begin_button = document.getElementById("mediButton");
    /* set up mediObj */
    if (!medLogObj.mediObj) {
        mediObj.watch = true;
        mediObj.timer = false;
        mediObj.brainwave = "sigma";
        mediObj.outro = "sigma";
        mediObj.duration = 12;
        mediObj.reentrain = 20;
        mediObj.flashing = false;
    } else {
        console.log(medLogObj.mediObj);
        mediObj = medLogObj.mediObj;
        elOption = document.createElement("option");
        elOption.text = mediObj.brainwave
        elOption.value = mediObj.brainwave;
        brainwave_select.add(elOption, 0);
        brainwave_select.selectedIndex = 0;
        elOption = document.createElement("option");
        elOption.text = mediObj.duration;
        elOption.value = mediObj.duration;
        timer_select.add(elOption, 0);
        timer_select.selectedIndex = 0;
        elOption = document.createElement("option");
        elOption.text = mediObj.reentrain;
        elOption.value = mediObj.reentrain;
        reentrain_select.add(elOption, 0);
        reentrain_select.selectedIndex = 0;
        elOption = document.createElement("option");
        elOption.text = mediObj.outro;
        elOption.value = mediObj.outro;
        outro_select.add(elOption, 0);
        outro_select.selectedIndex = 0;
        if (mediObj.timer === true) {
            timer_button.click();
        }
        flashing_box.checked = mediObj.flashing;
    }
    /* set old values */
    /* add listeners*/
    brainwave_select.addEventListener("change", function() {
        mediObj.brainwave = brainwave_select.value;
    });
    outro_select.addEventListener("change", function() {
        mediObj.outro = outro_select.value;
    });
    timer_select.addEventListener("change", function() {
        mediObj.duration = timer_select.value;
    });
    reentrain_select.addEventListener("change", function() {
        mediObj.reentrain = reentrain_select.value;
    });
    flashing_box.addEventListener("change", function() {
        console.log(flashing_box.checked);
        mediObj.flashing = flashing_box.checked;
    });
    stopwatch_button.addEventListener("click", function() {
        mediObj.watch = true;
        mediObj.timer = false;
    });
    timer_button.addEventListener("click", function() {
        mediObj.watch = false;
        mediObj.timer = true;
    });
    begin_button.addEventListener("click", function() {
        initMeditation(mediObj);
    });
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
        date_field.innerHTML = '<input ' +
            'name="dateText" value="00 Apr 2016">dd mmm yyyy</input>';
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
function onlyUnique(value, index, self) {
    "use strict";
    return self.indexOf(value) === index;
}
function countSitDays() {
    "use strict";
    var dates = findElementsOfEntries(
        "#mediField[data-value=sit], #dateField", 2),
        dateValues = dates.map(function (dateEl) {
            return dateEl[1].innerHTML;
        }),
        numberOfDays = 0;
    numberOfDays = dateValues.filter(onlyUnique).length;
    return numberOfDays;
}
function countActDays() {
    "use strict";
    var dates = findElementsOfEntries(
        "#mediField[data-value=act], #dateField", 2),
        dateValues = dates.map(function (dateEl) {
            return dateEl[1].innerHTML;
        }),
        numberOfDays = 0;
    numberOfDays = dateValues.filter(onlyUnique).length;
    return numberOfDays;
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
        content = document.getElementById("content"),
        sitDaysTotal,
        actDaysTotal,
        sitTotalField,
        sitPercentField,
        actTotalField,
        actPercentField,
        grandTotalField,
        grandPercentField,
        daysTotalField,
        daysPercentField,
        sitDaysTotalField,
        sitDaysPercentField,
        actDaysTotalField,
        actDaysPercentField;
    setContent(stat_screen.innerHTML);
    /* load fields */
    sitTotalField = document.getElementById("sitTotal");
    actTotalField = document.getElementById("actTotal");
    grandTotalField = document.getElementById("combinedTotal");
    daysTotalField = document.getElementById("daysTotal");
    actDaysTotalField = document.getElementById("actDaysTotal");
    sitDaysTotalField = document.getElementById("sitDaysTotal");
    actDaysPercentField = document.getElementById("actDaysPercent");
    sitDaysPercentField = document.getElementById("sitDaysPercent");
    sitPercentField = document.getElementById("sitPercent");
    actPercentField = document.getElementById("actPercent");
    grandPercentField = document.getElementById("combinedPercent");
    daysPercentField = document.getElementById("daysPercent");
    /* set fields */
    sitTotalField.innerHTML = minToMinHr(sitTotal);
    actTotalField.innerHTML = minToMinHr(actTotal);
    grandTotalField.innerHTML = minToMinHr(grandTotal);
    dayTotal = countDays();
    sitDaysTotal = countSitDays();
    actDaysTotal = countActDays();
    daysTotalField.innerHTML = dayTotal;
    actDaysTotalField.innerHTML = actDaysTotal;
    sitDaysTotalField.innerHTML = sitDaysTotal;
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
    sitDaysPercentField.innerHTML = makePercent(
        sitDaysTotal / dayGoal
    );
    actDaysPercentField.innerHTML = makePercent(
        actDaysTotal / dayGoal
    );
    daysPercentField.innerHTML = makePercent(
        dayTotal / dayGoal
    );
    medLogObj.statInfo = content.innerHTML;
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
        brainwaveField = document.getElementById("brainwaveField"),
        brainwave = document.getElementById("brainwave"),
        duration = document.getElementsByName("duration")[0],
        durationField = document.getElementById("durationField"),
        notes = document.getElementById("notes"),
        notesField = document.getElementById("notesField"),
        recordField = document.getElementById("recordField"),
        entry = document.getElementById("entry"),
        entryObj = {};
    /* check all required areas are filled in */
    if (dateField.getElementsByTagName("select")[0] !==
            undefined || notes.value === "" ||
            mediType.value === "") {
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
    entryObj.activityType = mediType.value;
    todField.innerHTML = tod.value;
    entryObj.date = dateField.innerHTML;
    entryObj.tod = tod.value;
    placeField.innerHTML = place.value;
    entryObj.place = place.value;
    postureField.innerHTML = posture.value;
    entryObj.posture = posture.value;
    breathField.innerHTML = breath.value;
    entryObj.breath = breath.value;
    eyesField.innerHTML = eyes.value;
    entryObj.eyes = eyes.value;
    focusField.innerHTML = focus.value;
    entryObj.focus = focus.value;
    entryObj.brainwave = brainwave.value;
    durationField.innerHTML = "0:" + duration.value;
    durationField.dataset.value = duration.value;
    entryObj.duration = duration.value;
    notesField.innerHTML = "Notes*: <br/> " + notes.value;
    entryObj.notes = notes.value;
    recordField.innerHTML = "";
    /* record HTML as an entry */
    medLogObj.entryArray.push(entry.innerHTML);
    medLogObj.entryObjArray.push(entryObj);
    storeLocally();
    /*global initMainMenu*/
    if (online) {
        socket.send(medLogObj.username + " recorded entry");
        uploadToServer();
    }
    initStatScreen();
}
function recordArEntry() {
    "use strict";
    /*jslint browser: true*/
    /* get all relevant elements */
    var mediField = document.getElementById("mediField"),
        dateField = document.getElementById("dateField"),
        todField = document.getElementById("todField"),
        placeField = document.getElementById("placeField"),
        postureField = document.getElementById("postureField"),
        breathField = document.getElementById("breathField"),
        eyesField = document.getElementById("eyesField"),
        focusField = document.getElementById("focusField"),
        durationField = document.getElementById("durationField"),
        notesField = document.getElementById("notesField"),
        recordField = document.getElementById("recordField"),
        entryObj = {};
    /* check all required areas are filled in */
    comment("");
    /* convert them to HTML in place*/
    console.log("converting HTML");
    entryObj.activityType = mediField.dataset.value;
    entryObj.date = dateField.innerHTML;
    entryObj.tod = todField.innerHTML;
    entryObj.place = placeField.innerHTML;
    entryObj.posture = postureField.innerHTML;
    entryObj.breath = breathField.innerHTML;
    entryObj.eyes = eyesField.innerHTML;
    entryObj.focus = focusField.innerHTML;
    if (durationField.dataset.value) {
        entryObj.duration = durationField.dataset.value;
    } else {
        entryObj.duration = durationField.innerHTML;
    }
    entryObj.notes = notesField.innerHTML;
    /* record HTML as an entry */
    medLogObj.entryObjArray.push(entryObj);
    storeLocally();
    /*global initMainMenu*/
    initStatScreen();
}
function initMeditationLog(mediObj) {
    "use strict";
    /*jslint browser: true*/
    var theEntry =
        document.getElementById("theEntry"),
        type_select,
        focus,
        focusField,
        durationEl,
        durationField,
        durationOption,
        brainwaveField,
        brainwaveOption,
        date_field,
        date_select,
        tod_select,
        brainwave,
        date,
        hour,
        record_button;
    setContent(theEntry.innerHTML);
    updateTotal();
    /* elements */
    focus = document.getElementsByName("focus")[0];
    focusField = document.getElementById("focusField");
    durationEl = document.getElementsByName("duration")[0];
    type_select = document.getElementsByName("mediType")[0];
    record_button = document.getElementById("record");
    /* mediObj settings */
    console.log(mediObj.realDuration);
    if (mediObj.realDuration) {
        durationOption = document.createElement("option");
        durationOption.text = minToMinHr(mediObj.realDuration);
        durationOption.value = mediObj.realDuration;
        durationEl.add(durationOption, 0);
        durationEl.selectedIndex = 0;
        /* set time of day */
        tod_select = document.getElementsByName("TOD")[0];
        date = new Date();
        hour = date.getLocalHours();
        if (hour < 4) {
            tod_select.selectedIndex = 4;
        } else if (hour < 10) {
            tod_select.selectedIndex = 1;
        } else if (hour < 16) {
            tod_select.selectedIndex = 2;
        } else if (hour < 22) {
            tod_select.selectedIndex = 3;
        } else if (hour < 24) {
            tod_select.selectedIndex = 4;
        }
    } 
    if (mediObj.brainwave) {
        brainwave = document.getElementById("brainwave");
        brainwaveOption = document.createElement("option");
        brainwaveOption.text = mediObj.brainwave;
        brainwaveOption.value = mediObj.brainwave;
        brainwave.add(brainwaveOption, 0);
        brainwave.selectedIndex = 0;
    } 
    date_select = document.getElementsByName("dateSelect")[0];
    date_select.addEventListener("change", setDate);
    if (mediObj.realDuration) {
        date_field = document.getElementById("dateField");
        date_field.innerHTML = formatDate(new Date());
    } 
    /* event listeners */
    durationEl.addEventListener("change", updateTotal);
    type_select.addEventListener("change", updateMediType);
    record_button.addEventListener("click", recordEntry);
    focus.addEventListener("change", function() {
        if (focus.value === "other") {
            focusField.innerHTML = 
                'please specify: <input class="form-control"' + 
                ' type="text" name="focus" />';
        }
    });
    
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
function convertEntryArrayToObj() {
    var theEntry = document.getElementById("theEntry");
    medLogObj.entryObjArray = [];
    medLogObj.entryArray.forEach(function (arEntry) {
        setContent(arEntry); 
        recordArEntry();
    });
}

function getLogData() {
    var tempObj = medLogObj;
    tempObj.password = "";
    return tempObj;
}

function stringifyEntry(entry) {
    "use strict";
    const date = new Date(entry.date);
    var returnBuffer = "",
        duration,
        sessionTime;
    returnBuffer = ("<p>");
    returnBuffer += "type: " + entry.activityType;
    returnBuffer += "<br/> date: " + (entry.date);
    if (entry.duration.length > 0) {
        duration = entry.duration,
        sessionTime = 0;
        if (/:/.test(duration)) {
            duration = minHrToMin(duration);
        } 
        duration = parseInt(duration, 10);
        returnBuffer += "<br/>" + ("duration: " +
            minToMinHr(duration));
        stat.total += duration;
        returnBuffer += "<br/>" + ("total: " +
            minToMinHr(stat.total));
        if (entry.activityType === "sit") {
            stat.sitTotal += duration;
            returnBuffer += "<br/>" + ("sit total: " +
                minToMinHr(stat.sitTotal));
        }
        if (entry.activityType === "act") {
            stat.actTotal += duration;
            returnBuffer += "<br/>" + ("act total: " +
                minToMinHr(stat.actTotal));
        }
    } 
    if (date.getTime() === stat.prevDate.getTime()) {
        stat.daysTotal += parseInt(duration, 10);
        returnBuffer += "<br/>" + ("day's total: " +
            minToMinHr(stat.daysTotal));
    } else {
        stat.daysTotal = parseInt(duration, 10);
        stat.totalDays += 1;
        returnBuffer += "<br/>" + ("total days: " +
            stat.totalDays);
    }
    if (date.getTime() !== stat.prevSitDate.getTime() &&
            entry.activityType === "sit") {
        stat.sitDays += 1;
        returnBuffer += "<br/>" + ("sit days: " + stat.sitDays);
        stat.prevSitDate = date;
    } else if (date.getTime() !== stat.prevActDate.getTime() &&
            entry.activityType === "act") {
        stat.actDays += 1;
        returnBuffer += "<br/>" + ("act days: " + stat.actDays);
        stat.prevActDate = date;
    }
    console.log(" dates " + date.getTime() + "|" +
        stat.prevDate.getTime() + " " +
        (date.getTime() == stat.prevDate.getTime()).toString());
    if (entry.tod && entry.tod.length > 0) {
        returnBuffer += "<br/>" + ("time of day: " + entry.tod);
    } 
    if (entry.place.length > 0) {
        returnBuffer += "<br/>" + ("place: " + entry.place);
    } 
    if (entry.posture.length > 0) {
        returnBuffer += "<br/>" + ("posture: " + entry.posture);
    } 
    if (entry.breath.length > 0) {
        returnBuffer += "<br/>" + ("breath " + entry.breath);
    } 
    if (entry.eyes.length > 0) {
        returnBuffer += "<br/>" + ("eyes " + entry.eyes);
    } 
    if (entry.focus.length > 0) {
        returnBuffer += "<br/>" + ("focus " + entry.focus);
    } 
    if (entry.brainwave && entry.brainwave.length > 0) {
        returnBuffer += "<br/>" + ("brainwave " + entry.focus);
    } 
    if (entry.notes.length > 0) {
        returnBuffer += "<br/>" + ("notes " + entry.notes);
    } 
    returnBuffer += "</p>"
    stat.prevDate = date;
    return returnBuffer;
}

function getLogString() {
    var returnString = "";
    medLogObj.entryObjArray.forEach(function (entry) {
        returnString = stringifyEntry(entry) + returnString;
    });
    return returnString;
}

function sortByDates() {
    medLogObj.entryObjArray.sort(function (first, match) {
        return (new Date(first.date)) - (new Date(match.date));
    });
}
function initViewLog() {
    "use strict";
    stat = new Stat();
    sortByDates();
    setContent(getLogString());
    console.log(JSON.stringify(medLogObj.entryObjArray));
    //getLogHTML();
}
function downloadLog() {
    "use strict";
    var logHTML = getLogHTML();
    download(medLogObj.username + "_meditation_log.html",
        logHTML);
}
function initRemovalScreen() {
    "use strict";
    var content = document.getElementById("content"),
        divEl = document.createElement("div");
    /*display all entries in content*/
    medLogObj.entryArray.forEach(function (entry) {
        /*add remove buttons to end of entries*/
        divEl.innerHTML = entry;
        content.innerHTML += "Blah";
    });
    /*add event listeners to each button
        that will remove that particular entry */
}
function uploadToServer() {
            var data = getLogData();
            data.request = "upload";
            socket.send(JSON.stringify(data)); 
            /*Data can be sent to server very easily by using 
            socket.send() method The data has to be changed to 
            a JSON before sending it (JSON.stringify() does this
            job )*/
            /* This triggers a message event on the server side 
            and the event handler obtains the data sent */ 
            //socket = io.disconnect();
}
function initMainMenu() {
    "use strict";
    /*jslint browser: true*/
    var mainMenu_screen = document.getElementById("mainMenu"),
        meditate_button,
        addEntry_button,
        //delEntry_button,
        stats_button,
        viewLog_button,
        download_button,
        serverUpload,
        login_button;
    setContent(mainMenu_screen.innerHTML);
    meditate_button = document.getElementById("meditate");
    addEntry_button = document.getElementById("addEntry");
    //delEntry_button = document.getElementById("delEntry");
    stats_button    = document.getElementById("stats");
    viewLog_button = document.getElementById("viewLog");
    download_button = document.getElementById("download");
    serverUpload = document.getElementById("toServer");
    login_button = document.getElementById("loginButton");
    meditate_button.addEventListener("click", initMeditationScreen);
    addEntry_button.addEventListener("click", initMeditationLog);
    //delEntry_button.addEventListener("click", initRemovalScreen);
    stats_button.addEventListener("click", initStatScreen);
    viewLog_button.addEventListener("click", initViewLog);
    download_button.addEventListener("click", downloadLog);
    if (online === true) {
        serverUpload.addEventListener("click", uploadToServer);
        login_button.addEventListener("click", initRegistration);
    } else {
        serverUpload.addEventListener("click", function() {
            comment('<div class="alert alert-danger">'+
                "server appears to be offline</div>");
        });
        login_button.addEventListener("click", function() {
            comment('<div class="alert alert-danger">'+
                "server appears to be offline</div>");
        });
    }
}
function initSetup() {
    "use strict";
    /*jslint browser: true*/
    var setupScreen = document.getElementById("setupScreen"),
        name,
        sitGoal,
        actGoal,
        dayGoal,
        themeRadio,
        acceptField,
        accept_button,
        nameField,
        sitField,
        actField,
        dayField,
        setupDiv;
    setContent(setupScreen.innerHTML);
    name = document.getElementsByName("name")[0];
    themeRadio = document.getElementsByName("theme");
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
    themeRadio = nodeListToArray(themeRadio);
    if (medLogObj.theme === "auto") {
        themeRadio[0].checked = true;
    } else if (medLogObj.theme === "day") {
        themeRadio[1].checked = true;
    } else if (medLogObj.theme === "night") {
        themeRadio[2].checked = true;
    }
    themeRadio.forEach(function (radioElem) {
       radioElem.addEventListener("click", function () {
            if (radioElem.checked) {
                setTheme(radioElem.value);
                medLogObj.theme = radioElem.value;
            }
        }); 
    });
    accept_button.addEventListener("click", function () {
        var tempLog;
        if (name.value !== medLogObj.username && localStorage) {
            medLogObj = getUser(name.value);
            storeLocally();
        }
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
        storeLocally();
        if (online) {
            socket.send(name.value + " accepted"); 
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
function initRegistration() {
    var passwordPage,
        username_field,
        email_field,
        password_field,
        rpassword_field,
        remember_box,
        login_button,
        offline_button;
    passwordPage = document.getElementById("register");
    setContent(passwordPage.innerHTML);
    username_field = document.getElementById("username");
    email_field = document.getElementById("email");
    password_field = document.getElementById("password");
    rpassword_field = document.getElementById("rpassword");
    remember_box = document.getElementById("remember");
    login_button = document.getElementById("login");
    offline_button = document.getElementById("offline");
    username_field.value = medLogObj.username;
    if (medLogObj.email) {
        email_field.value = medLogObj.email;
    }
    if (medLogObj.password) {
        password_field.value = medLogObj.password;
    }
    if (medLogObj.remember === false ||
            medLogObj.remember === true) {
        remember_box.checked = medLogObj.remember;
    }
    offline_button.addEventListener("click", function() {
        online = false;
        initMeditationScreen();
    });
    login_button.addEventListener("click", function() {
        comment(""); 
        /* copy all fields to memory */
        medLogObj.username = username_field.value;
        if (username_field.value !== medLogObj.username &&
                localStorage) {
            medLogObj = getUser(username_field.value);
            storeLocally();
        }
        medLogObj.email = email_field.value;
        medLogObj.remember = remember_box.checked;
        /* check passwords are matching */
        if (password_field.value !== rpassword_field.value) {
            comment('<div class="alert alert-danger">' +
                " Passwords are not matching</div>");
            initRegistration();
        } else {
            comment('<div class="alert alert-success">' +
                " Passwords matching</div>");
            medLogObj.password = password_field.value;
            storeLocally();
            var saltRequest = {
                username: medLogObj.username,
                request: "salt"
            };
            socket.send(saltRequest);
            initMeditationScreen();
        }
    });
}

function initSocket() {
    /*Initializing the connection with the server via websockets */
    socket.on("message",function(message){  
        /*
            When server sends data to the client it will trigger
            "message" event on the client side, by using 
            socket.on("message"), one can listen for the message
            event and associate a callback to be executed. 
            The Callback function gets the dat sent from the 
            server 
        */
        var tempLogOBj;
        console.log("Message from the server arrived")
        if (message === null) {
            console.log (" null ");
            return false;
        }
        message = JSON.parse(message);
        console.log(message); 
        if (message.salt) {
            salt = message.salt;
            if (!medLogObj.password) {
                console.log("loading password page");
                initRegistration();
            } else {
                socket.send(JSON.stringify((getPwdKey(
                    medLogObj.password, salt))));
            }
        } else if (message.session &&
                message.data === "password accepted"){
            medLogObj.session = message.session;
            if (message.logObj.length > 0) {
            tempLogObj = JSON.parse(message.logObj);
                if (tempLogObj.entryObjArray &&
                    tempLogObj.entryObjArray.length >
                    medLogObj.entryObjArray.length &&
                    medLogObj.password) {
                    tempLogObj.password = medLogObj.password;
                    medLogObj = tempLogObj;
                } else if (tempLogObj.entryArray) {
                    tempLogObj.password = medLogObj.password;
                    medLogObj = tempLogObj;
                }
            }
            comment("<p></p>");
            initMeditationScreen();
            return true;
        }
        /*converting the data into JS object */
        if (message.data === 
                "Connection with the server established") {
            var saltRequest = {
                username: medLogObj.username,
                request: "salt"
            };
            socket.send(saltRequest);
        } else if (message.data === "salt") {
        } else if (message.data) {
            comment('<div class="alert alert-info">' +
                message.data +  "</div>");
        }
    });
}
/* compute PBKDF2 on the password. */
function getPwdKey(password, salt) {
    var newStuff = {},
        keyOBj;
    newStuff.salt = salt;
    keyObj = (sjcl.misc.cachedPbkdf2(password,
            newStuff));
    keyObj.username = medLogObj.username;
    keyObj.data = "key";
    return keyObj;
}

function checkIfOnline() {
    "use strict";
    var lineStatus = false;
    if (!navigator.onLine) {
        console.log("navigator offline");
        lineStatus = false;
    } else {
        console.log("navigator online");
        lineStatus = true;
        ping("wyn.bot.nu:8087/img/phiEye-32bw.png", function
                (status, e)    {
            console.log("ping: " + status + " " +
                JSON.stringify(e));
            if (status === 'responded') {
                lineStatus = true;
            } else {
                lineStatus = false;
            }
        });
    }
    return lineStatus;
}

function init() {
    "use strict";
    /* if firefox remove designed for area start */
    if (typeof InstallTrigger !== 'undefined') {
        document.getElementById("designed").innerHTML = "";
    }
    /* if firefox remove designed for area stop */
    checkStorage();
    var menu_button = document.getElementById("menu"),
        setup_button = document.getElementById("setup"),
        meditate_button = document.getElementById("Dmeditate"),
        addEntry_button = document.getElementById("DaddEntry"),
        stats_button    = document.getElementById("Dstats"),
        viewLog_button = document.getElementById("DviewLog"),
        download_button = document.getElementById("Ddownload"),
        date,
        hour,
        storedMedLogObj;
    if (storageAvailable) {
        storedMedLogObj = localStorage.getItem("username");
        if (storedMedLogObj) {
            medLogObj = JSON.parse(storedMedLogObj);
        }
    }
    /* set theme based on time of day */
    if (medLogObj.theme === undefined) {
        medLogObj.theme === "auto";
    }
    setTheme(medLogObj.theme);
    /* add listeners */
    menu_button.addEventListener("click", initMainMenu);
    setup_button.addEventListener("click", initSetup);
    meditate_button.addEventListener("click",
        initMeditationScreen);
    addEntry_button.addEventListener("click", initMeditationLog);
    stats_button.addEventListener("click", initStatScreen);
    viewLog_button.addEventListener("click", initViewLog);
    download_button.addEventListener("click", downloadLog);
    if (medLogObj.username !== defaultObj.username) {
        initMeditationScreen(); 
    } else {
        initSetup();
    }
    if (!medLogObj.entryObjArray) {
        console.log("entryObj Array created");
        medLogObj.entryObjArray = [];
    }
    if (medLogObj.entryArray && medLogObj.entryArray.length >
            medLogObj.entryObjArray.length) {
        console.log(medLogObj.entryArray[0]);
        convertEntryArrayToObj();
    }
    online = checkIfOnline();
    if (online === true) {
            console.log("online");
            socket = io.connect("http://wyn.bot.nu:8087");
            console.log(socket);
            initSocket();
    } else {
        console.log("offline");
    }
}


init();
