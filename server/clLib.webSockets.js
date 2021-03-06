"use strict";

var util = require("util");

function clWebSockets(){};
exports.webSockets = clWebSockets;

 //IMPORT RESOURCES
var serverResource = require("./server");
util.log("serverResource = " + JSON.stringify(serverResource));
var server = serverResource.server;
var socketIO = serverResource.socketIO;

util.log("server = " + JSON.stringify(server));

var ZZio = socketIO.listen(server.server); //Note server.server instead of just server
server.runtime.connectedUsers = {};

 //IMPORT RESOURCES
var DBResource = require("./clLib.server.db.mongolab");
var DBHandler = new DBResource.DBHandler();


clWebSockets.prototype.foo= function() {
    util.log("FOOOO");
};

clWebSockets.prototype.connect = function(io) {
    clWebSockets.ioObj = io;
    // Websocket
    io.sockets.on('connection', function (socket) {
        // der Client ist verbunden
        util.log("connected id >" + socket.id + "<- sending welcome message..");
        
        // [2015-07-07 WD] don't spam user with messages.. :)
        //socket.emit('chat', { zeit: new Date(), text: 'Connected to server.' });
        
        // wenn ein Benutzer einen Text senden
        socket.on('chat', function (data) {
            util.log("message received from >" + socket.id + "<, >" + JSON.stringify(data) + "<");
            // so wird dieser Text an alle anderen Benutzer gesendet
            if(data["toUser"]) {
                util.log("yes, only to user >" + data["toUser"] + "<");
                if(!server.runtime.connectedUsers[data["toUser"]]) {
                    util.log("!!!! No connection for user >" + data["toUser"] + "< found."); 
                }
                else {
                    var toUserId = data["toUser"];
                    var toSocketId = server.runtime.connectedUsers[toUserId]["socketId"];
                    util.log("emitting only to socketId >" + toSocketId + "<");
                    util.log("emitting msg >" + JSON.stringify(data) + "<");
                    io.sockets.connected[toSocketId].emit(
                        'chat', 
                        { 
                            zeit: new Date(), 
                            name: data.name || 'Anonym', 
                            text: data.text, 
                            toUser : toUserId
                        }
                    );
                }
            }
            else {
                util.log("to ALL users..");
                io.sockets.emit('chat', { zeit: new Date(), name: data.name || 'Anonym', text: data.text });
            }
        });
        socket.on('notifyBuddies', function (data) {
// OBSOLETE!!!
/* 

                if(!server.runtime.connectedUsers[buddyObj["buddyId"]]) {
                    util.log("!!!! No connection for user >" + buddyObj["buddyId"] + "< found."); 
                }
                else {
                    var aSocketId = server.runtime.connectedUsers[buddyObj["buddyId"]]["socketId"];
                    util.log("aSocketId >" + aSocketId + "<");
                    util.log("emitting only to id >" + server.runtime.connectedUsers[buddyObj["buddyId"]]["socketId"] + "<");
                    util.log("emitting msg >" + JSON.stringify(buddyObj) + "<");
                    var aSocket = io.sockets.connected[aSocketId];
                    util.log("\n\nFOUND SOCKET!\n\n");
                    util.log("\n\nFOUND SOCKET >" + JSON.stringify(aSocketId) + "<\n\n");
                    
                    if(!aSocket) {
                        util.log("Socket >" + aSocketId + "< is DEAD!!!");
                        return false;
                    }
                    aSocket.emit(
                        'chat', 
                        {
                            zeit: new Date(), 
                            name: data.name || 'Anonym', 
                            text: data.text, 
                            toUser : buddyObj["buddyId"] 
                        }
                    );
                    util.log("Emitted!");
                }
*/
        });
        socket.on('setUserInfo', function (userInfoObj) {
            util.log("New user for >" + socket.id + "<, >" + JSON.stringify(userInfoObj) + "<");
            if(!server.runtime.connectedUsers[userInfoObj._id]) {
                return false;
            }
            server.runtime.connectedUsers[userInfoObj._id]["socketId"] = socket.id;
            util.log("connectedUsers: \n>" + JSON.stringify(server.runtime.connectedUsers) + "<");
            // so wird dieser Text an alle anderen Benutzer gesendet
            // [2015-07-07 WD] Don'T spam user..
            //io.sockets.emit('chat', { zeit: new Date(), name: 'newUser', text: userInfoObj.username });
        });
    });

};


clWebSockets.prototype.push = function(options, successFunc, errorFunc) {
    if(!server.runtime.connectedUsers[options["_id"]]) {
        util.log("!!!! No connection for user >" + options["_id"] + "< found."); 
    }
    else {
        // get user's device id from runtime collection of collected users..
        var aSocketId = clLib.server.runtime["connectedUsers"][options["_id"]]["socketId"];

        util.log("aSocketId >" + aSocketId + "<");
        util.log("emitting msg >" + JSON.stringify(options) + "<");
        var aSocket = clWebSockets.ioObj.sockets.connected[aSocketId];
        util.log("\n\nFOUND SOCKET!\n\n");
        util.log("\n\nFOUND SOCKET >" + JSON.stringify(aSocketId) + "<\n\n");
        
        if(!aSocket) {
            util.log("Socket >" + aSocketId + "< is DEAD!!!");
            return false;
        }
        aSocket.emit(
            'chat', 
            {
                zeit: new Date()
                ,name: options["name"] || 'Anonym'
                ,text: options["msgText"]
            }
        );
        util.log("Emitted!");
    }
};
    
/*
*
*   pushi sends a "chat" message to every client every 3 seconds..
*
*   !!! CURRENTLY DISABLED - ONLY FOR DEBUGGING !!!
*
*
*/
var i = 0;
var pushi = function() {
    util.log("Emitting push push message.." + i);
    io.sockets.emit('chat', { zeit: new Date(), name: 'push', text: "push push" + (i++) });
    setTimeout(function() {
        pushi();
    }, 3000);
};

//pushi();


// Portnummer in die Konsole schreiben
console.log('Der Server läuft nun.');

try {
    global.$ = $;
} catch(e) {
}

