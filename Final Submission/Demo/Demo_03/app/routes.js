// app/routes.js
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
		res.render('signin.ejs', { message: req.flash('loginMessage') });
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



