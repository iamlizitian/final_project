let capture;
let poseNet;
let poses = [];

function setup() {
  createCanvas(1024, 768);
  capture = createCapture(VIDEO);
  capture.size(width, height);
  //frameRate(30)
  
  const options = {
  architecture: "MobileNetV1",
  imageScaleFactor: 0.3,
  outputStride: 16, // 8, 16 (larger = faster/less accurate)
  flipHorizontal: false,
  minConfidence: 0.5,
  maxPoseDetections: 2, // 5 is the max
  scoreThreshold: 0.5,
  nmsRadius: 20,
  detectionType: "multiple",
  inputResolution: 257, // 161, 193, 257, 289, 321, 353, 385, 417, 449, 481, 513, or 801, smaller = faster/less accurate
  multiplier: 0.5, // 1.01, 1.0, 0.75, or 0.50, smaller = faster/less accurate
  quantBytes: 2,
};

  poseNet = ml5.poseNet(capture, modelReady);
  poseNet.on("pose", function (results) {
    poses = results;
  });

  capture.hide();
}

function modelReady() {
  console.log("Model loaded");
}

function draw() {
  background(255);

  push();
  translate(width, 0);
  scale(-1, 1);
  image(capture, 0, 0, width, height);
  drawHeadSwaps();
  pop();
  
}

function drawHeadSwaps() {
  if (poses.length >= 2) {
    

    let headA = getHead(poses[0]);
    let headB = getHead(poses[1]);

    // let headACenterX = poses[0].pose.keypoints.find(point => point.part === "nose").position.x;
    let headACenterX = poses[0].pose.nose.x;
    let headACenterY = poses[0].pose.nose.y;

    let headBCenterX = poses[1].pose.nose.x
    let headBCenterY = poses[1].pose.nose.y;

    image(headA, headBCenterX - headB.width / 2, headBCenterY - headB.height / 2);
    image(headB, headACenterX - headA.width / 2, headACenterY - headA.height / 2);
    
    push();
    scale(-1, 1);
    textAlign(CENTER, BOTTOM);
    fill(255, 0, 0); 
    textSize(25);
    text("I am ____, nice to meet you!", -headBCenterX, headBCenterY - headB.height / 2 - 10);
    fill(40, 190, 255);
    textSize(25);
    text("I am ____, nice to meet you, too!", -headACenterX, headACenterY - headA.height / 2 - 10);
    pop();
  }
}

function getHead(pose) {
  let headWidth = 200;
  let headHeight = 200;
  let headImage = capture.get(
    pose.pose.nose.x - headWidth / 2,
    pose.pose.nose.y - headHeight / 2,
    headWidth,
    headHeight
  );
  return headImage;
}
