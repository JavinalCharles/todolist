const validateInputTask = (req, res, next) => {
	let task = req.body.taskStr;
	let priorityID = parseInt(req.body.priorityID);
	if (1 <= task.length && task.length <= 256 && !isNaN(priorityID)) {
		req.body.taskStr = task.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
		next();
	}
	else {
		res.status(500).send("Data sent is invalid. Please try again.");
	}
}

module.exports = {
	validateInputTask
}