echo("abc",10)
echo("efg",3)

function echo(x,y){
	for(var i = 0; i<Number(y); i++)
		console.log(x);
}