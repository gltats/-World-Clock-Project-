//Using moment to get the current time and date
//let getTimezone = moment.tz.guess();
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

function updateCity(event) {
    let cityTimeZone = event.target.value;
    if (cityTimeZone === "current") {
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
                        let cityTime = moment().tz(cityTimeZone);
                        let citiesElement = document.querySelector("#cities");
                        citiesElement.innerHTML = `
                            <div class="city">
                                <div>
                                    <h2>${city}</h2>
                                    <div class="date">${cityTime.format("MMMM Do YYYY")}</div>
                                </div>
                                <div class="time">${cityTime.format("h:mm:ss")} <small>${cityTime.format("A")}</small></div>
                            </div>
                        `;
                    })
                    .catch(error => console.error('Error fetching city name:', error));
            }, (error) => {
                console.error('Error getting location:', error);
                //alert('Unable to retrieve your location');
				citiesElement.innerHTML = `
				<div class="city">
					<div>
						<h2>Unable to retrieve your location</h2>
					</div>
				</div>
			`;
            });
        } else {
			citiesElement.innerHTML = `
			<div class="city">
				<div>
					<h2>Geolocation is not supported by this browser</h2>
				</div>
			</div>
		`;
        }
    } else {
        let cityName = cityTimeZone.replace("_", " ").split("/")[1];
        let cityTime = moment().tz(cityTimeZone);
        let citiesElement = document.querySelector("#cities");
        citiesElement.innerHTML = `
            <div class="city">
                <div>
                    <h2>${cityName}</h2>
                    <div class="date">${cityTime.format("MMMM Do YYYY")}</div>
                </div>
                <div class="time">${cityTime.format("h:mm:ss")} <small>${cityTime.format("A")}</small></div>
            </div>
        `;
    }
}

updateTime();
setInterval(updateTime, 1000);

let citiesSelectElement = document.querySelector("#city");
citiesSelectElement.addEventListener("change", updateCity);