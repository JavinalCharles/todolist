let doneButtons = [...document.querySelectorAll("button.done-btn")];
let delButtons = [...document.querySelectorAll("button.del-btn")];

let addTaskButton = document.getElementById("add-task-btn");
let taskInput = document.getElementById("task-field-input");

function sendDoneTaskRequest(event) {
	let t = event.currentTarget;
	let n = t.getAttribute("value");
	t.setAttribute("disabled", "");

	const httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = () => {
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			// Everything is good, the response was received.
			if (httpRequest.status == 200) {
				console.log("DONE!");
				console.log(httpRequest.responseText);

				let wholeTodoDiv = t.parentNode.parentNode.parentNode;
				let parentDiv = wholeTodoDiv.parentNode;

				wholeTodoDiv.querySelector("div.priority-div").querySelector("p.priority-p").innerHTML = "priority level: Finished";
				wholeTodoDiv.querySelector("div.action-div").querySelector("div.flex-buttons").removeChild(t);
				parentDiv.removeChild(wholeTodoDiv);
				parentDiv.insertAdjacentElement("beforeEnd", wholeTodoDiv);
			}
			else {
				t.removeAttribute("disabled");
				console.log(httpRequest.responseText);
			}
		}
	}

	httpRequest.open("PUT", "http://localhost:3000/done/" + n);
	httpRequest.send();
}

function submitAddTask() {
	addTaskButton.setAttribute("disabled", "");
	let p = document.getElementById("priority-selection");
	let newTask = taskInput.value;
	let pID = p.value;
	let pText = p.options[p.selectedIndex].text;

	const httpRequest = new XMLHttpRequest();

	httpRequest.onreadystatechange = () => {
		if (httpRequest.readyState == XMLHttpRequest.DONE) {
			addTaskButton.removeAttribute("disabled");
			let response = JSON.parse(httpRequest.responseText);
			console.log(response);
			let taskID = response.insertId;
			if (httpRequest.status == 200) {
				let newToDo = {
					todoID: taskID,
					tasks: newTask,
					priorityID: pID,
					text: pText
				};
				todolist.push(newToDo);
				createToDoBox(newToDo);

				taskInput.value = "";
				let options = p.options;
				for (let i = 0; i < options.length; ++i) {
					options[i].selected = false;
				}
			}
			else {
				addTaskButton.removeAttribute("disabled");
				console.log(httpRequest.responseText);
			}
		}
	}
	httpRequest.open("POST", "http://localhost:3000/", true);
	httpRequest.setRequestHeader(
		"Content-Type",
    	"application/json",
	)
	let data = JSON.stringify({
		'taskStr': taskInput.value,
		'priorityID': p.value
	});

	console.log(data);
	httpRequest.send(data);
}

let main = document.getElementById("main_section");

let createToDoBox = (todoObj) => {
	let taskID = todoObj.todoID;
	let taskName = todoObj.tasks;
	let priorityID = todoObj.priorityID;
	let priorityText = todoObj.text;

	let newBox = document.createElement("div");
	newBox.classList.add("grid-box", "todo-item-container");

	let idBox = document.createElement("div");
	idBox.classList.add("grid-item", "gi-xss-2", "gi-xs-6", "gi-sm-6");
	let idP = document.createElement("p");
	idP.classList.add("task-id-p");
	idP.innerHTML = "#" + taskID;
	idBox.appendChild(idP);
	newBox.appendChild(idBox);

	let priorityBox = document.createElement("div");
	priorityBox.classList.add("grid-item", "gi-xxs-10", "gi-xs-6", "gi-sm-6", "priority-div");
	let priorityP = document.createElement("p");
	priorityP.classList.add("priority-p");
	priorityP.innerHTML = "priority level: " + priorityText;
	priorityBox.appendChild(priorityP);
	newBox.appendChild(priorityBox);

	let taskBox = document.createElement("div");
	taskBox.classList.add("grid-item", "gi-xxs-12", "gi-xs-12", "gi-sm-6");
	let taskP = document.createElement("p");
	taskP.classList.add("tasks-p");
	taskP.innerHTML = taskName;
	taskBox.appendChild(taskP);
	newBox.appendChild(taskBox);

	let actionsBox = document.createElement("div");
	actionsBox.classList.add("grid-item", "gi-xxs-12", "gi-xs-12", "gi-sm-6", "action-div");
	let actionsFlex = document.createElement("div");
	actionsFlex.classList.add("flex-buttons", "flex-box", "flex-xss-jc", "flex-sm-je");
	if (priorityID > 1) {
		let doneButton = document.createElement("button");
		doneButton.classList.add("btn", "done-btn");
		doneButton.setAttribute("type", "button");
		doneButton.setAttribute("value", taskID);
		doneButton.innerHTML = "Done";
		doneButton.addEventListener("click", sendDoneTaskRequest);
		actionsFlex.appendChild(doneButton);
	}

	let delButton = document.createElement("button");
	delButton.classList.add("btn", "del-btn");
	delButton.setAttribute("type", "button");
	delButton.setAttribute("value", taskID);
	delButton.innerHTML = "Delete";
	delButton.addEventListener("click", function(e){
		console.log("Delete Button clicked for task ID: " + e.target.value)
	});

	actionsFlex.appendChild(delButton);
	actionsBox.appendChild(actionsFlex);
	newBox.appendChild(actionsBox);

	// Append created elements
	main.appendChild(newBox);

	setTimeout(() => {
		newBox.classList.add("left-transition");
	}, 10);
}

if (todolist && main) {
	console.log("Rendering Tasks");
	for(let i = 0; i < todolist.length; ++i) {
		createToDoBox(todolist[i]);
	}
	console.log("Rendering finished.");
}

// doneButtons.forEach((buttonElement) => {
// 	buttonElement.addEventListener("click", sendDoneTaskRequest);
// });