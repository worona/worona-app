/* eslint-disable no-undef */
import React from 'react';
import { Link as RouterLink } from 'react-router';

const Link = ({ to, children, ...rest }) => {
  const baseHref = /index\.html/.test(window.location.href)
    ? /(.+index\.html)/.exec(window.location.href)[1]
    : '';
  return <RouterLink to={`${baseHref}${to}`} {...rest}>{children}</RouterLink>;
};
Link.propTypes = {
  to: React.PropTypes.string.isRequired,
  children: React.PropTypes.node.isRequired,
};

export default Link;
