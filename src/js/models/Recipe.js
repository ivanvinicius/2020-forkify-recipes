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
}