/* eslint-disable react/prefer-stateless-function, camelcase, no-undef, import/imports-first */
import 'worona-polyfills';
import React from 'react';
import ReactDOM from 'react-dom';

__webpack_public_path__ = window.publicPath;

class App extends React.Component {
  render() {
    return (
      <div>
        App is working!
      </div>
    );
  }
}

startSaga('build', sagas);

if ('ontouchstart' in window) {
  window.addEventListener('load', () => FastClick.attach(document.body));
}

ReactDOM.render(<App />, document.getElementById('root'));
