var mainList;
var mainQueryType;
function getNames(queryType = "character") {
	mainQueryType = queryType;
	const url = "https://www.amiiboapi.com/api/" + queryType;
	fetch(url)
		.then(function(response) {
			return response.json();
		}).then(function(json) {
			mainList = json.amiibo;
			let results = '<div class="h-full">';
			mainList.forEach(character => {
				results += `<button class="block px-3 py-1 hover:bg-charleston-green hover:text-tea-green w-full" onclick="getInfo('${character.key}', '${queryType}')">${character.name}</button>`;
			})
			results += "</div>";
			document.getElementById("left-nav-bar").innerHTML = results;
		});
}

function getInfo(key, queryType) {
	queryType = queryType === "amiiboseries" ? "amiiboSeries" : queryType;
	const url = `https://www.amiiboapi.com/api/amiibo/?${queryType}=` + key;
	fetch(url)
		.then(function(response) {
			return response.json();
		}).then(function(json) {
			let results = '<div class="grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">';
			json.amiibo.forEach(amiibo => {
				results += `<img class="" alt="${amiibo.amiiboSeries}" src="${amiibo.image}"/>`;
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
	document.getElementById("left-nav-bar").innerHTML = results;
});