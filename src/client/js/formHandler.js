const serverURL = 'http://localhost:8080/api'; // Backend API URL

export const handleFormSubmit = async (event) => {
    event.preventDefault();

    const location = document.getElementById('location').value;
    const date = document.getElementById('date').value;

    if (!location || !date) {
        alert('Please fill in all fields');
        return;
    }

    try {
        const response = await fetch(serverURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ location, date })
        });

        const data = await response.json();

        if (!data || !data.weather || !data.image) {
            alert('No data available');
            return;
        }

        document.getElementById('weather').innerHTML = `<p>Weather: ${data.weather.temp}°C, ${data.weather.description}</p>`;
        document.getElementById('tripDate').innerHTML = `<p>Trip Date: ${date} (Countdown: ${data.countdown} days)</p>`;
        document.getElementById('image').innerHTML = `<img src="${data.image}" alt="Location Image" />`;

    } catch (error) {
        alert('Error while fetching the data');
    }
};

//Only attach event listener if the form exists (Prevents Jest from failing)
const form = document.getElementById('bookingForm');
if (form) {
    form.addEventListener('submit', handleFormSubmit);
}
