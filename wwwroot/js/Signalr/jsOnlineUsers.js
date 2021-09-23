let OnlineUsers;
let OnlineSignedUsers;
const email = localStorage.getItem("email");
let countConnection = new signalR.HubConnectionBuilder().withUrl('/chatHub' + '?email=' + email).build();

let updateCountCallback = function (message) {
    if (!message) return;
    OnlineUsers = message;
    if (onlineCount) onlineCount.innerText = message;
};

let updateSignedCountCallback = function (message) {
    if (!message) return;
    OnlineSignedUsers = message;
    if (onlineSignedCount) onlineSignedCount.innerText = message;
};

let jsUpdateCountCallback = function (count, signedCount, emailList) {
    updateCountCallback(count);
    updateSignedCountCallback(signedCount);
    if (emailList) AddEmailList(emailList);
}

countConnection.on('updateCount', updateCountCallback);
countConnection.on('jsUpdateCount', jsUpdateCountCallback);
countConnection.onclose(onConnectionError);


function onConnectionError(error) {
    if (error && error.message) console.error(error.message);
}


countConnection.start()
    .then(function () {
    })
    .catch(function (error) {
        alert(error.message);
    });



function AddEmailList(emailList) {
    //if (onlineUsersList) onlineUsersList.innerText = emailList;
    if (onlineUsersList) {
        onlineUsersList.innerText = "";
        for (var i = 0; i < emailList.length; i++) {
            var item = document.createElement('li');
            item.appendChild(document.createTextNode(emailList[i]));
            onlineUsersList.appendChild(item);
        }
    }
}
