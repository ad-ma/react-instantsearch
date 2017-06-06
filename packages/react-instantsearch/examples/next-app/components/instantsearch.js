import React from 'react';
import { RefinementList, SearchBox, Hits } from 'react-instantsearch/dom';
import { InstantSearch } from 'react-instantsearch/server';
export default class extends React.Component {
  render() {
    return (
      <InstantSearch
        appId="latency"
        apiKey="6be0576ff61c053d5f9a3225e2a90f76"
        indexName="ikea"
        resultsState={this.props.resultsState}
        onSearchStateChange={this.props.onSearchStateChange}
        searchState={this.props.searchState}
      >
        <SearchBox />
        <Hits />
        <RefinementList attributeName="category" />
      </InstantSearch>
    );
  }
}
