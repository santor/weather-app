import Store from './store.js';

const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const OPEN_WEATHER = process.env.OPEN_WEATHER_APP_ID;
const ENCODED_KEY = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`); // encoded key works
const EXPIRE_THRESHOLD = 20; //make expire 20 seconds earlier

const API_URL_AUTH =
  'https://api.srgssr.ch/oauth/v1/accesstoken?grant_type=client_credentials';
//! actually I don't need the current day because it is also in the current hour
//! and int the 7days forecast
// const API_URL_CURRENT = 'https://api.srgssr.ch/forecasts/v1.0/weather/current';
// const API_URL_7_DAYS = 'https://api.srgssr.ch/forecasts/v1.0/weather/7day';
// const API_URL_24_HOURS = 'https://api.srgssr.ch/forecasts/v1.0/weather/24hour';
// const API_URL_THIS_HOUR =
//   'https://api.srgssr.ch/forecasts/v1.0/weather/nexthour';
const API_URL_SEARCH_LOCATION =
  'https://api3.geo.admin.ch/rest/services/api/SearchServer?type=locations&origins=zipcode,gg25,district&searchText=';

//lets try a singleton in javascript
class Api {
  constructor() {
    if (!Api.instance) {
      //maybe the token is already saved
      this.authToken = Store.getAuthToken();
    }
    return Api.instance;
  }

  _handleErrors(response) {
    if (!response.ok) {
      throw new Error('HTTP error, status = ' + response.status);
    }
    return response.json();
  }

  async searchLocation(searchTerm) {
    return (
      await (await fetch(API_URL_SEARCH_LOCATION + searchTerm)).json()
    ).results.map((result) => ({
      id: result.id,
      name: result.attrs.label.replace(/<\/?[^>]+(>|$)/g, ''), //strip the html (it's not foolproof)
      lat: result.attrs.lat,
      lon: result.attrs.lon,
    }));
  }

  /**
   * @throws [Errors]
   * @param {*} latitude Latitude of the location
   * @param {*} longitude Longitude of the location
   */
  async getCurrentForecast(latitude, longitude, location) {
    if (!latitude || !longitude) {
      latitude = Store.getLatitude();
      longitude = Store.getLongitude();
    } else if (location && latitude && longitude) {
      Store.saveCurrentLocation(location, latitude, longitude);
    }
    try {
      //if authToken undefined, then ask first for token
      if (!this._isTokenValid()) {
        this.authToken = await this._fetchAndStoreAuthToken();
      }
      return await this._fetchForecast(
        Api._currentWeatherUrl(latitude, longitude)
      );
    } catch (error) {
      //there was an error, calling the srf api
      console.log('error in current swiss ' + error);
      return await this._fetchOpenWeather(
        Api._openWeatherUrl(latitude, longitude)
      );
    }
  }

  async _fetchOpenWeather(url) {
    const result = await fetch(url).then(this._handleErrors);

    if (result) {
      // console.log(result);
      return {
        // location: r.info.name.de,
        iconCode: result.current.weather[0].icon, //different then the srf icon data
        temperature: result.current.temp,
        windSpeed: result.current.wind_speed,
        windDirection: result.current.wind_deg,
        precMm: result.minutely[0].precipitation,
        precProbability: result.hourly[0].pop,
      };
    } else {
      return null;
    }
  }

  static _openWeatherUrl(latitude, longitude) {
    return `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPEN_WEATHER}`;
  }

  async _fetchForecast(url) {
    const result = await fetch(url, {
      headers: {
        Authorization: 'Bearer ' + this.authToken,
      },
    }).then(this._handleErrors);

    if (result) {
      return {
        // location: r.info.name.de,
        iconCode: result.currentHour[0].values[0].smb3,
        temperature: result.currentHour[0].values[1].ttt,
        windSpeed: result.currentHour[0].values[2].fff,
        windDirection: result.currentHour[0].values[4].ddd,
        precMm: result.currentHour[0].values[5].rr3,
        precProbability: result.currentHour[0].values[6].pr3,
      };
    } else {
      return null;
    }
  }

  static _currentWeatherUrl(latitude, longitude) {
    return `https://api.srgssr.ch/forecasts/v1.0/weather/current?latitude=${latitude}&longitude=${longitude}`;
  }

  _isTokenValid() {
    return this.authToken && this._notExpired();
  }

  _notExpired() {
    const issued = Store.getAuthIssuedAt();
    const expire = Store.getAuthExpiresIn();
    const currentTime = new Date().getTime();
    return currentTime < issued + expire - EXPIRE_THRESHOLD;
  }

  async _fetchAndStoreAuthToken() {
    // const result = await axios(API_URL_AUTH, {
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Basic ${ENCODED_KEY}`,
    //   },
    // }).then((response) => response.data);
    const result = await fetch(API_URL_AUTH, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${ENCODED_KEY}`,
      },
    }).then(this._handleErrors);

    if (result) {
      //get the values
      const { access_token, issued_at, expires_in } = result;
      //and save them
      Store.saveAuthToken(access_token, issued_at, expires_in);

      return access_token;
    } else {
      return null;
    }
  }
}

const instance = new Api();
// Object.freeze(instance);

export default instance;
