import React from 'react';
import { storiesOf } from '@storybook/react';
import { SortBy } from '../packages/react-instantsearch/dom';
import { withKnobs } from '@storybook/addon-knobs';
import { WrapWithHits } from './util';

const stories = storiesOf('SortBy', module);

stories.addDecorator(withKnobs);

stories
  .add('default', () => (
    <WrapWithHits linkedStoryGroup="SortBy">
      <SortBy
        items={[
          { value: 'ikea', label: 'Featured' },
          { value: 'ikea_price_asc', label: 'Price asc.' },
          { value: 'ikea_price_desc', label: 'Price desc.' },
        ]}
        defaultRefinement="ikea"
      />
    </WrapWithHits>
  ))
  .add('without label', () => (
    <WrapWithHits linkedStoryGroup="SortBy">
      <SortBy
        items={[
          { value: 'ikea' },
          { value: 'ikea_price_asc' },
          { value: 'ikea_price_desc' },
        ]}
        defaultRefinement="ikea"
      />
    </WrapWithHits>
  ));
