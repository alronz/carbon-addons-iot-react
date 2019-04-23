import React from 'react';
// import PropTypes from 'prop-types';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, text, number } from '@storybook/addon-knobs';
import styled from 'styled-components';

import { getSortedData } from '../../utils/componentUtilityFunctions';

import Table from './Table';
import StatefulTable from './StatefulTable';
import AsyncTable from './AsyncTable/AsyncTable';
import MockApiClient from './AsyncTable/MockApiClient';

const selectData = [
  {
    id: 'option-A',
    text: 'option-A',
  },
  {
    id: 'option-B',
    text: 'option-B',
  },
  {
    id: 'option-C',
    text: 'option-C',
  },
];

const STATUS = {
  RUNNING: 'RUNNING',
  NOT_RUNNING: 'NOT_RUNNING',
  BROKEN: 'BROKEN',
};

const renderStatusIcon = ({ value: status }) => {
  switch (status) {
    case STATUS.RUNNING:
    default:
      return (
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="3" stroke="none" strokeWidth="1" fill="green" />
        </svg>
      );
    case STATUS.NOT_RUNNING:
      return (
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="3" stroke="none" strokeWidth="1" fill="gray" />
        </svg>
      );
    case STATUS.BROKEN:
      return (
        <svg height="10" width="10">
          <circle cx="5" cy="5" r="3" stroke="none" strokeWidth="1" fill="red" />
        </svg>
      );
  }
};
export const tableColumns = [
  {
    id: 'string',
    name: 'String',
    filter: { placeholderText: 'pick a string' },
  },
  {
    id: 'date',
    name: 'Date',
    filter: { placeholderText: 'pick a date' },
  },
  {
    id: 'select',
    name: 'Select',
    filter: { placeholderText: 'pick an option', options: selectData },
  },
  {
    id: 'secretField',
    name: 'Secret Information',
  },
  {
    id: 'status',
    name: 'Status',
    renderDataFunction: renderStatusIcon,
  },
  {
    id: 'number',
    name: 'Number',
    filter: { placeholderText: 'pick a number' },
  },
];

const defaultOrdering = tableColumns.map(c => ({
  columnId: c.id,
  isHidden: c.id === 'secretField',
}));

const words = [
  'toyota',
  'helping',
  'whiteboard',
  'as',
  'can',
  'bottle',
  'eat',
  'chocolate',
  'pinocchio',
  'scott',
];
const getLetter = index =>
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(index % 62);
const getWord = (index, step = 1) => words[(step * index) % words.length];
const getSentence = index =>
  `${getWord(index, 1)} ${getWord(index, 2)} ${getWord(index, 3)} ${index}`;
const getString = (index, length) =>
  Array(length)
    .fill(0)
    .map((i, idx) => getLetter(index * (idx + 14) * (idx + 1)))
    .join('');

const getStatus = idx => {
  const modStatus = idx % 3;
  switch (modStatus) {
    case 0:
    default:
      return STATUS.RUNNING;
    case 1:
      return STATUS.NOT_RUNNING;
    case 2:
      return STATUS.BROKEN;
  }
};

const getNewRow = idx => ({
  id: `row-${idx}`,
  values: {
    string: getSentence(idx),
    date: new Date(100000000000 + 1000000000 * idx * idx).toISOString(),
    select: selectData[idx % 3].id,
    secretField: getString(idx, 10),
    number: idx * idx,
    status: getStatus(idx),
  },
});

const tableData = Array(100)
  .fill(0)
  .map((i, idx) => getNewRow(idx));

/** Sample expanded row component */
const RowExpansionContent = ({ rowId }) => (
  <div key={`${rowId}-expansion`} style={{ padding: 20 }}>
    <h3 key={`${rowId}-title`}>{rowId}</h3>
    <ul style={{ lineHeight: '22px' }}>
      {Object.entries(tableData.find(i => i.id === rowId).values).map(([key, value]) => (
        <li key={`${rowId}-${key}`}>
          <b>{key}</b>: {value}
        </li>
      ))}
    </ul>
  </div>
);

const StyledTableCustomRowHeight = styled(Table)`
  &&& {
    tr {
      height: 5rem;
    }
  }
`;

const actions = {
  pagination: {
    /** Specify a callback for when the current page or page size is changed. This callback is passed an object parameter containing the current page and the current page size */
    onChangePage: action('onChangePage'),
  },
  toolbar: {
    onApplyFilter: action('onApplyFilter'),
    onToggleFilter: action('onToggleFilter'),
    onToggleColumnSelection: action('onToggleColumnSelection'),
    /** Specify a callback for when the user clicks toolbar button to clear all filters. Recieves a parameter of the current filter values for each column */
    onClearAllFilters: action('onClearAllFilters'),
    onCancelBatchAction: action('onCancelBatchAction'),
    onApplyBatchAction: action('onApplyBatchAction'),
    onApplySearch: action('onApplySearch'),
  },
  table: {
    onRowClicked: action('onRowClicked'),
    onRowSelected: action('onRowSelected'),
    onSelectAll: action('onSelectAll'),
    onEmptyStateAction: action('onEmptyStateAction'),
    onApplyRowAction: action('onApplyRowAction'),
    onRowExpanded: action('onRowExpanded'),
    onChangeOrdering: action('onChangeOrdering'),
    onChangeSort: action('onChangeSort'),
  },
};

/** This would be loaded from your fetch */
export const initialState = {
  columns: tableColumns.map((i, idx) => ({
    ...i,
    isSortable: idx !== 1,
  })),
  data: tableData.map((i, idx) => ({
    ...i,
    rowActions: [
      idx % 4 !== 0
        ? {
            id: 'drilldown',
            icon: 'arrow--right',
            labelText: 'Drill in',
          }
        : null,
      {
        id: 'Add',
        icon: 'icon--add',
        labelText: 'Add',
        isOverflow: true,
      },
    ].filter(i => i),
  })),
  expandedData: tableData.map(data => ({
    rowId: data.id,
    content: <RowExpansionContent rowId={data.id} />,
  })),
  options: {
    hasFilter: true,
    hasSearch: true,
    hasPagination: true,
    hasRowSelection: true,
    hasRowExpansion: true,
    hasRowActions: true,
    hasColumnSelection: true,
    shouldExpandOnRowClick: false,
  },
  view: {
    filters: [
      {
        columnId: 'string',
        value: 'whiteboard',
      },
      {
        columnId: 'select',
        value: 'option-B',
      },
    ],
    pagination: {
      pageSize: 10,
      pageSizes: [10, 20, 30],
      page: 1,
      totalItems: tableData.length,
    },
    table: {
      isSelectAllSelected: false,
      selectedIds: [],
      sort: undefined,
      ordering: tableColumns.map(({ id }) => ({
        columnId: id,
        isHidden: id === 'secretField',
      })),
      expandedIds: [],
    },
    toolbar: {
      activeBar: 'filter',
      batchActions: [
        {
          id: 'delete',
          labelText: 'Delete',
          icon: 'delete',
          iconDescription: 'Delete',
        },
      ],
    },
  },
};

storiesOf('Table', module)
  .add(
    'Stateful Example',
    () => (
      <StatefulTable
        {...initialState}
        actions={actions}
        lightweight={boolean('lightweight', false)}
      />
    ),
    {
      info: {
        text:
          'This is an example of the <StatefulTable> component that uses local state to handle all the table actions. This is produced by wrapping the <Table> in a container component and managing the state associated with features such the toolbar, filters, row select, etc. For more robust documentation on the prop model and source, see the other "with function" stories.',
        propTables: [Table],
        propTablesExclude: [StatefulTable],
      },
    }
  )
  .add(
    'Stateful Example with I18N strings',
    () => (
      <StatefulTable
        {...initialState}
        actions={actions}
        i18n={{
          /** pagination */
          pageBackwardAria: text('i18n.pageBackwardAria', '__Previous page__'),
          pageForwardAria: text('i18n.pageForwardAria', '__Next page__'),
          pageNumberAria: text('i18n.pageNumberAria', '__Page Number__'),
          itemsPerPage: text('i18n.itemsPerPage', '__Items per page:__'),
          itemsRange: (min, max) => `__${min}–${max} items__`,
          currentPage: page => `__page ${page}__`,
          itemsRangeWithTotal: (min, max, total) => `__${min}–${max} of ${total} items__`,
          pageRange: (current, total) => `__${current} of ${total} pages__`,
          /** table body */
          overflowMenuAria: text('i18n.overflowMenuAria', '__More actions__'),
          clickToExpandAria: text('i18n.clickToExpandAria', '__Click to expand content__'),
          clickToCollapseAria: text('i18n.clickToCollapseAria', '__Click to collapse content__'),
          selectAllAria: text('i18n.selectAllAria', '__Select all items__'),
          selectRowAria: text('i18n.selectRowAria', '__Select row__'),
          /** toolbar */
          clearAllFilters: text('i18n.clearAllFilters', '__Clear all filters__'),
          searchPlaceholder: text('i18n.searchPlaceholder', '__Search__'),
          columnSelectionButtonAria: text('i18n.columnSelectionButtonAria', '__Column Selection__'),
          filterButtonAria: text('i18n.filterButtonAria', '__Filters__'),
          clearFilterAria: text('i18n.clearFilterAria', '__Clear filter__'),
          filterAria: text('i18n.filterAria', '__Filter__'),
          openMenuAria: text('i18n.openMenuAria', '__Open menu__'),
          closeMenuAria: text('i18n.closeMenuAria', '__Close menu__'),
          clearSelectionAria: text('i18n.clearSelectionAria', '__Clear selection__'),
          /** empty state */
          emptyMessage: text('i18n.emptyMessage', '__There is no data__'),
          emptyMessageWithFilters: text(
            'i18n.emptyMessageWithFilters',
            '__No results match the current filters__'
          ),
          emptyButtonLabel: text('i18n.emptyButtonLabel', '__Create some data__'),
          emptyButtonLabelWithFilters: text('i18n.emptyButtonLabel', '__Clear all filters__'),
        }}
      />
    ),
    {
      info: {
        text:
          'This is an example of the <StatefulTable> component that uses local state to handle all the table actions. This is produced by wrapping the <Table> in a container component and managing the state associated with features such the toolbar, filters, row select, etc. For more robust documentation on the prop model and source, see the other "with function" stories.',
        propTables: [Table],
        propTablesExclude: [StatefulTable],
      },
    }
  )

  .add('default', () => <Table columns={tableColumns} data={tableData} actions={actions} />)
  .add('with simple search', () => (
    <Table
      columns={tableColumns}
      data={tableData}
      actions={actions}
      options={{ hasSearch: true }}
    />
  ))
  .add('with selection and batch actions', () => (
    // TODO - batch action bar
    <Table
      columns={tableColumns}
      data={tableData}
      actions={actions}
      options={{
        hasFilter: true,
        hasPagination: true,
        hasRowSelection: true,
      }}
      view={{
        filters: [],
        toolbar: {
          batchActions: [
            {
              id: 'delete',
              labelText: 'Delete',
              icon: 'delete',
              iconDescription: 'Delete Item',
            },
          ],
        },
        table: {
          ordering: defaultOrdering,
          isSelectAllSelected: false,
          isSelectAllIndeterminate: true,
          selectedIds: ['row-3', 'row-4', 'row-6', 'row-7'],
        },
      }}
    />
  ))
  .add('with row expansion', () => (
    <Table
      columns={tableColumns}
      data={tableData}
      actions={actions}
      options={{
        hasRowExpansion: true,
      }}
      view={{
        filters: [],
        table: {
          ordering: defaultOrdering,
          expandedRows: [
            {
              rowId: 'row-2',
              content: <RowExpansionContent rowId="row-2" />,
            },
            {
              rowId: 'row-5',
              content: <RowExpansionContent rowId="row-5" />,
            },
          ],
        },
      }}
    />
  ))
  .add('with row expansion and on row click expands', () => (
    <Table
      columns={tableColumns}
      data={tableData}
      actions={actions}
      options={{
        hasRowExpansion: true,
        shouldExpandOnRowClick: true,
      }}
      view={{
        filters: [],
        table: {
          ordering: defaultOrdering,
          expandedRows: [
            {
              rowId: 'row-2',
              content: <RowExpansionContent rowId="row-2" />,
            },
            {
              rowId: 'row-5',
              content: <RowExpansionContent rowId="row-5" />,
            },
          ],
        },
      }}
    />
  ))
  .add('with row expansion and actions', () => (
    <Table
      columns={tableColumns}
      data={tableData.map((i, idx) => ({
        ...i,
        rowActions: [
          idx % 4 === 0
            ? {
                id: 'drilldown',
                icon: 'arrow--right',
                labelText: 'See more',
              }
            : null,
          {
            id: 'add',
            icon: 'icon--add',
            labelText: 'Add',
            isOverflow: true,
          },
          {
            id: 'delete',
            icon: 'icon--delete',
            labelText: 'Delete',
            isOverflow: true,
          },
        ].filter(i => i),
      }))}
      actions={actions}
      options={{
        hasRowExpansion: true,
        hasRowActions: true,
      }}
      view={{
        filters: [],
        table: {
          ordering: defaultOrdering,
          expandedRows: [
            {
              rowId: 'row-2',
              content: <RowExpansionContent rowId="row-2" />,
            },
            {
              rowId: 'row-5',
              content: <RowExpansionContent rowId="row-5" />,
            },
          ],
        },
      }}
    />
  ))
  .add('with sorting', () => (
    <Table
      columns={tableColumns.map((i, idx) => ({
        ...i,
        isSortable: idx !== 1,
      }))}
      data={getSortedData(tableData, 'string', 'ASC')}
      actions={actions}
      options={{
        hasFilter: false,
        hasPagination: true,
        hasRowSelection: true,
      }}
      view={{
        filters: [],
        table: {
          ordering: defaultOrdering,
          sort: {
            columnId: 'string',
            direction: 'ASC',
          },
        },
      }}
    />
  ))
  .add(
    'with custom cell renderer',
    () => {
      const renderDataFunction = ({ value }) => <div style={{ color: 'red' }}>{value}</div>;
      return (
        <Table
          columns={tableColumns.map(i => ({
            ...i,
            renderDataFunction,
          }))}
          data={tableData}
          actions={actions}
          options={{
            hasFilter: true,
            hasPagination: true,
            hasRowSelection: true,
          }}
          view={{
            filters: [],
            table: {
              ordering: defaultOrdering,
              sort: {
                columnId: 'string',
                direction: 'ASC',
              },
            },
          }}
        />
      );
    },
    {
      info: {
        text: `To render a custom widget in a table cell, pass a renderDataFunction prop along with your column metadata.
            The renderDataFunction is called with this payload 
           { 
              value: PropTypes.any (current cell value),
              columnId: PropTypes.string,
              rowId: PropTypes.string,
              row: the full data for this rowPropTypes.object like this {col: value, col2: value}
           }
          `,
      },
    }
  )
  .add('with filters', () => {
    const filteredData = tableData.filter(({ values }) =>
      // return false if a value doesn't match a valid filter
      [
        {
          columnId: 'string',
          value: 'whiteboard',
        },
        {
          columnId: 'select',
          value: 'option-B',
        },
      ].reduce(
        (acc, { columnId, value }) => acc && values[columnId].toString().includes(value),
        true
      )
    );
    return (
      <Table
        columns={tableColumns}
        data={filteredData}
        actions={actions}
        options={{
          hasFilter: true,
          hasPagination: true,
          hasRowSelection: true,
        }}
        view={{
          filters: [
            {
              columnId: 'string',
              value: 'whiteboard',
            },
            {
              columnId: 'select',
              value: 'option-B',
            },
          ],
          pagination: {
            totalItems: filteredData.length,
          },
          toolbar: {
            activeBar: 'filter',
          },
          table: {
            ordering: defaultOrdering,
          },
        }}
      />
    );
  })
  .add('with customized columns', () => (
    <Table
      columns={tableColumns}
      data={tableData}
      actions={actions}
      options={{
        hasPagination: true,
        hasRowSelection: true,
        hasColumnSelection: true,
      }}
      view={{
        toolbar: {
          activeBar: 'column',
        },
        table: {
          ordering: defaultOrdering,
        },
      }}
    />
  ))
  .add('with no results', () => (
    <Table
      columns={tableColumns}
      data={[]}
      actions={actions}
      view={{
        filters: [
          {
            columnId: 'string',
            value: 'something not matching',
          },
        ],
        toolbar: {
          activeBar: 'filter',
        },
        table: {
          ordering: defaultOrdering,
        },
      }}
      options={{ hasFilter: true, hasPagination: true }}
    />
  ))
  .add('with no data', () => (
    <Table
      columns={tableColumns}
      data={[]}
      actions={actions}
      view={{
        table: {
          ordering: defaultOrdering,
        },
      }}
      options={{ hasPagination: true }}
    />
  ))
  .add('with no data and custom empty state', () => (
    <Table
      columns={tableColumns}
      data={[]}
      actions={actions}
      view={{
        table: {
          ordering: defaultOrdering,
          emptyState: (
            <div key="empty-state">
              <h1 key="empty-state-heading">Custom empty state</h1>
              <p key="empty-state-message">Hey, no data!</p>
            </div>
          ),
        },
      }}
      options={{ hasPagination: true }}
    />
  ))
  .add('with loading state', () => (
    <Table
      columns={tableColumns}
      data={tableData}
      actions={actions}
      view={{
        table: {
          ordering: defaultOrdering,
          loadingState: {
            isLoading: true,
            rowCount: 7,
          },
        },
      }}
    />
  ))
  .add('with zebra striping', () => (
    <Table zebra columns={tableColumns} data={tableData} actions={actions} />
  ))
  .add(
    'with fixed column width',
    () => (
      // You don't need to use styled components, just pass a className to the Table component and use selectors to find the correct column
      <Table
        columns={tableColumns.map((i, idx) => ({
          width: idx % 2 === 0 ? '20rem' : '10rem',
          ...i,
        }))}
        data={tableData}
        actions={actions}
      />
    ),
    {
      info: {
        source: true,
        propTables: false,
      },
    }
  )
  .add(
    'with custom row height',
    () => (
      // You don't need to use styled components, just pass a className to the Table component and use selectors to find the correct column
      <StyledTableCustomRowHeight columns={tableColumns} data={tableData} actions={actions} />
    ),
    {
      info: {
        source: false,
        text: `This is an example of the <Table> component that has a custom row height. Pass a custom className prop to the Table component and use a css selector to change the height of all the rows.
          
        <Table className="my-custom-classname"/>
          
        .my-custom-classname tr { 
          height: 5rem;
        }`,
        propTables: false,
      },
    }
  )
  .add('with lightweight design', () => (
    <Table
      columns={tableColumns}
      data={tableData}
      options={{ hasPagination: true }}
      actions={actions}
      lightweight={boolean('lightweight', true)}
    />
  ))
  .add('horizontal scroll - custom width', () => {
    const tableColumnsConcat = [
      { id: 'test2', name: 'Test 2' },
      { id: 'test3', name: 'Test 3' },
      {
        id: 'test4',
        name: 'Test 4',
      },
    ];
    // You don't n,eed to use styled components, just pass a className to the Table component and use selectors to find the correct column
    return (
      <div style={{ width: '800px' }}>
        <Table
          columns={tableColumns.concat(tableColumnsConcat)}
          options={{ hasFilter: true, hasPagination: true }}
          data={tableData}
          actions={actions}
          view={{
            filters: [
              { columnId: 'string', value: 'whiteboard' },
              { columnId: 'select', value: 'option-B' },
            ],
            toolbar: { activeBar: 'filter' },
          }}
        />
      </div>
    );
  })
  .add('horizontal scroll - full width', () => {
    const tableColumnsConcat = [
      { id: 'test2', name: 'Test 2' },
      { id: 'test3', name: 'Test 3' },
      {
        id: 'test4',
        name: 'Test 4',
      },
    ];
    // You don't n,eed to use styled components, just pass a className to the Table component and use selectors to find the correct column
    return (
      <Table
        columns={tableColumns.concat(tableColumnsConcat)}
        options={{ hasFilter: true, hasPagination: true }}
        data={tableData}
        actions={actions}
        view={{
          filters: [
            { columnId: 'string', value: 'whiteboard' },
            { columnId: 'select', value: 'option-B' },
          ],
          toolbar: { activeBar: 'filter' },
        }}
      />
    );
  })
  .add(
    'Filtered/Sorted/Paginated table with asynchronous data source',
    () => {
      const apiClient = new MockApiClient(100, number('Fetch Duration (ms)', 500));
      return <AsyncTable fetchData={apiClient.getData} />;
    },
    {
      info: {
        text:
          'This is an example of how to use the <Table> component to present data fetched asynchronously from an HTTP API supporting pagination, filtering and sorting. Refer to the source files under /src/components/Table/AsyncTable for details. ',
        source: false,
      },
    }
  );
