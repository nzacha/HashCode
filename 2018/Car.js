let classID = 0;
class Car {
  constructor(startPoint) {
    this.id = classID++;
    this.position = startPoint;
    this.availableAt = 0;
    this.rides = [];
  }

  isAvailable(simulationStep) {
    return availableAt <= simulationStep;
  }

  distanceFrom(point) {
    return this.position.distance(point);
  }

  claimRide(ride) {
    this.availableAt += this.distanceFrom(ride.startPoint) + ride.length;
    this.position = ride.endPoint;
    this.rides.push(ride);
  }

  estimateScore(simulationStep, ride, startBonus) {
    if (this.distanceFrom(ride.startPoint) < ride.earliest - simulationStep) {
      return [parseInt(startBonus) + parseInt(ride.length), ride.earliest];
    } else if (
      this.distanceFrom(ride.endPoint) <
      ride.latest - simulationStep
    ) {
      return [
        ride.length,
        parseInt(simulationStep) + parseInt(this.distanceFrom(ride.endPoint)),
      ];
    }
    return [0, 0];
  }
}

module.exports = Car;
