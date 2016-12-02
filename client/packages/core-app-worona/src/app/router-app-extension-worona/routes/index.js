/* eslint-disable react/prefer-stateless-function, react/no-multi-comp, react/prop-types */
/* eslint-disable prefer-template, react/prefer-es6-class, react/jsx-filename-extension */
import React from 'react';
import { dep } from 'worona-deps';
import { connect } from 'react-redux';
import { Route, IndexRoute } from 'react-router';
import CssLoader from '../components/CssLoader';
import * as deps from '../deps';

const mapStateToProps = state => ({
  themeName: deps.selectors.getThemeName(state),
});

class ThemeLoaderClass extends React.Component {
  render() {
    const Theme = dep('theme', 'components', 'Theme');
    return (
      <div id="root">
        <CssLoader />
        <Theme {...this.props} />
      </div>
    );
  }
}
const ThemeLoader = connect(mapStateToProps)(ThemeLoaderClass);

class Entry extends React.Component {
  render() {
    try {
      const Component = dep('theme', 'components', this.props.route.wrapped);
      return <Component {...this.props} />;
    } catch (error) {
      const Component = dep('theme', 'components', 'Home');
      return <Component {...this.props} />;
    }
  }
}

export const routes = () => (
  <Route path="/" component={ThemeLoader} >
    <IndexRoute component={Entry} wrapped="Home" />
    <Route path="*" component={Entry} wrapped="Home" />
  </Route>
);

export default routes;
