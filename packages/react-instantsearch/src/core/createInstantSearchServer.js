import PropTypes from 'prop-types';
import React, { Component } from 'react';
import InstantSearch from './InstantSearch';
import { version } from '../../package.json';
import algoliasearchHelper, {
  SearchResults,
  SearchParameters,
} from 'algoliasearch-helper';
import ReactDom from 'react-dom/server';

/**
 * Creates a specialized root InstantSearch component. It accepts
 * an algolia client and a specification of the root Element.
 * @param {function} defaultAlgoliaClient - a function that builds an Algolia client
 * @param {object} root - the defininition of the root of an InstantSearch sub tree.
 * @returns {object} an InstantSearch root
 */

let searchParameters;
let client2;
let indexName = '';

const onSearchParameters = function(
  getSearchParameters,
  context,
  props,
  searchState
) {
  searchParameters = searchParameters
    ? searchParameters
    : new SearchParameters({
        index: indexName,
      });

  searchParameters = getSearchParameters.call(
    { context },
    searchParameters,
    props,
    searchState
  );
};

const findResults = function(App, params) {
  ReactDom.renderToString(<App {...params} />);
  const helper = algoliasearchHelper(client2, searchParameters.index);
  return helper.searchOnce(searchParameters);
};

const decorateResults = function(results) {
  return new SearchResults(
    new SearchParameters(results.state),
    results._originalResponse.results
  );
};

const createInstantSearch = function(defaultAlgoliaClient, root) {
  return class CreateInstantSearch extends Component {
    static propTypes = {
      algoliaClient: PropTypes.object,
      appId: PropTypes.string,
      apiKey: PropTypes.string,
      children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
      ]),
      indexName: PropTypes.string.isRequired,
      searchParameters: PropTypes.object,
      createURL: PropTypes.func,
      searchState: PropTypes.object,
      onSearchStateChange: PropTypes.func,
    };

    constructor(props) {
      super();
      this.client =
        props.algoliaClient || defaultAlgoliaClient(props.appId, props.apiKey);
      this.client.addAlgoliaAgent(`react-instantsearch ${version}`);
      client2 = this.client;
      indexName = props.indexName;
    }

    componentWillReceiveProps(nextProps) {
      const props = this.props;
      if (nextProps.algoliaClient) {
        this.client = nextProps.algoliaClient;
      } else if (
        props.appId !== nextProps.appId ||
        props.apiKey !== nextProps.apiKey
      ) {
        this.client = defaultAlgoliaClient(nextProps.appId, nextProps.apiKey);
      }
      this.client.addAlgoliaAgent(`react-instantsearch ${version}`);
      client2 = this.client;
      indexName = nextProps.indexName;
    }

    render() {
      return (
        <InstantSearch
          createURL={this.props.createURL}
          indexName={this.props.indexName}
          searchParameters={this.props.searchParameters}
          searchState={this.props.searchState}
          onSearchStateChange={this.props.onSearchStateChange}
          onSearchParameters={onSearchParameters}
          root={root}
          algoliaClient={this.client}
          children={this.props.children}
          resultsState={this.props.resultsState}
        />
      );
    }
  };
};

export { createInstantSearch, findResults, decorateResults };
