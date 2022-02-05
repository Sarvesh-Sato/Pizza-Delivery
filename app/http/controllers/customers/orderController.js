 

const Order = require('../../../models/order');
const moment = require('moment');


function orderController(){
    return{
     
     store(req,res){
        //Validate request
        const {phone , address}  = req.body;
        if(!phone || !address){
            req.flash('error', 'All fields are required');
            console.log('all firlds required');
            return res.redirect('/cart');
        }


        const order = new Order({
            customerId : req.user._id,
            items: req.session.cart.items,
            phone : phone , 
            address : address
     
        });

        order.save().then(function(result){
            Order.populate(result , {path : 'customerId'} , function(err , placedOrder){
                req.flash('success','Order Placed Succesfully');
                delete req.session.cart
                //Emit
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('orderPlaced', placedOrder)
    
    
                return res.redirect('/customer/orders');
            })

        }).catch(function(err){
            req.flash('error','Somethimg went wrong');
            console.log(err);
            return res.redirect('/cart');
        })

     } , 

       async index(req,res){
         const orders = await Order.find({customerId : req.user._id} , null , {sort : {'createdAt' : -1}} );
         res.render('customers/orders',{orders : orders , moment : moment});
        // console.log(orders);

     } , 

     async show(req,res){
         const order = await Order.findById(req.params.id)
         // Authorize user 
         if(req.user._id.toString() === order.customerId.toString()){
            return res.render('customers/singleOrder', {order : order})

         }else{
            return res.redirect('/');
         }
     }



    }

}



module.exports = orderController


