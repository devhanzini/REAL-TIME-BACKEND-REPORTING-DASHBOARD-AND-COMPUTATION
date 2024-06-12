
// function newton(func, guess) {

//     const EPSILON = 1e-10;

//     const MAX_ITERATIONS = 1000;

//     let x0 = guess;

//     let x1;

//     let f0, f1;

//     let iterations = 0;

//     do {

//         f0 = func(x0);

//         f1 = derivative(func, x0);

//         if (f1 === 0) {

//             throw new Error("Derivative is zero.");

//         }

//         x1 = x0 - f0 / f1;

//         if (++iterations > MAX_ITERATIONS) {

//             throw new Error("Maximum iterations reached.");

//         }

//         x0 = x1;

//     } while (Math.abs(x1 - x0) > EPSILON);

//     return x1;

// }
 
// // Derivative calculation for Newton's method

// function derivative(func, x) {

//     const h = 1e-5;

//     return (func(x + h) - func(x)) / h;

// }
