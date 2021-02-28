var mainList;
var mainQueryType;

function getNames(event) {
	var queryType = typeof event === "string" ? event : event ? event.value : 'character';
	mainQueryType = queryType;
	const url = "https://www.amiiboapi.com/api/" + queryType;
	fetch(url)
		.then(function(response) {
			return response.json();
		}).then(function(json) {
			mainList = json.amiibo;
			let results = '<div class="h-full w-52">';
			mainList.forEach(character => {
				results += `<button class="block px-3 py-1 hover:bg-charleston-green hover:text-tea-green w-full" onclick="getInfo('${character.key}', '${queryType}')">${character.name}</button>`;
			})
			results += "</div>";
			let navBox = document.getElementById("nav-box");
			navBox.style.width = "13rem";
			navBox.innerHTML = results;
			let grid = document.getElementById("grid");
			if (grid && window.innerWidth < 640) {
				grid.style.gridTemplateColumns = "repeat(1, minmax(0, 1fr))";
			}
		});
}

function getInfo(key, queryType) {
	if (window.innerWidth < 640) { //Mobile view
		let navBox = document.getElementById("nav-box");
		navBox.style.width = "auto";
		navBox.innerHTML = `<nav class="bg-green-700 text-alabaster p-2 m-2 rounded shadow-md font-bold text-2xl" onclick="getNames('${queryType}')">≡</nav>`
	}
	
	queryType = queryType === "amiiboseries" ? "amiiboSeries" : queryType;
	const url = `https://www.amiiboapi.com/api/amiibo/?${queryType}=` + key;
	fetch(url)
		.then(function(response) {
			return response.json();
		}).then(function(json) {
			let results = "";
			if (queryType === "character") {
				results += `<button class="bg-green-700 text-alabaster p-2 m-2 rounded shadow-md" onclick="getCharacterGames('${key}')">Show Character's Games</button>`
			}
			results += '<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" id="grid">';
			json.amiibo.forEach(amiibo => {
				results += `<div class="flex flex-col justify-end">`;
				results += `<img class="" alt="${amiibo.amiiboSeries}" src="${amiibo.image}"/>`;
				var jpRelease = amiibo.release.jp ? moment(amiibo.release.jp).format("MMM, YYYY") : "Unknown Date";
				results += `<p class="text-charleston-green text-center">${jpRelease}</p>`;
				results += `</div>`;
			})
			results += '</div>';
			document.getElementById("results").innerHTML = results;
			document.getElementById("no-results").style.display = "none";
		});
}

document.getElementById("search-submit").addEventListener("click", event => {
	event.preventDefault();
	const characterSearch = document.getElementById("search-input").value;
	filteredMainList = mainList.filter(character => character.name.includes(characterSearch));
	let results = '<div class="h-full">';
	filteredMainList.forEach(character => {
		results += `<button class="block pl-3 py-1 hover:bg-charleston-green hover:text-tea-green w-full" onclick="getInfo('${character.key}', '${mainQueryType}')">${character.name}</button>`;
	})
	results += "</div>";
	document.getElementById("nav-box").innerHTML = results;
});

function getCharacterGames(key) {
	const url = `https://www.amiiboapi.com/api/amiibo/?character=` + key + "&showgames";
	fetch(url)
		.then(function(response) {
			return response.json();
		}).then(function(json) {
			var systems = Object.keys(json.amiibo[0]).filter(name => name.includes("games"));

			let results = `<button class="bg-green-700 text-alabaster p-2 m-2 rounded shadow-md" onclick="getInfo('${key}', 'character')">Show Amibo's</button>`
			systems.forEach(system => {
				results += `<h2 class="font-bold text-xl text-antique-ruby px-2">${system.split('games')[1]}</h2>`
				json.amiibo[0][system].forEach(game => {
					results += `<p class="text-charleston-green px-2">${game.gameName}</p>`
				})
			})
			document.getElementById("results").innerHTML = results;
			document.getElementById("no-results").style.display = "none";
		});
}
