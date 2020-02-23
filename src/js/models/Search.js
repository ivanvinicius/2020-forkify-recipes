import axios from 'axios'

export default class Search {
  constructor(query){
    this.query = query;
  }
  
  async getResults(){
    const cors = `https://cors-anywhere.herokuapp.com/`;
    const urlAPI = `https://forkify-api.herokuapp.com/api/search?&q=${this.query}`
  
    try {
      const res = await axios(cors + urlAPI)
      
      this.result = res.data.recipes;
    } 
    catch (err) {
      alert(err);
    }
  }
}