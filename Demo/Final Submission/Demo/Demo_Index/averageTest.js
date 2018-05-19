function average(s){
	var avg = 0;
	s.forEach(function(s){
		avg += s;
	});

	avg = avg/s.length;
	return Math.round(avg);
}

var score = [10,10,10];
console.log(average(score));