const AUTH_KEY = 'auth_key';
const AUTH_ISSUED_AT = 'auth_issued_at';
const AUTH_EXPIRES_IN = 'auth_expires_in';
const CURR_LOCATION = 'curr_location';
const CURR_LATITUDE = 'curr_lat';
const CURR_LONGITUDE = 'curr_lon';
const DEFAULT_LOCATION = 'Bern';
const DEFAULT_LATITUDE = 46.954559326171875;
const DEFAULT_LONGITUDE = 7.420684814453125;

export default class Store {
  /**
   * @returns {string | false} The auth token or null if it's not found
   */
  static getAuthToken = () => Store._checkValue(AUTH_KEY);
  static getAuthIssuedAt = () => Store._checkValue(AUTH_ISSUED_AT);
  static getAuthExpiresIn = () => Store._checkValue(AUTH_EXPIRES_IN);

  static getLastLocation = () =>
    Store._checkValue(CURR_LOCATION)
      ? Store._checkValue(CURR_LOCATION)
      : DEFAULT_LOCATION;
  static getLatitude = () =>
    Store._checkValue(CURR_LATITUDE)
      ? Store._checkValue(CURR_LATITUDE)
      : DEFAULT_LATITUDE;
  static getLongitude = () =>
    Store._checkValue(CURR_LONGITUDE)
      ? Store._checkValue(CURR_LONGITUDE)
      : DEFAULT_LONGITUDE;

  static saveAuthToken(accessToken, issuedAtSec, expiresInSec) {
    Store._saveValue(AUTH_KEY, accessToken);
    Store._saveValue(AUTH_ISSUED_AT, issuedAtSec);
    Store._saveValue(AUTH_EXPIRES_IN, expiresInSec);
  }

  static saveCurrentLocation(location) {
    Store._saveValue(CURR_LOCATION, location);
  }

  static saveCurrentCoordinates(lat, lon) {
    Store._saveValue(CURR_LATITUDE, lat);
    Store._saveValue(CURR_LONGITUDE, lon);
  }

  static _saveValue(key, value) {
    localStorage.setItem(key, value);
  }

  /**
   * Get value from the local store
   * @param {string} key Key in the local storage
   * @returns {string | null} The stored string value or null
   */
  static _checkValue(key) {
    if (localStorage.getItem(key)) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        localStorage.removeItem(key);
      }
    }
    return null;
  }
}
