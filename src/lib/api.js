import Store from './store.js';

const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
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
      throw Error(response.statusText);
    }
    return response;
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

  async getCurrentForecast(latitude, longitude) {
    console.log(latitude, longitude);
    // //if authToken undefined, then ask first for token
    // if (!latitude || !longitude) {
    //   latitude = Store.getLatitude();
    //   longitude = Store.getLongitude();
    // }
    // if (!this._isTokenValid()) {
    //   this.authToken = await this._fetchAndStoreAuthToken();
    // }
    // const url = API_URL_CURRENT + Api._latLongQuery(latitude, longitude);
    // return this._fetchForecast(url); //not helping to await
    return {
      current_hour: [
        {
          date: '2020-12-02T22:00:00+0100',
          values: [
            {
              smb3: '-3',
            },
            {
              ttt: '0.0',
            },
            {
              fff: '4',
            },
            {
              ffx3: '13',
            },
            {
              ddd: '75',
            },
            {
              rr3: '0.0',
            },
            {
              pr3: '10',
            },
          ],
        },
      ],
      info: {
        id: 3073,
        name: {
          de: 'Gümligen',
        },
        plz: 3073,
      },
    };
  }

  async _fetchForecast(url) {
    return await fetch(url, {
      headers: {
        Authorization: 'Bearer ' + this.authToken,
      },
    })
      .then(this._handleErrors)
      .then((response) => response.json());

    // .catch((error) => console.log('Fetch forecast error: ' + error));
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
      .then(this._handleErrors)
      .then((response) => response.json());
    // .catch((error) => {
    //   throw new Error(
    //     'Something went wrong, during the authentification process. \n' +
    //       error
    //   );
    // });

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
