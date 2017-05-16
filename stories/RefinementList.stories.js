import React from 'react';
import { storiesOf } from '@storybook/react';
import {
  RefinementList,
  Panel,
  SearchBox,
  withSSR,
  InstantSearch,
  Hits,
} from '../packages/react-instantsearch/dom';
import { withKnobs, boolean, number, array } from '@storybook/addon-knobs';
import { WrapWithHits } from './util';
import { orderBy } from 'lodash';
import algoliasearchHelper, {
  SearchParameters,
} from '../packages/react-instantsearch/node_modules/algoliasearch-helper';
import algoliasearch
  from '../packages/react-instantsearch/node_modules/algoliasearch/lite';

const algoliaClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);
const helper = algoliasearchHelper(algoliaClient, 'ikea');
const searchParameters = new SearchParameters({
  index: 'ikea',
});

class IS extends React.Component {
  render() {
    return (
      <InstantSearch
        appId="latency"
        apiKey="6be0576ff61c053d5f9a3225e2a90f76"
        indexName="ikea"
      >
        <RefinementList attributeName="category" />
        <Hits />
      </InstantSearch>
    );
  }
}

class Toto extends React.Component {
  iterate(children) {
    const { type, props } = children;
    console.log(React.createElement(type, props));

    React.Children.forEach(children, (child, i) => {
      // Ignore the first child
      if (child.props.children) {
        //this.iterate(child);
      }
    });
  }
  render() {
    const children = this.props.children;
    this.iterate(children);
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

/*withSSR(<Toto></Toto>).then(res => {
  console.log('my res', res);
});
*/
const stories = storiesOf('RefinementList', module);

stories.addDecorator(withKnobs);

stories
  .add('default', () => (
    <Toto>
      <IS />
    </Toto>
  ))
  .add('with selected item', () => (
    <WrapWithHits linkedStoryGroup="RefinementList" hasPlayground={true}>
      <RefinementList attributeName="category" defaultRefinement={['Dining']} />
    </WrapWithHits>
  ))
  .add('with show more', () => (
    <WrapWithHits linkedStoryGroup="RefinementList" hasPlayground={true}>
      <RefinementList
        attributeName="category"
        limitMin={2}
        limitMax={5}
        showMore={true}
      />
    </WrapWithHits>
  ))
  .add('with search inside items', () => (
    <WrapWithHits linkedStoryGroup="RefinementList" hasPlayground={true}>
      <RefinementList attributeName="category" withSearchBox />
    </WrapWithHits>
  ))
  .add('with the sort strategy changed', () => (
    <WrapWithHits linkedStoryGroup="RefinementList" hasPlayground={true}>
      <RefinementList
        attributeName="category"
        transformItems={items =>
          orderBy(items, ['label', 'count'], ['asc', 'desc'])}
      />
    </WrapWithHits>
  ))
  .add('with panel', () => (
    <WrapWithHits linkedStoryGroup="RefinementList" hasPlayground={true}>
      <Panel title="Category">
        <RefinementList attributeName="category" />
      </Panel>
    </WrapWithHits>
  ))
  .add('with panel but no refinement', () => (
    <WrapWithHits
      searchBox={false}
      linkedStoryGroup="RefinementList"
      hasPlayground={true}
    >
      <Panel title="Category">
        <RefinementList attributeName="category" />
        <div style={{ display: 'none' }}>
          <SearchBox defaultRefinement="ds" />
        </div>
      </Panel>
    </WrapWithHits>
  ))
  .add('playground', () => (
    <WrapWithHits linkedStoryGroup="RefinementList">
      <RefinementList
        attributeName="category"
        defaultRefinement={array('defaultSelectedItem', [
          'Decoration',
          'Lighting',
        ])}
        limitMin={number('limitMin', 10)}
        limitMax={number('limitMax', 20)}
        showMore={boolean('showMore', true)}
      />
    </WrapWithHits>
  ));
