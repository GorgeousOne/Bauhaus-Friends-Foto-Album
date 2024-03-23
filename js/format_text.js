// https://stackoverflow.com/questions/2936112/text-wrap-in-a-canvas-element
// https://stackoverflow.com/a/11124580/7636794

function sanitizeFileName(fileName) {
	const invalidCharsRegex = /[^a-zA-Z0-9\.\(\)_-]/g;
	return fileName.replace(invalidCharsRegex, '_');
}

function wrapText(text, maxWidth, ctx) {
	//split text into words
	//resulting lines
	let lines = [];
	//current line being constructed
	let line = '';

	//return texts shorter than maxWidth as single line
	if (ctx.measureText(text).width < maxWidth) {
		return text.split('\n');
	}
	const paragraphs = text.split('\n');

	for (const paragraph of paragraphs) {
		let words = paragraph.split(' ');

		while (words.length > 0) {
			//trim letters from words that are too long
			while (ctx.measureText(words[0]).width >= maxWidth) {
				const tmp = words[0];
				words[0] = tmp.slice(0, -1);
				if (words.length > 1) {
					words[1] = tmp.slice(-1) + words[1];
				} else {
					words.push(tmp.slice(-1));
				}
			}

			// add words until line is too long
			if (ctx.measureText(line + words[0]).width < maxWidth) {
				line += words.shift() + ' ';
			} else {
				// start new line if line is too long
				console.log(line);
				lines.push(line.trim());
				line = '';
			}
			// finish last line if no words left
			if (words.length === 0) {
				lines.push(line.trim());
				line = '';
			}
		}
	}
	return lines;
}