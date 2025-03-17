require('dotenv').config(); // Load environment variables
const request = require('supertest');
const app = require('../server/index'); 
const axios = require('axios');
jest.mock('axios');

const mockGeoResponse = {
  data: {
    geonames: [{ lat: 40.7128, lng: -74.0060, countryName: "United States" }]
  }
};

const mockWeatherResponse = {
  data: {
    data: [{ temp: 22, weather: { description: 'Clear sky' }, valid_date: '2025-03-14' }]
  }
};

const mockImageResponse = {
  data: { hits: [{ webformatURL: 'https://example.com/image.jpg' }] }
};

describe('POST /api', () => {
  beforeAll(() => {
    axios.get.mockImplementation((url) => {
      if (url.includes('geonames.org')) return Promise.resolve(mockGeoResponse);
      if (url.includes('weatherbit.io')) return Promise.resolve(mockWeatherResponse);
      if (url.includes('pixabay.com')) return Promise.resolve(mockImageResponse);
      return Promise.reject(new Error('Not found'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return trip data including location, weather, image, and countdown', async () => {
    const res = await request(app).post('/api').send({ location: 'New York', date: '2025-03-14' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      location: { city: 'New York', country: 'United States' },
      weather: { temp: 22, description: 'Clear sky', date: '2025-03-14' },
      image: 'https://example.com/image.jpg',
      countdown: expect.any(Number)
    });
  });

  it('should return a 400 if location or date is missing', async () => {
    const res = await request(app).post('/api').send({ location: 'New York' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'Location and date are required');
  });

  it('should return a 404 if location is not found', async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: { geonames: [] } }));
    const res = await request(app).post('/api').send({ location: 'Unknown City', date: '2025-03-14' });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message', 'Location not found.');
  });

  it('should return a 500 if API call fails', async () => {
    axios.get.mockImplementationOnce(() => Promise.reject(new Error('API error')));
    const res = await request(app).post('/api').send({ location: 'New York', date: '2025-03-14' });
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message', 'Error fetching data from APIs');
  });
});
