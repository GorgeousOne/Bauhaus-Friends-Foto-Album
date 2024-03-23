
const cardSize = [1240, 1748]
const pad = 175;
const pad2 = 150;
const fotoSize = cardSize[0] - 2 * pad;

const $canvas = $('#post-card')[0];
const $defaultImage = $('#default-img')
const $picture = $('#profile-image');
const $downloadButton = $('#download-button');

const $imageInput = $('#image-input');
const $nameInput = $('#name-input');
const $storyInput = $('#story-input');
const $ageInput = $('#age-input');
const $studyProgram = $('#study-program');
const $startInput = $('#semester-start');
const $endInput = $('#semester-end');

let cropper;

$downloadButton.on('click', saveCard);
$imageInput.on('change', createCropper);
$nameInput.on('input', refreshCardText);
$storyInput.on('input', refreshCardText);
$ageInput.on('input', refreshCardText);
$studyProgram.on('input', refreshCardText);
$startInput.on('input', refreshCardText);
$endInput.on('input', refreshCardText);


$canvas.width = cardSize[0];
$canvas.height = cardSize[1];

$(document).ready(() => {
	clearCard();
    refreshCardText();
    refreshCardFoto();
});

function clearCard() {
    const ctx = $canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, $canvas.width, $canvas.height);
}

function refreshCardText() {
    const ctx = $canvas.getContext('2d');
    ctx.save();
    const textY = pad2 + fotoSize;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, textY, $canvas.width, $canvas.height);

    // print name and age
    ctx.font = 'bold 64px Poppins';
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';

    const name = $nameInput.val();
    const nameWidth = ctx.measureText(name).width;
    const age = $ageInput.val().toString();

    ctx.fillText(name, pad2, textY + .75 * pad2);
    ctx.font = '64px Poppins';
    ctx.fillText('  ' + age, pad2 + nameWidth, textY + .75 * pad2);

    const story = $storyInput.val();
    if (story !== '') {
        printStory(ctx, story, textY);
    }

    // print study program
    const footerY = textY + 3.3 * pad;
    ctx.font = '32px Poppins';
    ctx.fillText($studyProgram.val(), pad2, footerY);

    //print from to
    ctx.textAlign = 'right';
    const start = $startInput.val();
    const end = $endInput.val();
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
    const quoteWidth = ctx.measureText('\u201C').width;
    const lastLineWidth = ctx.measureText(lines[numLines - 1]).width;
    ctx.fillText('\u201C', pad2 - quoteWidth, storyY);
    ctx.fillText('\u201D', pad2 + lastLineWidth, storyY + 1.25 * (numLines - 1) * fontSize);

}
function refreshCardFoto() {
    const ctx = $canvas.getContext('2d');
    let image;

    if (cropper) {
        image = cropper.getCroppedCanvas();
    } else {
        image = $defaultImage[0];
    }
    ctx.drawImage(image, pad, pad2, fotoSize, fotoSize); // Adjust position and size as needed
}


function createCropper(e) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {

        $picture.attr('src', event.target.result);
        $picture.on('load', function() {
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
    const dataURL = $canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'post-card.png';
    link.href = dataURL;
    link.click();
}