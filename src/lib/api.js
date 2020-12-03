import Store from './store.js';

const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const ENCODED_KEY = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`); // encoded key works
const EXPIRE_THRESHOLD = 20; //make expire 20 seconds earlier

const API_URL_AUTH =
  'https://api.srgssr.ch/oauth/v1/accesstoken?grant_type=client_credentials';
const API_URL_CURRENT =
  'https://api.srgssr.ch/forecasts/v1.0/weather/current?latitude=46.954559326171875&longitude=7.420684814453125';
// const API_URL_7_DAYS =
//   'https://api.srgssr.ch/forecasts/v1.0/weather/7day?latitude=46.954559326171875&longitude=7.420684814453125';
// const API_URL_24_HOURS =
//   'https://api.srgssr.ch/forecasts/v1.0/weather/24hour?latitude=46.954559326171875&longitude=7.420684814453125';
// const API_URL_THIS_HOUR =
//   'https://api.srgssr.ch/forecasts/v1.0/weather/nexthour?latitude=46.954559326171875&longitude=7.420684814453125';
// const API_URL_SEARCH_LOCATION =
//   'https://api3.geo.admin.ch/rest/services/api/SearchServer?searchText=bern&type=locations&origins=zipcode,gg25,district,gazetteer';

// class AccesToken {
//   constructor(token, issuedAt, expiresIn) {
//     this.token = token;
//     this.issuedAt = issuedAt;
//     this.expiresIn = expiresIn;
//   }
// }
//lets try a singleton in javascript
class Api {
  constructor() {
    if (!Api.instance) {
      //maybe the token is already saved
      this.authToken = Store.getAuthToken();
    }

    return Api.instance;
  }

  async getForecast() {
    //if authToken undefined, then ask first for token
    if (!this._isTokenValid()) {
      this.authToken = await this._fetchAndStoreAuthToken();
    }
    fetch(API_URL_CURRENT)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
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
      .catch((error) => console.log(error));

    if (result) {
      const { access_token, issued_at, expires_in } = result;
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
