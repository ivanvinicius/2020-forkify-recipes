import  { elements, renderLoader, clearLoader }  from './views/elementsDom';

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Like from './models/Like';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';

/** Global State of the app*/
const state = {};

/** Controllers */
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
    }
  }
}

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

      recipeView.renderRecipe(state.recipe, state.like.isLiked(id));
    } 
    catch (err) {
      alert('Error on recipe')
    }
  }
}

const controlList = async () => {
  if(!state.list) state.list = new List();

  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    
    listView.renderItem(item);
  })
}

const controlLike = () => {
  if(!state.like) state.like = new Like();

  const id = state.recipe.id;

  if(!state.like.isLiked(id)) {
    const newLike = state.like.addLike(
      id,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );

    likeView.toggleLikeBtn(true);

    likeView.renderLike(newLike)
  }
  else {
    state.like.deleteLike(id);
    
    likeView.toggleLikeBtn(false);

    likeView.deleteLike(id)
  }
  
  likeView.toggleLikeMenu(state.like.getNumLikes());
}

/**Events Listeners */
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

['hashchange', 'load'].forEach((event) => window.addEventListener(event, controlRecipe));

elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  if(e.target.matches('.shopping__delete, .shopping__delete *')) {
    state.list.deleteItem(id);

    listView.deleteItem(id);
  }
  else if(e.target.matches('.shopping__count--value')) {
    const val = parseFloat(e.target.value, 10);
    
    state.list.updateCount(id, val);
  }
})

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
  else if(e.target.matches('.recipe__btn--add, .recipe__btn--add * ')) {
    controlList();
  }
  else if(e.target.matches('.recipe__love, .recipe__love * ')) {
    controlLike();
  }
})

window.addEventListener('load', () => {
  state.like = new Like();
  
  state.like.readDataOnLocalStorage();

  likeView.toggleLikeMenu(state.like.getNumLikes());

  state.like.like.forEach(el => likeView.renderLike(el));
})