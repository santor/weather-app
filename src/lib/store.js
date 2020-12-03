const AUTH_KEY = 'auth_key';
const AUTH_ISSUED_AT = 'auth_issued_at';
const AUTH_EXPIRES_IN = 'auth_expires_in';

export default class Store {
  /**
   * @returns {string | false} The auth token or null if it's not found
   */
  static getAuthToken = () => Store._checkValue(AUTH_KEY);
  static getAuthIssuedAt = () => Store._checkValue(AUTH_ISSUED_AT);
  static getAuthExpiresIn = () => Store._checkValue(AUTH_EXPIRES_IN);

  static saveAuthToken(accessToken, issuedAtSec, expiresInSec) {
    Store._saveValue(Store.AUTH_KEY, accessToken);
    Store._saveValue(Store.AUTH_ISSUED_AT, issuedAtSec);
    Store._saveValue(Store.AUTH_EXPIRES_IN, expiresInSec);
  }

  static _saveValue(key, value) {
    localStorage.setItem(key, value);
  }

  /**
   * Get value from the local store
   * @param {string} key Key in the local storage
   * @returns {string | null} The string value stored or null
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
