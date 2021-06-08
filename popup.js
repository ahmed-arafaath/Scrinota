'use strict';

//To load active reminders from local storage, if any exist.
window.addEventListener('load', function() {

    //accessing reminders stored in local storage 
    chrome.storage.sync.get(['reminderList'],function(reminder){
        
        var div = document.getElementById("reminder-list"); //accessing DOM element from HTML page
        
        //if any reminders exist in local storage then the following table will be created with title and time of the reminder
        if (reminder.reminderList) {
            let activeReminders = reminder.reminderList.filter((reminder) => reminder.isComplete === false);
            //console.log(activeReminders);
    
            if (activeReminders.length > 0) {
                
                //creating table element 
                var table = document.createElement("table");
                table.setAttribute("class", "table"); //setting class for the table element
    
                var thead = document.createElement("thead"); //creating table head element and its contents
                var th1 = document.createElement("th"); 
                th1.innerHTML = "Scheduled Time";
                thead.appendChild(th1); //appending the data into table head element
    
                var th2 = document.createElement("th");
                th2.innerHTML = "URL to open";
                thead.appendChild(th2); //appending the data into table head element

                var th3 = document.createElement("th");
                th3.innerHTML = " ";
                thead.appendChild(th3); //appending the data into table head element
                table.appendChild(thead);//appending the table head into table element
                
                //likewise creating body element for active reminders in local storage in a for loop.
                var tbody = document.createElement("tbody");
                tbody.setAttribute("id", "table-body");
                for (let i=0; i < activeReminders.length; i++) {
                    let item_row = document.createElement("tr");
                    
                    let item_data1 = document.createElement("td");
                    item_data1.innerHTML = activeReminders[i].isTitle;
                    item_row.appendChild(item_data1);
    
                    let item_data2 = document.createElement("td");
                    item_data2.innerHTML = activeReminders[i].isTime;
                    item_row.appendChild(item_data2);
    
                    let item_data3 = document.createElement("td");
                    let btn = document.createElement("button");
                    btn.setAttribute("class", "remove");
                    btn.innerHTML = "[X]";
                    
                    item_data3.appendChild(btn);
                    item_row.appendChild(item_data3);
    
                    tbody.appendChild(item_row);
                }
                table.appendChild(tbody);
                div.appendChild(table);

                //adding remove button element for rows to delete active reminder from local storage
                var button = document.querySelectorAll('.remove');
                for (let i = 0; i < button.length; i++) {
                    //listening for click event of the button element
                    button[i].addEventListener('click', function() {
                        //console.log("clicked");
                        let parent1 = button[i].parentElement;
                        let parent = parent1.parentElement;
                        let child = parent.firstChild.innerHTML;
            
                        //accessing storage to remove the selected reminder
                        chrome.storage.sync.get(['reminderList'], function(reminder) {
                            let updatedList = reminder.reminderList.filter((reminder) => reminder.isTitle != child);
                            chrome.storage.sync.set({reminderList: updatedList});
                            alert("Successfully removed");
                        });
                        chrome.alarms.clear(child); //removing the created alarm
                        location.reload(); //reload to update the page
                    })
                };
                //chrome.alarms.getAll(function(e){console.log(e);});
            } else {

                //if no reminders exist then the following heading element will be created
                var message = document.createElement("h4");
                message.innerHTML = "You do not have any active reminders set, click the plus below to add new reminders";
                div.appendChild(message);
            };
        };
    });
});






