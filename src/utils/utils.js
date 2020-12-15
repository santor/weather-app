import weatherCodeMap from '../assets/weather_code_map.json';

function getWeatherIconName(iconCode) {
  const item = weatherCodeMap.find((element) => element.code == iconCode);
  return item.code_icon;
}

function getWeatherDescription(iconCode) {
  const item = weatherCodeMap.find((element) => element.code == iconCode);
  return item.description;
}

//add leading zeros to the hours:minutes
function zeroPad(num) {
  return String(num).padStart(2, '0');
}

export { getWeatherIconName, getWeatherDescription, zeroPad };
