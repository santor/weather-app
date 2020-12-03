import Store from '@/store';

const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const ENCODED_KEY = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`); // encoded key works
const EXPIRE_THRESHOLD = 20; //make expire 20 seconds earlier

//Bern 46.954559326171875,7.420684814453125
const API_URL_AUTH =
  'https://api.srgssr.ch/oauth/v1/accesstoken?grant_type=client_credentials';
const API_URL_CURRENT = 'https://api.srgssr.ch/forecasts/v1.0/weather/current';
// const API_URL_7_DAYS = 'https://api.srgssr.ch/forecasts/v1.0/weather/7day';
// const API_URL_24_HOURS = 'https://api.srgssr.ch/forecasts/v1.0/weather/24hour';
// const API_URL_THIS_HOUR =
//   'https://api.srgssr.ch/forecasts/v1.0/weather/nexthour';
// const API_URL_SEARCH_LOCATION =
//   'https://api3.geo.admin.ch/rest/services/api/SearchServer?type=locations&origins=zipcode,gg25,district,gazetteer&searchText=bern';

//lets try a singleton in javascript
class Api {
  constructor() {
    if (!Api.instance) {
      //maybe the token is already saved
      this.authToken = Store.getAuthToken();
    }

    return Api.instance;
  }

  async getCurrentForecast(latitude, longitude) {
    //if authToken undefined, then ask first for token
    if (!this._isTokenValid()) {
      this.authToken = await this._fetchAndStoreAuthToken();
    }
    const url = API_URL_CURRENT + Api._latLongQuery(latitude, longitude);
    const result = this._fetchForecast(url);
    if (result) {
      console.log(result);
    }

    return result;
  }

  async _fetchForecast(url) {
    const result = await fetch(url, {
      headers: {
        Authorization: 'Bearer ' + this.authToken,
      },
    })
      .then((response) => response.json())
      .catch((error) => console.log(error));

    if (result) {
      console.log(result);
    }

    return result;
  }

  static _latLongQuery(latitude, longitude) {
    return `?latitude=${latitude}&longitude=${longitude}`;
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
    const result = await fetch(API_URL_AUTH, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${ENCODED_KEY}`,
      },
    })
      .then((response) => response.json())
      .catch((error) => {
        throw new Error(
          'Something went wrong, during the authentification process. \n' +
            error
        );
      });

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
Object.freeze(instance);

export default instance;
