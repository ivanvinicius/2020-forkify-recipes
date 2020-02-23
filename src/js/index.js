import Search from './models/Search';
import  { elements }  from './views/elementsDom';
import * as searchView from './views/searchView';

/** Global State of the app*/
const state = {};


const controlSearch = async () => {
  const query = searchView.getInput()

  if(query){
    state.search = new Search(query);

    searchView.clearInput();
    searchView.clearResults();

    await state.search.getResults();

    searchView.renderResults(state.search.result)
  }
}


elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  controlSearch();
})
