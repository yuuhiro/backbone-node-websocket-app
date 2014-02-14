
/**
 * Module dependencies.
 */

var express = require('express')
	, routes = require('./routes')
	, user = require('./routes/user')
	, http = require('http')
	, path = require('path')
	, mongoose = require('mongoose')
	, backboneio = require('backbone.io');

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app);
server.listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});


// mongoose
var Schema = mongoose.Schema;

var MemoSchema = new Schema({
	message : String,
	date    : Date,
	top     : String,
	left    : String,
	isDrag  : String
});

var MemoSchema2 = new Schema({
	message : String,
	date    : Date,
	top     : String,
	left    : String,
	isDrag  : String
});

mongoose.model('Memo', MemoSchema);
mongoose.model('Memo2', MemoSchema2);
var uri = process.env.MONGOHQ_URL || 'mongodb://127.0.0.1/chat_app';
mongoose.connect(uri);
var Memo = mongoose.model('Memo');
var Memo2 = mongoose.model('Memo2');

// Backbone.io
var backend = backboneio.createBackend();
backend.use(function(req, res, next) {
	console.log(req.method);
	next();
});
var backend2 = backboneio.createBackend();
backend2.use(function(req, res, next) {
	console.log(req.method);
	next();
});

// ミドルウェアを設定（mangodb）
backend.use(backboneio.middleware.mongooseStore(Memo));
backend2.use(backboneio.middleware.mongooseStore(Memo2));

var io = backboneio.listen(server, {mybackend: backend, mybackend2: backend2});
// io.configure(function () { 
// 	io.set("transports", ["xhr-polling"]); 
// 	io.set("polling duration", 10); 
// });
