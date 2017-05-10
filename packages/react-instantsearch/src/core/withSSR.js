import highlightTags from './highlightTags.js';
import algoliasearchHelper, { SearchParameters } from 'algoliasearch-helper';
import { isObject } from 'lodash';
import algoliasearch from 'algoliasearch/lite';

let sp;
let results = null;

function iterate(children, searchParameters, context) {
  sp = searchParameters;
  console.log('children', children);
  if (children.length > 0 && children.forEach) {
    children.forEach(child => {
      if (child.type.getSearchParameters) {
        const getSearchParameters = child.type.getSearchParameters.bind(
          context
        );
        sp = getSearchParameters(sp, child.props, {});
      }
      if (child.props.children) {
        iterate(child.props.children, sp, context);
      }
    });
  } else if (isObject(children)) {
    if (children.type.getSearchParameters) {
      const getSearchParameters = children.type.getSearchParameters.bind(
        context
      );
      sp = getSearchParameters(sp, children.props, {});
    }
    if (children.props.children) {
      iterate(children.props.children, sp, context);
    }
  }
}

const withSSR = function(component) {
  console.log(component);
  const { indexName, children, appId, apiKey } = component.props;
  const algoliaClient = component.props.algoliaClient
    ? component.props.algoliaClient
    : algoliasearch(appId, apiKey);

  const searchParameters = new SearchParameters({
    index: indexName,
    ...highlightTags,
  });
  const context = {
    context: {
      ais: {
        mainTargetedIndex: indexName,
      },
    },
  };
  iterate(children, searchParameters, context);
  console.log('iteration is', sp);
  console.log('client', indexName);

  //const toto = search(props, sp);
  // console.log('results', toto);
  const helper = algoliasearchHelper(algoliaClient, indexName);
  return helper.searchOnce(sp);
};

export default withSSR;
