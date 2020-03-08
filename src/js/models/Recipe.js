import axios from 'axios';

import { cors, urlAPI } from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const param = `get?rId=${this.id}`
      const res = await axios(cors + urlAPI + param);
      const recipe = res.data.recipe; 

      this.title = recipe.title;
      this.author = recipe.publisher;
      this.img = recipe.image_url;
      this.url = recipe.source_url;
      this.ingredients = recipe.ingredients;
    } 
    catch (err) {
      alert(err);
    }
  }

  calcTime() {
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);

    this.time = periods * 15;
  }

  calcServings(){
    this.servings = 4;
  }
  
  parseIngredients() {
    let objIng;

    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tps', 'cup', 'pound'];
    const units = [...unitShort, 'kg', 'g']

    const newIngredients = this.ingredients.map((elem) => {
      let ingredient = elem.toLowerCase();

      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitShort[i]);
      });

      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex((el2) => units.includes(el2));

      if (unitIndex > -1) {
        let count;
        const arrCount = arrIng.slice(0, unitIndex);
        
        if(arrCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        }
        else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        }
      }
      else if (parseInt(arrIng[0], 10)) {
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        }
      }
      else if (unitIndex === -1) {
        objIng = {
          count: 1,
          unit: '',
          ingredient
        }
      }

      return objIng;
    })

    this.ingredients = newIngredients;
  }

  updateServings(type) {
    const newServings = type === 'dec' ? this.servings -1 : this.servings + 1;

    this.ingredients.forEach((el) => {
      el.count *= newServings / this.servings;
    })

    this.servings = newServings;
  }
}