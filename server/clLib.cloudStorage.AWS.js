// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Set your region for future requests.
AWS.config.region = 'us-west-2';
AWS.config.accessKeyId = "AKIAJ7GUMJYATJ6PPIZA";
AWS.config.secretAccessKey = "0lZ1MDggnwPJPuQgwJVWx7UWnTMa0zg1/JtgwaJV";

clLib.cloudStorage.AWS.buckets = {
    "img": new AWS.S3(
        {params: {
            Bucket: 'cl.imgbucket'
        }}
    )
};

clLib.cloudStorage.AWS.uploadFile(fileName, fileContent, successFunc, errorFunc) {
    var bucketParams = {
        Key: fileName
        ,Body: fileContent
    };
    var imgBucket = clLib.cloudStorage.AWS.buckets["img"];

    binaryData = new Buffer(fileContent, 'base64'); //.toString('binary');
    imgBucket.createBucket(function() {
        var params = {
            Key: fileName
            ,Body: binaryData 
            ,ACL: "public-read"
            //,ContentEncoding: 'asdfbase64'
            ,ContentType: 'image/' + imgFormat
        };
        imgBucket.upload(params, function(err, data) {
            if (err) {
                console.log(displayTime(),"Error uploading data: ", err);
                return errorFunc(err);
            } else {
                console.log(displayTime(),"Successfully uploaded data to " + bucketName + "/" + fileName);
                return successFunc(
                    "https://" + 
                    clLib.cloudStorage.AWS.buckets["img"]["bucket"]["params"]["Bucket"] + 
                    ".s3.amazonaws.com/" + 
                    fileName
                );
            }
        });
    });

  }
; 