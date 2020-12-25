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

export { getWeatherIconName, getWeatherDescriptionCode, zeroPad };
