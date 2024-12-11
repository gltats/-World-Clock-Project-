//Using moment to get the current time and date
//let getTimezone = moment.tz.guess();
const UNSPLASH_ACCESS_KEY =  'hxZKIo_wnzrFpB8vKAiKFC-2LoMB2cZBv9PWpGrpDiA';
document.getElementById("city").selectedIndex = 0;
let container = document.querySelector(".container");
container.style.backgroundImage = "none";

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
		refreshPage();
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
                            timeElement.innerHTML = cityTime.format("h:mm:ss [<small>]A[</small>]");
                        }, 1000);

						// Fetch a picture of the city from Unsplash API
                        fetch(`https://api.unsplash.com/photos/random?query=${city}&client_id=${UNSPLASH_ACCESS_KEY}`)
                            .then(response => response.json())
                            .then(photoData => {
                                //let cityImage = document.createElement("img");
                                //cityImage.src = photoData.urls.regular;
                                //cityImage.alt = `${city}`;
								//set the image to the background of the container
								let container = document.querySelector(".container");
								container.style.backgroundImage = `url(${photoData.urls.regular})`;
								container.style.backgroundSize = "cover";
								container.style.backgroundPosition = "center";
								container.style.backgroundRepeat = "no-repeat";
							})
						.catch(error => console.error('Error fetching city image:', error));
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
		let container = document.querySelector(".container");
		container.style.backgroundImage = "none";
        updateCityInterval = setInterval(() => {
            let cityTime = moment().tz(cityTimeZone);
            let dateElement = citiesElement.querySelector(".date");
            let timeElement = citiesElement.querySelector(".time");

            dateElement.innerHTML = cityTime.format("MMMM Do YYYY");
            timeElement.innerHTML = cityTime.format("h:mm:ss [<small>]A[</small>]");
        }, 1000);
    }
}


function refreshPage() {
    location.reload();
	//set the selector to the first option
	document.getElementById("city").selectedIndex = 0;
}

function changeBackroundColor() {
	//if current location is after 18:00 background color will be dark otherwise background: linear-gradient(45deg, #f1bcff, #a9eee9, #ecffa4, #ffdca6, #f2aeae);
	let currentTime = moment().tz(moment.tz.guess());
	let hours = currentTime.hours();

	if (hours >= 19 || hours < 6) {
		document.body.style.background = "linear-gradient(45deg, #b03cd0, #28918a, #5145d3)";
		document.body.style.color = "white";
		document.body.style.backgroundSize = "400% 400%";
	}
	else {
		document.body.style.background = "linear-gradient(45deg, #f1bcff, #a9eee9, #ecffa4, #ffdca6, #f2aeae)";
		document.body.style.color = "black";
		document.body.style.backgroundSize = "400% 400%";
	}
}


updateTime();
setInterval(updateTime, 1000);

let citiesSelectElement = document.querySelector("#city");
citiesSelectElement.addEventListener("change", updateCity);
changeBackroundColor();
