import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PanierService {

  constructor() {
    if (localStorage.getItem('cart') == null){
      localStorage.setItem('cart', JSON.stringify([]));
      console.log('Set new local storage :', JSON.parse(localStorage.getItem('cart')))
    }
    if (JSON.parse(localStorage.getItem('cart')).length == 0){
      localStorage.setItem('cart', JSON.stringify([]));
      console.log('Set new local storage :', JSON.parse(localStorage.getItem('cart')))
    }
  }

  addToCart(offer, number, race) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart.push({offer : offer, number : number, race: race, id : this.uuidv4()});
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log("Add to cart : ", JSON.parse(localStorage.getItem('cart')))
  }

  getItems() {
    return JSON.parse(localStorage.getItem('cart'));
  }

  clearItemInCart(id){
    let filtered = this.getItems().filter(function(el) { return el.id != id; });
    console.log("filtered", filtered)
    localStorage.setItem('cart', JSON.stringify(filtered))
  }

  clearCart() {
    localStorage['cart'] = JSON.stringify([]);
    return [];
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}