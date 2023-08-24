// let doneButtons = [...document.querySelectorAll("button.done-btn")];
// let delButtons = [...document.querySelectorAll("button.del-btn")];

let addTaskButton = document.getElementById("add-task-btn");
let taskInput = document.getElementById("task-field-input");

function convertUnwantedChars(str) {
	let dummyDiv = document.createElement("div");
	dummyDiv.innerText = dummyDiv.textContent = str;
	let s = dummyDiv.innerHTML;

	let res = s.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
	return res;
}

function sendDoneTaskRequest(event) {
	let t = event.currentTarget;
	let n = t.getAttribute("value");
	t.setAttribute("disabled", "");

	const httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = () => {
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			// Everything is good, the response was received.
			if (httpRequest.status == 200) {
				// console.log("DONE!");
				console.log(httpRequest.responseText);

				let wholeTodoDiv = t.parentNode.parentNode.parentNode;
				let parentDiv = wholeTodoDiv.parentNode;

				wholeTodoDiv.classList.add("left");
				setTimeout(() => {
					wholeTodoDiv.querySelector("div.priority-div").querySelector("p.priority-p").innerHTML = "priority level: Finished";
					wholeTodoDiv.querySelector("div.action-div").querySelector("div.flex-buttons").removeChild(t);
					parentDiv.removeChild(wholeTodoDiv);
					parentDiv.insertAdjacentElement("beforeend", wholeTodoDiv);
					setTimeout(() => {
						wholeTodoDiv.classList.remove("left");
					}, 10);
				}, 1500);
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

function sendDeleteTaskRequest(event) {
	let t = event.currentTarget;
	let n = t.value;
	t.setAttribute("disabled", "");

	const XHR = new XMLHttpRequest();
	XHR.onreadystatechange = () => {
		if (XHR.readyState === XMLHttpRequest.DONE) {
			if (XHR.status == 200) {
				console.log(XHR.responseText);

				let wholeTodoDiv = t.parentNode.parentNode.parentNode;
				// let parentDiv = wholeTodoDiv.parentNode;
				wholeTodoDiv.classList.add("left");
				setTimeout(() => {
					main.removeChild(wholeTodoDiv);
					for (let i = 0; i < todolist.length; ++i) {
						if (todolist[i].todoID == n) {
							todolist.splice(i, 1);
							break;
						}
					}
				}, 1600);
			}
			else {
				t.removeAttribute("disabled");
				console.log(XHR.responseText);
			}
		}
	}

	XHR.open("DELETE", "http://localhost:3000/remove/" + n);
	XHR.send();
}

function submitAddTask() {
	addTaskButton.setAttribute("disabled", "");
	let p = document.getElementById("priority-selection");
	let newTask = convertUnwantedChars(taskInput.value);
	let pID = p.value;
	let pText = p.options[p.selectedIndex].text;

	const httpRequest = new XMLHttpRequest();
	console.log("newTask: " + newTask);
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
				let todoBox = createToDoBox(newToDo);
				main.insertAdjacentElement("afterbegin", todoBox);
				setTimeout(() => {
					todoBox.classList.remove("right");
				}, 50);

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
		'taskStr': newTask,
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
	newBox.classList.add("grid-box", "todo-item-container", "right");

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
	delButton.addEventListener("click", sendDeleteTaskRequest);

	actionsFlex.appendChild(delButton);
	actionsBox.appendChild(actionsFlex);
	newBox.appendChild(actionsBox);

	return newBox;
}


function removeAllMainChildNodes() {
	let allTodoBox = main.childNodes;
	let timeOut = 100;

	for (let i = 0; i < allTodoBox.length; ++i) {
		setTimeout(() => {
			let todoBox = allTodoBox.item(i);
			todoBox.classList.add("left");
			setTimeout(() => {
				main.removeChild(todoBox);
			}, 1600);
		}, timeOut);
		timeOut += 100;
	}
}

function displayTodolist() {
	let timeOut = 100;
	for(let i = 0; i < todolist.length; ++i) {
		let newTodoBox = createToDoBox(todolist[i]);
		main.appendChild(newTodoBox);
		setTimeout(() => {
			newTodoBox.classList.remove("right");
		}, timeOut);
		timeOut += 50;
	}
}

let radioButtons = [...document.querySelectorAll("input[type=\"radio\"]")];
let sortCheckbox = document.getElementById("sort_order_checkbox");

for(let i = 0; i < radioButtons.length; ++i) {
	radioButtons[i].addEventListener("change", (e) => {
		let v = e.currentTarget.value;
		if (v == "ID") {
			todolist = todolist.sort((a, b) => {
				return sortCheckbox.checked ? a.todoID > b.todoID : a.todoID < b.todoID;
			});
		}
		else if (v == "Task") {
			todolist = todolist.sort((a, b) => {
				return sortCheckbox.checked ? a.tasks > b.tasks : a.tasks < b.tasks;
			});
		}
		else { // (v == "Priority" || v == "" )
			todolist = todolist.sort((a, b) => {
				return sortCheckbox.checked ? a.priorityID > b.priorityID : a.priorityID < b.priorityID;
			});
		}
		removeAllMainChildNodes();
		setTimeout(displayTodolist, 1700);
		
	});
}

sortCheckbox.addEventListener("change", (e) => {
	let v = "";
	for (let i = 0; i < radioButtons.length; ++i) {
		if (radioButtons[i].checked) {
			v = radioButtons[i].value;
			break;
		}
	}
	if (v == "ID") {
		todolist = todolist.sort((a, b) => {
			return sortCheckbox.checked ? a.todoID > b.todoID : a.todoID < b.todoID;
		});
	}
	else if (v == "Task") {
		todolist = todolist.sort((a, b) => {
			return sortCheckbox.checked ? a.tasks > b.tasks : a.tasks < b.tasks;
		});
	}
	else { // (v == "Priority" ||  v == ""
		todolist = todolist.sort((a, b) => {
			return sortCheckbox.checked ? a.priorityID > b.priorityID : a.priorityID < b.priorityID;
		});
	}
	removeAllMainChildNodes();
	setTimeout(displayTodolist, 1700);
});

if (todolist && main) {
	// console.log("Rendering Tasks");
	// let timeOut = 100;
	// for(let i = 0; i < todolist.length; ++i) {
	// 	let newTodoBox = createToDoBox(todolist[i]);
	// 	main.appendChild(newTodoBox);
	// 	setTimeout(() => {
	// 		newTodoBox.classList.remove("right");
	// 	}, timeOut);
	// 	timeOut += 50;
	// }
	displayTodolist();
	// console.log("Rendering finished.");
}