import uniqid from 'uniqid'

export default class List {
  constructor(){
    this.item = [];
  }

  addItem(count, unit, ingredient){
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient
    };

    this.item.push(item);

    return item;
  }

  deleteItem(id) {
    const index = this.item.findIndex(el => el.id === id);

    this.item.splice(index, 1);
  }

  updateCount(id, newCount) {
    if(newCount >= 0) this.item.find(el => el.id === id).count = newCount;
  }
}