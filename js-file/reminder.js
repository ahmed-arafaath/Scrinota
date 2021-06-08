'use strict';
const month = [1, 3, 5, 7, 8, 10, 12] //this array contains months with 31 days

function submitFunction () {
    let inputMonth = document.getElementById("month").value; //accessing the user input month from form element
    inputMonth = parseInt(inputMonth); //converting string to int

    let inputDate = document.getElementById("date").value; //accessing user input date from form element
    inputDate = parseInt(inputDate); //converting string to int

    let inputHour = document.getElementById("hr").value; //accessing user input hour from form element
    inputHour = parseInt(inputHour); //converting string to int

    let inputMin = document.getElementById("min").value; //accessing user input minute from form element
    inputMin = parseInt(inputMin); //converting string to int
    let convertMin = inputHour * 60; //converting the user input hour into minutes
    let remMin = convertMin + inputMin;  //taking the sum of converted minutes with user input minutes to get the minutes passed from day start
    
    let time = inputDate + '/' + inputMonth +'/2021' + ' ' + inputHour + ':' + inputMin; //creatng string to store as a reminder in local storage
    
    let current = new Date(); //getting current date
    let current_month = current.getMonth() + 1; //getting current month, as months start with 0, +1 to get current month
    //console.log("current month:" + current_month);
    let current_date = current.getDate() + 1; //adding +1 to take into consideration that the current date is mostly complete and minutes start 
    //fresh on the next date

    let current_hr = current.getHours(); //access current hour
    let current_min = current.getMinutes(); //access current minute
    let cs = current_hr * 60; // taking minutes passed till now in the current day
    cs+= current_min; //adding hours to minute to take minutes passed today
    let cmd = 1440 - cs; //getting the remining minutes left today; 1440 is the total number of minutes in a day
    
    
    let check = month.includes(current_month); //checks whether current month is a 31 day month
    let currentDiff;
    if (check) {
        currentDiff = 31 - current_date; //accommodating 31 days
    } else {
        currentDiff = 30 - current_date;
    }

    currentDiff = parseInt(currentDiff); //making sure that it is int

    let count_month = inputMonth - 1; // excluding the reminder month
    let count = 0;
    let sumDay = 0;
    let sumMin = 0;
    let sm = 0;

    //adding months with 31 days
    while(count_month > current_month) {
        for (let i = 0; i < month.length; i++) {
            if (count_month === month[i]) {
                count++;
            }
        }
        count_month--;
    }
    //if the month contains any month with 31 days then if condition will apply
    if (count) {
        sumDay = count * 31;
        let diff = inputMonth - count - current_month - 1; //taking the months with 30 days
        if (diff > 0) {
            let a = diff * 30;
            sumDay+= a;
        }
        
        sumDay = sumDay + currentDiff + inputDate - 1; // subtracting input date
        sm = sumDay * 24 * 60; //gives total number of minutes
    
        sumMin = sm + cmd + remMin; //adding all the minutes
    } else {

        //if condition to accomodate current date
        if ((current_date-1) > (inputDate-1) && current_month === inputMonth) {
            sumMin = remMin - cs;
        } else if ((current_date-1) === (inputDate-1) && current_month === inputMonth) {
            //else if condition to accommodate next to current date
            sumMin = cmd + remMin;
        } else {
            //else condition to accommodate current month
            if(current_month === inputMonth && inputDate < currentDiff) {
                sumDay = inputDate - current_date - 1; // subtracting input date
            } else {
                sumDay = currentDiff + inputDate - 1; // subtracting input date
            }
            sm = sumDay * 24 * 60; //gives total number of minutes for days
            
            sumMin = sm + cmd + remMin; //adding all the minutes
        }
    }
    
    
    let inputTitle = document.getElementById("title").value; //user input
    let inputURL = document.getElementById("url").value; //user input
    //creating obj to store in the local storage
    const obj ={
        isUrl: inputURL,
        isTime: time,
        isTitle: inputTitle,
        isComplete: false
    };
    if(sumMin) {
        chrome.storage.sync.get(['reminderList'], function(reminder) {
            
            if (reminder.reminderList) {
                var remList = reminder.reminderList;
                remList.push(obj);
                chrome.storage.sync.set({'reminderList': remList});
            } else {
                //creating new array if no reminders exist in local storage
                let remList = [];
                remList.push(obj);
                chrome.storage.sync.set({reminderList: remList});
            }
            chrome.alarms.create(inputTitle, {delayInMinutes: sumMin}); //creating alarm to call as a event listener
            
            //creating object to call for notification
            var notifOptions = {
                type: "basic",
                iconUrl: "/images/logo48.png",
                title: "Reminder Set!",
                message: "Your reminder has been set"
            };
            //creating notification to show user that their reminder was successfully saved
            chrome.notifications.create('reminderNotif', notifOptions, function() {
                location.assign("popup.html"); //loading popup to show active reminders
                chrome.storage.sync.get(['reminderList'], function(reminder) {
                    //setting badge for active reminders
                    let list = reminder.reminderList;
                    if(list) {
                        let activeReminders = list.filter((reminder) => reminder.isComplete === false);
                        if (activeReminders.length > 0) {
                            chrome.action.setBadgeText({"text": activeReminders.length.toString()});
                        }
                    }
                });
            });
        })
    } else {
        alert("Please input correct values");
    }
};


document.getElementById("rem-set").addEventListener('submit', function(e) {
    e.preventDefault();
    submitFunction();
    //chrome.alarms.getAll(function(e){console.log(e);});
});