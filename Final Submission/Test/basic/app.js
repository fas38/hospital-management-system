var express = require("express");
var app = express();

app.use(express.static("public"));

app.get("/",function(req,res){
	console.log("Someone has made a get req at '/'")
	res.render("index.ejs");
})

app.get("/:x",function(req,res){
	console.log("Someone has made a get req at "+String(req.params.x));
	res.render(req.params.x);
});

app.get("*",function(req,res){
	console.log("Someone has made a get req at 404");
	res.render("404.ejs");
});

app.listen(3000,'localhost',function(){
	console.log("Server Started");
});