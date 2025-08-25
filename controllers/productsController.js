const FinalProduct = require('../models/finalProduct')
const BrutProduct = require('../models/brutProduct')

exports.addProduct = async (req, res) => {
   try {
      // Case BRUT or FINAL 
      const type = req.body.type

      if (type == "BRUT"){
        const { productName: name, price: cost, supplier, unity } = req.body;

        // TODO Body verif
        if (!name || !cost || !supplier || !unity) {
          return res.json({
            result: false,
            data: "Data not invalid or undefined",
          });
        }

        const newBrutProduct = new BrutProduct({
          name,
          cost,
          supplier,
          unity,
          stock: 0,
          user: req.user._id,
        });

        newBrutProduct.save().then((resp) => {
          return res.json({ result: Boolean(resp), data: resp });
        });
      }
      
      if (type == "FINAL"){
        const {
          productName: name,
          salePrice: price,
          receipe,
          unity,
          shelfLife: dlc,
        } = req.body;

        // TODO Body verif
        if (!name || !price || !unity || !dlc || !receipe) {
          return res.json({
            result: false,
            data: "Data invalid or undefined",
          });
        }

        const brutProductFromReceipe = await Promise.all(
            receipe.map((el) => {
              return BrutProduct.findById(el.id) 
            })
        )

        const formatedReceipe = receipe.map((el)=>{
         return {
            product: el.id,
            quantity: el.quantity
         }
        })

         const totalCost = brutProductFromReceipe.reduce((acc, curr, index) => {
            const quantity = receipe[index].quantity
            return acc + (curr.cost * quantity)
         },0)

        const newFinalProduct = new FinalProduct({
          name,
          cost: totalCost,
          price,
          dlc,
          unity,
          receipe: formatedReceipe,
          stock: 0,
          user: req.user._id,
        });

        newFinalProduct.save().then((resp) => {
          return res.json({ result: Boolean(resp), data: resp });
        });
      }
      
   } catch (error) {
      res.status(500).json({ result: false, error: error.message });
   }

};

exports.getAllProducts = async (req, res) => {
   try{
      const productType = req.query.type
      const supplierId = req.query.supplierId

      const finalProducts = await FinalProduct.find({
         user: req.user._id,
      }).populate("receipe.product");
      const brutProducts = await BrutProduct.find({
         user: req.user._id,
      }).populate("supplier");

      // Query param brut product
      if (productType == 1){
         // Query param supplierId
         if (supplierId){
            const brutSupplierProducts = await BrutProduct.find({
               user: req.user._id,
               supplier: supplierId
            })
            if (!brutSupplierProducts){
               return res.json({ result: false, data: "invalid supplier"});
            }
            return res.json({ result: true, data: brutSupplierProducts });
         }
         return res.json({ result: true, data: brutProducts });
      }

      // Query param final product
      if (productType == 2){   
         if (supplierId){
            return res.json({ result: false, data: "final product does not have supplier" });
         }
         return res.json({ result: true, data: finalProducts });
      }
      // No query params
      const products = [...brutProducts, ...finalProducts];
      return res.json({ result: true, data: products });

   }catch (error) {
      res.status(500).json({ result: false, error: error.message });
   }
};

exports.getProduct = async (req, res) => {
   try {
      // Find the product in eihter BrutProducts or FinalProduct
      const id = req.params.id
      
      const brutRes = await BrutProduct.findById(id).populate("supplier");
      const finalRes = await FinalProduct.findById(id).populate("receipe.product");
      
      if (!brutRes && !finalRes){
         return res.json({result: false, data: "Product not find"})
      }

      return res.json({result: true, data: brutRes ? brutRes : finalRes})

   } catch (error) {
      res.status(500).json({ result: false, error: error.message });
   }
};

exports.modifyProduct = async (req, res) => {
   const user = req.user._id;
   const {type, id, stock} = req.body
try {
   let data;
   if (type === "produit brut") {
       data = await BrutProduct.updateOne({ user, _id:id }, { stock });
   } else if (type === "produit transformé") {
       data = await FinalProduct.updateOne({ user, _id:id }, { stock });
   } else {
       res.status(404).json({ result: false, error: "Type de produit non reconnu" });
       return 
   }


   if (data.modifiedCount===0) return  res.status(404).json({ result: false, error: "Produit introuvable" });
        

   res.status(200).json({ result: true, data: data });
   return
   
   } catch (error) {
      res.status(500).json({ result: false, error: "Erreur serveur" });
      return 
   }

};

exports.modifyProductName = async (req,res) =>{
   
   const user = req.user._id;
   const {type, id, newName} = req.body
   
try {

   let data;
   if (type === "produit brut") {
      const checkNames = await BrutProduct.findOne({ user, name:newName })
      if(checkNames) return res.status(401).json({ result: false, error: "Nom de produit déjà utilisé" })
       data = await BrutProduct.updateOne({ user, _id:id }, { name:newName });

   } else if (type === "produit transformé") {
      const checkNames = await FinalProduct.findOne({ user, name:newName })
      if(checkNames) return res.status(401).json({ result: false, error: "Nom de produit déjà utilisé" })
       data = await FinalProduct.updateOne({ user, _id:id  }, { name:newName });

   } else {
       return res.status(404).json({ result: false, error: "Type de produit non reconnu" });
   }

   if (!data) {
       return res.status(404).json({ result: false, error: "Produit introuvable" });
   }

   res.status(200).json({ result: true, data: data });
   } catch (error) {
      return res.status(500).json({ result: false, error: "Erreur serveur" });
   }
}

exports.getAllProductsAlert = async (req,res)=>{

   try{

      const finalProducts = await FinalProduct.find(
         {user: req.user._id, stock:{$lt:5}},
         {name:1, stock:1, unity:1}
      );
      const brutProducts = await BrutProduct.find(
         {user: req.user._id, stock:{$lt:5}},
         {name:1, stock:1, unity:1}
      ).populate("supplier");
      
      if(finalProducts.length>0||brutProducts.length>0){
      const products = [...brutProducts, ...finalProducts];
      return res.status(200).json({ result: true, data: products });

      };

      return res.status(204).json({ result: true, data: "Pas d'alerte sur les produits en stock" });

   }catch (error) {
      res.status(500).json({ result: false, error: error.message });
   }   
}