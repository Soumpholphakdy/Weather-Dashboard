var current = dayjs();
var currentDay = (current.format("MM/DD/YYYY"));
var city = "";
var listofCities = $("#search-city");
var citiesButton = $("#search-button");
//When you click the button it will display the current and future weather
citiesButton.on("click", displayWeather);

//This will delete searches from localstorage
function deleteCities() {
  localStorage.clear();

}
//This function gets the current weather conditions for the selected city from the API
function currentFutureWeather(city) {
  const apiKey = "14bc642e7fbec16847712fb8685896f0";
  var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}&units=imperial`;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (weatherData) {

    var weatherIcon = weatherData.weather[0].icon;
    var iconurl = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
    var current = dayjs();
    var city = document.getElementById("current-city");
    city.innerHTML = (weatherData.name + " " + "(" + current.format("MM/DD/YYYY") + ")" + '<img src="' + iconurl + '">');


    var temp = document.getElementById("temperature");
    temp.textContent = "Temperature: " +
      weatherData.main.temp + "F";

    var humidity = document.getElementById("humidity");
    humidity.textContent = "Humidity: " +
      weatherData.main.humidity + "%";

    var wind = document.getElementById("wind-speed");
    wind.textContent = "Wind Speed: " +
      weatherData.wind.speed + " MPH";

    var lat = weatherData.coord.lat;
    var lon = weatherData.coord.lon;

    //This function shows the future weather for the selected city
    $.ajax({
      url: `https://api.openweathermap.org/data/3.0/onecall?units=imperial&lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}`,
      method: "GET",
    }).then(function (forecastData) {
      $("#forecast").empty();

      for (var i = 1; i < 6; i++) {
        var forecastSection = document.getElementById("forecast");

        var unix = forecastData.daily[i].dt;
        var date = new Date(unix * 1000);
        var forecastDate = dayjs(date).format('MM/DD/YYYY');

        var div1 = document.createElement("div");
        div1.setAttribute("class", "col-sm");
        forecastSection.appendChild(div1);

        var div2 = document.createElement("div");
        div2.setAttribute("class", "card card-body bg-primary border-dark");
        div1.appendChild(div2);

        var para1 = document.createElement("p");
        para1.textContent = forecastDate;
        div2.appendChild(para1);

        var img2 = document.createElement('img');
        img2.setAttribute("src", "https://openweathermap.org/img/wn/" + forecastData.daily[i].weather[0].icon + "@2x.png");
        img2.setAttribute("alt", forecastData.daily[i].weather[0].description);
        div2.appendChild(img2);

        var forecastTemp = forecastData.daily[i].temp.day;
        var para2 = document.createElement("p");
        div2.appendChild(para2);
        para2.textContent = "Temp:" + forecastTemp + "°F";

        var forecastHumidity = forecastData.daily[i].humidity;
        var ptag3 = document.createElement("p");
        div2.appendChild(ptag3);
        ptag3.textContent = "Humidity:" + forecastHumidity + "%";
      }
    })
  });
};


// This displays the weather after calling the function
function displayWeather(event) {
  event.preventDefault();
  if (listofCities.val().trim() !== "") {
    city = listofCities.val().trim();
    currentFutureWeather(city);
    var cityList = document.getElementById("city-list");
    cityList.textContent = "";
    

    //This function stores the searched cities in localstorage
    var searchCities = localStorage.getItem("searchedCities");
    if (searchCities === null) {
      searchCities = [];
    } else {
      searchCities = JSON.parse(searchCities);
    }
    searchCities.push(city);
  

  
    //This creates a list of chosen cites in the local storage
    var chosenCities = JSON.stringify(searchCities);
    localStorage.setItem("searchedCities", chosenCities);
    
    for (let i = 0; i < searchCities.length; i++) {
      var list = document.createElement("li");
      list.setAttribute("class", "list-group-item");
      list.setAttribute("id", "city-link");
      list.textContent = searchCities[i];
      cityList.appendChild(list);
    }
  }
}