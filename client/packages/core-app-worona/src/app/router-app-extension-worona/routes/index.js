/* eslint-disable react/prefer-stateless-function, react/no-multi-comp, react/prop-types
eslint-disable prefer-template, react/prefer-es6-class, react/jsx-filename-extension, camelcase */
import React from 'react';
import { dep } from 'worona-deps';
import { connect } from 'react-redux';
import { Route, IndexRoute } from 'react-router';
import CssLoader from '../components/CssLoader';
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

class Entry extends React.Component {
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
Entry.propTypes = { component: React.PropTypes.string };

class Content extends React.Component {
  constructor() {
    super();
    this.state = { component: 'Home' };
  }

  componentWillMount() {
    const { p, cat, tag, author, y, m, page_id, s, attachment_id } = this.props.location.query;
    if (p)
      this.setState({ component: 'Post' });
    else if (cat)
      this.setState({ component: 'Category' });
    else if (tag)
      this.setState({ component: 'Tag' });
    else if (author)
      this.setState({ component: 'Author' });
    else if (y || m)
      this.setState({ component: 'Archive' });
    else if (page_id)
      this.setState({ component: 'Page' });
    else if (s)
      this.setState({ component: 'Search' });
    else if (attachment_id)
      this.setState({ component: 'Attachment' });
    else
      this.setState({ component: 'Home' });
  }

  render() {
    return <Entry component={this.state.component} />;
  }
}
Content.propTypes = {
  location: React.PropTypes.shape({
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
  }),
};

export const routes = () => (
  <Route path="/" component={ThemeLoader}>
    <IndexRoute component={Content} />
    <Route path="*" component={Content} />
  </Route>
);

// export const routes = () => (
//   <Route path="/" component={ThemeLoader}>
//     <IndexRoute component={Entry} wrapped="Home" />
//     <Route path="category/:category1" component={Entry} wrapped="Category" />
//     <Route
//       path="category/:category1(/:category2)(/:category3)(/:category4)"
//       component={Entry}
//       wrapped="Category"
//     />
//     <Route path="tag/:tag" component={Entry} wrapped="Tag" />
//     <Route path="author/:author" component={Entry} wrapped="Author" />
//     <Route path=":content1" component={Content} />
//     <Route path="*" component={Entry} wrapped="Home" />
//   </Route>
// );
export default routes;
