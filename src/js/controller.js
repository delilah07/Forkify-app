import * as model from './module.js';
import { MODAL_CLOSE } from './config';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';

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
    bookmarksView.update(model.state.bookmarks);

    // loading recepi
    await model.loadRecipe(id);
    // const recipe = model.state.recipe;

    // rendering recipe

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
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

const controlAddBookmark = function () {
  // add or remote bookmark icon
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // update recipe view
  recipeView.update(model.state.recipe);

  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newResipe) {
  try {
    //show loading spinnner
    addRecipeView.renderSpinner();

    // upload the new recipe data
    await model.uploadrecipe(newResipe);
    console.log(model.state.recipe);

    // render recipe
    recipeView.render(model.state.recipe);

    //success
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back()

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
