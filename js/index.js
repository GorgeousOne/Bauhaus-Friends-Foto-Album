
const cardSize = [1240, 1760]
const pad = 175;
const pad2 = 150;
const fotoSize = cardSize[0] - 2 * pad;

const canvas = document.getElementById("post-card");
const defaultImage = document.getElementById("default-img")
const picture = document.getElementById("profile-image");
const downloadButton = document.getElementById("download-button");

const imageInput = document.getElementById("image-input");
const nameInput = document.getElementById("name-input");
const storyInput = document.getElementById("story-input");
const ageInput = document.getElementById("age-input");
const studyProgram = document.getElementById("study-program");
const startInput = document.getElementById("semester-start");
const endInput = document.getElementById("semester-end");

let cropper;

downloadButton.addEventListener('click', saveCard);
imageInput.addEventListener('change', createCropper);
nameInput.addEventListener('input', refreshCardText);
storyInput.addEventListener('input', refreshCardText);
ageInput.addEventListener('input', refreshCardText);
studyProgram.addEventListener('input', refreshCardText);
startInput.addEventListener('input', refreshCardText);
endInput.addEventListener('input', refreshCardText);


canvas.width = cardSize[0];
canvas.height = cardSize[1];

document.addEventListener('DOMContentLoaded', () => {
    clearCard();
    refreshCardText();
    refreshCardFoto();
});

function clearCard() {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function refreshCardText() {
    const ctx = canvas.getContext('2d');
    ctx.save();
    const textY = pad2 + fotoSize;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, textY, canvas.width, canvas.height);

    // print name and age
    ctx.font = 'bold 64px Poppins';
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';

    const name = nameInput.value;
    const nameWidth = ctx.measureText(name).width;
    const age = ageInput.value.toString();

    ctx.fillText(name, pad2, textY + .75 * pad2);
    ctx.font = '64px Poppins';
    ctx.fillText('  ' + age, pad2 + nameWidth, textY + .75 * pad2);

    printStory(ctx, storyInput.value, textY);

    // print study program
    const footerY = textY + 3.3 * pad;
    ctx.font = '32px Poppins';
    ctx.fillText(studyProgram.value, pad2, footerY);

    //print from to
    ctx.textAlign = 'right';
    const start = startInput.value;
    const end = endInput.value;
    let timeSpan;
    if (start === end) {
        timeSpan = start
    } else {
        timeSpan = start + ' \u2014 ' + end;
    }
    if (timeSpan !== null) {
        ctx.fillText(timeSpan, cardSize[0] - pad2, footerY);
    }
    ctx.restore();
}

function printStory(ctx, story, textY) {
    const textWidth = cardSize[0] - 2 * pad2;

    // print story text
    const storyY = textY + 1.25 * pad;
    const fontSize = 48;
    ctx.font = fontSize + 'px Poppins';
    const lines = wrapText(story, textWidth, ctx);
    const numLines = Math.min(lines.length, 5);

    for (let i = 0; i < numLines; i++) {
        ctx.fillText(lines[i], pad2, storyY + 1.25 * i * fontSize);
    }
}

function refreshCardFoto() {
    const ctx = canvas.getContext('2d');
    let image;

    if (cropper) {
        image = cropper.getCroppedCanvas();
    } else {
        image = defaultImage;
    }
    ctx.fillRect(pad, pad2, fotoSize, fotoSize);
    ctx.drawImage(image, pad, pad2, fotoSize, fotoSize);
}


function createCropper(e) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {

        picture.src = event.target.result;
        picture.addEventListener('load', function() {
            if (cropper) {
                cropper.destroy(); // Destroy the previous instance
            }
            cropper = new Cropper(this, {
                aspectRatio: 1,
                viewMode: 1, // Set to 1 to restrict the cropped area to be within the container
                autoCropArea: 1, // Ensure that the initial cropped area covers the whole container
                responsive: true, // Enable responsive mode
                crop: refreshCardFoto
            });
        });
    };
    fileReader.readAsDataURL(e.target.files[0]);
}

function saveCard() {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'post-card.png';
    link.href = dataURL;
    link.click();
}