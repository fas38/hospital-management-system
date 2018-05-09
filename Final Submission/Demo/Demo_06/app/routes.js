// app/routes.js
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "sample01"
});

var did;
var nid;
var pid;
var wid;

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
		res.render('ward_info.ejs');
	})

	app.get('/newMedicine', function(req, res){
		res.render('system_entry_form_medicine.ejs');
	})

	// POST REQUEST  for Doctor Entry================

	app.post('/newDoctor', function(req, res){
		var user = {username: req.body.username,password: req.body.password, user_type: "Doctor"};
		connection.query("INSERT INTO pre_user SET ?", user, function (err,res) {
      		if (err) throw err;
      		connection.query("SELECT * FROM user WHERE username = ? ",user.username, function(err, row){
      			if(err) throw err;
      			did = row[0].id;
      		});
      	});  			

		res.render('system_entry_form_doctor_table.ejs');
	})

	app.post('/newDoctorProfile', function(req, res){
		var ddoctor = {did, fname: req.body.fname, mname: req.body.mname, lname: req.body.lname, 
			bdate: req.body.bdate, adate: req.body.adate, gender: req.body.gender, rid: req.body.registar, 
			assigned_ward: req.body.ward};
		
		
		connection.query("INSERT INTO doctor SET ?", ddoctor, function (err,res){
			if (err) throw err;
			
		});

		
		res.render("system_entry_form_doctor_qualification.ejs");

	})

	app.post('/newDoctorQualification', function(req, res){
		
		

		var e_qualification1 = {did, degree: req.body.degree1, board: req.body.board1, year: req.body.year1, 
			cgpa: req.body.cgpa1, position: req.body.position1};	
		
		connection.query("INSERT INTO education_qualification SET ?", e_qualification1);	

		var e_qualification2 = {did, degree: req.body.degree2, board: req.body.board2, year: req.body.year2, 
			cgpa: req.body.cgpa2, position: req.body.position2};
		
		connection.query("INSERT INTO education_qualification SET ?", e_qualification2);	

		var e_qualification3 = {did, degree: req.body.degree3, board: req.body.board3, year: req.body.year3, 
			cgpa: req.body.cgpa3, position: req.body.position3};
		
		connection.query("INSERT INTO education_qualification SET ?", e_qualification3); 	


		var e_qualification4 = {did, degree: req.body.degree4, board: req.body.board4, year: req.body.year4, 
			cgpa: req.body.cgpa4, position: req.body.position4};
		
		connection.query("INSERT INTO education_qualification SET ?", e_qualification4);

		var e_qualification5 = {did, degree: req.body.degree5, board: req.body.board5, year: req.body.year5, 
			cgpa: req.body.cgpa5, position: req.body.position5};
		
		connection.query("INSERT INTO education_qualification SET ?", e_qualification5);

		res.render('system_entry_form_doctor_experience.ejs');
		
			
	})

	app.post('/newDoctorExperience', function(req, res){
		
		var experience1 = {did, title: req.body.title1, dfrom: req.body.from1, dto: req.body.to1, 
		  organization: req.body.organization1};
		  console.log(typeof(experience1.dfrom));

		if(!(experience1.dfrom === ''))  

		{connection.query("INSERT INTO experience SET ?", experience1);};

		var experience2 = {did, title: req.body.title2, dfrom: req.body.from2, dto: req.body.to2, 
		  organization: req.body.organization2};
		if(!(experience2.dfrom === ''))
			connection.query("INSERT INTO experience SET ?", experience2);

		var experience3 = {did, title: req.body.title3, dfrom: req.body.from3, dto: req.body.to3, 
		  organization: req.body.organization3};
		if(!(experience3.dfrom === ''))
			connection.query("INSERT INTO experience SET ?", experience3);

		var experience4 = {did, title: req.body.title4, dfrom: req.body.from4, dto: req.body.to4, 
		  organization: req.body.organization4};
		if(!(experience4.dfrom === ''))
			connection.query("INSERT INTO experience SET ?", experience4);

		var experience5 = {did, title: req.body.title5, dfrom: req.body.from5, dto: req.body.to5, 
		  organization: req.body.organization5};  
		if(!(experience5.dfrom === ''))
			connection.query("INSERT INTO experience SET ?", experience5);

		res.redirect('/profile');
	})


	

	// POST REQUEST  for Nurse Entry================

	app.post('/newNurse', function(req, res){
		var user = {username: req.body.username,password: req.body.password, user_type: "Nurse"};
		connection.query("INSERT INTO pre_user SET ?", user, function (err,res) {
      		if (err) throw err;
      		connection.query("SELECT * FROM user WHERE username = ? ",user.username, function(err, row){
      			if(err) throw err;
      			nid = row[0].id;
      		});
      	});  			

		res.render('system_entry_form_nurse_table.ejs');
	})

	app.post('/newNurseProfile', function(req, res){
		var nnurse = {nid, fname: req.body.fname, mname: req.body.mname, lname: req.body.lname, 
			bdate: req.body.bdate, adate: req.body.adate, gender: req.body.gender, sid: req.body.supervisor, 
			assigned_ward: req.body.ward};
		
		
		connection.query("INSERT INTO nurse SET ?", nnurse, function (err,res){
			if (err) throw err;
			
		});

		
		res.render("system_entry_form_nurse_qualification.ejs");

	})

	app.post('/newNurseQualification', function(req, res){
		
		did = nid;
		console.log("Boobies");
		var e_qualification11 = {did, degree: req.body.degree1, board: req.body.board1, year: req.body.year1, 
			cgpa: req.body.cgpa1, position: req.body.position1};
		console.log("vagina");	
		
		connection.query("INSERT INTO education_qualification SET ?", e_qualification11);



		var e_qualification22 = {did, degree: req.body.degree2, board: req.body.board2, year: req.body.year2, 
			cgpa: req.body.cgpa2, position: req.body.position2};
		
		connection.query("INSERT INTO education_qualification SET ?", e_qualification22);	

		var e_qualification33 = {did, degree: req.body.degree3, board: req.body.board3, year: req.body.year3, 
			cgpa: req.body.cgpa3, position: req.body.position3};
		
		connection.query("INSERT INTO education_qualification SET ?", e_qualification33); 	


		var e_qualification44 = {did, degree: req.body.degree4, board: req.body.board4, year: req.body.year4, 
			cgpa: req.body.cgpa4, position: req.body.position4};
		
		connection.query("INSERT INTO education_qualification SET ?", e_qualification44);

		var e_qualification55 = {did, degree: req.body.degree5, board: req.body.board5, year: req.body.year5, 
			cgpa: req.body.cgpa5, position: req.body.position5};
		
		connection.query("INSERT INTO education_qualification SET ?", e_qualification55);

		res.render('system_entry_form_nurse_experience.ejs');
		
			
	})

	app.post('/newNurseExperience', function(req, res){
		
		console.log("pussy");
		did = nid;

		
		var experience11 = {did, title: req.body.title1, dfrom: req.body.from1, dto: req.body.to1, 
		  organization: req.body.organization1};

		if(!(experience11.dfrom === ''))
			connection.query("INSERT INTO experience SET ?", experience11);

		var experience22 = {did, title: req.body.title2, dfrom: req.body.from2, dto: req.body.to2, 
		  organization: req.body.organization2};
		if(!(experience22.dfrom === ''))
			connection.query("INSERT INTO experience SET ?", experience22);

		var experience33 = {did, title: req.body.title3, dfrom: req.body.from3, dto: req.body.to3, 
		  organization: req.body.organization3};
		if(!(experience33.dfrom === ''))
			connection.query("INSERT INTO experience SET ?", experience33);

		var experience44 = {did, title: req.body.title4, dfrom: req.body.from4, dto: req.body.to4, 
		  organization: req.body.organization4};
		if(!(experience44.dfrom === ''))  
			connection.query("INSERT INTO experience SET ?", experience44);

		var experience55 = {did, title: req.body.title5, dfrom: req.body.from5, dto: req.body.to5, 
		  organization: req.body.organization5};
		if(!(experience55.dfrom === ''))    
			connection.query("INSERT INTO experience SET ?", experience55);

		res.redirect('/profile');
	})


	// POST REQUEST  for Patient Entry======

	app.post('/newPatient', function(req, res){
		var user = {username: req.body.username,password: req.body.password, user_type: "Patient"};
		connection.query("INSERT INTO pre_user SET ?", user, function (err,res) {
      		if (err) throw err;
      		connection.query("SELECT * FROM user WHERE username = ? ",user.username, function(err, row){
      			if(err) throw err;
      			pid = row[0].id;
      		});
      	});  			

		res.render('system_entry_form_patient_table.ejs');
	})

	app.post('/newPatientProfile', function(req, res){
		var ppatient = {pid, fname: req.body.fname, mname: req.body.mname, lname: req.body.lname, 
			bdate: req.body.bdate, adate: req.body.adate, mblnoOne: req.body.mblnoOne, 
			mblnoTwo: req.body.mblnoTwo, gender: req.body.gender, streetno: req.body.streetno, 
			streetname: req.body.streetname, area: req.body.area, thana: req.body.thana, 
			district: req.body.district, pstreetno: req.body.pstreetno, pstreetname: req.body.pstreetname, 
			parea: req.body.parea, pthana: req.body.pthana, pdistrict: req.body.pdistrict, job: req.body.job, 
			deposit: req.body.deposit, admitted_ward: req.body.ward};
		
		
		connection.query("INSERT INTO patient SET ?", ppatient, function (err,res){
			if (err) throw err;
			
		});

		
		res.redirect('/profile');

	})



	// POST REQUEST  for Ward Entry======
	app.post('/newWard', function(req, res){
		var wward = {name: req.body.name,  rid: req.body.rid, sid: req.body.sid};
		connection.query("INSERT INTO ward SET ?", wward, function (err,res) {
      		if (err) throw err;
      		connection.query("SELECT * FROM ward WHERE name = ? ",wward.name, function(err, row){
      			if(err) throw err;
      			wid = row[0].id;
      		});
      	});  			

		res.render('bed_entry.ejs');
	})	


	app.post('/newBed', function(req, res){
		var bbed1 = {wid, bedNo: req.body.bno1, type: req.body.type1, rent: req.body.rent1, 
		status: req.body.status1};
		connection.query("INSERT INTO bed SET ?", bbed1);

		var bbed2 = {wid, bedNo: req.body.bno2, type: req.body.type2, rent: req.body.rent2, 
		status: req.body.status2};
		connection.query("INSERT INTO bed SET ?", bbed2);

		var bbed3 = {wid, bedNo: req.body.bno3, type: req.body.type3, rent: req.body.rent3, 
		status: req.body.status3};
		connection.query("INSERT INTO bed SET ?", bbed3);

		var bbed4 = {wid, bedNo: req.body.bno4, type: req.body.type4, rent: req.body.rent4, 
		status: req.body.status4};
		connection.query("INSERT INTO bed SET ?", bbed4);

		
		res.redirect('/profile');

	})	


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



