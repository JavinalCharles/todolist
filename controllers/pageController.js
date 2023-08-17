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

const query = "SELECT todo.todoID, todo.tasks, todo.priorityID, priority.text FROM todo INNER JOIN priority ON todo.priorityID = priority.id ORDER BY todo.priorityID DESC";

const homeView = (req, res) => {
	dbcon.query(query, function(err, queryResult, fields) {
		if (err) {
			res.render("index", {
				page: "home", css: "home.css", todoData: {}
			});
		}
		else {
			const todolist = queryResult;
			// console.log(todolist);
			res.render("index", {
				page: "home", css: "home.css", data: {todoData: todolist}
			});
		}
	})
};

const aboutView = (req, res) => {
	res.render("index", {
		page: "about", css: "about.css"
	});
};

module.exports = {
	dbcon,
	homeView,
	aboutView
};