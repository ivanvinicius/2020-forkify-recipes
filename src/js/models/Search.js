import axios from 'axios'

import { cors, urlAPI } from '../config';

export default class Search {
  constructor(query){
    this.query = query;
  }
  
  async getResults(){
    const param = `search?&q=${this.query}`;

    try {
      const res = await axios(cors + urlAPI + param);
      
      this.result = res.data.recipes;
    } 
    catch (err) {
      alert(err);
    }
  }
}