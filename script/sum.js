// Ask user to enter numbers separated by spaces or commas
let input = prompt("Enter numbers separated by spaces or commas:");

// Convert input string to an array of numbers
let numbers = input.split(/[\s,]+/).map(Number);

// Calculate sum
let sum = numbers.reduce((acc, curr) => acc + curr, 0);

console.log("Sum =", sum);
alert("Sum = " + sum);
