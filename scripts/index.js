async function loadData() {
    try {
        console.log('Fetching destinations...');
        const response = await fetch('../public/utils.js');
        const data = await response.json();
        console.log('Destinations loaded:', data);

        const container = document.getElementById('destinationContainer');
        const template = document.getElementById('destinationTemplate');

        container.innerHTML = '';

        data.map(destination => {
            const card = template.content.cloneNode(true);

            card.querySelector('img').src = destination.image;

            // Set destination details
            card.querySelector('.destination-name').textContent = destination.destination;
            card.querySelector('.destination-state').textContent = destination.state;
            card.querySelector('.destination-rating').textContent = `Rating: ${destination.rating}/5`;
            card.querySelector('.destination-duration').textContent = destination.duration;
            card.querySelector('.destination-price').textContent = destination.price;
            card.querySelector('.destination-discount').textContent = destination.discount;

            // Generate rating stars
            const starsContainer = card.querySelector('.rating-stars');
            const fullStars = Math.floor(destination.rating);
            const hasHalfStar = destination.rating % 1 >= 0.5;

            for (let i = 0; i < 5; i++) {
                const star = document.createElement('i');
                if (i < fullStars) {
                    star.className = 'fa-solid fa-star';
                } else if (i === fullStars && hasHalfStar) {
                    star.className = 'fa-solid fa-star-half-stroke';
                } else {
                    star.className = 'fa-regular fa-star';
                }
                starsContainer.appendChild(star);
            }

            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading destinations:', error);
    }
}

loadData();

let heroSection = async function () {
    try {
        const response = await fetch('https://api.aviationstack.com/v1/flights?access_key=46c4f799ad42c1b79a1a09acb661faef');
        const data = await response.json();
        console.log('API Response:', data);
        
        const container = document.querySelector('#heroSectionContainer');
        const template = document.getElementById('heroSectionTemplate');

        // Clear the container first
        container.innerHTML = '';
        
        // Create a single card
        const card = template.content.cloneNode(true);

        // Clear the city-buttons-container before adding new buttons
        const departureCityContainer = card.querySelector('.city-buttons-container');
        departureCityContainer.innerHTML = '';

        // Get unique departure airports and sort them alphabetically
        const departureAirports = [...new Set(data.data.map(flight => flight.departure.airport))].sort();
        
        // Add departure city buttons with modified styling
        departureAirports.forEach(airport => {
            if (airport) {
                const button = document.createElement('button');
                button.className = 'w-full p-2 rounded-lg bg-[#002855] border border-gray-600 text-white hover:bg-[#0F3A5F] transition-colors duration-300 mb-2 text-sm';
                button.textContent = airport;
                button.addEventListener('click', () => {
                    card.querySelector('.city-name').textContent = airport;
                    // Find matching flight for timezone
                    const matchingFlight = data.data.find(flight => flight.departure.airport === airport);
                    if (matchingFlight) {
                        card.querySelector('.time-zone').textContent = matchingFlight.arrival.timezone || 'GMT';
                    }
                });
                departureCityContainer.appendChild(button);
            }
        });

        // Get unique arrival airports and sort them alphabetically
        const arrivalAirports = [...new Set(data.data.map(flight => flight.arrival.airport))].sort();

        // Get the arrival city container
        const arrivalCityContainer = card.querySelector('details:nth-child(2) .space-y-2');
        arrivalCityContainer.innerHTML = ''; // Clear existing content

        // Create a container for arrival city buttons
        const arrivalButtonsContainer = document.createElement('div');
        arrivalButtonsContainer.className = 'arrival-buttons-container';

        // Add arrival city buttons with matching styling
        arrivalAirports.forEach(airport => {
            if (airport) {
                const button = document.createElement('button');
                button.className = 'w-full p-2 rounded-lg bg-[#002855] border border-gray-600 text-white hover:bg-[#0F3A5F] transition-colors duration-300 mb-2 text-sm';
                button.textContent = airport;
                button.addEventListener('click', () => {
                    // Update the main display
                    const mainDisplay = card.querySelector('details:nth-child(2) .arrival-name');
                    if (mainDisplay) {
                        mainDisplay.textContent = airport;
                    }

                    // Update the button in the dropdown
                    const dropdownButton = card.querySelector('details:nth-child(2) .space-y-2 button.arrival-name');
                    if (dropdownButton) {
                        dropdownButton.textContent = airport;
                    }

                    // Find matching flight for timezone
                    const matchingFlight = data.data.find(flight => flight.arrival.airport === airport);
                    if (matchingFlight) {
                        const timezoneElement = card.querySelector('.arival-time-zone');
                        if (timezoneElement) {
                            timezoneElement.textContent = matchingFlight.arrival.timezone || 'GMT';
                        }
                    }
                });
                arrivalButtonsContainer.appendChild(button);
            }
        });

        arrivalCityContainer.appendChild(arrivalButtonsContainer);

        // Update initial city name and arrival name (only once)
        const firstFlight = data.data[0];
        if (firstFlight) {
            card.querySelector('.city-name').textContent = firstFlight.departure.airport || 'N/A';
            card.querySelector('.arrival-name').textContent = firstFlight.arrival.airport || 'N/A';
            card.querySelector('.time-zone').textContent = firstFlight.departure.timezone || 'GMT';
            card.querySelector('.arival-time-zone').textContent = firstFlight.arrival.timezone || 'GMT';

            // Format and set the flight date
            const flightDate = new Date(firstFlight.flight_date);
            const dateOptions = { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                weekday: 'long'
            };
            const formattedDate = flightDate.toLocaleDateString('en-US', dateOptions);
            
            // Update departure date display
            const departureDateHeading = card.querySelector('details:nth-child(3) h2');
            const departureDayText = card.querySelector('details:nth-child(3) p:last-child');
            if (departureDateHeading && departureDayText) {
                departureDateHeading.textContent = formattedDate.split(',')[0];
                departureDayText.textContent = formattedDate.split(',')[1];
            }
        }

        // Append the single populated card to the container
        container.appendChild(card);

    } catch (error) {
        console.error('Error loading flight data:', error);
        const container = document.querySelector('#heroSectionContainer');
        container.innerHTML = '<p class="text-red-500 p-4">Unable to load flight data. Please try again later.</p>';
    }
}();

let travelSpots = async function () {
    try {
        const response = await fetch('../public/travelSpots.js');
        const data = await response.json();

        const container = document.querySelector('#travelSpotsContainer');
        const template = document.getElementById('travelSpotsTemplate');

        container.innerHTML = '';

        data.forEach(spot => {
            const card = template.content.cloneNode(true);

            // Set travel spot details
            card.querySelector('img').src = spot.image;
            card.querySelector('.travelSpots-name').textContent = spot.travelSpots;
            card.querySelector('.travelSpots-rating').textContent = spot.rating;

            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading travel spots:', error);
    }
}();

var galary = async function () {
    try {
        const response = await fetch('../public/galary.js');
        const data = await response.json();

        const container = document.querySelector('#galaryContainer');
        const template = document.getElementById('galaryTemplate');

        container.innerHTML = '';

        data.forEach(spot => {
            const card = template.content.cloneNode(true);

            // Set galary details
            card.querySelector('img').src = spot.image;

            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading travel spots:', error);
    }
}();

var galary2 = async function () {
    try {
        const response = await fetch('../public/galary2.js');
        const data = await response.json();

        const container = document.querySelector('#galary2Container');
        const template = document.getElementById('galary2Template');

        container.innerHTML = '';

        data.forEach(spot => {
            const card = template.content.cloneNode(true);

            // Set galary2 details
            card.querySelector('img').src = spot.image;

            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading travel spots:', error);
    }
}();

async function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    try {
        const response = await fetch('https://docs.google.com/forms/d/e/1FAIpQLSd9vbR-T2ChqHoghzk-CvKa-UB89PKwX0tbie7fBS6kY1Pt9w/formResponse', {
            method: 'POST',
            mode: 'no-cors', // This is important for Google Forms
            body: formData
        });

        // Clear the form
        form.reset();
        
        // Show success message
        alert('Thank you for your submission!');

        console.log(response)
        
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Please try again later.');
    }
}

document.addEventListener('click', function(event) {
    const fromContainer = document.querySelector('.from-container');
    const fromSummary = document.querySelector('details:nth-child(1) summary');
    const toContainer = document.querySelector('.to-container');
    const toSummary = document.querySelector('details:nth-child(2) summary');
    const departureDateContainer = document.querySelector('.departure-date');
    const departureSummary = document.querySelector('details:nth-child(3) summary');
    const returnDateContainer = document.querySelector('.return-date');
    const returnSummary = document.querySelector('details:nth-child(4) summary');

    // Check if the click is on the fromSummary
    if (fromSummary.contains(event.target)) {
        fromContainer.style.display = fromContainer.style.display === 'none' ? 'block' : 'none';
        console.log('Toggled fromContainer');
    } else if (fromContainer && !fromContainer.contains(event.target)) {
        fromContainer.style.display = 'none';
        console.log('Closed fromContainer');
    }

    // Check if the click is on the toSummary
    if (toSummary.contains(event.target)) {
        toContainer.style.display = toContainer.style.display === 'none' ? 'block' : 'none';
        console.log('Toggled toContainer');
    } else if (toContainer && !toContainer.contains(event.target)) {
        toContainer.style.display = 'none';
        console.log('Closed toContainer');
    }

    // Check if the click is on the departureSummary
    if (departureSummary.contains(event.target)) {
        departureDateContainer.style.display = departureDateContainer.style.display === 'none' ? 'block' : 'none';
        console.log('Toggled departureDateContainer');
    } else if (departureDateContainer && !departureDateContainer.contains(event.target)) {
        departureDateContainer.style.display = 'none';
        console.log('Closed departureDateContainer');
    }

    // Check if the click is on the returnSummary
    if (returnSummary.contains(event.target)) {
        returnDateContainer.style.display = returnDateContainer.style.display === 'none' ? 'block' : 'none';
        console.log('Toggled returnDateContainer');
    } else if (returnDateContainer && !returnDateContainer.contains(event.target)) {
        returnDateContainer.style.display = 'none';
        console.log('Closed returnDateContainer');
    }
});

document.getElementById('avatar').addEventListener('click', function() {
    const menuBox = document.querySelector('.menu-box');
    if (menuBox) {
        menuBox.classList.toggle('hidden');
    }
});