import weatherCodeMap from './weather_code_map.json';

function getWeatherIconName(iconCode) {
  const item = weatherCodeMap.find((element) => element.code == iconCode);
  return item.code_icon;
}

function getWeatherDescriptionCode(iconCode) {
  const item = weatherCodeMap.find((element) => element.code == iconCode);
  return item.description;
}

//add leading zeros to the hours:minutes
function zeroPad(num) {
  return String(num).padStart(2, '0');
}

const State = { LOADING: 0, FAILURE: -1, SUCCESS: 1 };
Object.freeze(State);

export { getWeatherIconName, getWeatherDescriptionCode, zeroPad, State };
