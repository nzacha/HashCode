const fs = require("fs");
const Point = require("./Point");
const Ride = require("./Ride");
const Car = require("./Car");
const cliProgress = require("cli-progress");

const fileNames = [
  "a_example.in",
  "b_should_be_easy.in",
  "c_no_hurry.in",
  "d_metropolis.in",
  "e_high_bonus.in",
];

const debug = false;

function readFile(fileName) {
  const lines = fs
    .readFileSync(fileName, { encoding: "utf8", flag: "r" })
    .split("\n");
  return lines;
}

function runRoutine(fileName) {
  console.log(`Running on file: ${fileName}`);
  const lines = readFile(fileName);
  const args = lines.shift();

  const [rows, cols, cars, rides, B, S] = args.split(" ");
  if (debug) {
    console.log("rows:", rows);
    console.log("cols:", cols);
    console.log("cars:", cars);
    console.log("rides:", rides);
    console.log("bonus:", B);
    console.log("steps:", S);
    console.log("----------------------------");
  }

  const Rides = [];
  const ClaimedRides = [];
  const UnusedRides = [];
  for (let i = 0; i < rides; i++) {
    const line = lines[i].split(" ");

    Rides.push(
      new Ride(
        new Point(line[0], line[1]),
        new Point(line[2], line[3]),
        line[4],
        line[5]
      )
    );
  }

  // sort Rides
  Rides.sort((a, b) => a.earliest - b.earliest);
  if (debug) console.log(Rides);

  const Cars = Array.from({ length: cars }).map(
    (el) => new Car(new Point(0, 0))
  );
  if (debug) console.log(Cars);
  const UnavailableCars = [];

  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );
  if (!debug) {
    progressBar.start(S, 0);
  }

  let score = 0,
    simulationStep = 0;
  while (simulationStep < S) {
    if (debug) {
      console.log("Simulation Step: ", simulationStep);
      console.log("----------------------------");
    } else {
      progressBar.update(simulationStep);
    }

    for (let carIndex = UnavailableCars.length - 1; carIndex >= 0; carIndex--) {
      const car = UnavailableCars[carIndex];
      if (simulationStep >= car.availableAt) {
        UnavailableCars.splice(carIndex, 1);
        Cars.push(car);
      }
    }

    for (let rideIndex = Rides.length - 1; rideIndex >= 0; rideIndex--) {
      const ride = Rides[rideIndex];
      if (!ride.hasPoitiveScore(simulationStep)) {
        Rides.splice(rideIndex, 1);
        if (debug) {
          console.log(
            `Ride: ${ride.toString()} is removed due to negative score`
          );
        }
        continue;
      }

      let bestMatch = undefined;
      let carIndex = 0;
      for (let car of Cars) {
        const [score, rideStart] = car.estimateScore(simulationStep, ride, B);
        if (!bestMatch || (score > 0 && score > bestMatch.score)) {
          bestMatch = {
            car: car,
            score: score,
            carIndex: carIndex,
            rideStart: rideStart,
          };
        }
        carIndex++;
      }
      if (bestMatch) {
        if (debug) {
          console.log(ride);
          console.log(`has claimed car:`);
          console.log(bestMatch.car);
        }

        bestMatch.car.claimRide(ride);
        UnavailableCars.push(Cars.splice(bestMatch.carIndex, 1)[0]);
        ClaimedRides.push(Rides.splice(rideIndex, 1)[0]);
        score += parseInt(bestMatch.score);
      }
    }
    simulationStep++;
  }

  const allCars = [...Cars, ...UnavailableCars].sort((c1, c2) => c1.id - c2.id);
  fs.writeFileSync(
    "out_" + fileName,
    allCars
      .map(
        (car) => `${car.rides.length} ${car.rides.map((r) => r.id).join(" ")}`
      )
      .join("\n")
  );
  if (!debug) {
    progressBar.stop();
  }

  console.log(`Score: ${score}`);
  return score;
}

let finalScore = 0;
for (const fileName of fileNames) {
  finalScore += runRoutine(fileName);
}
console.log("Final Score:", finalScore);
