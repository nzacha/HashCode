const fs = require("fs");
const cliProgress = require("cli-progress");
const Image = require("./Image");
const Slide = require("./Slide");

const fileNames = [
  "a_example.txt",
  //   "b_lovely_landscapes.txt",
  //   "c_memorable_moments.txt",
  //   "d_pet_pictures.txt",
  //   "e_shiny_selfies.txt",|
];

const debug = true;

function readFile(fileName) {
  const lines = fs
    .readFileSync(fileName, { encoding: "utf8", flag: "r" })
    .split("\n");
  return lines;
}

function scoringFunction(tags1, tags2) {
  let left = 0,
    common = 0;
  tags1.filter((el) => {
    if (tags2.includes(el)) {
      common++;
    } else {
      left++;
    }
  });
  //   console.log(tags1);
  //   console.log(tags2);
  //   console.log(`left: ${left}\ncommon: ${common}\nright: ${right}`);
  return Math.min(left, common, tags2.length - common);
}

function runRoutine(fileName) {
  console.log(`Running on file: ${fileName}`);
  const lines = readFile(fileName);
  const args = lines.shift();

  const [nImages] = args.split(" ");
  if (debug) {
    console.log("images:", nImages);
    console.log("----------------------------");
  }

  const Images = [];
  for (let i = 0; i < nImages; i++) {
    const line = lines[i].split(" ");
    Images.push(new Image(line.shift(), parseInt(line.shift()), line));
  }
  //   console.log(Images);

  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );
  if (!debug) {
    progressBar.start(nImages, 0);
  }

  let score = 0;
  let reviewImage = Images.shift();
  let Slides = [new Slide(reviewImage)];
  while (Images.length > 0) {
    let bestMatch = undefined;
    for (let j = Images.length - 1; j >= 0; j--) {
      const image2 = Images[j];
      const score = scoringFunction(reviewImage.tags, image2.tags);
      if (!bestMatch || bestMatch.score < score) {
        bestMatch = { image: image2, score: score, imageIndex: j };
      }
    }
    Images.splice(bestMatch.imageIndex, 1);
    reviewImage = bestMatch.image;
    score += bestMatch.score;
    Slides.push(new Slide(reviewImage));
    progressBar.update(nImages - Images);
  }
  console.log(Slides);

  fs.writeFileSync("out_" + fileName, "");
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
