import './config.js'

const buttonICS = document.querySelector("button.ics-download");
const buttonGCal = document.querySelector("button.google-upload");

// Creates ICS
function makeICSCalendar() {
  function getClasses() {
    const allClassElements = document.querySelectorAll("div[class='result result--group-start']");
    allClasses = []
    for (let i = 0; i < allClassElements.length; i++) {
      let classElement = allClassElements[i]
      className = classElement.getElementsByClassName("result__code")[0].innerText.trim();
      dayTime = classElement.querySelectorAll("span.result__part span.flex--grow")[0].childNodes[1].textContent.trim();

      dayTimeList = dayTime.split(" ");
      if (dayTimeList.length == 2) {
        newClass = [className, dayTimeList[0], dayTimeList[1]] // class name, days, time
        allClasses.push(newClass);
      }
    }
    return allClasses
  }
  
  function makeEvents(allClasses) {
    function daysConverter(days) {
      let enumDays = []
      for (let i = 0; i < days.length; i ++) {
          if (days[i] == "M") {
            enumDays.push("MO")
          } else if (days[i] == "T") {
            enumDays.push("TU")
          } else if (days[i] == "W") {
            enumDays.push("WE")
          } else if (days[i] == "R") { 
            enumDays.push("TH")
          } else if (days[i] == "F") {
            enumDays.push("FR")
          } else {
            // Throw Error
            console.log("ERROR")
            return ""
          }
      }
      return enumDays
    }
    // Takes in an input "M", "T", "W", "R", "F" and returns it enumerated day of the week.
    function daysEvaluator(day) {
      if (day == "M") {
        return 1
      } else if (day == "T") {
        return 2
      } else if (day == "W") {
        return 3
      } else if (day == "R") { 
        return 4
      } else if (day == "F") {
        return 5
      } else {
        // Throw Error
        return -1
      }
    }
    function dateFormatter(year, month, day, hour, minute, second) {
      return `${year}${month}${day}T${hour}${minute}${second}`
    }
    function onDay(date, day) {
      let days = (day - date.getDay() + 7) % 7;
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result
    }
    function startTime(time) {
      let splitTime = time.split("-")
      if (splitTime.length != 2) {
        // throw error
        return []
      }
    
      let startTime = time.split("-")[0]
      if (startTime.length == 2) {
        hour = parseInt(startTime)
        minute = 0
      } else {
        hour = parseInt(startTime.split(":")[0])
        minute = parseInt(startTime.split(":")[1])
      }
      let amOrPm = time.split("-")[1].slice(-1);
      if (amOrPm == "p" && hour < 12) {
        hour += 12
      }
      if (hour < 10) {
        hour = "0" + hour
      }
      else {
        hour += ""
      }

      if (minute < 10) {
        minute = "0" + minute
      }
      else {
        minute += ""
      }
    
    
      return [hour, minute]
    }
    function endTime(time) {
      let splitTime = time.split("-")
      if (splitTime.length != 2) {
        // throw error
        return []
      }
    
      let endTime = time.split("-")[1]
      if (endTime.length == 2) {
        hour = parseInt(endTime)
        minute = 0
      } else {
        hour = parseInt(endTime.split(":")[0])
        minute = parseInt(endTime.split(":")[1])
      }
      let amOrPm = time.split("-")[1].slice(-1);
      if (amOrPm == "p" && hour < 12) {
        hour += 12
      }
      if (hour < 10) {
        hour = "0" + hour
      }
      else {
        hour += ""
      }

      if (minute < 10) {
        minute = "0" + minute
      }
      else {
        minute += ""
      }
    
      return [hour, minute]
    }
    // get formatting for end date
    let dateRanges = [new Date(2022, 0, 1), new Date(2022, 4, 1)] // months start at 0
    let hhMmSs = dateRanges[1].toTimeString().split(' ')[0].split(":")
    let mm = dateRanges[1].getMonth() + 1; // Months start at 0!
    let dd = dateRanges[1].getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    endDate = dateFormatter(dateRanges[1].getFullYear(), mm, dd, hhMmSs[0], hhMmSs[1], hhMmSs[2])
    let currDate = new Date()
    let currHhMmSs = currDate.toTimeString().split(' ')[0].split(":")
    let currMm = currDate.getMonth() + 1; // Months start at 0!
    let currDd = currDate.getDate();
    if (currDd < 10) currDd = '0' + currDd;
    if (currMm < 10) currMm = '0' + currMm;
    currStamp = dateFormatter(currDate.getFullYear(), currMm, currDd, currHhMmSs[0], currHhMmSs[1], currHhMmSs[2])
  
    events = []

    for (let i = 0; i < allClasses.length; i ++) {
      let daysStr = daysConverter(allClasses[i][1]).toString()
      let firstDayOfWeek = allClasses[i][1][0]
      let startDate = onDay(dateRanges[0], daysEvaluator(firstDayOfWeek))
      let startHourMinute = startTime(allClasses[i][2])
      let endHourMinute = endTime(allClasses[i][2])

      let currMm = startDate.getMonth() + 1; // Months start at 0!
      let currDd = startDate.getDate();
      if (currDd < 10) currDd = '0' + currDd;
      if (currMm < 10) currMm = '0' + currMm;
      // if (isICS) {
      //   start = dateFormatter(startDate.getFullYear(), currMm, currDd, startHourMinute[0], startHourMinute[1], "00")
      //   end = dateFormatter(startDate.getFullYear(), currMm, currDd, endHourMinute[0], endHourMinute[1], "00")
      // } else {
      //   end = dateFormatterGCal(startDate.getFullYear(), currMm, currDd, endHourMinute[0], endHourMinute[1], "00")
      //   start = dateFormatterGCal(startDate.getFullYear(), currMm, currDd, startHourMinute[0], startHourMinute[1], "00")
      // }
      events.push({
        title: allClasses[i][0],
        start: dateFormatter(startDate.getFullYear(), currMm, currDd, startHourMinute[0], startHourMinute[1], "00"),
        end: dateFormatter(startDate.getFullYear(), currMm, currDd, endHourMinute[0], endHourMinute[1], "00"),
        stamp: currStamp,
        recurrenceRule: `FREQ=WEEKLY;BYDAY=${daysStr};INTERVAL=1;UNTIL=${endDate}`,
      })
    }
    return events
  }
  
  function makeICSEvents(events) {
    t = 21 
    icsFormat = ''
    for (let i = 0; i < events.length; i ++) {
      icsFormat += 'BEGIN:VEVENT\r\n'
      icsFormat += foldLine(`UID:${crypto.getRandomValues(new Uint8Array(t)).reduce(((t,e)=>t+=(e&=63)<36?e.toString(36):e<62?(e-26).toString(36).toUpperCase():e>62?"-":"_"),"")}`) + '\r\n'
      icsFormat += foldLine(`SUMMARY:${events[i].title}`) + '\r\n'
      icsFormat += foldLine(`DTSTAMP:${events[i].stamp}`) + '\r\n'
      icsFormat += foldLine(`DTSTART:${events[i].start}`) + '\r\n'
      icsFormat += foldLine(`DTEND:${events[i].end}`) + '\r\n'
      icsFormat += foldLine(`RRULE:${events[i].recurrenceRule}`) + '\r\n'
      // icsFormat += foldLine(`EXDATE:`) + '\r\n'
      icsFormat += 'END:VEVENT\r\n'
    }
    return icsFormat
  }
  function foldLine (line) {
    const parts = []
    let length = 75
    while (line.length > length) {
      parts.push(line.slice(0, length))
      line = line.slice(length)
      length = 74
    }
    parts.push(line)
    return parts.join('\r\n\t')
  }
  events = makeEvents(getClasses())
  if (events.length == 0) {
    return null;
  }
  icsFormat = ''
  icsFormat += 'BEGIN:VCALENDAR\r\n'
  icsFormat += 'VERSION:2.0\r\n'
  icsFormat += 'CALSCALE:GREGORIAN\r\n'
  icsFormat += foldLine(`PRODID:jimmyren/ics`) + '\r\n'
  icsFormat += foldLine(`METHOD:PUBLISH`) + '\r\n'
  icsFormat += `X-PUBLISHED-TTL:PT1H\r\n`
  icsFormat += makeICSEvents(events)
  icsFormat += `END:VCALENDAR\r\n`
  return icsFormat
}

// Downloads the ICS Calendar
async function downloadICSCalendar() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  if (tab == undefined) {
    console.log("Unfocused tab...")
    document.querySelector('p.upload-status').textContent = 'The tab is unfocused. Please focus the tab and try again.'
    document.querySelector('p.upload-status').style.visibility = 'visible'
    return;
  }
  chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    func: makeICSCalendar,
    }, (injectionResults) => {
      if (injectionResults[0].result != null) {
        chrome.downloads.download({
        url: `data:text/calendar;charset=utf-8,${injectionResults[0].result}`,
        filename: "classes.ics",
        });
      } else {
        document.querySelector('p.upload-status').textContent = 'Invalid Results. Please check the directions and try again.'
        document.querySelector('p.upload-status').style.visibility = 'visible'
      }
  })
  return tab;
}



function makeGCal() {
  function getClasses() {
    const allClassElements = document.querySelectorAll("div[class='result result--group-start']");
    let allClasses = []
    for (let i = 0; i < allClassElements.length; i++) {
      let classElement = allClassElements[i]
      className = classElement.getElementsByClassName("result__code")[0].innerText.trim();
      dayTime = classElement.querySelectorAll("span.result__part span.flex--grow")[0].childNodes[1].textContent.trim();

      dayTimeList = dayTime.split(" ");
      if (dayTimeList.length == 2) {
        newClass = [className, dayTimeList[0], dayTimeList[1]] // class name, days, time
        allClasses.push(newClass);
      }
    }
    return allClasses
  }
  function makeEvents(allClasses) {
    function daysConverter(days) {
      let enumDays = []
      for (let i = 0; i < days.length; i ++) {
          if (days[i] == "M") {
            enumDays.push("MO")
          } else if (days[i] == "T") {
            enumDays.push("TU")
          } else if (days[i] == "W") {
            enumDays.push("WE")
          } else if (days[i] == "R") { 
            enumDays.push("TH")
          } else if (days[i] == "F") {
            enumDays.push("FR")
          } else {
            // Throw Error
            console.log("ERROR")
            return ""
          }
      }
      return enumDays
    }
    // Takes in an input "M", "T", "W", "R", "F" and returns it enumerated day of the week.
    function daysEvaluator(day) {
      if (day == "M") {
        return 1
      } else if (day == "T") {
        return 2
      } else if (day == "W") {
        return 3
      } else if (day == "R") { 
        return 4
      } else if (day == "F") {
        return 5
      } else {
        // Throw Error
        return -1
      }
    }
    function dateFormatter(year, month, day, hour, minute, second) {
      return `${year}-${month}-${day}T${hour}:${minute}:${second}.000Z`
    }
    function untilFormatter(year, month, day) {
      return `${year}${month}${day}T000000Z`
    }
    function onDay(date, day) {
      let days = (day - date.getDay() + 7) % 7;
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result
    }
    function startTime(time) {
      let splitTime = time.split("-")
      if (splitTime.length != 2) {
        // throw error
        return []
      }
    
      let startTime = time.split("-")[0]
      if (startTime.length == 2) {
        hour = parseInt(startTime)
        minute = 0
      } else {
        hour = parseInt(startTime.split(":")[0])
        minute = parseInt(startTime.split(":")[1])
      }
      let amOrPm = time.split("-")[1].slice(-1);
      if (amOrPm == "p" && hour < 12) {
        hour += 12
      }
      if (hour < 10) {
        hour = "0" + hour
      }
      else {
        hour += ""
      }

      if (minute < 10) {
        minute = "0" + minute
      }
      else {
        minute += ""
      }
    
    
      return [hour, minute]
    }
    function endTime(time) {
      let splitTime = time.split("-")
      if (splitTime.length != 2) {
        // throw error
        return []
      }
    
      let endTime = time.split("-")[1]
      if (endTime.length == 2) {
        hour = parseInt(endTime)
        minute = 0
      } else {
        hour = parseInt(endTime.split(":")[0])
        minute = parseInt(endTime.split(":")[1])
      }
      let amOrPm = time.split("-")[1].slice(-1);
      if (amOrPm == "p" && hour < 12) {
        hour += 12
      }
      if (hour < 10) {
        hour = "0" + hour
      }
      else {
        hour += ""
      }

      if (minute < 10) {
        minute = "0" + minute
      }
      else {
        minute += ""
      }
    
      return [hour, minute]
    }
    // get formatting for end date
    let dateRanges = [new Date(2023, 0, 1), new Date(2023, 4, 1)] // months start at 0
    let mm = dateRanges[1].getMonth() + 1; // Months start at 0!
    let dd = dateRanges[1].getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    endDate = untilFormatter(dateRanges[1].getFullYear(), mm, dd)
    let currDate = new Date()
    let currMm = currDate.getMonth() + 1; // Months start at 0!
    let currDd = currDate.getDate();
    if (currDd < 10) currDd = '0' + currDd;
    if (currMm < 10) currMm = '0' + currMm;
  
    events = []

    for (let i = 0; i < allClasses.length; i ++) {
      let daysStr = daysConverter(allClasses[i][1]).toString()
      let firstDayOfWeek = allClasses[i][1][0]
      let startDate = onDay(dateRanges[0], daysEvaluator(firstDayOfWeek))
      let startHourMinute = startTime(allClasses[i][2])
      let endHourMinute = endTime(allClasses[i][2])

      let currMm = startDate.getMonth() + 1; // Months start at 0!
      let currDd = startDate.getDate();
      if (currDd < 10) currDd = '0' + currDd;
      if (currMm < 10) currMm = '0' + currMm;
      events.push({
        title: allClasses[i][0],
        start: dateFormatter(startDate.getFullYear(), currMm, currDd, startHourMinute[0], startHourMinute[1], "00"),
        end: dateFormatter(startDate.getFullYear(), currMm, currDd, endHourMinute[0], endHourMinute[1], "00"),
        recurrenceRule: `FREQ=WEEKLY;BYDAY=${daysStr};INTERVAL=1;UNTIL=${endDate}`,
      })
    }
    return events
  }
  function newGCalEvent(event) {  
    let currDate = new Date().toISOString()
    return {
      "created": currDate,
      "summary": event.title,
      "start": {
        "dateTime": event.start,
        "timeZone": "America/New_York"
      },
      "end": {
        "dateTime": event.end,
        "timeZone": "America/New_York"
      },
      "recurrence": [
        `RRULE:${event.recurrenceRule}`
      ],
    };
  }
  events = makeEvents(getClasses())
  let gcal_events = events.map(event => newGCalEvent(event));
  if (gcal_events.length == 0) {
    return null;
  }
  return gcal_events
}

// Downloads the ICS Calendar
async function uploadGCal() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  if (tab == undefined) {
    console.log("Unfocused tab...")
    buttonGCal.disabled = false
    document.querySelector('p.upload-status').textContent = 'The tab is unfocused. Please focus the tab and try again.'
    document.querySelector('p.upload-status').style.visibility = 'visible'
    return;
  }
  chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    func: makeGCal,
    }, (injectionResults) => {
      if (injectionResults[0].result != null) {
        chrome.identity.getAuthToken({interactive: true}, function(token) {
          if (token != null) {
            document.querySelector('button.google-auth').style.display = 'none'
            document.querySelector('button.google-upload').style.display = 'inline-block'
          }
          let calendar_init = {
            method: 'POST',
            async: true,
            headers: {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "summary": "Fall23 Classes"
            }),
            'contentType': 'json'
          };
          fetch(
            `https://www.googleapis.com/calendar/v3/calendars?key=${config.apikey}`,
            calendar_init)
            .then((response) => response.json())
            .then(function(data) {
              let calendarId = data.id
              injectionResults[0].result.map((event) => {
                let event_init = {
                  method: 'POST',
                  async: true,
                  headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(event),
                  'contentType': 'json'
                };
                var fetchEvent = function(exponentialBackoff) {
                  fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${config.apikey}`, event_init)
                  .then((response) => {
                    if (response.status == 403) {
                      setTimeout(() => {
                        console.log("Error: 403. Using exponential backoff to comply with Google API rate limits.");
                        fetchEvent(exponentialBackoff * 2)
                      }, exponentialBackoff)
                    } else if (response.status == 200) {
                      console.log("Success!")
                    }
                  })
                  .catch( (error) => {
                    console.log("Fetch was unsuccessful. Error: " + error)
                  });
                }
                fetchEvent(200);
              })
              document.querySelector('p.upload-status').textContent = 'Successfully uploaded to Google Calendar!'
              document.querySelector('p.upload-status').style.visibility = 'visible'
              buttonGCal.disabled = false
            });
        });
      } else {
        document.querySelector('p.upload-status').textContent = 'Invalid Results. Please check the directions and try again.'
        document.querySelector('p.upload-status').style.visibility = 'visible'
        buttonGCal.disabled = false
      }
  })
  return tab;
}


// Flow of info
// 1. Get Auth Token.
// 2. if successful, then update the css
// Authorize - if authorized, have a button called upload to your GCal -> if successful,
window.onload = function() {
  chrome.identity.getAuthToken({interactive: true}, function(token) {
    if (token != null) {
      document.querySelector('button.google-auth').style.display = 'none'
      document.querySelector('button.google-upload').style.display = 'inline-block'
    }
  });

  document.querySelector('button.google-auth').addEventListener('click', function() {
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      if (token != null) {
        document.querySelector('button.google-auth').style.display = 'none'
        document.querySelector('button.google-upload').style.display = 'inline-block'
        document.querySelector('p.upload-status').textContent = 'You can now upload your schedule to your Google Calendar!'
        document.querySelector('p.upload-status').style.visibility = 'visible'
      }
    });
  });
};


buttonICS.addEventListener("click", async () => {
  console.log("Starting ICS File download...")
  downloadICSCalendar()
});

buttonGCal.addEventListener("click", async () => {
  if (buttonGCal.disabled == true) {
    return
  } else {
    buttonGCal.disabled = true
    console.log("hi this is you pressing the google authorize button")
    uploadGCal()
  }
});


