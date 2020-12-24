import LocalStore from '@/lib/local_storage';

describe('local_store.js', () => {
  test('saves and loads auth token', () => {
    const token = '234';
    const issuedAt = 345;
    const expiresIn = 20;
    LocalStore.saveAuthToken(token, issuedAt, expiresIn);

    expect(LocalStore.getAuthToken()).toBe(token);
    expect(LocalStore.getAuthIssuedAt()).toEqual(issuedAt.toString());
    expect(LocalStore.getAuthExpiresIn()).toEqual(expiresIn.toString());
  });

  test('saves and loads location', () => {
    const location = 'Zürich';
    LocalStore.saveCurrentLocation(location);

    expect(LocalStore.getLastLocation()).toBe(location);
  });

  test('saves/loads latitude and longitude', () => {
    const latitude = 47.37721252441406;
    const longitude = 8.527311325073242;
    LocalStore.saveCurrentCoordinates(latitude, longitude);

    expect(LocalStore.getLatitude()).toBe(latitude.toString());
    expect(LocalStore.getLongitude()).toBe(longitude.toString());
  });
});
