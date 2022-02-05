import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin'
import moment from 'moment'

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


// remove alert message after x seconds

const alertMsg = document.querySelector('#success-alert');

if(alertMsg){
    setTimeout(() => {
        alertMsg.remove()
    }, 2000);
}





// Change order status
let statuses = document.querySelectorAll('.status_line')
//console.log(statuses)
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? document.querySelector('#hiddenInput').value : null
order = JSON.parse(order)
// console.log(order)

let time = document.createElement('small')


function updateStatus(order){
    statuses.forEach(function(status){
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach(function(status){
            let dataProp = status.dataset.status
            if(stepCompleted){
                status.classList.add('step-completed')
            }
            if(dataProp === order.status){
                stepCompleted = false
                time.innerText = moment(order.updatedAt).format('hh:mm A')
                status.appendChild(time)
                if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')
            }

        }
     
    })

}


updateStatus(order);


//Socket
 
let socket = io()
initAdmin(socket);

//Join 
if(order){
    socket.emit('join', `order_${order._id}`)
}

let adminAreaPath = window.location.pathname
// console.log(adminAreaPath)
if(adminAreaPath.includes('admin')){
    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', function(data){
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        text:'Order updated',
        timeout: 1000,
        progressBar: false
    }).show();

 
})

// socket.emit('join', `order_${order._id}`)
//order_niuh9dash9oh9h