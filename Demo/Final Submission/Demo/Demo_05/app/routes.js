// app/routes.js
var mysql = require('mysql');

var connection = mysql.createConnection({
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


	// =====================================
	// Forms for User Staff ================
	// =====================================
	
	app.get('/newPatient', function(req, res){
		res.render('patient_entry_form.ejs');
	})

	app.get('/newDoctor', function(req, res){
		res.render('system_entry_form_doctor.ejs');
	})

	app.get('/newNurse', function(req, res){
		res.render('system_entry_form_nurse.ejs');
	})
	
	app.get('/newStaff', function(req, res){
		res.render('system_entry_form_staff.ejs');
	})

	app.get('/newWard', function(req, res){
		res.render('system_entry_form_Ward.ejs');
	})

	// POST REQUEST  for Doctor Entry================

	app.post('/newDoctor', function(req, res){

		var user = {username: req.body.username,password: req.body.password, user_type: "Doctor"};
		var did;

		connection.connect(function(err) {
		    if (err) throw err;
		    else{
	      		connection.query("INSERT INTO pre_user SET ?", user, function (err,res) {
		      		if (err) throw err;
		      		connection.query("SELECT * FROM user WHERE username = ? ",user.username, function(err, row){
		      			if(err) throw err;
		      			did = row[0].id;
			      		var ddoctor = {did, fname: req.body.fname, mname: req.body.mname, lname: req.body.lname, 
			      			bdate: req.body.bdate, adate: req.body.adate, gender: req.body.gender, rid: req.body.registar, 
			      			assigned_ward: req.body.ward};
		      			connection.query("INSERT INTO doctor SET ?", ddoctor, function (err,res){
		      				if (err) throw err;
		      			});

		      			var e_qualification1 = {did, degree: req.body.degree1, board: req.body.board1, year: req.body.year1, 
		      				cgpa: req.body.cgpa1, position: req.body.position1};	
		      			if(true){
		      				connection.query("INSERT INTO education_qualification SET ?", e_qualification1);	
		      			};

		      			var e_qualification2 = {did, degree: req.body.degree2, board: req.body.board2, year: req.body.year2, 
		      				cgpa: req.body.cgpa2, position: req.body.position2};
		      			if(true){
		      				connection.query("INSERT INTO education_qualification SET ?", e_qualification2);	
		      			};

		      			var e_qualification3 = {did, degree: req.body.degree3, board: req.body.board3, year: req.body.year3, 
		      				cgpa: req.body.cgpa3, position: req.body.position3};
		      			if(true){
		      				connection.query("INSERT INTO education_qualification SET ?", e_qualification3, 
		      				function (err,res){
		      					if(err) throw err;
		      				});	
		      			};

		      			var e_qualification4 = {did, degree: req.body.degree4, board: req.body.board4, year: req.body.year4, 
		      				cgpa: req.body.cgpa4, position: req.body.position4};
		      			if(true){
		      				connection.query("INSERT INTO education_qualification SET ?", e_qualification4, 
		      				function (err,res){
		      					if(err) throw err;
		      				});	
		      			};

		      			var e_qualification5 = {did, degree: req.body.degree5, board: req.body.board5, year: req.body.year5, 
		      				cgpa: req.body.cgpa5, position: req.body.position5};
		      			if(true){
		      				connection.query("INSERT INTO education_qualification SET ?", e_qualification5, 
		      				function (err,res){
		      					if(err) throw err;

		      					
		      				});	
		      			};

						
		      		
	      			});	
	      		});
	      	};             
		    
		});
                       

		res.redirect('/profile');
	});

	// POST REQUEST  for Nurse Entry================

	app.post('/newNurse', function(req, res){

		var user = {username: req.body.username,password: req.body.password, user_type: "Nurse"};
		var nid;

		connection.connect(function(err) {
		    if (err) throw err;
		    else{
	      		connection.query("INSERT INTO pre_user SET ?", user, function (err,res) {
		      		if (err) throw err;
		      		connection.query("SELECT * FROM user WHERE username = ? ",user.username, function(err, row){
		      			if(err) throw err;
		      			nid = row[0].id;
			      		var nnurse = {nid, fname: req.body.fname, mname: req.body.mname, lname: req.body.lname, 
			      			bdate: req.body.bdate, adate: req.body.adate, gender: req.body.gender, sid: req.body.supervisor, 
			      			assigned_ward: req.body.ward};
		      			connection.query("INSERT INTO nurse SET ?", nnurse, function (err,res){
		      				if (err) throw err;
		      			});

		      			var e_qualification1 = {nid, degree: req.body.degree1, board: req.body.board1, year: req.body.year1, 
		      				cgpa: req.body.cgpa1, position: req.body.position1};	
		      			if(true){
		      				connection.query("INSERT INTO education_qualification SET ?", e_qualification1);	
		      			};

		      			var e_qualification2 = {nid, degree: req.body.degree2, board: req.body.board2, year: req.body.year2, 
		      				cgpa: req.body.cgpa2, position: req.body.position2};
		      			if(true){
		      				connection.query("INSERT INTO education_qualification SET ?", e_qualification2);	
		      			};

		      			var e_qualification3 = {nid, degree: req.body.degree3, board: req.body.board3, year: req.body.year3, 
		      				cgpa: req.body.cgpa3, position: req.body.position3};
		      			if(true){
		      				connection.query("INSERT INTO education_qualification SET ?", e_qualification3, 
		      				function (err,res){
		      					if(err) throw err;
		      				});	
		      			};

		      			var e_qualification4 = {nid, degree: req.body.degree4, board: req.body.board4, year: req.body.year4, 
		      				cgpa: req.body.cgpa4, position: req.body.position4};
		      			if(true){
		      				connection.query("INSERT INTO education_qualification SET ?", e_qualification4, 
		      				function (err,res){
		      					if(err) throw err;
		      				});	
		      			};

		      			var e_qualification5 = {nid, degree: req.body.degree5, board: req.body.board5, year: req.body.year5, 
		      				cgpa: req.body.cgpa5, position: req.body.position5};
		      			if(true){
		      				connection.query("INSERT INTO education_qualification SET ?", e_qualification5, 
		      				function (err,res){
		      					if(err) throw err;

		      					
		      				});	
		      			};

						
		      		
	      			});	
	      		});
	      	};             
		    
		});
                       

		res.redirect('/profile');
	});

		


	// =====================================
	// Forms for User Nurse ================
	// =====================================



	// =====================================
	// Forms for User Doctor ===============
	// =====================================
	app.get('/newPrescription', function(req, res){
		res.render('prescription_form.ejs');
	})

	app.get('/newAppointment', function(req, res){
		res.render('appointment_form.ejs');
	})

	app.post('/profile', function(req, res){
		res.redirect('/profile');
	})

	


	// =====================================
	// Forms for User Patient ==============
	// =====================================


	// =====================================
	// Miscellaneous Routes ================
	// =====================================
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



