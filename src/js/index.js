import Search from './models/Search';
import Recipe from './models/Recipe';
import  { elements, renderLoader, clearLoader }  from './views/elementsDom';
import * as searchView from './views/searchView';

/** Global State of the app*/
const state = {};

const controlSearch = async () => {
  const query = searchView.getInput()

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
      alert('error processing search')
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
    state.recipe = new Recipe(id);

    try {
      await state.recipe.getRecipe();
  
      state.recipe.calcTime();
      state.recipe.calcServings();
  
      console.log(state.recipe);
    } 
    catch (err) {
      alert('error processing recipe');
    }
  }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));