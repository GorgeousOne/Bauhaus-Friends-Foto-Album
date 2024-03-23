
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
    const textStart = pad2 + fotoSize;
    const textWidth = cardSize[0] - 2 * pad2;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, textStart, $canvas.width, $canvas.height);


    // print name and age

    ctx.font = 'bold 64px Poppins';
    ctx.fillStyle = 'black';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';

    const name = $nameInput.val()
    const nameWidth = ctx.measureText(name).width;
    const age = $ageInput.val().toString();

    ctx.fillText(name, pad2, textStart + .75 * pad2);
    ctx.font = '64px Poppins';
    ctx.fillText('  ' + age, pad2 + nameWidth, textStart + .75 * pad2);

    // print story text
    const fontSize = 48;
    ctx.font = fontSize + 'px Poppins';
    const lines = wrapText($storyInput.val(), textWidth - fontSize, ctx);

    for (let i = 0; i < lines.length && i < 5; i++) {
        ctx.fillText(lines[i], pad2, textStart + 1.25 * pad + 1.25 * i * fontSize);
    }

    // print study program
    ctx.font = '32px Poppins';
    ctx.fillText($studyProgram.val(), pad2, textStart + 3.3 * pad);

    //print from to
    ctx.textAlign = 'right';
    const start = $startInput.val();
    const end = $endInput.val();
    let timeSpan;
    if (start === end) {
        timeSpan = start
    } else {
        timeSpan = start + ' — ' + end;
    }
    if (timeSpan !== null) {
        ctx.fillText(timeSpan, cardSize[0] - pad2, textStart + 3.3 * pad);
    }
    ctx.restore();
}

function refreshStory() {

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