'use strict';
//setting an event listener to listen for alarm and the when the schedule time expires a new window will open. 
chrome.alarms.onAlarm.addListener(function(alarm) {
    //console.log(alarm);
    
    //accessing locally stored reminder list on the client side storage to open the URL in a new tab.
    chrome.storage.sync.get(['reminderList'], function(reminder) {
        var list = reminder.reminderList;
        //console.log(reminder.reminderList);

        if(list) {
            for (let i=0; i < list.length; i++) {
                if (list[i].isTitle === alarm.name) {
                    let url = list[i].isUrl; //accessing url from storage
                    //console.log(url);
                    //creating an object to run when the windows create function is called
                    let winObj = {
                        "url": url,
                        "type": "popup",
                        "top": 5,
                        "left": 5
                    };
                    chrome.windows.create(winObj); //creates new window with the url from storage
                    list[i].isComplete = true;
                    chrome.storage.sync.set({'reminderList': list});
                    //console.log(list);
                }
            }
        }
        //setting badge for active reminders
        let activeReminders = list.filter((reminder) => reminder.isComplete === false); //filters the local storage with reminders whose isComplete state is false
        if (activeReminders.length > 0) {
            chrome.action.setBadgeText({"text": activeReminders.length.toString()});
        } else {
            chrome.action.setBadgeText({"text": ''});
        }
    })
})