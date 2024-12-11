//Using moment to get the current time and date
//let getTimezone = moment.tz.guess();
document.getElementById("city").selectedIndex = 0;

function updateTime() {
    // Los Angeles
    let losAngelesElement = document.querySelector("#los-angeles");
    if (losAngelesElement) {
        let losAngelesDateElement = losAngelesElement.querySelector(".date");
        let losAngelesTimeElement = losAngelesElement.querySelector(".time");
        let losAngelesTime = moment().tz("America/Los_Angeles");

        losAngelesDateElement.innerHTML = losAngelesTime.format("MMMM Do YYYY");
        losAngelesTimeElement.innerHTML = losAngelesTime.format("h:mm:ss [<small>]A[</small>]");
    }

    // Paris
    let parisElement = document.querySelector("#paris");
    if (parisElement) {
        let parisDateElement = parisElement.querySelector(".date");
        let parisTimeElement = parisElement.querySelector(".time");
        let parisTime = moment().tz("Europe/Paris");

        parisDateElement.innerHTML = parisTime.format("MMMM Do YYYY");
        parisTimeElement.innerHTML = parisTime.format("h:mm:ss [<small>]A[</small>]");
    }
}

let updateCityInterval; // Variable to store the interval ID

function updateCity(event) {
    let cityTimeZone = event.target.value;
    clearInterval(updateCityInterval); // Clear the previous interval
	if (cityTimeZone === "") {
		console.log("Please select a city");
	}
    else if (cityTimeZone === "current") {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;

                // Use a reverse geocoding service to get the city name
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
                    .then(response => response.json())
                    .then(data => {
                        let city = data.address.city || data.address.town || data.address.village || "Location";
                        cityTimeZone = moment.tz.guess();
                        let citiesElement = document.querySelector("#cities");
                        citiesElement.innerHTML = `
                            <div class="city row justify-content-evenly">
                                <div class="col-4">
                                    <h2>${city}</h2>
                                    <div class="date"></div>
                                </div>
                                <div class="time col-4"> </div>
                            </div>
							<button onclick="refreshPage()" class="mt-4 mb-1" >Refresh</button>

                        `;
                        updateCityInterval = setInterval(() => {
                            let cityTime = moment().tz(cityTimeZone);
                            let dateElement = citiesElement.querySelector(".date");
                            let timeElement = citiesElement.querySelector(".time");

                            dateElement.innerHTML = cityTime.format("MMMM Do YYYY");
                            timeElement.innerHTML = cityTime.format("h:mm:ss A");
                        }, 1000);
                    })
                    .catch(error => console.error('Error fetching city name:', error));
            }, (error) => {
                console.error('Error getting location:', error);
            });
        }
    } else {
        let cityName = cityTimeZone.replace("_", " ").split("/")[1];
        let citiesElement = document.querySelector("#cities");
        citiesElement.innerHTML = `
            <div class="city row justify-content-evenly">
                <div class="col-4">
                    <h2>${cityName}</h2>
                    <div class="date"></div>
                </div>
                <div class="time col-4"></div>
            </div>
            <button onclick="refreshPage()" class="mt-4 mb-1">Refresh</button>

        `;
        updateCityInterval = setInterval(() => {
            let cityTime = moment().tz(cityTimeZone);
            let dateElement = citiesElement.querySelector(".date");
            let timeElement = citiesElement.querySelector(".time");

            dateElement.innerHTML = cityTime.format("MMMM Do YYYY");
            timeElement.innerHTML = cityTime.format("h:mm:ss A");
        }, 1000);
    }
}


function refreshPage() {
    location.reload();
	//set the selector to the first option
	document.getElementById("city").selectedIndex = 0;
}

updateTime();
setInterval(updateTime, 1000);

let citiesSelectElement = document.querySelector("#city");
citiesSelectElement.addEventListener("change", updateCity);