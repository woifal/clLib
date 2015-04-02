if(!window.clLib) {
    window.clLib = {};
}
clLib.webSocketClient = {
    socketServerURL : "@@clLib.REST.clLibServerURI"

    ,socket: null
    ,connectOptions: {
        reconnection: true
    }
    ,connect:  function(
        userInfoObj
    ) {
        // Check for active connection
        if(this.socket && this.socket["connected"]) {
            //alert("already connected!");
            return true;
        }
        
        // Open a new socket connection
        this.socket = io.connect(
            this.socketServerURL
            ,this.connectOptions
        );
        
        var mySocket = this.socket;

        mySocket.on("reconnect", function(data) {
            alert("reconnected >" + data + "<");
        });
        mySocket.on("connect", function(data) {
            //var userInfoObj = clLib.getUserInfo();
            //var userInfoObj = data;
            console.log("connected >" + userInfoObj["_id"] + "< with name >" + userInfoObj["username"] + "<");
            mySocket.emit('setUserInfo', userInfoObj);
        });
        
        mySocket.off("chat").on('chat', function (data) {
            console.log("chat!!");
            console.log(">" + JSON.stringify(data) + "<");
            var zeit = new Date(data.zeit);
            var webSocketOutputEl = document.getElementById("websocketOutput");
            var aStr = "";
            aStr += 
                "[" +
                    (zeit.getHours() < 10 ? '0' + zeit.getHours() : zeit.getHours()).toString() +
                ":" +
                    (zeit.getMinutes() < 10 ? '0' + zeit.getMinutes() : zeit.getMinutes()) + 
                '] ' + 
                '<b>' + (typeof(data.name) != 'undefined' ? data.name + ': ' : '') + 
                '<span>' + data.text + 
//                "--"
                '</b>'
            ;
            if(webSocketOutputEl) {
                webSocketOutputEl.innerHTML += aStr + "<br>--";
            }
/*            alert(aStr);
            alert(11111);
*/
            clLib.UI.newNotification({text: aStr});
        });        
        
    }
    ,send: function(msgObj) {
        if(this.socket && this.socket != null && this.socket["connected"]) {
            this.socket.emit(msgObj["name"], msgObj);
        }
    }
    
};
