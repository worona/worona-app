/* eslint-disable no-undef, no-console, no-underscore-dangle, no-alert */
import 'babel-polyfill';

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

const checkForConnection = async () => {
  console.log('=> Checking for internet connection.');
  let connected = navigator.connection.type !== Connection.NONE;
  while (!connected) {
    console.log('=> Not connected. Trying again.');
    await delay(5000);
    connected = navigator.connection.type !== Connection.NONE;
  }
  console.log('=> Connected.');
};

const onDeviceReady = () => {
  console.log('Getting siteId...');
  AppSettings.get(
    async values => {
      // Add siteId to window.
      window.__woronaSiteId__ = values.siteid;
      console.log(`The siteId is: ${window.__woronaSiteId__}`);

      await checkForConnection();

      if (!app.checkForConnection()) screens.errors.noConnection();
      launch();
      checkForUpdate();
    },
    error => {
      alert(`Fatal error: Error getting the site id -> ${JSON.stringify(error)}`);
      return;
    },
    ['siteid']
  );
};

document.addEventListener('deviceready', onDeviceReady);
