import React, { Fragment } from 'react';
import {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
} from 'carbon-components-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Bee32 from '@carbon/icons-react/lib/bee/32';

const StructuredListWrapperStyled = styled(StructuredListWrapper)`
   {
    background-color: #ffffff;
    margin-bottom: 0;
    ${props => (props.isfixedwidth ? 'width: inherit;' : '')}

    .bx--structured-list-th {
      padding-left: 16px;
    }

    .bx--structured-list-td {
      padding-left: 16px;
      line-height: 8px;
    }
  }
`;

const EmptyDiv = styled.div`
   {
    background-color: #ffffff;
    text-align: center;
    color: #5a6872;
    font-size: 14px;
    padding-top: 90px;
    padding-bottom: 115px;
    font-weight: regular;
  }
`;

const LoadingDiv = styled.div`
   {
    padding-top: 16px;
  }
`;

const StyledStructuredListCell = styled(StructuredListCell)`
  &&& {
    ${props => {
      const { width } = props;
      return width !== undefined
        ? `
        min-width: ${width};
        max-width: ${width};
        white-space: nowrap;
        overflow-x: hidden;
        text-overflow: ellipsis;
      `
        : '';
    }}
  }
`;

/**
 * Carbon Structured List simple with custom design and onClick
 */
const StructuredList = ({ columns, data, design, isFixedWidth, onRowClick, loadingDataLabel }) => (
  <Fragment>
    <StructuredListWrapperStyled selection isfixedwidth={isFixedWidth}>
      <StructuredListHead>
        <StructuredListRow head>
          {columns.map(({ id, title, width = undefined }) => (
            <StyledStructuredListCell key={`${id}-column`} width={width} head>
              {title}
            </StyledStructuredListCell>
          ))}
        </StructuredListRow>
      </StructuredListHead>
      <StructuredListBody>
        {data.map(item => (
          <StructuredListRow key={`${item.id}-row`} onClick={() => onRowClick(item.id)}>
            {columns.map(col => (
              <StyledStructuredListCell
                key={`${col.id}-item`}
                noWrap
                width={col.width}
                style={design === 'normal' ? { lineHeight: '16px' } : {}}>
                {item.values[col.id]}
              </StyledStructuredListCell>
            ))}
          </StructuredListRow>
        ))}
      </StructuredListBody>
    </StructuredListWrapperStyled>
    {!data.length ? (
      <EmptyDiv>
        <Bee32 width={100} height={100} fill="#5a6872" />
        <LoadingDiv>{loadingDataLabel}</LoadingDiv>
      </EmptyDiv>
    ) : (
      undefined
    )}
  </Fragment>
);

StructuredList.propTypes = {
  /** Component row height */
  design: PropTypes.oneOf(['normal', 'mini']),
  /** Array of columns - header */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      width: PropTypes.string,
    })
  ).isRequired,
  /** Array of data - table content */
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      values: PropTypes.shape(PropTypes.string.isRequired).isRequired,
    })
  ).isRequired,
  /** If true, list will not take 100% of width */
  isFixedWidth: PropTypes.bool,
  /** Callback for when row is clicked */
  onRowClick: PropTypes.func.isRequired,
  /** Text label for loading data */
  loadingDataLabel: PropTypes.string,
};

StructuredList.defaultProps = {
  design: 'mini',
  isFixedWidth: false,
  loadingDataLabel: '',
};

export default StructuredList;
