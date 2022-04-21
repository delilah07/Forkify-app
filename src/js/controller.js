import * as model from './module.js';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import searchViews from './views/searchView';

if (module.hot) {
  module.hot.accept();
}

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    console.log(id);

    if (!id) return;

    recipeView.renderSpinner();

    //update result view to mark selected search result
    resultsView.update(model.getSearchResultPage());

    // loading recepi
    await model.loadRecipe(id);
    // const recipe = model.state.recipe;

    // rendering recipe

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // get search query
    const query = searchView.getQuery();
    if (!query) return;

    //load search
    await model.loadSearchResults(query);

    //render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultPage());

    //render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (page) {
  //render new results
  resultsView.render(model.getSearchResultPage(page));

  //rendernew pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServ) {
  //update the recipe servings
  model.updateServings(newServ);

  //update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
