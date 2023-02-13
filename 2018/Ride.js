let classID = 0;
class Ride {
  constructor(startPoint, endPoint, earliest, latest) {
    this.id = classID++;
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.earliest = parseInt(earliest);
    this.latest = parseInt(latest);
    this.length = this.startPoint.distance(this.endPoint);
  }

  hasPoitiveScore(simulationStep) {
    return this.length < this.latest - simulationStep;
  }
}

module.exports = Ride;
