/* eslint-disable react/prefer-stateless-function, react/no-multi-comp, react/prop-types
eslint-disable prefer-template, react/prefer-es6-class, react/jsx-filename-extension, camelcase,
react/no-unused-prop-types */
import React from 'react';
import { dep } from 'worona-deps';
import { connect } from 'react-redux';
import { Route, IndexRoute } from 'react-router';
import CssLoader from '../components/CssLoader';
import * as selectors from '../selectors';
import * as deps from '../deps';

const mapStateToProps = state => ({ themeName: deps.selectors.getThemeName(state) });

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

class EntryClass extends React.Component {
  render() {
    try {
      const Component = dep('theme', 'components', this.props.component);
      return <Component {...this.props} />;
    } catch (error) {
      const Component = dep('theme', 'components', 'Home');
      return <Component {...this.props} />;
    }
  }
}
EntryClass.propTypes = { component: React.PropTypes.string };
const Entry = connect(mapStateToProps)(EntryClass);

const ContentClass = ({ query }) => {
  let component = 'Home';
  if (query.p)
    component = 'Post';
  else if (query.cat)
    component = 'Category';
  else if (query.tag)
    component = 'Tag';
  else if (query.author)
    component = 'Author';
  else if (query.y || query.m)
    component = 'Archive';
  else if (query.page_id)
    component = 'Page';
  else if (query.s)
    component = 'Search';
  else if (query.attachment_id)
    component = 'Attachment';

  return <Entry component={component} />;
}
ContentClass.propTypes = {
  query: React.PropTypes.shape({
    p: React.PropTypes.string,
    cat: React.PropTypes.string,
    tag: React.PropTypes.string,
    author: React.PropTypes.string,
    y: React.PropTypes.string,
    m: React.PropTypes.string,
    page_id: React.PropTypes.string,
    s: React.PropTypes.string,
    attachment_id: React.PropTypes.string,
  }),
};
const mapStateToContentProps = state => ({
  query: selectors.getURLQueries(state),
});
const Content = connect(mapStateToContentProps)(ContentClass);

export const routes = () => (
  <Route path="/" component={ThemeLoader}>
    <IndexRoute component={Content} />
    <Route path="*" component={Content} />
  </Route>
);

export default routes;
