const validateInputTask = (req, res, next) => {
	let task = req.body.taskStr;
	let priorityID = parseInt(req.body.priorityID);
	if (1 <= task.length && task.length <= 256 && !isNaN(priorityID)) {
		// task = task.replace(/[^\w\s]+/gi, '');
		// req.body.taskStr = task;
		next();
	}
	else {
		res.status(500).send("Data sent is invalid. Please try again.");
	}
}

module.exports = {
	validateInputTask
}