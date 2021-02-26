document.getElementById("weatherSubmit").addEventListener("click", function(event) {
	event.preventDefault();
	const value = document.getElementById("weatherInput").value;
	if (value === "")
	  return;
	console.log(value);
	const url = "http://api.openweathermap.org/data/2.5/weather?q=" + value + ",US&units=imperial" + "&APPID=1b5bce174b3fbef40b04d293ee34a12b";
	fetch(url)
		.then(function(response) {
		return response.json();
		}).then(function(json) {
			console.log(json)
			let results = '<div class="bg-gray-100 flex justify-center m-2 p-2 rounded-md border border-gray-500">';
			for (let i=0; i < json.weather.length; i++) {
				results += '<img class="mr-5 h-50 w-50" src="http://openweathermap.org/img/w/' + json.weather[i].icon + '.png"/>';
			}
			results += '<div class="mt-2">';
			results += '<h2 class="font-bold">Weather in: ' + json.name + "</h2>";
			results += '<h2>Current: ' + json.main.temp + " &deg;F</h2>"
			results += '<div>';
				results += '<p>High: ' + json.main.temp_max + " &deg;F</p>";
				results += '<p>Low: ' + json.main.temp_min + " &deg;F</p>";
			results += '</div>';
			results += "<p>"
			for (let i=0; i < json.weather.length; i++) {
				var description = json.weather[i].description
				results += description.charAt(0).toUpperCase() + description.slice(1);
				if (i !== json.weather.length - 1)
					results += ", "
			}
			results += "</p></div></div>";
			document.getElementById("weatherResults").innerHTML = results;
		});

		const url2 = "http://api.openweathermap.org/data/2.5/forecast?q=" + value + ", US&units=imperial" + "&APPID=1b5bce174b3fbef40b04d293ee34a12b";
		fetch(url2)
		.then(function(response) {
			return response.json();
		}).then(function(json) {
			console.log(json)
			let forecast = '<div class="sm:grid sm:grid-cols-2">';
			let day = "";
			for (let i=0; i < json.list.length; i++) {
				var forecastDay = moment(json.list[i].dt_txt).format('MMMM Do YYYY');
				if (day !== forecastDay) {
					forecast += '<h2 class="sm:col-span-2 text-center font-bold ">' + forecastDay + '</h2>';
					day = forecastDay;
				}
				
				forecast += '<div class="m-2 bg-gray-100 p-2 rounded-md border border-gray-500 flex">'
					forecast += '<img class="h-50 w-50" src="http://openweathermap.org/img/w/' + json.list[i].weather[0].icon + '.png"/>'
					forecast += '<div>';
						forecast += '<h2 class="font-bold">' + moment(json.list[i].dt_txt).format('h:mm a') + "</h2>";
						forecast += '<p>Temperature: ' + json.list[i].main.temp + " &deg;F</p>";
						forecast += '<p>Feels Like: ' + json.list[i].main.feels_like + " &deg;F</p>";
					forecast += '</div>';
				forecast += '</div>'
			}
			forecast += '</div>';
			document.getElementById("forecastResults").innerHTML = forecast;
		});
		document.getElementById("no-results").style.display = "none";
  });