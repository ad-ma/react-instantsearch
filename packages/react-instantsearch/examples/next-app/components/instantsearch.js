import React from 'react';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch/dom';

export default class extends React.Component {
  render() {
    return (
      <InstantSearch
        appId="latency"
        apiKey="6be0576ff61c053d5f9a3225e2a90f76"
        indexName="ikea"
        onSearchStateChange={this.props.onSearchStateChange}
      >
        <SearchBox />
        <Hits />
      </InstantSearch>
    );
  }
}
