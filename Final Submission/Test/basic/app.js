var express = require("express");
var app = express();
var path = require("path");

app.get("/",function(req,res){
	console.log("Someone has made a get req at '/'")
	res.sendFile(path.join(__dirname+"/index.html"));
})

app.get("/:x",function(req,res){
	console.log("Someone has made a get req at "+String(req.params.x));
	res.sendFile(path.join(__dirname+"/"+String(req.params.x)));
});

app.get("*",function(req,res){
	console.log("Someone has made a get req at 404");
	res.sendFile(path.join(__dirname+"/404.html"));
});

app.listen(3000,'localhost',function(){
	console.log("Server Started");
});