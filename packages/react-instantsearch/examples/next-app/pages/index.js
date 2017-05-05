import Link from 'next/link';
import { Head, InstantSearch } from '../components';
import React from 'react';
import Router from 'next/router';

export default class extends React.Component {
  constructor(params) {
    super(params);
    this.onSearchStateChange = this.onSearchStateChange.bind(this);
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
        <InstantSearch onSearchStateChange={this.onSearchStateChange} />
        <style jsx>{`
      
    `}</style>
      </div>
    );
  }
}
