/*
Write a function compress(str), which shortens strings by reducing consecutive character repetitions:
input: aaaabbaaaababbbcccccccccccc
return value: a4b2a4b1a1b3c12
*/

function compress(str) {
	var res = [str[0]];
	var prev = str[0];
	var repetitions = 1;
	for(var i = 1; i < str.length; i++) {
		if (str[i] !== prev) {
			res.push(repetitions.toString());
			res.push(str[i]);
			repetitions = 0;
			prev = str[i];
		}
		repetitions += 1;
	}
	res.push(repetitions.toString());
	return res.join("");
}

console.assert(compress("aaaabbaaaababbbcccccccccccc") === "a4b2a4b1a1b3c12");
console.assert(compress("abcd") === "a1b1c1d1");
