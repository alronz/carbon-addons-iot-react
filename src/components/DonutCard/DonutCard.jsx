import React from 'react';
import { DonutChart } from '@carbon/charts-react';
// TODO: waiting for @carbon/charts support https://github.com/carbon-design-system/carbon-charts/pull/389
import '@carbon/charts/dist/styles.css';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import withSize from 'react-sizeme';

import { CardPropTypes, DonutCardPropTypes } from '../../constants/PropTypes';
import { CARD_SIZES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';

const DonutChartWrapper = styled.div`
  padding-left: 16px;
  padding-right: 1rem;
  padding-top: ${props => (props.isLegendHidden ? '16px' : '0px')};
  padding-bottom: ${props => (!props.size === CARD_SIZES.MEDIUM ? '16px' : '0px')};
  position: absolute;
  width: 100%;
  height: ${props => props.contentHeight};

  &&& {
    .chart-wrapper g.x.axis g.tick text {
      transform: rotateY(0);
      text-anchor: initial !important;
    }
    .expand-btn {
      display: ${props => (props.isEditable ? 'none' : '')};
    }
    .legend-wrapper {
      display: ${props => (props.isLegendHidden ? 'none' : '')};
      height: ${props => (!props.size === CARD_SIZES.MEDIUM ? '40px' : '20px')} !important;
      margin-top: -10px;
      padding-right: 20px;
    }
    .chart-holder {
      width: 100%;
      height: 100%;
    }
    .chart-svg {
      width: 100%;
      height: 100%;
      margin-top: ${props => (props.isLegendHidden ? '-10px' : '')};
      circle.dot {
        stroke-opacity: ${props => (props.isEditable ? '1' : '')};
      }
    }
    .chart-tooltip {
      display: ${props => (props.isEditable ? 'none' : '')};
    }
  }
`;

const determineHeight = (size, measuredWidth) => {
  let height = '100%';
  switch (size) {
    case CARD_SIZES.MEDIUM:
    case CARD_SIZES.LARGE:
      if (measuredWidth && measuredWidth > 635) {
        height = '90%';
      }
      break;
    case CARD_SIZES.XLARGE:
      height = '90%';
      break;
    default:
      break;
  }
  return height;
};

const DonutChartCard = ({
                          title,
                          content: { accessibility },
                          size,
                          interval,
                          isEditable,
                          values: chartData,
                          locale,
                          ...others
                        }) => {
  return (
    <withSize.SizeMe>
      {({ size: measuredSize }) => {
        const height = determineHeight(size, measuredSize.width);
        return (
          <Card
            title={title}
            size={size}
            {...others}
            isEditable={isEditable}
            isEmpty={isEmpty(Object.keys(chartData))}
          >
            {!others.isLoading && !isEmpty(Object.keys(chartData)) ? (
              <DonutChartWrapper
                size={size}
                contentHeight={height}
                isLegendHidden={Object.keys(chartData).length === 1}
                isEditable={isEditable}
              >
                <DonutChart
                  data={chartData}
                  options={{
                    animations: false,
                    accessibility: accessibility || false,
                    legendClickable: !isEditable,
                    containerResizable: true,
                  }}
                  width="100%"
                  height="100%"
                />
              </DonutChartWrapper>
            ) : null}
          </Card>
        );
      }}
    </withSize.SizeMe>
  );
};

DonutChartCard.propTypes = { ...CardPropTypes, ...DonutCardPropTypes };

DonutChartCard.defaultProps = {
  size: CARD_SIZES.MEDIUM,
  values: {},
};

export default DonutChartCard;
