import Link from 'next/link';
import { Head, IS } from '../components';
import React from 'react';
import Router from 'next/router';
import { findResults, decorateResults } from 'react-instantsearch/server';

export default class extends React.Component {
  static async getInitialProps() {
    const results = await findResults(IS);
    return { results };
  }

  render() {
    return (
      <div>
        <Head title="Home" />
        <div>
          <IS resultsState={decorateResults(this.props.results)} />
        </div>
        <style jsx>{`
      
    `}</style>
      </div>
    );
  }
}
