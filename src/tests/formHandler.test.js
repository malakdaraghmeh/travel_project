import { handleFormSubmit } from '../client/js/formHandler';
import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/dom';

// Mock the fetch function
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({
            weather: { temp: 25, description: 'Sunny' },
            countdown: 5,
            image: 'https://example.com/image.jpg'
        })
    })
);

describe('handleFormSubmit', () => {
    let form, locationInput, dateInput, weatherDiv, imageDiv, tripDateDiv;

    beforeAll(() => {
        document.body.innerHTML = `
            <form id="bookingForm">
                <input id="location" value="Paris" />
                <input id="date" value="2025-06-01" />
                <button type="submit">Book Now</button>
            </form>
            <div id="weather"></div>
            <div id="tripDate"></div>
            <div id="image"></div>
        `;
    });

    beforeEach(() => {
        form = document.getElementById('bookingForm');
        locationInput = document.getElementById('location');
        dateInput = document.getElementById('date');
        weatherDiv = document.getElementById('weather');
        tripDateDiv = document.getElementById('tripDate');
        imageDiv = document.getElementById('image');
        form.addEventListener('submit', handleFormSubmit);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should prevent form submission if fields are empty', () => {
        locationInput.value = '';
        dateInput.value = '';
        
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
        fireEvent.submit(form);

        expect(alertMock).toHaveBeenCalledWith('Please fill in all fields');
        expect(fetch).not.toHaveBeenCalled();
        alertMock.mockRestore();
    });

    test('should make a fetch request with correct data', async () => {
        fetch.mockClear();
        fireEvent.submit(form);

        expect(fetch).toHaveBeenCalledWith('http://localhost:8080/api', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ location: 'Paris', date: '2025-06-01' })
        });
    });

    test('should update DOM with fetched data', async () => {
        fetch.mockClear();
        fireEvent.submit(form);

        await new Promise(r => setTimeout(r, 100));

        expect(weatherDiv.innerHTML).toContain('Weather: 25°C, Sunny');
        expect(tripDateDiv.innerHTML).toContain('Trip Date: 2025-06-01');
        expect(imageDiv.innerHTML).toContain('<img src="https://example.com/image.jpg"');
    });
});
