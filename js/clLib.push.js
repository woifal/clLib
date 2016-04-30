"use strict";

clLib.push = {
    options: {
        gcmSenderId: "366201815473"
    }
    ,platform: null
    ,deviceToken: null
    ,connectedHandler: function() {
        // 
    }
    ,showNotification: function(options) {
        var aStr = "";
        if(options.timestamp) {
            var zeit = new Date(options.timestamp);
            aStr += 
                "[" +
                    (zeit.getHours() < 10 ? '0' + zeit.getHours() : zeit.getHours()).toString() +
                ":" +
                    (zeit.getMinutes() < 10 ? '0' + zeit.getMinutes() : zeit.getMinutes()) + 
                '] '
            ; 
        }
        aStr +=
//                '<b>' + (typeof(data.name) != 'undefined' ? data.name + ': ' : '') + 
            '<span>' + options.text + "</span>"
//            '</b>'
        ;

        clLib.loggi("showing notifiucation >" + aStr + "<", "20150429");
        clLib.UI.newNotification({text: aStr});
    }
    ,registerUserPush: function(registerFuncHandler) {
        clLib.setUserInfo(
            {
                deviceToken: clLib.push.deviceToken
                ,platform: clLib.push.platform
                ,pushType: clLib.push.pushType
            }
        );
        clLib.console.log("registering user push for >" + JSON.stringify(clLib.getUserInfo()) + "<");
        if(clLib.push.pushType == 'webSocket') {
            return clLib.webSocketClient.connect(
                clLib.getUserInfo()
                ,function(resultObj) {
                    clLib.loggi("Registered user push >" + JSON.stringify(resultObj) + "<", "20150429");
                }
                ,function(errorObj) {
                    alert("error while registering user push >" + JSON.stringify(errorObj) + "<");
                }
            );
            return 1;
        }
        
        return registerFuncHandler(
            clLib.getUserInfo()
            ,function(resultObj) {
                clLib.console.log("Registered user push >" + JSON.stringify(resultObj) + "<");
            }
            ,function(errorObj) {
                clLib.console.log("error while registering user push >" + JSON.stringify(errorObj) + "<");
            }
        );
    }
    ,tokenHandler: function(token) {
        if ( clLib.push.platform == 'android' || clLib.push.platform == 'Android' || clLib.push.platform == "amazon-fireos" ){
            return;
        }
        /*
        clLib.push.showNotification({
            text: "Got token >" + token + "<"
        });
        */
        clLib.console.log("Got token >" + token + "<");
        clLib.push.deviceToken = token;
        clLib.push.pushType = 'APN';

        return clLib.push.registerUserPush(clLib.REST.registerUserPush);
    }
    ,tokenErrorHandler: function(error) {
        alert("got NO token >", error, "<");
    }
    ,iOSNotificationHandler : function(event) {
        clLib.alert("notification received..>" + JSON.stringify(event) + "<");
        if(event.alert) {
            clLib.push.showNotification({
                text: event.alert
            });
        }
    /*
                if ( event.alert )
                {
                    navigator.notification.alert(event.alert);
                }

                if ( event.sound )
                {
                    var snd = new Media(event.sound);
                    snd.play();
                }

                if ( event.badge )
                {
                    pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
                }
    */
    }
    ,androidNotificationHandler : function(e)  {
        clLib.alert("notification received..>" + JSON.stringify(e) + "<");
        switch( e.event ) {
            case 'registered':
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                clLib.push.showNotification({
                    text: "regID = " + e.regid
                });
                clLib.alert("regID = " + e.regid);
                clLib.push.deviceToken = e.regid;
                clLib.push.pushType = 'GCM';
                
                return clLib.push.registerUserPush(clLib.REST.registerUserPush);

            break;
            case 'message':
                    // if this flag is set, this notification happened while we were in the foreground.
                    // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                clLib.push.showNotification({
                    text: e.payload.message
                });

/*
                if ( e.foreground )
                {
                    clLib.alert('<li>--INLINE NOTIFICATION--' + '</li>');

                    // on Android soundname is outside the payload.
                    // On Amazon FireOS all custom attributes are contained within payload
                    var soundfile = e.soundname || e.payload.sound;
                    // if the notification contains a soundname, play it.
                    var my_media = new Media("/android_asset/www/"+ soundfile);
                    my_media.play();
                }
                else
                {  // otherwise we were launched because the user touched a notification in the notification tray.
                    if ( e.coldstart )
                    {
                        clLib.alert('<li>--COLDSTART NOTIFICATION--' + '</li>');
                    }
                    else
                    {
                        clLib.alert('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                    }
                }
*/
/*
               clLib.alert('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
                   //Only works for GCM
               clLib.alert('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
               //Only works on Amazon Fire OS
               $status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
*/
            break;
            case 'error':
                alert('GCM error msg >' + e.msg + '<');
            break;
            default:
                alert('GCM: An event was received and we do not know what it is. Damn.');
            break;
        }

    }
    ,initialize: function(successFunc, errorFunc) {
        
        clLib.console.log("init push notifications..");
        try {
            
            clLib.console.log("platform is >" + clLib.push.platform + "<, device >" + JSON.stringify(window.device) + "<");

            // Android
            if ( window.device && (
                device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" 
            )){
                var pushNotification = window.plugins.pushNotification;
                clLib.console.log("pushNotification is >" + pushNotification + "<");
                clLib.push.platform = device.platform;

                pushNotification.register(
                    clLib.push.tokenHandler,
                    this.tokenErrorHandler,
                    {
                        "senderID": clLib.push.options.gcmSenderId,
                        "ecb":"clLib.push.androidNotificationHandler"
                    }
                );        
            }
            // IOS
            else if (window.device && device.platform == 'iOS'){
                var pushNotification = window.plugins.pushNotification;
                clLib.console.log("pushNotification is >" + pushNotification + "<");
                clLib.push.platform = device.platform;

                pushNotification.register(
                    clLib.push.tokenHandler,
                    this.tokenErrorHandler,
                    {
                        "badge":"true",
                        "sound":"true",
                        "alert":"true",
                        "ecb":"clLib.push.iOSNotificationHandler"
                    }
                );
             }
             else {
                // Desktop - use socket.io
                clLib.push.pushType = 'webSocket';
                clLib.console.log("websocket push!!");
                return clLib.push.registerUserPush(clLib.webSocketClient.connect);
             }
        }
        catch(e) {
            alert("push init error >" + JSON.stringify(e) + "<, >" + e + "<");
        }
    
    }
};

// run init method in any case(at startup)
clLib.push.initialize();