import highlightTags from './highlightTags.js';
import algoliasearchHelper, { SearchParameters } from 'algoliasearch-helper';
import { isObject } from 'lodash';
import algoliasearch from 'algoliasearch/lite';
import React from 'react';
import PropTypes from 'prop-types';
import { version } from '../../package.json';
import InstantSearch from './InstantSearch';

let searchParameters = {};
let results = null;

const withSSR = function(component) {
  //const toto = search(props, sp);
  const helper = algoliasearchHelper(algoliaClient, indexName);
  return helper.searchOnce(sp);
};

const onSearchParameters = function(sp) {
  console.log('sp', sp);
  searchParameters = { ...searchParameters, ...sp };
};

const connectSSR = function(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.onSearchParameters = this.onSearchParameters.bind(this);
    }

    onSearchParameters(sp) {
      console.log(sp);
    }
    render() {
      debugger;
      console.log('this', this);
      return (
        <WrappedComponent
          onSearchParameters={this.onSearchParameters}
          {...this.props}
        />
      );
    }
  };
};

export { onSearchParameters, connectSSR };
export default withSSR;
