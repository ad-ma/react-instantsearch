import Link from 'next/link';
import { Head, IS } from '../components';
import React from 'react';
import Router from 'next/router';
import {
  InstantSearch,
  RefinementList,
  SearchBox,
  Hits,
  withSSR,
} from 'react-instantsearch/dom';
import { connectHits } from 'react-instantsearch/connectors';
import algoliasearchHelper, {
  SearchResults,
  SearchParameters,
} from 'algoliasearch-helper';

const App = props => (
  <InstantSearch
    appId="latency"
    apiKey="6be0576ff61c053d5f9a3225e2a90f76"
    indexName="ikea"
  >
    <SearchBox />
    <Hits />
    <RefinementList attributeName="category" />
  </InstantSearch>
);

withSSR(App()).then(res => {});
export default class extends React.Component {
  constructor(params) {
    super(params);
    this.onSearchStateChange = this.onSearchStateChange.bind(this);
  }

  static getInitialProps({ req }) {
    return withSSR(App()).then(res => {
      console.log('xxx', res);
      return res;
    });
  }

  onSearchStateChange(searchState) {}
  render() {
    console.log(this.props);
    const searchResults = new SearchResults(
      new SearchParameters(this.props.state),
      this.props._originalResponse.results
    );
    return (
      <div>
        <Head title="Home" />
        <InstantSearch
          appId="latency"
          apiKey="6be0576ff61c053d5f9a3225e2a90f76"
          indexName="ikea"
          resultsState={searchResults}
        >
          <SearchBox />
          <ConnectedHits />
          <RefinementList attributeName="category" />
        </InstantSearch>
        <style jsx>{`
      
    `}</style>
      </div>
    );
  }
}

const ConnectedHits = connectHits(props => {
  const hits = props.hits.map(hit => <div>{hit.name}</div>);
  return <div>{hits}</div>;
});
