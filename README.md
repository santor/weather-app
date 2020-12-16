# Switzerland Weather

A weather forecast app example for Switzerland, with Vue.js 3 and Tailwind css.

Demo: [https://santor.github.io/weather-app/](https://santor.github.io/weather-app/)

## Setup

To be able to use the SRF Weather-API, first you have to register at https://developer.srgssr.ch/ and create an app with public api v2 SRG-SSR-PUBLIC-API-V2.

Rename the `.env.example` file to `.env` in the project root folder and copy your `CONSUMER_KEY` and `CONSUMER_SECRET` from the SRF API into it.

#### Install packages

```
yarn install
```

#### Compiles and hot-reloads for development

```
yarn serve
```

#### Compiles and minifies for production

```
yarn build
```

#### Run tests

```
yarn test
```

## Credits

- location search API from: [https://api3.geo.admin.ch/](https://api3.geo.admin.ch/)
- based on a [design](https://dribbble.com/shots/10979569-Card-weather) by Irina Krotkova
- weather icons from [https://github.com/erikflowers/weather-icons](https://github.com/erikflowers/weather-icons)
- mapping for the icons found at [https://github.com/baerengraben/iobroker.swiss-weather-api](https://github.com/baerengraben/iobroker.swiss-weather-api)
