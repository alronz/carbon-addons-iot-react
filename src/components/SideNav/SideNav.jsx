import {
  SideNavItems,
  SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
} from 'carbon-components-react//lib/components/UIShell';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import { COLORS } from '../../styles/styles';

import CarbonSideNav from './CarbonSideNav';

const StyledSideNav = styled(CarbonSideNav)`
  &&& {
    background-color: ${COLORS.darkGray};
    border-top: 1px solid #3c4646;
    height: calc(100% - 3rem);

    .bx--side-nav__menu[role='menu'] .bx--side-nav__link[role='menuitem'] {
      height: 2rem;
      min-height: 2rem;
      padding-left: 3.5rem;
    }

    .bx--side-nav__link {
      position: relative;
      display: flex;
      align-items: center;
      text-decoration: none;
      min-height: 3rem;
      padding-right: 1rem;
      font-weight: 400;
    }

    button {
      appearance: none;
      width: 100%;
      background: ${COLORS.darkGray};
    }

    button.bx--side-nav__link {
      border: none;
    }

    .bx--side-nav__link > .bx--side-nav__link-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #f3f3f3;
      font-size: 0.875rem;
      letter-spacing: 0.1px;
      line-height: 1.25rem;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    .bx--side-nav__link:focus {
      outline: 4px solid #0062ff;
      outline-offset: -4px;
    }
  }
`;
const StyledSideNavLink = styled(SideNavLink)`
  &&& {
    position: relative;
    display: flex;
    align-items: center;
    text-decoration: none;
    min-height: 3rem;
    padding-right: 1rem;
    font-weight: 400;

    :focus {
      outline: 4px solid #0062ff;
      outline-offset: -4px;
    }

    :hover {
      background-color: ${COLORS.darkGrayHover};
    }

    > .bx--side-nav__link-text {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #f3f3f3;
      font-size: 0.875rem;
      letter-spacing: 0.1px;
      line-height: 1.25rem;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    > .bx--side-nav__icon {
      margin-right: 0.5rem;
    }
  }
`;

const StyledSideNavMenu = styled(SideNavMenu)`
  &&& {
    background-color: ${COLORS.darkGray};

    :not(.bx--side-nav__item--active):hover {
      background-color: ${COLORS.darkGray};
    }

    > button:hover {
      background-color: ${COLORS.darkGrayHover};
    }

    .bx--side-nav__menu[role='menu']
      .bx--side-nav__link[role='menuitem']:not(.bx--side-nav__link--current):not([aria-current='page']):hover {
      background-color: ${COLORS.darkGrayHover};
    }

    :hover {
      background-color: ${COLORS.darkGrayHover};
    }
  }
`;

const propTypes = {
  /** Specify whether the side navigation is expanded or collapsed */
  defaultExpanded: PropTypes.bool,
  /** array of link item objects */
  links: PropTypes.arrayOf(
    PropTypes.shape({
      /** is current link active */
      current: PropTypes.bool,
      /** bot show/hide link */
      isEnabled: PropTypes.bool,
      /** extra props to pass to link component */
      /** Example:
          // What to render for link
          element: PropTypes.any,
          // trigger something instead of follow link
          onClick: PropTypes.func,
          // url to link to
          href: PropTypes.string,
      */
      metaData: PropTypes.object,
      /** the icon component to render */
      icon: PropTypes.any.isRequired,
      /** string for the title of overall submenu */
      linkContent: PropTypes.string,
      /** array of child links to render in a subnav */
      childContent: PropTypes.arrayOf(
        PropTypes.shape({
          /** props to pass to link component */
          /** Example:
            // What to render for link
            element: PropTypes.any,
            // trigger something instead of follow link
            onClick: PropTypes.func,
            // url to link to
            href: PropTypes.string,
          */
          metaData: PropTypes.object,
          /** content to render inside sub menu link */
          content: PropTypes.any.isRequired,
        })
      ),
    })
  ).isRequired,
};

const defaultProps = {
  defaultExpanded: false,
};

/**
 * Side Navigation. part of UI shell
 */
const SideNav = ({ links, defaultExpanded }) => {
  const nav = links.map(link => {
    const enabled = link.isEnabled ? link.isEnabled : false;
    if (!enabled) {
      return null;
    }
    if (link.hasOwnProperty('childContent')) {
      const children = link.childContent.map(childlink => (
        <SideNavMenuItem
          key={`menu-link-${link.childContent.indexOf(childlink)}-child`}
          {...childlink.metaData}>
          {childlink.content}
        </SideNavMenuItem>
      ));
      return (
        <StyledSideNavMenu
          className={classnames({ disabled: link.isEnabled })}
          icon={link.icon}
          aria-label="dropdown"
          key={`menu-link-${links.indexOf(link)}-dropdown`}
          title={link.linkContent}>
          {children}
        </StyledSideNavMenu>
      );
    }
    return (
      <StyledSideNavLink
        className={classnames({ disabled: link.isEnabled })}
        key={`menu-link-${link.metaData.label.replace(/\s/g, '')}-global`}
        aria-label={link.metaData.label}
        onClick={link.metaData.onClick}
        href={link.metaData.href}
        icon={link.icon}
        isActive={link.current}
        {...link.metaData}>
        {link.linkContent}
      </StyledSideNavLink>
    );
  });

  return (
    <StyledSideNav aria-label="Side navigation" defaultExpanded={defaultExpanded}>
      <SideNavItems>{nav}</SideNavItems>
    </StyledSideNav>
  );
};

SideNav.propTypes = propTypes;
SideNav.defaultProps = defaultProps;

export default SideNav;
