import { Head, IS } from '../components';
import React from 'react';
import Router from 'next/router';
import { findResults } from 'react-instantsearch/server';
import qs from 'qs';

const searchStateToUrl = searchState =>
  (searchState
    ? `${window.location.pathname}?${qs.stringify(searchState)}`
    : '');
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.onSearchStateChange = this.onSearchStateChange.bind(this);
    this.state = { searchState: {} };
  }

  static async getInitialProps(params) {
    const searchState = qs.parse(params.asPath.substring(2)); //nextjs params.query doesn't handle nested objects
    const results = await findResults(IS, { searchState });
    return { results };
  }

  onSearchStateChange(searchState) {
    const href = searchStateToUrl(searchState);
    Router.push(href, href, {
      shallow: true,
    });
  }

  componentDidMount() {
    this.setState({ searchState: qs.parse(window.location.search.slice(1)) });
  }

  componentWillReceiveProps() {
    this.setState({ searchState: qs.parse(window.location.search.slice(1)) });
  }

  render() {
    const resultsState = this.props.results ? this.props.results : null;
    return (
      <div>
        <Head title="Home" />
        <div>
          <IS
            resultsState={resultsState}
            onSearchStateChange={this.onSearchStateChange}
            searchState={this.state.searchState}
          />
        </div>
        <style jsx>{`
      
    `}</style>
      </div>
    );
  }
}
