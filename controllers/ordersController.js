const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const Customer = require("../models/customer");
const Order = require("../models/orders"); 
const User = require("../models/users"); 
const finalProduct = require("../models/finalProduct");
const { checkbody } = require("../modules/checkbody");

// Middleware to set the date format for sending
// TODO : export in a module

exports.addOrder = async (req, res) => {
    
    const { products, deliveryDate, customer, price } = req.body;

    try {
        // Validate user token
        const user = req.user._id // User is set by authMiddleware
        
        // Validate client
        const clientOrder = await Customer.findOne({ user:user, name: customer });

        if (!clientOrder) {
            return res.status(401).json({ result:false, error: "Client non trouvé" });
        }
        
        // "Aggregate" product cost
        
        const productValue = await finalProduct.find({ user:user, _id: { $in: products.map(p => p._id) } });
        

        const totalCost = productValue.reduce((total, pFinal) => total + (pFinal.cost * products.find(el=>el._id.toString()===pFinal._id.toString()).quantity), 0);
        
        
        const totalPrice = productValue.reduce((total, pFinal) => 
            total + (pFinal.price * products.find(el=>el._id.toString()===pFinal._id.toString()).quantity), 0);
        if (totalPrice.toFixed(2) !== price) {
            
            return res.status(400).json({ result:false, error: "Le prix total ne correspond pas au prix des produits" });
        }
        const isValidId = mongoose.Types.ObjectId.isValid(products[0]._id);

            if (!isValidId) {
                throw new Error("Invalid product ID: " + p._id);
            }
        
        // Create new order
        const now = new Date();
            // Example reference format (before caching)
            const reference = `ORD-${("0" + now.getDate()).slice(-2)}${("0"+(now.getMonth() + 1)).slice(-2)}${now.getFullYear()}${now.getMinutes()}-${String.fromCharCode(Math.floor(Math.random()*26)+65)}`;
        
        const newOrder = new Order({
            products: products.map(p => ({ product: new mongoose.Types.ObjectId(p._id), quantity: parseFloat(p.quantity) })),
            creationDate: new Date(),
            customer: clientOrder._id,
            deliveryDate: new Date(deliveryDate),
            user: user,
            ref: reference, 
            price: Math.round(totalPrice*100)/100,
            cost: Math.round(totalCost*100)/100,
        });
        // Save the order to the database
        
        const savedOrder = await newOrder.save();
        // update stock values of each finalProducts
        try {
            for (const product of products) {
                await finalProduct.updateOne(
                    { _id: product._id, user: user },
                    { $inc: { stock: -product.quantity } }
                );
            };
        }catch(error){
            return res.status(500).json({ result:false, error: "Erreur serveur lors de la mise à jour des produits" })
        };

        // update customers orders
        try {
            await Customer.updateOne({ user:user, name: customer },{$push:{order:savedOrder._id}});
        }catch(error){
            return res.status(500).json({ result:false, error: "Erreur serveur lors de la mise à jour des produits" })
        };
        
        return res.status(201).json({ result:true, data: savedOrder });

    }catch (error) {
        return res.status(500).json({ result:false, error: "Erreur serveur" });
    }
};

// kpi dashboard orders
exports.getOrdersKpi = async (req, res) => {
    try {
      const userId = req.user._id; 
  
      const result = await Order.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" }
            },
            totalCA: { $sum: "$price" },
            countOrders: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: null,
            caGlobal: { $sum: "$totalCA" },
            totalOrders: { $sum: "$countOrders" },
            caMensuel: {
              $push: {
                month: "$_id.month",
                year: "$_id.year",
                totalCA: "$totalCA"
              }
            }
          }
        },
        {
          $addFields: {
            caMoyenParCommande: {
              $cond: [
                { $eq: ["$totalOrders", 0] },
                0,
                { $divide: ["$caGlobal", "$totalOrders"] }
              ]
            }
          }
        },
        {
          $project: {
            _id: 0,
            caGlobal: 1,
            caMoyenParCommande: 1,
            caMensuel: 1,
            totalOrders: 1
          }
        }
      ]);
  
      res.json(result.length > 0 ? result[0] : {
        caGlobal: 0,
        caMoyenParCommande: 0,
        caMensuel: []
      });
  
    } catch (error) {
      console.error("Erreur KPI CA:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  };
  

// Get all orders for a user
exports.getAllOrders = async (req, res) => {

    const user = req.user._id;
    

    try {
        // Case query params is given
        if (req.query.productId){
            const productId = new ObjectId(String(req.query.productId));

            const ordersWithProduct = await Order.find({
              "products.product": productId,
            })

            return res.json({result: true, data: ordersWithProduct})
        }

        // No query params
        const orders = await Order.find({ user: user }, 
        ).populate('products.product', 'name') 
        .populate('customer', 'name')
       
        return res.status(200).json({ result: true, data: orders });
        
    } catch (error) {
        return res.status(500).json({ result:false, error: error.message || "Erreur serveur" });
    }
}

exports.handleStatus = async (req, res) => {
    const { status, id } = req.body;
    // Check if token and required fields are present
   
    try {     
        const user = req.user._id // User is set by authMiddleware
        // Find the order by ID and user
        const order = await Order.updateOne(
                    { _id: id, user: user },
                    { status: status }
                );
        if (!order) {
            return res.status(404).json({ result:false, error: "Commande non trouvée" });
        }         
        return res.status(200).json({ result:true, data: order });
    } catch (error) {
        return res.status(500).json({ result:false, error: "Erreur serveur" });
    }
}

exports.getOneOrderById = async (req, res) => {
    const user = req.user._id // User is set by authMiddleware
    const orderId = req.params.ref;

    try {
               
        // Find the order by ID and user
        
        const order = await Order.findOne({ _id: orderId, user: user }
        ).populate('user', 'name')
        .populate('products.product')
        .populate('customer')
        .populate({
            path:'customer', 
            populate:{
                path:'order',
                model:'orders',
            }
    })
        
        if (!order) {
            return res.status(404).json({ result:false, error: "Commande introuvable" });
        }   
        return res.status(200).json({ result:true, data: order });

    } catch (error) {
        return res.status(500).json({ result:false, error: error.message || "Erreur serveur" });
    }
}

exports.getLastCustomerOrder = async (req, res) => {
    const user = req.user._id // User is set by authMiddleware
    const customerName = req.params.customer;
    try {
        // Does customer existe and get id
        const customerId = await Customer.findOne({ name: customerName, user: user })  
        // Find the order by ID and user
        if(!customerId) return res.status(404).json({result:false, error:'Client introuvable'})
        const order = await Order.find({ customer: customerId._id, user: user }
        ).populate('user', 'name')
        .populate('products.product')
        .sort({creationDate:-1})
        .limit(1)
        

        res.status(201).json({result:true, data:order})
            }catch(error){
                console.error('Erreur Serveur:',error)
                res.status(500).json({result:false, error:error})
            }
    }
exports.getAllOrdersAlert = async (req, res) => {

    const user = req.user._id;
    
    try {        
        // No query params
        const date = new Date (new Date().getTime()+1000*3600*24*7)
        const orders = await Order.find({ user: user, status:'En cours', deliveryDate:{$lt: date}}, 
        ).populate('products.product', 'name') 
        
        if(orders.length>0) return res.status(200).json({ result: true, data: orders });
        
        return res.status(204).json({ result: true, data: 'Pas de commandes dans la semaine' });
        
    } catch (error) {
        return res.status(500).json({ result:false, error: error.message || "Erreur serveur" });
    }
}
      

