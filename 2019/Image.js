let classID = 0;
class Image {
  constructor(orientation, tagsSize, tags) {
    this.id = classID++;
    this.orientation = orientation;
    this.tagsSize = tagsSize;
    this.tags = tags;
  }
}

module.exports = Image;
