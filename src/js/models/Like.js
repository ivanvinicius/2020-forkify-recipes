export default class Like {
  constructor(){
    this.like = [];
  }

  addLike(id, title, author, img){
    const like = {
      id,
      title, 
      author, 
      img
    }

    this.like.push(like);

    return like;
  }

  deleteLike(id){
    const index = this.like.findIndex((el) => el.id === id)

    this.like.splice(index, 1);
  }

  isLiked(id){
    return this.like.findIndex((el) => el.id === id) !== -1;
  }

  getNumLikes() {
    return this.like.length;
  }
}