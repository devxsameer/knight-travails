import knightMoves from "./knightTravails.js";

const UI = {
  // --- Cached DOM elements ---
  boardElement: document.querySelector(".board"),
  clearBtn: document.querySelector(".clear-btn"),
  travailBtn: document.querySelector(".travail-btn"),
  randomBtn: document.querySelector(".random-btn"),

  // --- State ---
  selectionActive: true, // controls whether clicks are allowed
  startPos: [],
  desiredPos: [],
  path: [],

  /**
   * Initialize the board + attach event listeners
   */
  init() {
    const size = 8;

    // Generate 8x8 chessboard squares
    this.boardElement.innerHTML = Array.from({ length: size }, (_, i) =>
      Array.from({ length: size }, (_, j) => {
        const color = (i + j) % 2 === 0 ? "light" : "dark";
        return `
          <div 
            class="square ${color}" 
            data-x="${i}" 
            data-y="${j}">
          </div>
        `;
      }).join("")
    ).join("");

    // Handle board clicks
    this.boardElement.addEventListener("click", (e) => {
      const square = e.target.closest(".square");
      if (!square) return;
      this.handleClick(square);
    });

    // Buttons
    this.clearBtn.addEventListener("click", this.clear.bind(this));
    this.randomBtn.addEventListener("click", () => this.placeRandomKnight());
    this.travailBtn.addEventListener("click", () => this.animatePath());

    this.boardElement.classList.add("active");
  },

  /**
   * Handle user clicks: first click = start, second click = end
   */
  handleClick(square) {
    if (!this.selectionActive) return;

    // First click → set start
    if (!(this.startPos.length === 2)) {
      this.startPos = [Number(square.dataset.x), Number(square.dataset.y)];
      square.classList.add("active");
      square.innerHTML = `<img width="100%" src="./assets/horse.png" alt="horse" />`;
    }
    // Second click → set end
    else if (!(this.desiredPos.length === 2)) {
      this.desiredPos = [Number(square.dataset.x), Number(square.dataset.y)];
      square.classList.add("active");

      // Stop additional selections
      this.boardElement.classList.remove("active");
      this.selectionActive = false;

      // 🚀 Calculate shortest path using BFS
      this.path = knightMoves(this.startPos, this.desiredPos) || [];
      console.log("Path:", this.path);
    }
  },

  /**
   * Animate knight movement along the computed path
   */
  async animatePath() {
    if (!this.path.length) {
      alert("Please select start and end squares first!");
      return;
    }

    // Reset intermediate squares (keep start & end marked)
    document.querySelectorAll(".square.active").forEach((sq) => {
      const x = Number(sq.dataset.x);
      const y = Number(sq.dataset.y);
      if (
        (x === this.startPos[0] && y === this.startPos[1]) ||
        (x === this.desiredPos[0] && y === this.desiredPos[1])
      ) {
        return; // skip start and end
      }
      sq.innerHTML = "";
      sq.classList.remove("active");
    });

    // Step through the path
    for (let step = 0; step < this.path.length; step++) {
      const [x, y] = this.path[step];
      const square = this.boardElement.querySelector(
        `.square[data-x="${x}"][data-y="${y}"]`
      );
      if (!square) continue;

      // Remove knight image from previous square
      document.querySelectorAll(".square img").forEach((img) => img.remove());

      // Mark current square
      square.classList.add("active");
      square.innerHTML = `<img width="100%" src="./assets/horse.png" alt="horse" />`;

      // Replace previous square content with step number
      if (step > 0) {
        const prev = this.path[step - 1];
        const prevSquare = this.boardElement.querySelector(
          `.square[data-x="${prev[0]}"][data-y="${prev[1]}"]`
        );
        if (prevSquare) {
          prevSquare.classList.add("active");
          prevSquare.innerHTML = `<span class="step">${step}</span>`;
        }
      }

      // Delay before next move
      await new Promise((res) => setTimeout(res, 600));
    }
  },

  /**
   * Place knight randomly on board (resets everything)
   */
  placeRandomKnight() {
    this.clear();

    const x = Math.floor(Math.random() * 8);
    const y = Math.floor(Math.random() * 8);

    this.startPos = [x, y];
    const square = this.boardElement.querySelector(
      `.square[data-x="${x}"][data-y="${y}"]`
    );

    square.classList.add("active");
    square.innerHTML = `<img width="100%" src="./assets/horse.png" alt="horse" />`;
  },

  /**
   * Reset all state + board visuals
   */
  clear() {
    this.startPos = [];
    this.desiredPos = [];
    this.path = [];
    this.selectionActive = true;

    document.querySelectorAll(".square.active").forEach((square) => {
      square.innerHTML = "";
      square.classList.remove("active");
    });

    this.boardElement.classList.add("active");
  },
};

UI.init();
