import PropTypes from 'prop-types';
import React, { Component } from 'react';
import InstantSearch from './InstantSearch';
import { version } from '../../package.json';
import algoliasearchHelper, {
  SearchResults,
  SearchParameters,
} from 'algoliasearch-helper';
import ReactDom from 'react-dom/server';
import { getIndex, hasMultipleIndex } from './indexUtils';

/**
 * Creates a specialized root InstantSearch component. It accepts
 * an algolia client and a specification of the root Element.
 * @param {function} defaultAlgoliaClient - a function that builds an Algolia client
 * @param {object} root - the defininition of the root of an InstantSearch sub tree.
 * @returns {object} an InstantSearch root
 */

const searchParameters = [];
let client;
let indexName = '';

const onSearchParameters = function(
  getSearchParameters,
  context,
  props,
  searchState
) {
  const index = getIndex(context);
  searchParameters.push({
    getSearchParameters,
    context,
    props,
    searchState,
    index,
  });
};

const findResults = function(App, params) {
  ReactDom.renderToString(<App {...params} />);
  const sharedSearchParameters = searchParameters
    .filter(searchParameter => !hasMultipleIndex(searchParameter.context))
    .reduce(
      (acc, searchParameter) =>
        searchParameter.getSearchParameters.call(
          { context: searchParameter.context },
          acc,
          searchParameter.props,
          searchParameter.searchState
        ),
      new SearchParameters({ index: indexName })
    );

  const mergedSearchParameters = searchParameters
    .filter(searchParameter => hasMultipleIndex(searchParameter.context))
    .reduce((acc, searchParameter) => {
      const index = getIndex(searchParameter.context);
      const sp = searchParameter.getSearchParameters.call(
        { context: searchParameter.context },
        acc[index] ? acc[index] : sharedSearchParameters,
        searchParameter.props,
        searchParameter.searchState
      );
      acc[index] = sp;
      return acc;
    }, {});

  const search = Object.keys(mergedSearchParameters).map(key => {
    const helper = algoliasearchHelper(
      client,
      mergedSearchParameters[key].index
    );
    return helper.searchOnce(new SearchParameters(mergedSearchParameters[key]));
  });
  return Promise.all(search);
};

const decorateResults = function(results) {
  if (!results) {
    return undefined;
  }
  return Array.isArray(results)
    ? results.reduce((acc, result) => {
        acc[result.state.index] = new SearchResults(
          new SearchParameters(result.state),
          result._originalResponse.results
        );
        return acc;
      }, [])
    : new SearchResults(
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
      resultsState: PropTypes.object,
      onSearchStateChange: PropTypes.func,
    };

    constructor(props) {
      super();
      this.client =
        props.algoliaClient || defaultAlgoliaClient(props.appId, props.apiKey);
      this.client.addAlgoliaAgent(`react-instantsearch ${version}`);
      client = this.client;
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
      client = this.client;
      indexName = props.indexName;
    }

    render() {
      const resultsState = decorateResults(this.props.resultsState);
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
          resultsState={resultsState}
        />
      );
    }
  };
};

export { createInstantSearch, findResults, decorateResults };
