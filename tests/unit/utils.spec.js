import {
  zeroPad,
  getWeatherDescription,
  getWeatherIconName,
} from '../../src/utils/utils';

describe('utils.js zeroPad()', () => {
  test('adds leading zero to single digit', () => {
    const result = zeroPad(1);
    expect(result).toEqual('01');
  });

  test('adds nothing to multiple digits', () => {
    const result = zeroPad(123);
    expect(result).toEqual('123');
  });
});

describe('utils.js getWeatherIconName()', () => {
  test('converts srf icon code to wi icon name', () => {
    const result = getWeatherIconName('-3');
    expect(result).toEqual('wi-night-alt-cloudy');
  });
});

describe('utils.js getWeatherDescription()', () => {
  test('converts srf icon code to description usable with i18n', () => {
    const result = getWeatherDescription('26');
    expect(result).toEqual('rain_shower_thunderstorm');
  });
});
