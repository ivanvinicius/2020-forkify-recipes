import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import  { elements, renderLoader, clearLoader }  from './views/elementsDom';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

/** Global State of the app*/
const state = {};

const controlSearch = async () => {
  const query = searchView.getInput();
  
  if(query){
    state.search = new Search(query);

    searchView.clearInput();
    searchView.clearResults();
    
    renderLoader(elements.searchRes);
    
    try {
      await state.search.getResults();
      
      clearLoader();
      
      searchView.renderResults(state.search.result)
    }
    catch (err) {
      clearLoader();
      alert('Error on search')
      console.log(err);
    }
  }
}

elements.searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  controlSearch();
})

elements.searchResPages.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-inline');

  if(btn) {
    const gotoPage = Number(btn.dataset.goto);

    searchView.clearResults();
    searchView.clearPrintedBtn();

    searchView.renderResults(state.search.result, gotoPage);
  }
  
});

const controlRecipe = async () => {
  const id = window.location.hash.replace('#', '');
  
  if(id) {
    recipeView.clearRecipe();

    renderLoader(elements.recipe);

    if(state.search) searchView.highlightSelected(id);

    state.recipe = new Recipe(id);

    try {
      await state.recipe.getRecipe();
      
      state.recipe.parseIngredients();
      state.recipe.calcTime();
      state.recipe.calcServings();

      clearLoader();

      recipeView.renderRecipe(state.recipe);
    } 
    catch (err) {
      alert('Error on recipe')
      console.log(err)
    }
  }
}

['hashchange', 'load'].forEach((event) => window.addEventListener(event, controlRecipe));

elements.recipe.addEventListener('click', e => {
  if(e.target.matches('.btn-decrease, .btn-decrease * ')) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');

      recipeView.updateServingsIngredients(state.recipe);
    }
  }
  else if(e.target.matches('.btn-increase, .btn-increase * ')) {
    if (state.recipe.servings <= 50) {
      state.recipe.updateServings('inc'); 

      recipeView.updateServingsIngredients(state.recipe);      
    } 
  }
})

window.l = new List();