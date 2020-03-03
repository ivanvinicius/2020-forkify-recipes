import Search from './models/Search';
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

    await state.search.getResults();

    clearLoader();

    searchView.renderResults(state.search.result)
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
