// set up
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// connect to DB
mongoose.connect('mongodb://127.0.0.1:27017/mean');

// configureation
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());

// data model
var todoSchema = new mongoose.Schema({
	text: {type: String},
	created_at: {type: Date, default: Date.now},
	completed_at: {type: Date}
});
var Todo = mongoose.model('Todo', todoSchema);

// Express routes
// ## API ##
//Get all the todos
app.get('/api/todos', function(req, res) {
	Todo.find(function(err, todos) {
		if(err) res.send(err);

		res.json(todos);
	});
});

//create todo and send back all todos after
app.post('/api/todos', function(req, res) {
	Todo.create({
		text: req.body.text,
		done: false
	}, function(err, todo) {
		if(err) res.send(err);

		Todo.find(function(err, todos) {
			if (err) res.send(err);
			res.json(todos);
		});
	});
});

//delete todo
app.delete('/api/todos/:todo_id', function(req, res) {
	Todo.remove({
		_id: req.params.todo_id
	}, function(err, todo) {
		if(err) res.send(err);

		Todo.find(function(err, todos) {
			if (err) res.send(err);
			res.json(todos);
		}); 
	});
});

// ## Application Route ##
app.get('*', function(req, res) {
	res.sendFile('./public/index.html'); //loads the single view file.. angular will handls page changes
});

//Get the OpenShift Ports/IP
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080 
var ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

//start the server
app.listen(port, ip);
console.log('App is listening on port ' + port + ' IP ' + ip);