import axios from 'axios';
import Api from '@/lib/api';
import location from '../api/location.json';

//mock response
const response = {
  data: location,
};
jest.mock('axios');

describe('api.js searchLocation()', () => {
  let result;

  beforeAll(async () => {
    axios.get.mockImplementationOnce(() => Promise.resolve(response));
    result = await Api.searchLocation('muri');
  });

  test('has correct length', () => {
    expect(result).toHaveLength(4);
  });

  test('has correct id', () => {
    expect(result[0].id).toBe(205);
  });

  test('has correct name', () => {
    expect(result[2].name).toBe('Muriaux (JU)');
  });

  test('has correct latitude and longitude', () => {
    expect(result[1].lon).toBe(8.338957786560059);
    expect(result[3].lat).toBe(47.24173355102539);
  });
});
