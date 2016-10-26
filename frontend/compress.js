'use strict';

function compress(str) {
  const res = [str[0]];
  let prev = str[0];
  let repetitions = 1;
  for (let i = 1; i < str.length; i += 1) {
    if (str[i] !== prev) {
      res.push(repetitions.toString());
      res.push(str[i]);
      repetitions = 0;
      prev = str[i];
    }
    repetitions += 1;
  }
  res.push(repetitions.toString());
  return res.join('');
}

console.assert(compress('aaaabbaaaababbbcccccccccccc') === 'a4b2a4b1a1b3c12');
console.assert(compress('abcd') === 'a1b1c1d1');
