"use strict";
clLib.images = {};

/*
AWS.config.update({
    "accessKeyId": "AKIAJ7GUMJYATJ6PPIZA" 
    ,"secretAccessKey": "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"
    ,"region": "us-west-2"
});
clLib.images.bucketName = 'cl.foobucket';
*/
clLib.images = $.extend(clLib.images
    ,{
    init: function() {
        // Setup AWS authentification..
        AWS.config.update({
            "accessKeyId": "AKIAJ7GUMJYATJ6PPIZA" 
            ,"secretAccessKey": "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"
            ,"region": "us-west-2"
        });
        clLib.images.bucketName = 'cl.foobucket';
		clLib.images.amazonAWSURL = "https://d3gpzvq0gqbk39.cloudfront.net";

    }
    ,uploadImage: function(imgOptions, successFunc, errorFunc) {
        util.error("saving impOptions of >" + imgOptions + "<");
        util.error("saving jsoned impOptions of >" + JSON.stringify(imgOptions) + "<");
        //return true;
        /*
            imgOptions = 
                fileName
                contentType
                dataURI
                dataFileObj
                bucketName
        */
        if(!imgOptions["bucketName"]) {
            clLib.console.log("defaulting bucketname to >" + clLib.images.bucketName + "<");
            imgOptions["bucketName"] = clLib.images.bucketName;
        }
        clLib.console.log("bucketName is >" + imgOptions["bucketName"] + "<");
        var bucket = new AWS.S3({params: {Bucket: imgOptions["bucketName"]}});
        if(!imgOptions["fileName"]) {
            imgOptions["fileName"] = Date.now();
            if(imgOptions["contentType"] == "image/png") {
                imgOptions["fileName"] += ".png";
            } 
            else if(imgOptions["contentType"] == "image/jpg") {
                imgOptions["fileName"] += ".jpg";
            }
            else {
                return errorFunc("unknown imgOptions[contentType] >" + imgOptions["contentType"] + "<");
            }
            clLib.console.log("filename is >" + imgOptions["fileName"] + "<");
        }
        var bucketBody;
        clLib.console.log("imgOptions: >" + JSON.stringify(Object.keys(imgOptions)) + "<");
        if(imgOptions["dataFileObj"]) {
            bucketBody = imgOptions["dataFileObj"];
        }



/*

// ALTERNATIVE fro PHONEGAP: Use resolveLocalFileSysstemURL instead of base64-date
window.resolveLocalFileSystemURL(fileUrl, function (fileEntry) {

        fileEntry.file(function (file) {
            // Do your other work here
            // ...
        });
    }); 




*/





        else if(imgOptions["dataURI"]) {
            clLib.console.log("yes, datauri..");
            //clLib.console.log("dataURI is >" + imgOptions["dataURI"] + "<");
            bucketBody = clLib.images.dataURLtoBlob(imgOptions["dataURI"]);
            clLib.console.log("converted.");
            //clLib.console.log("bucketBody is >" + bucketBody + "<");
        }
        else {
            return errorFunc("no image data passed..");
        }
        clLib.console.log("setting params");
        var params = {
            Key: imgOptions["fileName"]
            ,contentType: imgOptions["contentType"]
            ,Body: bucketBody
            ,ACL: "public-read"
        };
        //alert("uploading..>" + JSON.stringify(params) + "<");
        
        bucket.upload(params, function (err, data) {
            //alert("img upload result >" + err + "< data >" + JSON.stringify(data) + "<");
            //if(err) {
            //    return errorFunc("Error while uploading image data >" + err + "<");
            //}
            
            var imgURL = clLib.images.amazonAWSURL + "/" + imgOptions["fileName"];
            //alert("saved image at >" + imgURL + "<");
            //
            // callback version of function called?
            //
            //alert("checking for callback func..>" + successFunc + "< >" + typeof(successFunc) + "<");
            if(successFunc && typeof(successFunc) == 'function') {
                //alert("callback func specified - call it!");
                return successFunc(imgURL);
            }
        });
        return; // successFunc();
    
    }
    ,dataURLtoBlob: function(dataurl) {
        clLib.console.log("urltoblob..");
        clLib.console.log("dataurl..>" + dataurl.substr(1,100) + "<");
        var arr = dataurl.split(',');
        //var mime = arr[0].match(/:(.*?);/)[1];
        var imgData = arr[0];
        clLib.console.log("split");
        clLib.console.log("imgData >" + JSON.stringify(imgData).substring(1,50) + "<");
        
        clLib.console.log("atobing length >" + imgData.length + "<..");
        clLib.console.log("atobing part >" + imgData.substring(0,50) + "<");
        var bstr = atob(imgData.substring(0,50));
        clLib.console.log("atobing full >" + imgData.substring(0,50) + "<");
        var bstr = atob(imgData);
        clLib.console.log("now n");
        var n = bstr.length;
        clLib.console.log("now u8arr");
        var u8arr = new Uint8Array(n);
        clLib.console.log("whiling..");

        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        clLib.console.log("returning");
        var blob;
        try {
            blob = new Blob([u8arr], {type:"img/jpg"});
        } catch(e) {
            clLib.console.log("EXCEPTION >" + JSON.stringify(e) + "<");
        }
        return blob;
    }

    ,previewImg: function(imageURI, previewHandler) {
        clLib.alert("previe Handler? >" + previewHandler + "<");
        if(!$.mobile && previewHandler) {
            clLib.alert("calling previewHandler...");
            previewHandler(imageURI);
            return;
        }
    //alert("previewing img >" + imageURI + "<..");
        // display preview iamge
        //alert(clLib.UI.byId$("routeImg")[0].outerHTML);
        clLib.UI.byId$("routeImg").attr("src", imageURI);
        clLib.UI.byId$("routeImgContainer").show();
        
        clLib.UI.byId$("getPictureButton").removeClass("clFullWidth");
        clLib.UI.byId$("removePictureButton").show();
        
        //alert("previewed img..");
    }
    ,saveImgDataForUpload: function(fileName, contentType, dataURI, dataFileObj) {
        var tmpImgObj = {
            fileName: fileName
            ,contentType: contentType
            ,dataURI: dataURI
            ,dataFileObj: dataFileObj
        };
        clLib.console.log("Setting tmpImgObj to >" + JSON.stringify(tmpImgObj) + "<");
        window["tmpImgObj"] = tmpImgObj;
        //localStorage.setItem("tmpImgObj", JSON.stringify(tmpImgObj));
    }
    ,phonegapSuccessHandler: function(imageURI) {
        alert("previewing img >" + imageURI + "<");
        clLib.images.previewImg(imageURI);
        clLib.images.saveImgDataForUpload(
            Date.now() + ".jpg"
            ,"image/jpg"
            ,imageURI
        );
    }
    ,desktopSuccessHandler: function(fileObj, previewHandler) {
        var imgURL = URL.createObjectURL(fileObj);
        //alert("imgURL is >" + imgURL + "<");
        clLib.images.previewImg(imgURL, previewHandler);
        clLib.images.saveImgDataForUpload(
            Date.now()+ "_" + fileObj.name
            ,fileObj.type
            ,null
            ,fileObj
        );
    }
    ,uploadErrorHandler: function(error) {
        alert("img upload error >" + JSON.stringify(error) + "<");
    }
    ,getCameraOptions: function() { 
        return {
            quality: 100
            ,destinationType: Camera.DestinationType.DATA_URL //FILE_URI 
            ,encodingType: Camera.EncodingType.JPEG
        };
    }
    




    }
    );


