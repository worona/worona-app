import React from 'react';
import { connect } from 'react-redux';
import * as deps from '../../deps';

class LinkCssClass extends React.Component {
  componentDidMount() {
    this.linkElement.addEventListener('load', this.props.assetsFileDownloaded);
    this.linkElement.addEventListener('error', this.props.assetsFileDontDownloaded);
  }
  render() {
    return (
      <link
        rel="stylesheet"
        ref={linkElement => {
          this.linkElement = linkElement;
        }}
        type="text/css"
        href={`${this.props.cdn}${this.props.path}`}
      />
    );
  }
}
LinkCssClass.propTypes = {
  cdn: React.PropTypes.string.isRequired,
  path: React.PropTypes.string.isRequired,
  assetsFileDownloaded: React.PropTypes.func.isRequired,
  assetsFileDontDownloaded: React.PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, { path, pkgName }) => ({
  assetsFileDownloaded: () =>
    dispatch(deps.actions.packageAssetFileDownloaded({ path, pkgName, assetType: 'css' })),
  assetsFileDontDownloaded: error =>
    dispatch(
      deps.actions.packageAssetFileDontDownloaded({ path, pkgName, assetType: 'css', error }),
    ),
});

const LinkCss = connect(null, mapDispatchToProps)(LinkCssClass);

const CssLoader = ({ cssAssets }) => (
  <div>
    {cssAssets.map(asset => (
      <LinkCss
        pkgName={asset.pkgName}
        cdn="https://cdn.worona.io/packages/"
        path={asset.path}
        key={asset.path}
      />
    ))}
  </div>
);

CssLoader.propTypes = {
  cssAssets: React.PropTypes.arrayOf(
    React.PropTypes.shape({ path: React.PropTypes.string, pkgName: React.PropTypes.string }),
  ).isRequired,
};

export const mapStateToProps = state => ({ cssAssets: deps.selectors.getCssAssets(state) });

export default connect(mapStateToProps)(CssLoader);
