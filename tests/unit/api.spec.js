import axios from 'axios';
import Api from '@/lib/api';
import location from '../api/location.json';
import allDay from '../api/24hour.json';
import sevenDays from '../api/sevendays.json';
import current from '../api/current.json';

jest.mock('axios');

describe('api.js searchLocation()', () => {
  let result;

  beforeAll(async () => {
    //mock axios
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: location }));
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

describe('api.js get24HoursForecast()', () => {
  let result;

  beforeAll(async () => {
    Api._isTokenValid = jest.fn().mockReturnValue(true);
    //mock axios
    axios.get.mockImplementation(() => Promise.resolve({ data: allDay }));
    result = await Api.get24HoursForecast(1, 1);
  });

  test('has correct length', () => {
    expect(result).toHaveLength(8);
  });

  test('has correct fields', () => {
    result.forEach((item) => {
      const hasField =
        item.hours != undefined &&
        item.temperature != undefined &&
        item.icon != undefined;
      expect(hasField).toBeTruthy();
    });
  });

  test('has correct hours', () => {
    expect(result[0].hours).toBe(1);
    expect(result[4].hours).toBe(13);
    expect(result[7].hours).toBe(22);
  });

  test('has correct temperature', () => {
    expect(result[2].temperature).toBe(0);
    expect(result[5].temperature).toBe(1);
  });

  test('has correct icons', () => {
    expect(result[1].icon).toBe('-19');
    expect(result[6].icon).toBe('3');
  });
});

describe('api.js get7daysForecast()', () => {
  let result;

  beforeAll(async () => {
    Api._isTokenValid = jest.fn().mockReturnValue(true);
    //mock axios
    axios.mockImplementation(() => Promise.resolve({ data: sevenDays }));
    result = await Api.get7daysForecast(1, 1);
  });

  test('has correct length', () => {
    expect(result).toHaveLength(7);
  });

  test('has correct fields', () => {
    result.forEach((item) => {
      const hasField =
        item.dayOfWeek != undefined &&
        item.tempAvg != undefined &&
        item.iconCode != undefined;
      expect(hasField).toBeTruthy();
    });
  });
});

describe('api.js getCurrentForecast()', () => {
  let result;

  beforeAll(async () => {
    Api._isTokenValid = jest.fn().mockReturnValue(true);
    //mock axios
    axios.mockImplementation(() => Promise.resolve({ data: current }));
    result = await Api.getCurrentForecast(1, 1);
  });

  test('has correct location', () => {
    expect(result.location).toBe('Gümligen');
  });

  test('has correct iconCode', () => {
    expect(result.iconCode).toBe('-3');
  });

  test('has correct temperature', () => {
    expect(result.temperature).toBe('0.0');
  });
});

describe('api.js checkNotNull', () => {
  test('throws error if latitude or longitude are not specified', () => {
    expect(Api._checkNotNull).toThrow(Error);
  });
});
