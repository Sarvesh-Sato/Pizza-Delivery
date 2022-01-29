import axios from 'axios'
import Noty from 'noty'

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');


function updateCart(pizza){
    axios.post('/update-cart', pizza).then(function(res){
           console.log(res);
           cartCounter.innerText = res.data.totalQty;
           new Noty({
               type: 'success',
               text:'Item added to cart',
               timeout: 1000,
               progressBar: false
           }).show();
    }).catch(function(err){
        new Noty({
            type: 'error',
            text:'Something Went Wrong',
            timeout: 1000,
            progressBar: false
        }).show();
    })
        
}

addToCart.forEach(function(btn){
    btn.addEventListener('click',function(e){
        // console.log(e);
        let pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza)
        
    })
})