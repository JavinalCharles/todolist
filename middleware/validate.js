const validateInputTask = (req, res, next) => {
	let task = req.body.taskStr;
	let priorityID = parseInt(req.body.priorityID);
	console.log(task);
	console.log(priorityID);
	if (1 <= task.length && task.length <= 256 && !isNaN(priorityID)) {
		next();
	}
	else {
		res.status(500).send("Data sent is invalid. Please try again.");
	}
}

module.exports = {
	validateInputTask
}