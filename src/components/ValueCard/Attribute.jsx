import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import { Icon } from 'carbon-components-react';
import { iconCaretUp, iconCaretDown } from 'carbon-icons';

import { CARD_LAYOUTS } from '../../constants/LayoutConstants';

import ValueRenderer from './ValueRenderer';
import UnitRenderer from './UnitRenderer';

const StyledAttribute = styled.div`
  display: flex;
  align-items: flex-end;
  order: 1;
  width: 100%;
`;

const TrendIcon = styled(Icon)`
  margin-right: 0.25rem;
`;

const ThresholdIconWrapper = styled.div`
  width: 1rem;
  height: 1rem;
  margin: 0 0 0.5rem 0.5rem;
`;

const ThresholdIcon = styled(Icon)`
  ${props =>
    props.color &&
    `
    color: ${props.color};
    fill: ${props.color};
  `}
`;

const AttributeSecondaryValue = styled.div`
  height: 24px;
  display: flex;
  align-items: center;
  color: ${props => props.color || '#777'};
  fill: ${props => props.color || '#777'};
  font-size: 0.875rem;
  padding-left: 0.25rem;
`;

const propTypes = {
  value: PropTypes.any, // eslint-disable-line
  unit: PropTypes.any, // eslint-disable-line
  layout: PropTypes.oneOf(Object.values(CARD_LAYOUTS)),
  /** Additional information about the Attribute, like it's range or aggregator */
  secondaryValue: PropTypes.any, // eslint-disable-line
  /** need to render smaller attribute */
  isSmall: PropTypes.bool,
  isVertical: PropTypes.bool, // are the attributes and labels in a column?
  thresholds: PropTypes.arrayOf(
    PropTypes.shape({
      comparison: PropTypes.oneOf(['<', '>', '=', '<=', '>=']).isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      color: PropTypes.string,
      icon: PropTypes.string,
    })
  ),
  precision: PropTypes.number,
};

const defaultProps = {
  layout: null,
  precision: 0,
  thresholds: [],
  isVertical: false,
  isSmall: false,
};

const Attribute = ({
  value,
  unit,
  layout,
  secondaryValue,
  thresholds,
  precision,
  isVertical,
  isSmall,
}) => {
  // matching threshold will be the first match in the list, or a value of null
  const matchingThreshold = thresholds
    .filter(t => {
      switch (t.comparison) {
        case '<':
          return value < t.value;
        case '>':
          return value > t.value;
        case '=':
          return value === t.value;
        case '<=':
          return value <= t.value;
        case '>=':
          return value >= t.value;
        default:
          return false;
      }
    })
    .concat([null])[0];
  const valueColor =
    matchingThreshold && matchingThreshold.icon === undefined ? matchingThreshold.color : null;
  const thresholdIcon =
    matchingThreshold && matchingThreshold.icon ? (
      <ThresholdIconWrapper>
        <ThresholdIcon
          iconTitle={`${matchingThreshold.comparison} ${matchingThreshold.value}`}
          name={matchingThreshold.icon}
          color={matchingThreshold.color}
        />
      </ThresholdIconWrapper>
    ) : null;

  return (
    <StyledAttribute>
      {!isNil(value) ? (
        <ValueRenderer
          value={value}
          unit={unit}
          layout={layout}
          isSmall={isSmall}
          thresholds={thresholds}
          precision={precision}
          isVertical={isVertical}
          color={valueColor}
        />
      ) : (
        ' '
      )}
      <UnitRenderer value={value} unit={unit} layout={layout} />
      {thresholdIcon}
      {secondaryValue !== undefined ? (
        <AttributeSecondaryValue color={secondaryValue.color} trend={secondaryValue.trend}>
          {secondaryValue.trend && secondaryValue.trend === 'up' ? (
            <TrendIcon icon={iconCaretUp} />
          ) : secondaryValue.trend === 'down' ? (
            <TrendIcon icon={iconCaretDown} />
          ) : null}
          {secondaryValue.value}
        </AttributeSecondaryValue>
      ) : null}
    </StyledAttribute>
  );
};

Attribute.propTypes = propTypes;
Attribute.defaultProps = defaultProps;

export default Attribute;