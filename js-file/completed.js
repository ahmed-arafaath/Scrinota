'use strict';

//to load finished reminder from local storage, if any exist.
window.onload = () => {

    //accessing reminders stored in local storage 
    chrome.storage.sync.get(['reminderList'],function(reminder){
        var div = document.getElementById("reminder-list"); //accessing DOM element from HTML page

        //if any finished reminders exist in local storage then the following table will be created with title and time of the reminder
        if (reminder.reminderList) {
            let activeReminders = reminder.reminderList.filter((reminder) => reminder.isComplete === true);
            console.log(activeReminders);
            if (activeReminders.length > 0) {
                console.log(activeReminders);
    
                //creating table element
                var table = document.createElement("table");
                table.setAttribute("class", "table"); //setting class for the table element
    
                var thead = document.createElement("thead"); //creating table head element and its contents
                var th1 = document.createElement("th");
                th1.innerHTML = "Scheduled Time";
                thead.appendChild(th1); //appending the data into table head element
    
                var th2 = document.createElement("th");
                th2.innerHTML = "URL opened";
                thead.appendChild(th2); //appending the data into table head element
                table.appendChild(thead); //appending the table head into table element
                
                //likewise creating body element for finisher reminders in local storage in a for loop.
                var tbody = document.createElement("tbody");
                for (let i=0; i < activeReminders.length; i++) {
                    let item_row = document.createElement("tr");
                    
                    let item_data1 = document.createElement("td");
                    item_data1.innerHTML = activeReminders[i].isTitle;
                    item_row.appendChild(item_data1);
    
                    let item_data2 = document.createElement("td");
                    item_data2.innerHTML = activeReminders[i].isTime;
                    item_row.appendChild(item_data2);
    
                    tbody.appendChild(item_row);
                }
                table.appendChild(tbody);
                div.appendChild(table);
            } else {
                //if no reminders exist then the following heading element will be created
                var message = document.createElement("h4");
                message.innerHTML = "You do not have any finished reminders";
                div.appendChild(message);
            }
        } 
    });
}


