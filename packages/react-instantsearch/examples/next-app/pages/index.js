import Link from 'next/link';
import { Head } from '../components';
import React from 'react';
import Router from 'next/router';
import {
  InstantSearch,
  RefinementList,
  SearchBox,
  Hits,
} from 'react-instantsearch/dom';

const App = props => (
  <InstantSearch
    appId="latency"
    apiKey="6be0576ff61c053d5f9a3225e2a90f76"
    indexName="ikea"
    onSearchStateChange={props.onSearchStateChange}
    searchState={props.searchState}
  >
    <SearchBox />
    <Hits />
    <RefinementList attributeName="category" />
  </InstantSearch>
);
export default class extends React.Component {
  constructor(params) {
    super(params);
    this.onSearchStateChange = this.onSearchStateChange.bind(this);
  }

  static getInitialProps({ req }) {
    return req
      ? { userAgent: req.headers['user-agent'] }
      : { userAgent: navigator.userAgent };
  }

  onSearchStateChange(searchState) {
    const handler = () =>
      Router.push({
        query: searchState,
      });
  }
  render() {
    return (
      <div>
        <Head title="Home" />
        <App
          onSearchStateChange={this.onSearchStateChange}
          searchState={this.props.searchState}
        />
        <style jsx>{`
      
    `}</style>
      </div>
    );
  }
}
