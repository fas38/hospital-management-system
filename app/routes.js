// app/routes.js
var did;
var nid;
var pid;
var wid;
var g;
var bill_id;
var quantity;
var u_price;
var m_id;

var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "hospital_db"
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



	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {

		bill_id = parseInt(req.user.id);

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
		var e_qualification11 = {did, degree: req.body.degree1, board: req.body.board1, year: req.body.year1, 
			cgpa: req.body.cgpa1, position: req.body.position1};	
		
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


	// Prescription Entry

	app.post("/newPrescription",function(req,res){
  		g = req.body.id;
  		res.render("radio_prescription");
  	});

  		app.post('/newRadioReport', function(req, res){
		
		var sum = 0;

		var a = Number(req.body.a);
		var b = Number(req.body.b);
		var c = Number(req.body.c);

		if(!isNaN(a))
			sum = sum + a;

		if(!isNaN(b))
			sum = sum + b;

		if(!isNaN(c))
			sum = sum + c;

		connection.query("UPDATE bill SET total_payable = total_payable + ? WHERE id = ?", [sum,g]);

		

		res.render('image_prescription');
	})

	app.post('/newImageReport', function(req, res){
		
		var sum = 0;

		var a = Number(req.body.a);
		var b = Number(req.body.b);
		var c = Number(req.body.c);

		if(!isNaN(a))
			sum = sum + a;

		if(!isNaN(b))
			sum = sum + b;

		if(!isNaN(c))
			sum = sum + c;

		connection.query("UPDATE bill SET total_payable = total_payable + ? WHERE id = ?", [sum,g]);

		res.render('path_prescription');
	})

	app.post('/newPathReport', function(req, res){
		
		var sum = 0;

		var a = Number(req.body.a);
		var b = Number(req.body.b);
		var c = Number(req.body.c);

		if(!isNaN(a))
			sum = sum + a;

		if(!isNaN(b))
			sum = sum + b;

		if(!isNaN(c))
			sum = sum + c;

		connection.query("UPDATE bill SET total_payable = total_payable + ? WHERE id = ?", [sum,g]);

		res.render('medicine_prescription.ejs');
	})

	app.post('/newPrescribedMedicine', function(req, res){
		
		var sum;
		console.log(typeof(req.body.name));
		connection.query("SELECT * FROM medicine WHERE name = ? ",req.body.name1, function(err, row){

  			if(err) throw err;
  			quantity = Number(row[0].quantity);
  			u_price = Number(row[0].u_price);
  			m_id = Number(row[0].mid);
  			var x = parseInt(req.body.quantity1);


  		if(!((quantity - x) < 0)){
  			connection.query('UPDATE medicine SET quantity = quantity - ? WHERE mid = ?',[x,m_id]);
  			sum = x*u_price;
  			connection.query('UPDATE bill SET total_payable = total_payable + ? WHERE id = ?',[sum,g]);
  		}
  		});

  		connection.query("SELECT * FROM medicine WHERE name = ? ",req.body.name2, function(err, row){

  			if(err) throw err;
  			quantity = Number(row[0].quantity);
  			u_price = Number(row[0].u_price);
  			m_id = Number(row[0].mid);
  			var x = parseInt(req.body.quantity2);

  		if(!((quantity - x) < 0)){
  			connection.query('UPDATE medicine SET quantity = quantity - ? WHERE mid = ?',[x,m_id]);
  			sum = x*u_price;
  			connection.query('UPDATE bill SET total_payable = total_payable + ? WHERE id = ?',[sum,g]);
  		}
  		});

  		connection.query("SELECT * FROM medicine WHERE name = ? ",req.body.name3, function(err, row){

  			if(err) throw err;
  			quantity = Number(row[0].quantity);
  			u_price = Number(row[0].u_price);
  			m_id = Number(row[0].mid);
  			var x = parseInt(req.body.quantity3);
  		if(!((quantity - x) < 0)){
  			connection.query('UPDATE medicine SET quantity = quantity - ? WHERE mid = ?',[x,m_id]);
  			sum = x*u_price;
  			connection.query('UPDATE bill SET total_payable = total_payable + ? WHERE id = ?',[sum,g]);
  		}
  		});

		res.redirect('/profile');

	})

	// POST REQUEST  for Medicine Entry=========

	app.post('/newMedicine', function(req, res){
		
		
		var mmedicine = {name: req.body.name, type: req.body.type, u_price: req.body.u_price, 
			quantity: req.body.quantity, mdate: req.body.mdate, edate: req.body.edate};	
		
		connection.query("INSERT INTO medicine SET ?", mmedicine);

		res.redirect('/profile');

	});	



	// Patient Due bill

	app.get('/dueBill', function(req,res){
  		
  		connection.query('select due from bill_due where id = ?',bill_id,function(err,rows){
			if(err){
					console.log(err);
					return;
			}
			res.render("billDetails",{dueBill: rows[0].due});
		});	
	});

	 app.post('/update_payment', function(req, res) {

  		var paid = parseInt(req.body.paid);
    	connection.query("UPDATE bill SET paid = paid + ? WHERE id = ?",[paid,req.body.id] );
    	res.render("StaffIndex");
  	
  	});

	app.post('/delete_user', function(req, res) {
  		var id = parseInt(req.body.id);
    	connection.query("DELETE FROM user WHERE id = ?",id);
    	res.render("StaffIndex");
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

// con.query('select * from bill_due',function(err,rows){
// 	if(err){
// 		console.log(err);
// 		return;
// 	}
// 	rows.forEach(function(result){
// 		console.log(result.id,result.due);
// 	});
// });

// con.end(function(){
// 	console.log("Connection Closed...")
// });



