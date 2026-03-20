console.log("functions in javascript");

// public static void add(int a , int b)
// {
//     System.out.println(a + b);
// }

// add();

// function add(a, b) {
//   console.log(a + b);
// }

// add(10, 30);

// fucntions with return value. or return type.

// public static int add(int a, int b)
// {
//   return (a + b);
// }

// int result = add(4, 5);
// System.out.println(result);

// function add(a, b) {
//   return a + b;
// }

// let result = add(4, 5);
// console.log(result);
// console.log(add(5, 6));

// lambda function. // array function.

// function add(a, b)
// {
//   return (a + b);
// }

// arraw function. / lambda function.

// const add = (a, b) => a + b;

// add();

// let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// var squares = numbers.map((eachnumber) => eachnumber * eachnumber);

// console.log(squares);

// // filter()

// var even_numbers = numbers.filter((eachnumber) => {
//   if (eachnumber % 2 == 0) {
//     return eachnumber;
//   }
// });

// console.log(even_numbers);

// var multiples_of_7 = () => {
//   let result = [];
//   for (let i = 1; i <= 100; i++) {
//     if (i % 7 == 0) {
//       result.push(i);
//     }
//   }
//   return result;
// };

// console.log(multiples_of_7());

// var elements = document.querySelectorAll(arguments[0]);
// var result = [];
// for (var i = 0; i < elements.length; i++) {
//   var text = elements[i].textContent.trim();
//   if (text !== "") {
//     result.push(text);
//   }
// }
// return result;

var mainheading = document.querySelector("h1");
var mainheading = document.querySelector(".myheading");

console.log(mainheading);
console.log(mainheading.innerHTML);

var secondheading = document.querySelector(".secondheading");

console.log(secondheading);
console.log(secondheading.innerHTML);

var firstParagraph = document.querySelectorAll("#one");

console.log(firstParagraph);
console.log(firstParagraph.innerHTML);
