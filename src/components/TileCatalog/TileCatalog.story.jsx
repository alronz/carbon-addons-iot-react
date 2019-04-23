import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { select } from '@storybook/addon-knobs';
import { Icon } from 'carbon-components-react';

import StatefulTileCatalog from './StatefulTileCatalog';
import CatalogContent from './CatalogContent';

const longDescription =
  'Really long string with lots of lots of text too much to show on one line and when it wraps it might cause some interesting issues especially if it starts vertically wrapping outside of tile bounds at the bottom of the tile';

const tileRenderFunction = ({ values }) => (
  <CatalogContent {...values} icon={<Icon width="50" height="50" name="icon--add" />} />
);

export const commonTileCatalogProps = {
  title: 'My Tile Catalog',
  id: 'entityType',
  tiles: [
    {
      id: 'test1',
      values: {
        title: 'Test Tile with really long title that should wrap',
        description: longDescription,
      },
      renderContent: tileRenderFunction,
    },
    {
      id: 'test2',
      values: { title: 'Test Tile2', description: longDescription },
      renderContent: tileRenderFunction,
    },
    {
      id: 'test3',
      values: { title: 'Test Tile3', description: 'Tile contents' },
      renderContent: tileRenderFunction,
    },
    {
      id: 'test4',
      values: { title: 'Test Tile4', description: longDescription },
      renderContent: tileRenderFunction,
    },
    {
      id: 'test5',
      values: { title: 'Test Tile5', description: longDescription },
      renderContent: tileRenderFunction,
    },
    {
      id: 'test6',
      values: { title: 'Test Tile6', description: longDescription },
      renderContent: tileRenderFunction,
    },
    {
      id: 'test7',
      values: { title: 'Test Tile7', description: longDescription },
      renderContent: tileRenderFunction,
    },
  ],
  onSelection: action('onSelection'),
};

storiesOf('TileCatalog', module)
  .add('default', () => (
    <StatefulTileCatalog
      {...commonTileCatalogProps}
      selectedTileId={select(
        'id',
        commonTileCatalogProps.tiles.map(tile => tile.id),
        commonTileCatalogProps.tiles[0].id
      )}
    />
  ))
  .add('with search', () => (
    // Example stateful catalog component that can search
    <StatefulTileCatalog
      {...commonTileCatalogProps}
      search={{
        placeHolderText: 'Search catalog',
        onSearch: action('onSearch'),
      }}
      pagination={{ pageSize: 6, onPage: action('onPage') }}
    />
  ))
  .add('with pages', () => (
    <StatefulTileCatalog
      {...commonTileCatalogProps}
      pagination={{ pageSize: 6, onPage: action('onPage') }}
    />
  ))
  .add('loading', () => <StatefulTileCatalog {...commonTileCatalogProps} isLoading />)
  .add('error', () => (
    <StatefulTileCatalog {...commonTileCatalogProps} tiles={[]} error="In error state" />
  ));
