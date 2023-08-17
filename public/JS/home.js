function sendDoneTaskRequest(event) {
	let t = event.currentTarget;
	let n = t.getAttribute("value");
	t.setAttribute("disabled", "");

	const httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = () => {
		if (httpRequest.readyState === XMLHttpRequest.DONE) {
			// Everything is good, the response was received.
			t.removeAttribute("disabled");
			console.log("DONE!");
			console.log(httpRequest.responseText);

			let wholeTodoDiv = t.parentNode.parentNode.parentNode;
			let parentDiv = wholeTodoDiv.parentNode;

			wholeTodoDiv.querySelector("div.priority-div").querySelector("p.priority-p").innerHTML = "priority level: Finished";
			wholeTodoDiv.querySelector("div.action-div").querySelector("div.flex-buttons").removeChild(t);
			parentDiv.removeChild(wholeTodoDiv);
			parentDiv.insertAdjacentElement("beforeEnd", wholeTodoDiv);
		} else {
			// Not ready yet.
			console.log("NOT YET DONE!");
		}
	}

	httpRequest.open("PUT", "http://localhost:3000/done/" + n);
	httpRequest.send();
}

let doneButtons = [...document.querySelectorAll("button.done-btn")];
let delButtons = [...document.querySelectorAll("button.del-btn")];

// console.log("done-button");
// console.log(doneButtons);

// console.log("del-button");
// console.log(delButtons);
doneButtons.forEach((buttonElement) => {
	buttonElement.addEventListener("click", sendDoneTaskRequest);
});