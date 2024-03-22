// $(document).ready(() => {
const $canvas = $('#post-card')[0];
const $imageInput = $('#image-input');
const $nameInput = $('#name-input');

const $image = $('#profile-image');

const cardSize = [1240, 1748]
const pad = 150;
const fotoSize = cardSize[0] - 2 * pad;

let cropper;

$nameInput.on('input', refreshCardText);
$imageInput.on('change', createCropper);
clearCard();
refreshCardText();

function clearCard() {
    const ctx = $canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, $canvas.width, $canvas.height);
}

function refreshCardFoto() {
    const ctx = $canvas.getContext('2d');

    if (cropper) {
        // Get cropped canvas data
        const croppedCanvas = cropper.getCroppedCanvas();
        // Draw cropped image on canvas
        ctx.drawImage(croppedCanvas, pad, pad, fotoSize, fotoSize); // Adjust position and size as needed
    }
}

function refreshCardText() {
    const text = $nameInput.val();
    const ctx = $canvas.getContext('2d');

    ctx.fillStyle = 'white';
    const textStart = pad + fotoSize;
    ctx.fillRect(0, textStart, $canvas.width, $canvas.height);

    ctx.font = '72px Arial';
    ctx.fillStyle = 'black';
    // ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.fillText(text, pad, textStart + pad/2);
}


function createCropper(e) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {

        $image.attr('src', event.target.result);
        $image.on('load', function() {
            if (cropper) {
                cropper.destroy(); // Destroy the previous instance
            }
            cropper = new Cropper(this, {
                aspectRatio: 1,
                viewMode: 1, // Set to 1 to restrict the cropped area to be within the container
                autoCropArea: 1, // Ensure that the initial cropped area covers the whole container
                responsive: true, // Enable responsive mode
                crop: function(event) {
                    const canvas = cropper.getCroppedCanvas({
                        width: 200,
                        height: 200
                    });
                    $('#cropped-preview').empty().append(canvas);
                    refreshCardFoto();
                }
            });
        });
    };
    fileReader.readAsDataURL(e.target.files[0]);
}