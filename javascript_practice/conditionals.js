console.log("conditional statments");

// if-else, if-else if-else,  switch - case , break, continue
// > <  >= <= == !=
// and , or , not

let a = 40;
let b = 20;
let c = 10;

if (a < b && a < c) {
  console.log("A is smallest");
} else if (b < a && b < c) {
  console.log("b is the smallest");
} else {
  console.log("c is smallest number");
}

let name = "Raj";

switch (name) {
  case "Ecoders": {
    console.log("Access granted");
    break;
  }
  case "Anjan": {
    console.log("Access granted");
    break;
  }
  case "Bharath": {
    console.log("Access granted");
    break;
  }
  case "Shilpa": {
    console.log("Access granted");
    break;
  }
  case "Sharanya": {
    console.log("Access granted");
    break;
  }

  default: {
    console.log("Access denied, username not matching");
  }
}
