// https://stackoverflow.com/questions/2936112/text-wrap-in-a-canvas-element
// https://stackoverflow.com/a/11124580/7636794

function wrapText(text, maxWidth, ctx) {
	let words = text.split(' ');
	let lines = [];
	let line = '';

	if (ctx.measureText(text).width < maxWidth) {
		return [text];
	}
	while (words.length > 0) {
		while (ctx.measureText(words[0]).width >= maxWidth) {
			const tmp = words[0];
			words[0] = tmp.slice(0, -1);
			if (words.length > 1) {
				words[1] = tmp.slice(-1) + words[1];
			} else {
				words.push(tmp.slice(-1));
			}
		}
		if (ctx.measureText(line + words[0]).width < maxWidth) {
			line += words.shift() + ' ';
		} else {
			lines.push(line);
			line = '';
		}
		if (words.length === 0) {
			lines.push(line);
		}
	}
	return lines;
}