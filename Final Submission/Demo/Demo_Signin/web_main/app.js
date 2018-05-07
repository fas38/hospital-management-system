var express = require("express");
var app = express();
var favicon = require('serve-favicon')
var path = require('path')
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/",function(req,res){
	console.log("Someone has made a get req at '/'")
	res.render("signin");
})

app.get("/:x",function(req,res){
	console.log("Someone has made a get req at "+String(req.params.x));
	res.render(req.params.x);
});

app.post("/",function(req,res){
	console.log("Someone has made a post req at /")
	if(req.body.role == "doctor"){
		res.render("DoctorIndex");
	}
	else if(req.body.role == "nurse"){
		res.render("NurseIndex");
	}
	else if(req.body.role == "admin"){
		res.render("index");
	}
});

app.get("*",function(req,res){
	console.log("Someone has made a get req at 404");
	res.render("404");
});

app.listen(3000,'localhost',function(){
	console.log("Server Started");
});