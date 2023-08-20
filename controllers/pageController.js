const mysql = require("mysql");

const dbcon = mysql.createConnection({
	host: "localhost",
	user: "Vianou",
	password: "mint_chocolate_chips123",
	database: "todoDB"
});
let priorityData = {};

dbcon.connect(function(err) {
	if (err) {return err;}
	dbcon.query("SELECT * FROM priority", function(err, res, fields) {
		if (err) { throw err;}
		priorityData = res;
	})
});



const homeView = (req, res) => {
	const query = "SELECT todo.todoID, todo.tasks, todo.priorityID, priority.text FROM todo INNER JOIN priority ON todo.priorityID = priority.id ORDER BY todo.priorityID DESC";
	dbcon.query(query, function(err, queryResult, fields) {
		let todolist = {};
		if (!err) {
			todolist = queryResult;
		}
		// console.log(priorityData);
		res.render("index", {
			page: "home", css: "home.css", data: {todoData: todolist, priorities: priorityData}
		});
	})
};

const aboutView = (req, res) => {
	res.render("index", {
		page: "about", css: "about.css", data: {}
	});
};

const finishTask = (req, res) => {
	console.log(req.params);
	let p = req.params.taskID;

	const updateQuery = 'UPDATE todo SET priorityID = 1 WHERE todoID = ' + p;

	dbcon.query(updateQuery, function(err, queryResult, fields) {
		if (err) {
			throw err;
		}
		else {
			// console.log(queryResult);
			console.log(fields);
			res.json(queryResult);
		}
	});
}

const addTask = (req, res) => {
	let task = req.body.taskStr;
	let priorityID = req.body.priorityID;
	// console.log(task);

	const insertQuery = "INSERT INTO todo (tasks, priorityID) VALUES( \"" + task + "\", " + priorityID + ")";
	dbcon.query(insertQuery, function(err, queryResult, fields) {
		if (err) {
			throw err;
		}
		else {
			res.json(queryResult);
		}
	});
}

const removeTask = (req, res) => {
	let tID = req.params.taskID;
	// console.log(tID);

	const deleteQuery = "DELETE FROM todo WHERE todoID = " + tID;
	dbcon.query(deleteQuery, function(err, queryResult, fields) {
		if (err) {
			throw err;
		}
		else {
			res.json(queryResult);
		}
	})
}

module.exports = {
	dbcon,
	aboutView,
	addTask,
	homeView,
	finishTask,
	removeTask
};