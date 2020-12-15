import Store from './store.js';
import axios from 'axios';

const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const ENCODED_KEY = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`); // encoded key works
const EXPIRE_THRESHOLD = 20; //make expire 20 seconds earlier

const URL_AUTH =
  'https://api.srgssr.ch/oauth/v1/accesstoken?grant_type=client_credentials';
const URL_CURRENT = 'https://api.srgssr.ch/forecasts/v1.0/weather/current';
const URL_7_DAYS = 'https://api.srgssr.ch/forecasts/v1.0/weather/7day';
const URL_24_HOURS = 'https://api.srgssr.ch/forecasts/v1.0/weather/24hour';
const URL_SEARCH_LOCATION =
  'https://api3.geo.admin.ch/rest/services/api/SearchServer?type=locations&origins=zipcode,gg25,district&searchText=';

//lets try a singleton in javascript
class Api {
  constructor() {
    if (!Api.instance) {
      //maybe the token from the SRF API is already saved
      this.authToken = Store.getAuthToken();
      Api.instance = this;
    }
    return Api.instance;
  }

  async searchLocation(searchTerm) {
    const json = await axios
      .get(URL_SEARCH_LOCATION + searchTerm)
      .then((result) => result.data)
      .catch((error) =>
        console.log(`[api.js] Error searching location: ${error}`)
      );

    return json.results.map((result) => ({
      id: result.id,
      name: result.attrs.label.replace(/<\/?[^>]+(>|$)/g, ''), //strip the html from the label (it's not 100% foolproof)
      lat: result.attrs.lat,
      lon: result.attrs.lon,
    }));
  }
  async get24HoursForecast(latitude, longitude) {
    this._checkNotNull(latitude, longitude, 'get24HoursForecast()');
    if (!this._isTokenValid()) {
      this.authToken = await this._fetchAndStoreAuthToken();
    }
    const url = Api._url(URL_24_HOURS, latitude, longitude);

    const json = await axios(url, {
      headers: {
        Authorization: 'Bearer ' + this.authToken,
      },
    }).then((result) => result.data);

    if (json) {
      return json['24hours'].map((result) => ({
        hours: new Date(result.date).getHours(),
        temperature: parseInt(result.values[1].ttt),
        icon: result.values[0].smb3,
      }));
    }
  }

  async get7daysForecast(latitude, longitude) {
    this._checkNotNull(latitude, longitude, 'get7daysForecast()');
    if (!this._isTokenValid()) {
      this.authToken = await this._fetchAndStoreAuthToken();
    }
    const url = Api._url(URL_7_DAYS, latitude, longitude);

    const json = await axios(url, {
      headers: {
        Authorization: 'Bearer ' + this.authToken,
      },
    }).then((result) => result.data);

    if (json) {
      return json['7days'].map((result) => ({
        dayOfWeek: Api._getDayFromDate(result.date),
        tempAvg: Api._getAverageFromStrings(
          result.values[0].ttn,
          result.values[2].ttx
        ),
        iconCode: result.values[1].smbd,
      }));
    }
  }

  static _getAverageFromStrings(min, max) {
    return parseInt((parseFloat(min) + parseFloat(max)) / 2);
  }

  static _getDayFromDate(dateString) {
    //construct a date from the dateString (ex. 1995-12-17T01:00:00)
    const date = new Date(dateString + 'T01:00:00');
    return date.getDay();
  }

  _checkNotNull(lat, lon, functionName) {
    if (!lat || !lon) {
      throw Error(
        `[api.js] ${functionName} latitude and longitude should be specified`
      );
    }
  }
  /**Returns the current forecast and saves the parameters, so that they
   * can be recalled, when the app starts.
   * @throws [Error] when latitude or longitude are not specified, or there was a problem with the response
   * @param {*} latitude Latitude of the location
   * @param {*} longitude Longitude of the location
   * @param {*} location name of the location
   */
  async getCurrentForecast(latitude, longitude, location) {
    this._checkNotNull(latitude, longitude, 'getCurrentForecast()');

    Store.saveCurrentCoordinates(latitude, longitude);

    if (location) {
      Store.saveCurrentLocation(location);
    }

    if (!this._isTokenValid()) {
      this.authToken = await this._fetchAndStoreAuthToken();
    }
    return await this._fetchCurrentForecast(
      Api._url(URL_CURRENT, latitude, longitude)
    );
  }

  async _fetchCurrentForecast(url) {
    const json = await axios(url, {
      headers: {
        Authorization: 'Bearer ' + this.authToken,
      },
    }).then((result) => result.data);

    if (json) {
      // console.log(json);
      Store.saveCurrentLocation(json.info.name.de);
      return {
        location: json.info.name.de,
        iconCode: json.current_hour[0].values[0].smb3,
        temperature: json.current_hour[0].values[1].ttt,
      };
    }
  }

  static _url(url, latitude, longitude) {
    return `${url}?latitude=${latitude}&longitude=${longitude}`;
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
    const json = await axios(URL_AUTH, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${ENCODED_KEY}`,
      },
    }).then((response) => response.data);

    if (json) {
      //object destructuring
      const { access_token, issued_at, expires_in } = json;
      //save them
      Store.saveAuthToken(access_token, issued_at, expires_in);

      return access_token;
    } else {
      return null;
    }
  }
}

const instance = new Api();

export default instance;
