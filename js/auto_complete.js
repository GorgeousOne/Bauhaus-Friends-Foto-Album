$(document).ready(function() {
	$.each(listSemesters(), function(index, value) {
		$('#semester-start').append($('<option>').text(value));
		$('#semester-end').append($('<option>').text(value));

	});
});

function listSemesters() {
	const startDate = new Date(2020, 9, 1);
	const today = new Date();
	const currentDate = new Date(startDate);

	const semesters = [];

	while (currentDate <= today) {
		const year = currentDate.getFullYear()
		const month = currentDate.getMonth();
		const shortYear = parseInt(year.toString().slice(-2));

		if (month === 9) {
			semesters.push("WS" + shortYear + "/" + (shortYear + 1));
			currentDate.setFullYear(year + 1);
			currentDate.setMonth(3);
		} else if (month === 3) {
			semesters.push("SS" + shortYear);
			currentDate.setMonth(9);
		}
	}
	return semesters.reverse();
}