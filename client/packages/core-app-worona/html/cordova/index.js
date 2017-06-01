/* eslint-disable no-undef, no-console, no-underscore-dangle, no-alert, no-constant-condition */
import 'babel-polyfill';

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));

const checkForConnection = async () => {
  while (navigator.connection.type === Connection.NONE) {
    console.log('=> Not connected. Trying again in 2 secs.');
    document.getElementById('container').style.display = 'block';
    await delay(2000);
  }
  document.getElementById('container').style.display = 'none';
};

const launchError = () => {
  navigator.notification.alert(
    'Something went wrong. Please reload your app or contact support@worona.org',
    () => {},
    "The app couldn't load",
    'Ok'
  );
};

const launch = () => {
  const vendors = document.createElement('script');
  const core = document.createElement('script');
  vendors.setAttribute(
    'src',
    `${htmlWebpackPlugin.options.publicPath}${htmlWebpackPlugin.options.vendorsFile}`
  );
  document.body.appendChild(vendors);
  console.log('=> Loading vendors.');
  window.htmlWebpackPlugin.files.chunks.forEach(chunk => {
    core.setAttribute('src', htmlWebpackPlugin.files.chunks[chunk].entry);
  });
  vendors.onload = () => {
    console.log('=> Vendors loaded. Loading core.');
    document.body.appendChild(core);
  };
  core.onload = () => {
    console.log('=> Core loaded.');
  };
  vendors.onerror = launchError;
  core.onerror = launchError;
};

const checkForUpdatePromise = new Promise((resolve, reject) => {
  chcp.fetchUpdate(
    error => {
      if (error) {
        if (error.code === chcp.error.NOTHING_TO_UPDATE) {
          resolve(false);
        } else {
          reject(error.code);
        }
      } else {
        resolve(true);
      }
    },
    {
      'config-file': `https://${htmlWebpackPlugin.options.cdn}.worona.io/api/v1/chcp/site/${window.__woronaSiteId__}/chcp.json`,
    }
  );
});

const checkForUpdate = async () => {
  while (true) {
    try {
      return await checkForUpdatePromise();
    } catch (error) {
      console.log(`Failed to load the update with error code: ${error.code}`);
      console.log(error.description);
      await delay(500);
    }
  }
};

const installUpdatePromise = () =>
  new Promise((resolve, reject) => {
    chcp.installUpdate(error => {
      if (error) {
        if (error.code === chcp.error.NOTHING_TO_INSTALL) {
          resolve(false);
        } else {
          reject(error);
        }
      } else {
        resolve(true);
      }
    });
  });

const installUpdate = async () => {
  while (true) {
    try {
      return await installUpdatePromise();
    } catch (error) {
      console.log(`Failed to install the update with error code: ${error.code}`);
      console.log(error.description);
      await delay(500);
    }
  }
};

const onDeviceReady = () => {
  console.log('=> Getting siteId...');
  AppSettings.get(
    async values => {
      // Add siteId to window.
      window.__woronaSiteId__ = values.siteid;
      console.log(`=> The siteId is: ${window.__woronaSiteId__}`);

      console.log('=> Checking for internet connection.');
      await checkForConnection();
      console.log('=> Connected.');

      console.log('=> Launching app.');
      launch();

      console.log('=> Checking for update.');
      const isUpdate = await checkForUpdate();

      if (isUpdate) {
        console.log('=> There is an update. Trying to install it.');
        const installedUpdate = await installUpdate();
        if (installedUpdate) {
          console.log('=> Update installed.');
        } else {
          console.log('=> Nothing to install');
        }
      } else {
        console.log('=> Nothing to update');
      }
    },
    error => {
      alert(`=> Fatal error: Error getting the site id -> ${JSON.stringify(error)}`);
      return;
    },
    ['siteid']
  );
};

document.addEventListener('deviceready', onDeviceReady);
