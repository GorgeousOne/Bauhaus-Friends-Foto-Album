let text = document.getElementById('textInput').value;

function printText() {
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    console.log(ctx)
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
}