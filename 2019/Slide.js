let classID = 0;
class Image {
  constructor(image1, image2 = undefined) {
    this.id = classID++;
    this.image1 = image1;
    this.image2 = image2;
    this.tags =
      image2 != undefined
        ? image1.tags.concat(
            image2.tags.filter((item) => image1.tags.indexOf(item) < 0)
          )
        : image1.tags;
  }
}

module.exports = Image;
