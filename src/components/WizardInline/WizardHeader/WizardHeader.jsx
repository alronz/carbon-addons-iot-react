import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ProgressIndicator from '../../ProgressIndicator/ProgressIndicator';

const StyledDivWizardHeader = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin-bottom: 1.5rem;

  .bx--progress {
    padding: 1rem 1rem;
  }

  .bx--modal-header {
    display: flex;
    margin-bottom: 0.5rem;
    overflow-x: auto;
    overflow-y: hidden;
  }
`;

const StyledDivHeading = styled.div`
  min-width: 200px;
  padding-right: 3rem;
`;

class WizardHeader extends Component {
  static propTypes = {
    /** Title in the header  */
    title: PropTypes.string.isRequired,
    blurb: PropTypes.string,
    currentItemId: PropTypes.string.isRequired,
    setItem: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        component: PropTypes.element.isRequired,
      })
    ).isRequired,
    showLabels: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    stepWidth: PropTypes.number,
  };

  static defaultProps = {
    blurb: null,
    showLabels: true,
    stepWidth: 136,
  };

  state = {};

  render = () => {
    const {
      title,
      blurb,
      currentItemId,
      setItem,
      items,
      showLabels,
      onClose,
      stepWidth,
      className,
    } = this.props;

    return (
      <StyledDivWizardHeader className={className}>
        <div className="bx--modal-header">
          <StyledDivHeading>
            <p className="bx--modal-header__heading bx--type-beta">{title}</p>
          </StyledDivHeading>
          <ProgressIndicator
            currentItemId={currentItemId}
            items={items.map(item => ({ id: item.id, label: item.name }))}
            showLabels={showLabels}
            onClickItem={setItem}
            stepWidth={stepWidth}
          />

          <button
            className="bx--modal-close"
            type="button"
            data-modal-close
            aria-label="close modal"
            onClick={onClose}>
            <svg
              className="bx--modal-close__icon"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              xmlns="http://www.w3.org/2000/svg">
              <title>Close</title>
              <path
                d="M6.32 5L10 8.68 8.68 10 5 6.32 1.32 10 0 8.68 3.68 5 0 1.32 1.32 0 5 3.68 8.68 0 10 1.32 6.32 5z"
                fillRule="nonzero"
              />
            </svg>
          </button>
        </div>
        {blurb ? <div>{blurb}</div> : null}
      </StyledDivWizardHeader>
    );
  };
}

export default WizardHeader;
