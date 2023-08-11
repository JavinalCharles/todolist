const homeView = (req, res) => {
	res.render("index", {
		page: "home", css: "home.css"
	});
};

const aboutView = (req, res) => {
	res.render("index", {
		page: "about", css: "about.css"
	});
};

module.exports = {
	homeView,
	aboutView
};