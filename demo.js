// demo.js
// 🎯 Demo usage of Knight Travails implementation

import knightMoves from "./knightTravails.js";

// Example runs
const examples = [
  { start: [0, 0], end: [3, 3] },
  { start: [0, 0], end: [7, 7] },
  { start: [3, 3], end: [4, 3] },
];

// Run each example
examples.forEach(({ start, end }) => {
  const path = knightMoves(start, end);

  console.log(`\nKnight moves from ${start} to ${end}:`);
  console.log(`=> You made it in ${path.length - 1} moves! Here's your path:`);

  path.forEach(([x, y]) => console.log(`[${x},${y}]`));
});
