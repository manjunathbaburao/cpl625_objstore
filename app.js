/**
 * Object Store Code Jam- showcasing the storage service on SAP Cloud Platform
 */

//List down all the required dependencies for the Node-Express app
var express = require('express'); 
var app = express();
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var statics = require('serve-static');
var http  = require("http");
var path = require("path");
var cfenv = require("cfenv");
var util = require('util');
var multer = require('multer');
var multerS3 = require('multer-s3');

var aws = require("aws-sdk"); //Module to connect to AWS
var fs = require("fs"); //Module for file system connection

//Gather all the Environment variables from VCAP
var cf_svc = require( './app/vcap_services');

//Retrieve the configurations for AWS connection
var objstore_url = cf_svc.get_objstore_url();

var endpoint = cf_svc.get_objstore_host();
var accesskey = cf_svc.get_objstore_accesskeyid();
var accesssecret = cf_svc.get_objstore_secretaccesskey();
var bucket = cf_svc.get_objstore_bucket();
var user = cf_svc.get_objstore_user();

// Set Express app parameters
app.set('port', process.env.PORT || 6000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/images/favicon.ico'));
//app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + '/public/uploads' }));
app.use(logger('dev'));
app.use(bodyParser());
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//app.use(app.router);
app.use(statics(path.join(__dirname, '/public')));

// development only debug 
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Create S3 client
var s3 = new aws.S3({
		apiVersion: "2006-03-01",
		endpoint: endpoint,
		region: '<enter region here>',
		signatureVersion: 'v4',
		credentials: {
			accessKeyId: accesskey,
	        secretAccessKey: accesssecret
		},
	    //httpOptions: { agent: proxy('http://proxy.wdf.sap.corp:8080/') }
	 }); 

var upload = multer({dest: 'uploads/'});

app.post('/upload', upload.single('imageName'), function(req, res, next){

	console.log('/// ----------- Upload');
	console.log(req.file);
	var fileBuffer = fs.readFileSync('uploads/' + req.file.filename);
	var writeparams = {
		  Bucket: bucket, // required
		  Key: req.file.originalname, // required
		  Body: fileBuffer,
		  ContentType: "image/jpeg"
	};

	s3.putObject(writeparams, function(err, data) {
		if (err) {
			console.log("Error in upload", err.stack);
			res.render('index', {message: 'Error '+JSON.stringify(err.stack), title: 'Image Library'});
			} // error response
		else {
			console.log("Uploaded the object ",data);
			res.render('index', {message: 'Uploaded successful '+ JSON.stringify(data), title: 'Image Library'});
			} // successful response
	});
});

app.post('/show', function(req, res){
	
	console.log('/// ----------- Show');
	var listparams = {
			Bucket: bucket
			};
	
	s3.listObjects(listparams, function(err, data){
	  var bucketContents = data.Contents;
	  console.log(bucketContents);
	  res.render('list', {objects: bucketContents, title: 'Image List'});
    });
});

app.post('/view', function(req, res){
	
	console.log('/// ----------- View');
	console.log(req.body.selection);
	var readparams = {
			  Bucket: bucket, // required
			  Key: req.body.selection, // required
			};

	s3.getSignedUrl('getObject', readparams, function(err, url){
		if (err) {
			console.log(err, err.stack);
		} // error response
		else {
			console.log('the url of the image is', url);
			res.render('image', {photo: url, title: 'Image Display'});
		} // successful response
	});
});

//App home page
app.get('/', function(req, res){
    res.render('index', {title: 'Image Library'});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
