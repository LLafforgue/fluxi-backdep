const Production = require("../models/production");
const FinalProduct = require("../models/finalProduct");



exports.addProduction =  async (req, res) => {
  try {
    const { product, date, quantity, nlot, cost, start, end } = req.body;

    //  Validation
    if (!product || !nlot || !quantity) {
      return res.status(400).json({ result: false, message: "Tous les champs sont requis." });
    }

    // Récupération du produit final avec recette + produits bruts
    const produitFinal = await FinalProduct.findOne({ name: product, user: req.user._id })
      .populate("receipe.product");
      
    if (!produitFinal) {
      return res.status(404).json({ result: false, message: "Produit final introuvable." });
    }

    // Vérification du stock brut
    for (const item of produitFinal.receipe) {
      if (!item.product) continue; // sécurité si produit brut supprimé
      const neededQty = item.quantity * Number(quantity);
      if (item.product.stock < neededQty) {
        return res.status(400).json({
          message: `Stock insuffisant pour ${item.product.name} (besoin : ${neededQty}, dispo : ${item.product.stock})`
        });
      }
    }

    //  Création de la production
    const newProduction = new Production({
      product,
      date: date ? new Date(date) : new Date(), // Remove unused date ?
      quantity,
      nlot,
      cost,
      start: start ? new Date(start) : new Date(),
      end: end ? new Date(end) : null,
      user: req.user._id,
    });
    await newProduction.save();

    //  Décrémentation du stock brut
    for (const item of produitFinal.receipe) {
      item.product.stock -= item.quantity * Number(quantity);
      await item.product.save();
    }

    //  Incrémentation du stock du produit final
    produitFinal.stock = (produitFinal.stock || 0) + Number(quantity);
    await produitFinal.save();

    // Réponse
    res.status(201).json({
      result: true,
      message: "Production créée avec succès",
      production: newProduction,
      receipe: produitFinal.receipe
    });

  } catch (error) {
    res.status(500).json({
      result: false,
      message: "Erreur lors de la création de la production",
      error: error.message
    });
  }
};

// Route pour récupérer toutes les productions
exports.getAllProduction = async (req, res) => {
  try {
    const productions = await Production.find({user: req.user._id});
    res.status(200).json({ result: true, productions });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des productions",
      error: error.message
    });
  }
};



