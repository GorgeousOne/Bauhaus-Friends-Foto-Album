$('#printButton').on( "click", function() {
    const text = $('#textInput').val();
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Calculate text position
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    // Print text to canvas
    ctx.fillText(text, x, y);
});

let cropper;
$('#inputImage').change(function(e) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const $image = $('#image');
        $image.attr('src', event.target.result);
        $image.on('load', function() {
            if (cropper) {
                cropper.destroy(); // Destroy the previous instance
            }
            cropper = new Cropper(this, {
                aspectRatio: 1,
                viewMode: 1,
                crop: function(event) {
                    const canvas = cropper.getCroppedCanvas({
                        width: 200,
                        height: 200
                    });
                    $('#cropped-preview').empty().append(canvas);
                }
            });
        });
    };
    fileReader.readAsDataURL(e.target.files[0]);
});