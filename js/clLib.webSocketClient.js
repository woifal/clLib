if(!window.clLib) {
    window.clLib = {};
}
clLib.webSocketClient = {
    socketServerURL : "@@clLib.REST.clLibServerURI"

    ,socket: null
    ,connectOptions: {
        reconnection: true
        ,'force new connection':true
        ,'forceNew':true
    }
    ,connect:  function(
        userInfoObj
        ,successFunc
        ,errorFunc
    ) {
        console.log("connecting io.socket at >" + this.socketServerURL + "<");
        console.log("connecting with userInfoObj >" + JSON.stringify(Object.keys(userInfoObj)) + "<");
        // Check for active connection
        if(this.socket && this.socket["connected"]) {
            this.socket.disconnect();
            console.log("already connected!");
        }
        
        console.log("io.socket connecting..");
        var userInfoObj = clLib.getUserInfo();
        if(!userInfoObj["_id"]) {
            clLib.loggi("not logged in, not connection websocket for now..", "20150429");
            return;
        }

        clLib.loggi("connecting..", "20150429");
        // Open a new socket connection
        
        this.socket = io.connect(
            this.socketServerURL
            ,this.connectOptions
        );
        
        var mySocket = this.socket;

        mySocket.on("reconnect", function(data) {
           console.log("reconnected >" + data + "<");
        });
        mySocket.on("connect", function(data) {
            //var userInfoObj = data;
            clLib.loggi("connected >" + userInfoObj["_id"] + "< with name >" + userInfoObj["username"] + "<", "20150429");
            mySocket.emit('setUserInfo', userInfoObj);
        });
        
        mySocket.off("chat").on('chat', function (data) {
            console.log("chat!!");
            console.log(">" + JSON.stringify(data) + "<");
            clLib.push.showNotification({
                text: data.text
                ,timestamp: data.zeit
            });
        });  

        return successFunc({'yes' :'we can'});
        
    }
    ,send: function(msgObj) {
        if(this.socket && this.socket != null && this.socket["connected"]) {
            this.socket.emit(msgObj["name"], msgObj);
        }
    }
    
};
