console.log("while, do-while, for loop in javascript.");
console.log("break, continue");

// let i = 1;

// while (i <= 10) {
//   console.log(i);
//   i++;
// }

// let a = -10;
// while (a >= 1) {
//   console.log(a);
//   a--;
// }

// let i = 100;

// do {
//   console.log(i);
//   i++;
// } while (i <= 10);

// while loop is used when you dont know the ending value.

// for loop

// for (let i = 1; i <= 10; i++) {
//   console.log(i);
// }

// for (let i = 10; i >= 1; i--) {
//   console.log(i);
// }

console.log("break statement in a for loop.");

// for (let i = 1; i <= 10; i++) {
//   console.log(i);
//   if (i == 5) {
//     break;
//   }
// }

console.log("continue statement in a for loop.");
for (let i = 1; i <= 10; i++) {
  if (i == 5) {
    continue;
  }
  console.log(i);
}

console.log("continue statement in a for loop.");
for (let i = 1; i <= 10; i++) {
  if (i >= 4 && i <= 7) {
    continue;
  }
  console.log(i);
}

console.log("continue statement in a for loop.");
for (let i = 1; i <= 10; i++) {
  if (i <= 3 || i >= 8) {
    continue;
  }
  console.log(i);
}
