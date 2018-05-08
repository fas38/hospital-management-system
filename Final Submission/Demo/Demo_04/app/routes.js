// app/routes.js
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "sample01"
});

module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signin', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
            
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

    app.post('/create_user', function(req, res) {

    	var user = {username: req.body.username,password: req.body.password, user_type: req.body.role};
    	con.query("INSERT INTO pre_user SET ?", user);
    	res.render("StaffIndex");
  	});

  	app.post('/create_nurse', function(req, res) {

  		var age = parseInt(req.body.age);
  		var supervisor_id = parseInt(req.body.supervisor_id);

    	var nurse = {nurse_name: req.body.name, gender: req.body.gender, age: age, contact_no: req.body.contact_no, address: req.body.address,
    		supervisor_id: supervisor_id, assigned_ward: req.body.ward};
    	con.query("INSERT INTO nurse SET ?", nurse);
    	res.render("StaffIndex");
  	});

  	app.post('/delete_user', function(req, res) {
  		var username = req.body.username;
    	con.query("DELETE FROM user WHERE username = ?",username);
    	res.render("StaffIndex");
  	});


	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {

		if(req.user.user_type == 'Staff'){
			res.render('StaffIndex.ejs', {
				user : req.user // get the user out of session and pass to template
			});
		}
    		
        else if(req.user.user_type == 'Nurse'){
			res.render('NurseIndex.ejs', {
				user : req.user // get the user out of session and pass to template
			});
		}
        else if(req.user.user_type == 'Doctor'){
			res.render('DoctorIndex.ejs', {
				user : req.user // get the user out of session and pass to template
			});
		}
        else{
			res.render('PatientIndex.ejs', {
				user : req.user // get the user out of session and pass to template
			});
		}
		
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get("/:x",function(req,res){
		console.log("Someone has made a get req at "+String(req.params.x));
		res.render(req.params.x);
	});


	app.use(function(err, req, res, next) {
  		res.render("404");
	});

	app.get("*",function(req,res){
		console.log("Someone has made a get req at 404");
		res.render("404");
	});

};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}



