const AUTH_KEY = 'auth_key';
const AUTH_ISSUED_AT = 'auth_issued_at';
const AUTH_EXPIRES_IN = 'auth_expires_in';
const CURR_LOCATION = 'curr_location';
const CURR_LATITUDE = 'curr_lat';
const CURR_LONGITUDE = 'curr_lon';
const DEFAULT_LOCATION = 'Bern';
const DEFAULT_LATITUDE = 46.954559326171875;
const DEFAULT_LONGITUDE = 7.420684814453125;

export default class LocalStorage {
  /**
   * @returns {string | false} The auth token or null if it's not found
   */
  static getAuthToken = () => LocalStorage._loadValue(AUTH_KEY);
  static getAuthIssuedAt = () => LocalStorage._loadValue(AUTH_ISSUED_AT);
  static getAuthExpiresIn = () => LocalStorage._loadValue(AUTH_EXPIRES_IN);

  static getLastLocation = () =>
    LocalStorage._loadValue(CURR_LOCATION)
      ? LocalStorage._loadValue(CURR_LOCATION)
      : DEFAULT_LOCATION;
  static getLatitude = () =>
    LocalStorage._loadValue(CURR_LATITUDE)
      ? LocalStorage._loadValue(CURR_LATITUDE)
      : DEFAULT_LATITUDE;
  static getLongitude = () =>
    LocalStorage._loadValue(CURR_LONGITUDE)
      ? LocalStorage._loadValue(CURR_LONGITUDE)
      : DEFAULT_LONGITUDE;

  static saveAuthToken(accessToken, issuedAtSec, expiresInSec) {
    LocalStorage._saveValue(AUTH_KEY, accessToken);
    LocalStorage._saveValue(AUTH_ISSUED_AT, issuedAtSec);
    LocalStorage._saveValue(AUTH_EXPIRES_IN, expiresInSec);
  }

  static saveCurrentLocation(location) {
    LocalStorage._saveValue(CURR_LOCATION, location);
  }

  static saveCurrentCoordinates(lat, lon) {
    LocalStorage._saveValue(CURR_LATITUDE, lat);
    LocalStorage._saveValue(CURR_LONGITUDE, lon);
  }

  static _saveValue(key, value) {
    localStorage.setItem(key, value);
  }

  /**
   * Get value from the local store
   * @param {string} key Key in the local storage
   * @returns {string | null} The stored string value or null
   */
  static _loadValue(key) {
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
