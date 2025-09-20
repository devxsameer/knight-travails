// 🏇 Knight Travails
// Implementation of BFS to find the shortest path a knight takes on a chessboard

// -------------------------
// Main function
// -------------------------

/**
 * Find the shortest path a knight can take from startPos to desiredPos.
 * @param {number[]} startPos - [x, y] starting coordinates
 * @param {number[]} desiredPos - [x, y] target coordinates
 * @returns {number[][]} path - list of positions from start to target
 */
function knightMoves(startPos, desiredPos) {
  if (!isValidPosition(startPos) || !isValidPosition(desiredPos)) {
    throw new Error("Invalid position");
  }

  const queue = [startPos];
  const visited = new Set([startPos.toString()]);
  const parent = { [startPos.toString()]: null };

  while (queue.length) {
    const curr = queue.shift();

    // ✅ Goal check
    if (samePos(curr, desiredPos)) {
      return reconstructPath(curr, parent);
    }

    // 🔄 Explore neighbors
    for (const move of generateValidMoves(curr)) {
      const key = move.toString();
      if (!visited.has(key)) {
        visited.add(key);
        parent[key] = curr.toString();
        queue.push(move);
      }
    }
  }
}

// -------------------------
// Helper functions
// -------------------------

/**
 * Reconstructs the path from the parent map once the target is reached.
 * @param {number[]} curr - current position
 * @param {Object} parent - map of childKey -> parentKey
 * @returns {number[][]} path
 */
function reconstructPath(curr, parent) {
  const path = [];
  let key = curr.toString();

  while (key !== null) {
    const [x, y] = key.split(",").map(Number);
    path.push([x, y]);
    key = parent[key];
  }

  return path.reverse();
}

/**
 * Checks if two positions are the same.
 */
function samePos(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

/**
 * Checks if a position is valid on an 8x8 chessboard.
 */
function isValidPosition(pos) {
  if (!Array.isArray(pos) || pos.length !== 2) return false;
  const [x, y] = pos;
  return (
    Number.isInteger(x) &&
    Number.isInteger(y) &&
    x >= 0 &&
    x <= 7 &&
    y >= 0 &&
    y <= 7
  );
}

/**
 * Generates all valid knight moves from a given position.
 */
function generateValidMoves([x, y]) {
  const deltas = [
    [2, 1],
    [2, -1],
    [-2, 1],
    [-2, -1],
    [1, 2],
    [1, -2],
    [-1, 2],
    [-1, -2],
  ];
  return deltas.map(([dx, dy]) => [x + dx, y + dy]).filter(isValidPosition);
}

// -------------------------
// Export
// -------------------------

export default knightMoves;
