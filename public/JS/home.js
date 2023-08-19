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
				t.removeAttribute("disabled");
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
				console.log(httpRequest.responseText);
			}
		} else {
			// Not ready yet.
			console.log("NOT YET DONE!");
		}
	}

	httpRequest.open("PUT", "http://localhost:3000/done/" + n);
	httpRequest.send();
}

function submitAddTask() {
	addTaskButton.setAttribute("disabled", "");
	let p = document.getElementById("priority-selection");

	const httpRequest = new XMLHttpRequest();

	httpRequest.onreadystatechange = () => {
		if (httpRequest.readyState == XMLHttpRequest.DONE) {
			addTaskButton.removeAttribute("disabled");
			if (httpRequest.status == 200) {
				taskInput.value = "";

				let options = p.options;
				for (let i = 0; i < options.length; ++i) {
					options[i].selected = false;
				}
			}
			// console.log(httpRequest.responseText);
		}
		else {
			console.log(httpRequest.responseText);
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

doneButtons.forEach((buttonElement) => {
	buttonElement.addEventListener("click", sendDoneTaskRequest);
});