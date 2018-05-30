document.addEventListener('DOMContentLoaded', function () {
    var timerDB = [];

    function timerCheck(element, cb) {
        var startObj = getDateObj(element.startDateTime),
            endObj = getDateObj(element.endDateTime);
        cb(startObj, endObj, element.id);
    }

    function setTime(element) {
        $("#timer-heading-" + element.id).text(element.label);
        element["interval"] = setInterval(function () {
            var startTime = getDateObj(element.startDateTime),
                endTime = getDateObj(element.endDateTime);
            var elapsedTime = endTime - startTime;
            setHtml(element.id, startTime, endTime, millisecondsToObj(elapsedTime));
        }, 1000);
    }

    function setHtml(id, startTime, endTime, diffTime) {
        $("#start-time-" + id).html(startTime.toDateString() + " " + startTime.toLocaleTimeString('en-GB'));
        $("#end-time-" + id).html(endTime.toDateString() + " " + endTime.toLocaleTimeString('en-GB'));
        $("#year-" + id).html(diffTime.years);
        $("#day-" + id).html(diffTime.days);
        $("#hour-" + id).html(diffTime.hours);
        $("#minute-" + id).html(diffTime.minutes);
        $("#second-" + id).html(diffTime.seconds);
    }

    function getDateObj(dateObj) {
        return (dateObj == "now") ? (new Date()) : createDateObj(dateObj);
    }

    function createDateObj(dateObj) {
        return new Date(dateObj.year, dateObj.month - 1, dateObj.date, dateObj.hour, dateObj.minute, dateObj.second);
    }

    function millisecondsToObj(milliseconds) {
        var dateObj = {};
        // TIP: to find current time in milliseconds, use:
        // var  current_time_milliseconds = new Date().getTime();

        function numberEnding(number) {
            return (number > 1) ? 's' : '';
        }

        var temp = Math.floor(milliseconds / 1000);
        var years = Math.floor(temp / 31536000);
        dateObj["years"] = 0 + ' year';
        if (years) {
            dateObj["years"] = years + ' year' + numberEnding(years);
        }
        //TODO: Months! Maybe weeks?
        var days = Math.floor((temp %= 31536000) / 86400);
        dateObj["days"] = 0 + ' day';
        if (days) {
            dateObj["days"] = days + ' day' + numberEnding(days);
        }
        var hours = Math.floor((temp %= 86400) / 3600);
        dateObj["hours"] = 0 + ' hour';
        if (hours) {
            dateObj["hours"] = hours + ' hour' + numberEnding(hours);
        }
        var minutes = Math.floor((temp %= 3600) / 60);
        dateObj["minutes"] = 0 + ' minute';
        if (minutes) {
            dateObj["minutes"] = minutes + ' minute' + numberEnding(minutes);
        }
        var seconds = temp % 60;
        dateObj["seconds"] = 0 + ' second';
        if (seconds) {
            dateObj["seconds"] = seconds + ' second' + numberEnding(seconds);
        }
        return dateObj; //'just now' //or other string you like;
    }

    function createTimeCard(element) {
        var $timers = $("#timers");
        console.log($timers);

        var $li = $("<li>", {
            "id": "li-" + element.id,
            "class": "clearfix list-unstyled"
        });

        var $header = $("<div>", {
            "class": "header"
        })

        var $h4 = $("<h5>", {
            "class": "pull-left",
            "id": "timer-heading-" + element.id
        }).text(element.label);

        // glyphicon glyphicon-pencil
        var $edit = $("<a>", {
            "href": "#",
            "data-id": element.id,
            "id": "edit-" + element.id,
            "class": "pull-right toggle glyphicon glyphicon-pencil",
            "data-toggle": "modal",
            "data-target": "#myModal"
        }).bind("click", function () {
            $("#timer-id").val($(this).attr("data-id"));
            var objTimer = DB.get($(this).attr("data-id"));
            if (objTimer) {
                TimerForm.setForm(objTimer);
            }

        });

        var $toggle = $("<a>", {
            "href": "#",
            "data-id": element.id,
            "id": "toggle-" + element.id,
            "class": "pull-right toggle glyphicon glyphicon-minus"

        }).bind("click", function () {
            $("#card-" + $(this).attr("data-id")).toggle("slow", function () {
                if ($(this).is(":visible")) { // its visible
                    console.log("its visible", $("#toggle-" + $(this).attr("data-id")));
                    if ($("#toggle-" + $(this).attr("data-id")).hasClass("glyphicon-plus")) {
                        console.log("removeClass of plus");
                        $("#toggle-" + $(this).attr("data-id")).removeClass("glyphicon-plus");
                    }
                    if ($("#toggle-" + $(this).attr("data-id")).hasClass("glyphicon-minus") === false) {
                        console.log("addClass of minus");
                        $("#toggle-" + $(this).attr("data-id")).addClass("glyphicon-minus");
                    }
                    setTime(element);
                } else { // its hidden
                    console.log("its hidden", $(this).attr("data-id"));
                    if ($("#toggle-" + $(this).attr("data-id")).hasClass("glyphicon-minus")) {
                        console.log("removeClass of minus");
                        $("#toggle-" + $(this).attr("data-id")).removeClass("glyphicon-minus");
                    }
                    if ($("#toggle-" + $(this).attr("data-id")).hasClass("glyphicon-plus") === false) {
                        console.log("addClass of plus");
                        $("#toggle-" + $(this).attr("data-id")).addClass("glyphicon-plus");
                    }
                    clearInterval(element["interval"]);
                }
            });
        });

        var $card = $("<div>", {
            "class": "card",
            "data-id": element.id,
            "id": "card-" + element.id
        });

        var $startime = $("<span>", {
            "id": "start-time-" + element.id
        });
        var $endtime = $("<span>", {
            "id": "end-time-" + element.id
        });
        var $time = $("<div>", {
            "class": "time",
            "id": "time-" + element.id
        }).append($("<b>Start Time: </b>")).append($startime).append("<br>").append($("<b>End Time: </b>")).append($endtime);

        var $year = $("<span>", {
            "id": "year-" + element.id
        }), $day = $("<span>", {
            "id": "day-" + element.id
        }), $hour = $("<span>", {
            "id": "hour-" + element.id
        }), $minute = $("<span>", {
            "id": "minute-" + element.id
        }), $second = $("<span>", {
            "id": "second-" + element.id
        });
        var $elapsedtime = $("<div>", {
            "class": "elapsedtime",
            "id": "elapsed-time-" + element.id
        }).append("<b>Elapsed Time: </b>").append($year).append(", ").append($day).append(", ").append($hour).append(", ").append($minute).append(", ").append($second);

        $header.append($h4);
        $header.append($toggle);
        $header.append($edit);

        $card.append($time).append($elapsedtime);

        $li.append($header).append($card);
        $timers.append($li);

    }

    $("#add-timer").bind("click", function () {
        TimerForm.resetForm();
    });

    var TimerForm = {
        "resetForm": function () {
            $("#timer-label").val("");
            $("#timer-id").val("");
            $("#start-date-time").val("");
            $("#start-now").prop('checked', false);
            $("#end-date-time").val("");
            $("#end-now").prop('checked', true);
        },
        "normalizeNumber": function (number) {
            return (parseInt(number / 10, 10) === 0) ? "0" + number : number;
        },
        "getFormTimeFromObj": function (obj) {
            if (obj == "now") {
                return "";
            }
            return obj.year + "-" + this.normalizeNumber(obj.month) + "-" + this.normalizeNumber(obj.date) + " " + this.normalizeNumber(obj.hour) + ":" + this.normalizeNumber(obj.minute) + ":" + this.normalizeNumber(obj.second);
        },
        "setForm": function (obj) {
            $("#timer-label").val(obj.label);
            $("#timer-id").val(obj.id);
            $("#start-date-time").val(this.getFormTimeFromObj(obj.startDateTime));
            var startNow = (obj.startDateTime == "now") ? true : false;
            $("#start-now").prop('checked', startNow);
            $("#end-date-time").val(this.getFormTimeFromObj(obj.endDateTime));
            var endNow = (obj.endDateTime == "now") ? true : false;
            $("#end-now").prop('checked', endNow);

        },
        "getForm": function () {

        },
        "getObjTimeFromForm": function (formObjTime, formObjNow) {
            if (formObjNow && formObjNow === "on") {
                return "now";
            }
            var time = moment(formObjTime);
            var timeObj = {};
            timeObj.year = time.year();
            timeObj.month = time.month() + 1;
            timeObj.date = time.date();
            timeObj.hour = time.hours();
            timeObj.minute = time.minutes();
            timeObj.second = time.seconds();
            console.log(timeObj);
            return timeObj;
        },
        "getObj": function (formObj, id) {
            var obId = id || false;
            var timerObj = {};
            timerObj.label = formObj["timer-label"];
            timerObj.startDateTime = this.getObjTimeFromForm(formObj["start-date-time"], formObj["start-now"]);
            timerObj.endDateTime = this.getObjTimeFromForm(formObj["end-date-time"], formObj["end-now"]);

            if (obId === false) {
                var arrIds = timerDB.map(function (obj) {
                    return obj.id;
                });
                if (arrIds.length == 0) {
                    timerObj.id = 1;
                } else {
                    timerObj.id = arrIds.sort().pop() + 1;
                }

            } else {
                timerObj.id = id;
            }
            return timerObj;
        }
    };

    var DB = {
        "objectifyForm": function (formArray) {//serialize data function

            var returnArray = {};
            for (var i = 0; i < formArray.length; i++) {
                returnArray[formArray[i]['name']] = formArray[i]['value'];
            }
            return returnArray;
        },
        "save": function (formArr) {
            console.log(formArr);
            var formObj = this.objectifyForm(formArr);
            console.log(formObj);
            if (formObj["timer-id"]) {
                // update
                this.update(formObj, formObj["timer-id"]);
            } else {
                // save
                this.insert(formObj);
            }
        },
        "insert": function (formObj) {
            var newObj = TimerForm.getObj(formObj);
            timerDB.push(newObj);
            this.storageSave(timerDB);
            $('#myModal').modal('hide');
            createTimeCard(newObj);
            setTime(newObj);
        },
        "update": function (formObj, id) {
            id = parseInt(id, 10);
            var ids = timerDB.map(function (o) {
                return o.id;
            });

            var index = ids.indexOf(id);

            clearInterval(timerDB[index]["interval"]);
            var newObj = TimerForm.getObj(formObj, id);

            timerDB[index] = newObj;
            this.storageSave(timerDB);
            $('#myModal').modal('hide');
            setTime(newObj);
        },
        "get": function (id) {
            var result = timerDB.filter(function (obj) {
                return obj.id == id;
            });
            return result[0];
        },
        "storageSave": function (arr) {
            chrome.storage.local.set({'timerDB': arr}, function () {
                console.log('Settings saved');
            });
        },
        "storageGet": function (cb) {
            chrome.storage.local.get('timerDB', function (result) {
                result.timerDB = result.timerDB || [];
                console.log("result", result.timerDB);
                cb(result.timerDB);
            });
        }
    };


    $("#save-timer").bind("click", function () {
        DB.save($("#form-timer").serializeArray());
    });
    $(function () {
        var format = 'YYYY-MM-DD hh:mm:ss';
        $('#start-date-time').datetimepicker({
            "format": format
        });
        $('#end-date-time').datetimepicker({
            "format": format
        });
    });
    DB.storageGet(function (result) {
        timerDB = result || [];
        console.log("after getting", timerDB);
        var i = 0, ln = timerDB.length;
        console.log("ln", ln);
        for (; i < ln; i++) {
            console.log("each timer", timerDB[i]);
            createTimeCard(timerDB[i]);
            setTime(timerDB[i]);
        }

    });


}, false);
