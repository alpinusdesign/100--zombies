/* - Bindings - */
let currentZombies = 0;
let currentHumans = 0;
let currentRound = 0;
let simulationResults = [];
let houseList = [];
// Change the roundInterval-binding to adjust the delay between every round.
const roundInterval = 200;

/* - Bound HTML-elements */
const contentArea = document.getElementById("content-area");

/* - Event listeners - */
document = addEventListener("load", renderInfoPage);

/* - Functions - */
/* - Page renderers - */
function renderInfoPage() {
  contentArea.innerHTML = `
    <p>
        <strong>100% ZOMBIES</strong> is a zombie-outbreak simulator.
    </p>
    <img
    src="img/preview_01.png"
    class="img-screenshot"
    alt="A screenshot of the simulation interface."
    ></img>
    <p>
        A simulation run starts with 1 zombie and 100 humans.
    </p>
    <p>
        Every night, every zombie will seek out a random house.
        If the house contains a human, it will become a zombie as well.
        A simulation runs until all humans have been zombified.
    </p>
    <p>
        In total, 10 simulations will run, with some statistics printed out in the end.
    </p>
    <button id="simulation-reset-bttn">Begin simulation</button>
    `;
  // Go to the simulation-screen on button-click.
  document
    .getElementById("simulation-reset-bttn")
    .addEventListener("click", renderSimPage);
}

function renderSimPage() {
  contentArea.innerHTML = `<div id="simulation-grid"></div>
  <div id="simulation-panel">
    <span id="panel-rounds"></span>
    <span id="panel-zombies"></span>
    <span id="panel-humans"></span>
    <span id="panel-simulations"></span>
  </div>`;
  startSimulation();
  renderSimulationUI();
}

function renderResultPage() {
  contentArea.innerHTML = `
  <div id="result-display">
    <h1>Simulation results</h1>
    <h2>Rounds until completion</h2>
    <ul id="display-list"></ul>
    <h2>Average rounds until completion</h2>
    <span>
    ${
      // Get the average rounds until completion.
      simulationResults.reduce((a, b) => {
        return a + b;
      }, 0) / simulationResults.length
    } rounds
    </span>
  </div>
  <button id="back-bttn">Back to beginning</button>
  `;

  // Go back to the information screen on button-click.
  document
    .getElementById("back-bttn")
    .addEventListener("click", renderInfoPage);

  const displayList = document.getElementById("display-list");

  // Fill the display-list list with the results of each simulation.
  for (let i = 0; i < simulationResults.length; i++) {
    let li = document.createElement("li");
    let content = document.createTextNode(
      `Simulation ${i + 1}: ${simulationResults[i]} rounds`
    );
    li.appendChild(content);
    displayList.appendChild(li);
  }
}

/* - Other functions - */
function renderSimulationUI() {
  // Make sure the grid is empty.
  let grid = "";
  // Print out all the houses as human or zombie.
  for (let i = 0; i < houseList.length; i++) {
    switch (houseList[i]) {
      case "Human":
        grid += `<div class="simulation-grid-cell cell-human"></div>`;
        break;
      default:
        grid += `<div class="simulation-grid-cell cell-zombie"></div>`;
    }

    // Update the panel counters with the current simulation values.
    document.getElementById(
      "panel-rounds"
    ).innerHTML = `Round: ${currentRound}`;

    document.getElementById(
      "panel-zombies"
    ).innerHTML = `Zombies: ${currentZombies}`;

    document.getElementById(
      "panel-humans"
    ).innerHTML = `Humans: ${currentHumans}`;

    document.getElementById("panel-simulations").innerHTML = `Simulation ${
      simulationResults.length + 1
    } / 10`;
  }

  document.getElementById("simulation-grid").innerHTML = grid;
}

function initRound() {
  // Reinitialize simulation values in preparation for every run.
  currentRound = 1;
  currentZombies = 1;
  // Clear the house list and fill it with 100 humans.
  houseList = [];
  for (let i = 0; i < 100; i++) {
    houseList.push("Human");
    currentHumans++;
  }
}

function startSimulation() {
  // Set the rounds staring values.
  initRound();
  currentRound = 0;
  simulationResults = [];

  // Perform a round-calculation every 300 seconds
  let intervalId = setInterval(() => {
    // Render the simulation UI once before calculations.
    renderSimulationUI();

    // Contains a rounds newly accumulated zombies.
    let newZombies = 0;

    // Let each zombie go to a randomly selected house between 0 and 99.
    for (let i = 0; i < currentZombies; i++) {
      let target = Math.floor(Math.random() * 100);
      if (houseList[target] === "Human") {
        // Zombify the human and adjust counters.
        houseList[target] = "Zombie";
        newZombies++;
        currentHumans--;
      }
    }

    // Add the newly acquired zombies to the counter.
    currentZombies += newZombies;

    // Begin next round if all humans have been zombified.
    if (currentHumans <= 0) {
      simulationResults.push(currentRound);

      // End simulation if 10 simulation rounds have been made, and send user to the result page.
      if (simulationResults.length > 9) {
        clearInterval(intervalId);
        renderResultPage();
      } else {
        // Reinitialize the rounds standard values.
        initRound();
      }
    } else {
      // Proceed to next round.
      currentRound++;
    }
  }, roundInterval);
}
