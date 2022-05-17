// Get DOM elements

const imgUpload = document.getElementById("imageUpload");
const imgUploadBtn = document.getElementById("imageUploadBtn");
const imgUploadLabel = document.getElementById("uploadedImage");

const convertButton = document.getElementById("convert");

const previewImgNorm = document.getElementById("previewImageNormal");
const previewImgAscii = document.getElementById("previewImageAscii");
// Functions

const showUploadedImage = (imageCode) => {
  let img = new Image();
  img.addEventListener("load", () => {
    img = makeImageSmaller(img, 256);
    previewImgNorm.src = img.src;
    previewImgNorm.width = img.width;
    previewImgNorm.height = img.height;
  });
  img.src = imageCode;
};

const convertImageIntoAscii = (imageCode) => {
  let img = new Image();
  img.addEventListener("load", () => {
    img = makeImageSmaller(img, 256);

    let canvas = document.createElement("canvas");
    canvas.height = img.height / 5;
    canvas.width = img.width / 5;
    let ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let imageDataArray = imageData.data;

    // const density = "Ñ@#W$9876543210?!abc;:+=-,._ ";
    const density = " _.,-=+:;cba!?0123456789$W#@Ñ";
    let art = "";

    for (let i = 0; i < imageDataArray.length; i += 4) {
      let avg =
        (imageDataArray[i] + imageDataArray[i + 1] + imageDataArray[i + 2]) / 3;

      imageDataArray[i] = avg;
      imageDataArray[i + 1] = avg;
      imageDataArray[i + 2] = avg;

      let c = density.charAt(avg / (255 / density.length));
      if (c == " ") {
        c = "\u00A0";
        console.log("Hi");
      }
      art += c;
      if ((i / 4 + 1) % imageData.width == 0) {
        art += "\n";
      }
    }

    // ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);

    // previewImages.appendChild(canvas);

    previewImgAscii.innerText = art;
  });
  img.src = imageCode;
  // canvasImage = document.createElement("img");
  // canvasImage.src = uploadedImg;
  // let canvas = document.createElement("canvas");
  // canvas.height = canvasImage.height / 10;
  // canvas.width = canvasImage.width / 10;
  // var ctx = canvas.getContext("2d");
  // ctx.drawImage(canvasImage, 0, 0, canvas.width, canvas.height);
  // console.log(canvasImage.width);
  // for (var i = 0; i < imageData.data.length; i += 4) {
  //   var avg =
  //     (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
  //   imageData.data[i] = avg;
  //   imageData.data[i + 1] = avg;
  //   imageData.data[i + 2] = avg;
  // }
  // ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
  // asciiOutput.appendChild(canvas);
};

const makeImageSmaller = (image, maxSize) => {
  const divider = Math.max(image.width, image.height) / maxSize;
  image.width = image.width / divider;
  image.height = image.height / divider;

  return image;
};

const readImgAndRunFunction = (func, fileToRead) => {
  const reader = new FileReader();
  reader.onload = func;
  reader.readAsDataURL(fileToRead);
};

// Event Listeners
imgUploadBtn.addEventListener("click", () => {
  imgUpload.click();
});

imgUpload.onchange = () => {
  let val = imgUpload.value.substring(12);
  readImgAndRunFunction((e) => {
    const uploadedImg = e.target.result;
    showUploadedImage(uploadedImg);
  }, imgUpload.files[0]);
  imgUploadLabel.textContent = val;
};

convertButton.addEventListener("click", () => {
  if (imgUpload.files.length > 0) {
    readImgAndRunFunction((e) => {
      const uploadedImg = e.target.result;
      convertImageIntoAscii(uploadedImg);
    }, imgUpload.files[0]);
  }
});
