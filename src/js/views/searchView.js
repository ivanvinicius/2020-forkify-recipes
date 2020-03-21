import { elements } from './elementsDom';

export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  
  if(title.length > limit) {
    title.split(' ').reduce((sum, cur) => {
      if(sum + cur.length <= limit){
        newTitle.push(cur);
      }

      return sum + cur.length;
    }, 0)

    return `${newTitle.join(' ')} ...`;
  }
  
  return title;
}

const renderRecipe = (recipe) => {
  const markup = `<li>
                    <a class="results__link" href="#${recipe.recipe_id}">
                      <figure class="results__fig">
                        <img src="${recipe.image_url}" alt="${recipe.title}">
                      </figure>
                      <div class="results__data">
                        <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                        <p class="results__author">${recipe.publisher}</p>
                      </div>
                    </a>
                  </li>`;
  
  elements.searchResultList.insertAdjacentHTML('beforeend', markup);
}

const createPageButton = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page - 1 : page + 1}">
  <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
  <svg class="search__icon">
    <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
  </svg>
</button>
`;

const renderPageButton = (page, numOfResults, limitPerPage) => {
  let button;
  
  /** Math.ceil() rounds up a result like 5.3 to 6 */
  const pages = Math.ceil(numOfResults / limitPerPage);
  
  if(page === 1 && pages > 1) {
    /** only go to next page */
    button = createPageButton(page, 'next');
  }
  else if(page < pages) {
    /** both directions of pages */
    button = `${createPageButton(page, 'prev')} ${createPageButton(page, 'next')}`;
  } 
  else if(page === pages && pages > 1) {
    /** only go to previous page */
    button = createPageButton(page, 'prev');
  }
  
  elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}

export const renderResults = (recipes, page = 1, limitPerPage = 10) => {
  const start = (page - 1) * limitPerPage;
  const end = page * limitPerPage;
  
  recipes.slice(start, end).forEach(renderRecipe)
  
  renderPageButton(page, recipes.length, limitPerPage)
}

export const getInput = () => elements.searchInput.value;

export const clearInput = () => elements.searchInput.value = '';

export const clearResults = () => elements.searchResultList.innerHTML = '';

export const clearPrintedBtn = () => elements.searchResPages.innerHTML = '';

export const highlightSelected = (id) => {
  const resultsArr = Array.from(document.querySelectorAll('.results__link'));

  resultsArr.forEach((el) => {
    el.classList.remove('results__link--active')
  });

  document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}