import {
  Header as CarbonHeader,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  SkipToContent,
  HeaderMenuItem,
} from 'carbon-components-react/lib/components/UIShell';
import { rem } from 'polished';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import React from 'react';

import { COLORS } from '../../styles/styles';

import HeaderMenu from './HeaderMenu';

const StyledHeader = styled(CarbonHeader)`
  &&& {
    background: ${COLORS.darkGray};
    position: fixed;
    top: 0;
    left: 0;

    .bx--header__menu {
      min-width: 12.5rem;
      width: auto;
    }

    .bx--header__menu .bx--header__menu-item[role='menuitem']:hover,
    .bx--header__menu .bx--header__menu-item[role='menuitem']:focus {
      background: ${COLORS.darkGray};
    }

    .bx--header__menu.bx--header__menu-item[role='menuitem']:hover,
    a.bx--header__menu-item[role='menuitem']:active {
      background: ${COLORS.darkGrayHover};
    }

    .bx--header__menu-item[role='menuitem']:focus {
      border-color: #0062ff;
      outline: none;
    }
  }
`;
const StyledGlobalAction = styled(HeaderGlobalAction)`
  &&& {
    align-items: center;
    display: flex;
    justify-content: center;
    min-width: 3rem;
    padding: 0 ${rem(15)};
    position: relative;
    width: auto;
    :hover {
      background-color: ${COLORS.darkGrayHover};
    }
    span {
      display: flex;
    }
  }
`;

const propTypes = {
  /** Add a prefix other than IBM */
  prefix: PropTypes.string,
  /** Name to follow the IBM prefix up top, left */
  appName: PropTypes.string.isRequired,
  /** Add a class name to Header */
  className: PropTypes.string,
  /** Object of action items */
  actionItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      btnContent: PropTypes.any.isRequired,
      childContent: PropTypes.arrayOf(
        PropTypes.shape({
          /** extra data to pass to HeaderMenuLink (aria-*, href, target, etc.) */
          metaData: PropTypes.object,
          /** Optionally pass in an onClick handler to trigger action  */
          onClick: PropTypes.func,
          content: PropTypes.any.isRequired,
        })
      ),
    })
  ).isRequired,
};

const defaultProps = {
  prefix: 'IBM',
  className: 'main-header',
};

/**
 * Clickable card that shows "Add" button
 */
const Header = ({ appName, className, actionItems, prefix }) => {
  const actionBtnContent = actionItems.map(item => {
    if (item.hasOwnProperty('childContent')) {
      const children = item.childContent.map(childItem => (
        <HeaderMenuItem
          key={`menu-item-${item.label + item.childContent.indexOf(childItem)}-child`}
          {...childItem.metaData}>
          {childItem.content}
        </HeaderMenuItem>
      ));
      return (
        <HeaderMenu
          key={`menu-item-${item.label}`}
          aria-label={item.label}
          isMenu={false}
          renderMenuContent={() => item.btnContent}>
          {children}
        </HeaderMenu>
      );
    }
    return (
      <StyledGlobalAction
        key={`menu-item-${item.label}-global`}
        aria-label={item.label}
        onClick={item.onClick}>
        {item.btnContent}
      </StyledGlobalAction>
    );
  });

  return (
    <StyledHeader className={className} aria-label="main header">
      <SkipToContent />
      <HeaderName href="#" prefix={prefix}>
        {appName}
      </HeaderName>
      <HeaderGlobalBar>{actionBtnContent}</HeaderGlobalBar>
    </StyledHeader>
  );
};

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
