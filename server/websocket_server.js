//Define the port to listen to
var PORT = 1983;
//Include retify.js framework
var restify = require('restify');
var socketIO = require("socket.io");
var util = require("util");

var options = {
  serverName: 'My server',
  accept: [ 'application/json' ]
}
var server = restify.createServer(options);
server.listen(PORT, '0.0.0.0');





server.use(restify.bodyParser({ mapParams: false }));
server.use(restify.fullResponse());
server.use(restify.gzipResponse());


function unknownMethodHandler(req, res) {
	if (req.method.toLowerCase() === 'options') {
		console.log('received an options method request');
		var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Origin', 'X-Requested-With']; // added Origin & X-Requested-With

		if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');
        if (res.methods.indexOf('PUT') === -1) res.methods.push('PUT');
        if (res.methods.indexOf('POST') === -1) res.methods.push('POST');
        if (res.methods.indexOf('DELETE') === -1) res.methods.push('DELETE');

		res.header('Access-Control-Allow-Credentials', true);
		res.header('Access-Control-Allow-Headers', "content-type,x-appery-database-id,clSessionToken,clUserName,DNT,accept-language,accept,Access-Control-Allow-Origin");
        util.log("header.methods >" + res.methods.join(', ') + "<");
		res.header('Access-Control-Allow-Methods', 	res.methods.join(', '));
        util.log("header.origin >" + req.headers.origin + "<");
        res.header('Access-Control-Allow-Origin', req.headers.origin);
		//res.header('Access-Control-Allow-Origin', "*");
		console.log("sending 204...\n\n\n");
		return res.send(204);
	} else {
		return res.send(new restify.MethodNotAllowedError());
	}
}

server.use(restify.queryParser()); 
server.use(restify.fullResponse());
server.on('MethodNotAllowed', unknownMethodHandler);


server.listen(PORT, '0.0.0.0');
server.use(restify.CORS());
server.use(restify.fullResponse());











var io = socketIO.listen(server.server); //Note server.server instead of just server
var connectedUsers = {};

util.log("1");
// Websocket
io.sockets.on('connection', function (socket) {
	// der Client ist verbunden
	util.log("connected id >" + socket.id + "<- sending welcome message..");
    socket.emit('chat', { zeit: new Date(), text: 'Du bist nun mit dem Server verbunden!' });
	// wenn ein Benutzer einen Text senden
	socket.on('chat', function (data) {
		util.log("message received from >" + socket.id + "<, >" + JSON.stringify(data) + "<");
        // so wird dieser Text an alle anderen Benutzer gesendet
        if(data["toUser"]) {
            util.log("yes, only to user >" + data["toUser"] + "<");
            if(!connectedUsers[data["toUser"]]) {
                util.log("!!!! No connection for user >" + data["toUser"] + "< found."); 
            }
            else {
                util.log("emitting only to id >" + connectedUsers[data["toUser"]] + "<");
                util.log("emitting msg >" + JSON.stringify(data) + "<");
                io.sockets.connected[connectedUsers[data["toUser"]]].emit(
                'chat', 
                { zeit: new Date(), name: data.name || 'Anonym', text: data.text, toUser : data.toUser }
                );
            }
        }
        else {
            util.log("to ALL users..");
            io.sockets.emit('chat', { zeit: new Date(), name: data.name || 'Anonym', text: data.text });
        }
	});
	socket.on('setUserName', function (data) {
		util.log("New user for >" + socket.id + "<, >" + JSON.stringify(data) + "<");
        // so wird dieser Text an alle anderen Benutzer gesendet
        io.sockets.emit('chat', { zeit: new Date(), name: 'newUser', text: data.username });
        connectedUsers[data.username] = socket.id;
        util.log("connectedUsers: \n>" + JSON.stringify(connectedUsers) + "<");
	});
});

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
util.log('Der Server läuft nun.');






try {
    global.$ = $;
} catch(e) {
}



