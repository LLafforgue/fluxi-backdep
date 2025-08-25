require("dotenv").config()
const mongoose = require('mongoose');
const User = require('./models/users');
const BrutProduct = require('./models/brutProduct');
const FinalProduct = require('./models/finalProduct');
const Customer = require('./models/customer');
const Supplier = require('./models/suppliers');
const Order = require('./models/orders');
const Production = require('./models/production');

const MONGO_URI = process.env.MONGO_URI;

if (process.argv.length < 3) {
  console.error('Usage: node seed.js <userId>');
  process.exit(1);
}
const userId = process.argv[2];

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  await mongoose.connect(MONGO_URI);

  // Nettoyage des anciennes données liées à ce user
  await Promise.all([
    BrutProduct.deleteMany({ user: userId }),
    FinalProduct.deleteMany({ user: userId }),
    Customer.deleteMany({ user: userId }),
    Supplier.deleteMany({ user: userId }),
    Order.deleteMany({ user: userId }),
    Production.deleteMany({ user: userId }),
  ]);

  // 1. Suppliers
  const supplierNames = [
    'Ferme du Pré Vert', 'Coopérative Laitière', 'Fournisseur Fruits Rouges', 'Maison des Arômes', 'Chocolaterie Artisanale',
    'Ferme des Trois Vallées', 'Producteur Bio Sud', 'Moulins de France', 'Apiculteur du Village', 'Ferme des Montagnes'
  ];
  const suppliers = await Supplier.insertMany(
    supplierNames.map((name) => ({
      name,
      tags: randomFromArray(["bio", "local", "import", "premium", "standard"]),
      phone: `06${Math.floor(10000000 + Math.random() * 89999999)}`,
      email: `contact@${name.replace(/ /g, "").toLowerCase()}.fr`,
      address: `${Math.floor(
        Math.random() * 100
      )} route de la Ferme, ${randomFromArray([
        "Paris",
        "Lyon",
        "Toulouse",
        "Nantes",
        "Bordeaux",
      ])}`,
      user: userId,
    }))
  );

  // 2. Brut Products
  const brutProductsData = [
    'Lait cru', 'Crème', 'Ferments lactiques', 'Sucre', 'Fruits rouges', 'Vanille',
    'Cacao', 'Sel', 'Eau', 'Stabilisant', 'Arôme naturel', 'Lait écrémé', 'Lait entier',
    'Lait demi-écrémé', 'Myrtilles', 'Fraises', 'Abricots', 'Pêches', 'Mangues', 'Pommes',
    'Poire', 'Noisettes', 'Amandes', 'Miel', 'Caramel', 'Chocolat', 'Levure', 'Beurre cru',
    'Crème épaisse', 'Lait concentré'
  ];
  while (brutProductsData.length < 30) {
    brutProductsData.push(randomFromArray(brutProductsData) + ' (lot ' + Math.floor(Math.random()*100) + ')');
  }
  const brutProducts = await BrutProduct.insertMany(
    brutProductsData.map(name => ({
      name,
      type: randomFromArray(['laitier', 'fruit', 'additif', 'sucre', 'arôme']),
      stock: Math.floor(Math.random() * 500) + 50,
      unity: randomFromArray(['L', 'kg', 'g']),
      cost: Math.round((Math.random() * 10 + 1) * 100) / 100,
      supplier: randomFromArray(suppliers)._id,
      user: userId
    }))
  );

  // 3. Final Products (avec receipe)
  const finalProductsData = [
    'Yaourt nature', 'Fromage blanc', 'Beurre doux', 'Lait UHT', 'Crème fraîche',
    'Yaourt aux fruits', 'Lait chocolaté', 'Fromage affiné', 'Dessert lacté', 'Lait fermenté'
  ].map(name => ({
    name,
    stock: Math.floor(Math.random() * 200) + 20,
    unity: randomFromArray(['pot', 'brique', 'kg', 'L']),
    cost: Math.round((Math.random() * 20 + 2) * 100) / 100,
    price: Math.round((Math.random() * 30 + 3) * 100) / 100,
    dlc: Math.floor(Math.random() * 30) + 7,
    receipe: Array.from({ length: Math.floor(Math.random() * 3) + 2 }).map(() => ({
      product: randomFromArray(brutProducts)._id,
      quantity: Math.floor(Math.random() * 10) + 1
    })),
    user: userId
  }));
  const finalProducts = await FinalProduct.insertMany(finalProductsData);

  // 4. Customers
  const frenchLocations = [
    { city: "Paris", cp: "75000", lat: 48.856613, lng: 2.352222 },
    { city: "Lyon", cp: "69000", lat: 45.764043, lng: 4.835659 },
    { city: "Marseille", cp: "13000", lat: 43.296482, lng: 5.36978 },
    { city: "Toulouse", cp: "31000", lat: 43.604652, lng: 1.444209 },
    { city: "Nice", cp: "06000", lat: 43.710173, lng: 7.261953 },
    { city: "Nantes", cp: "44000", lat: 47.218371, lng: -1.553621 },
    { city: "Bordeaux", cp: "33000", lat: 44.837789, lng: -0.57918 },
    { city: "Strasbourg", cp: "67000", lat: 48.573405, lng: 7.752111 },
    { city: "Montpellier", cp: "34000", lat: 43.61194, lng: 3.877718 },
    { city: "Rennes", cp: "35000", lat: 48.117266, lng: -1.677792 }
  ];
  
  const streetNames = [
    "rue de la République",
    "avenue Victor Hugo",
    "boulevard Voltaire",
    "rue du Général de Gaulle",
    "chemin des Écoliers",
    "place de la Liberté",
    "allée des Acacias",
    "impasse des Lilas"
  ];
  
  const customerNames = [
    "Supermarché Leclerc", "Boulangerie Dupont", "Épicerie Verte", "Marché Bio", "Restaurant La Table",
    "Fromagerie des Alpes", "Primeur du Marché", "Café du Centre", "Hôtel Bellevue", "Crèmerie Parisienne",
    "École Saint-Exupéry", "Hôpital Général", "Maison de Retraite Les Lilas", "Cantine Municipale", "Boucherie Martin",
    "Pâtisserie Gourmande", "Brasserie du Coin", "Magasin Fraîcheur", "Supérette Express", "Marché Fermier",
    "Traiteur Saveurs", "Snack du Parc", "Bar des Sports", "Camping Soleil", "Gîte Rural", "Auberge du Lac",
    "Resto Rapide", "Livraison Express", "Épicerie du Quartier", "Marché de Nuit", "Café des Artistes",
    "Boulangerie du Village", "Fromagerie du Marché", "Super U", "Carrefour Market", "Intermarché",
    "Casino Shop", "Auchan City", "Biocoop", "Naturalia", "La Vie Claire", "Grand Frais", "Lidl", "Aldi", "Leader Price"
  ];
  
  const customers = await Customer.insertMany(
    customerNames.slice(0, 45).map(name => {
      const cityData = randomFromArray(frenchLocations);
      const street = `${Math.floor(Math.random() * 200) + 1} ${randomFromArray(streetNames)}`;
      return {
        name,
        tags: randomFromArray(["pro", "particulier", "restauration", "collectivité"]),
        phone: `07${Math.floor(10000000 + Math.random() * 89999999)}`,
        email: `contact@${name.replace(/ /g, "").toLowerCase()}.fr`,
        address: `${street}, ${cityData.cp} ${cityData.city}, France`,
        latitude: cityData.lat,
        longitude: cityData.lng,
        user: userId,
        order: []
      };
    })
  );
  

  // 5. Orders (~100) et remplissage des orders de chaque customer
  const orders = [];
  for (let i = 0; i < 100; i++) {
    const customer = randomFromArray(customers);
    const orderProducts = Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map(() => {
      const prod = randomFromArray(finalProducts);
      return {
        product: prod._id,
        quantity: Math.floor(Math.random() * 100) + 1
      };
    });
    const order = {
      customer: customer._id,
      products: orderProducts,
      creationDate: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
      deliveryDate: new Date(Date.now() + Math.floor(Math.random() * 1000000000)),
      ref: `CMD${1000 + i}`,
      user: userId,
      price: Math.round((Math.random() * 500 + 50) * 100) / 100,
      cost: Math.round((Math.random() * 300 + 30) * 100) / 100
    };
    orders.push({ ...order, _customer: customer }); // on garde le customer pour lier après
  }
  // Insertion des orders
  const insertedOrders = await Order.insertMany(orders.map(({ _customer, ...rest }) => rest));
  // Mise à jour des customers avec leurs orders
  for (let i = 0; i < orders.length; i++) {
    const customer = orders[i]._customer;
    customer.order.push(insertedOrders[i]._id);
  }
  // On sauvegarde les customers modifiés
  await Promise.all(customers.map(c => c.save()));

  // 6. Production (~15)
  const day = 1000 * 60 * 60 * 24
  const productions = [];
  for (let i = 0; i < 15; i++) {
    
    const start = new Date(Date.now() - Math.floor(Math.random() * (60 * day)))

    productions.push({
      product: randomFromArray(finalProducts).name,
      date: start,
      quantity: Math.floor(Math.random() * 200) + 10,
      nlot: `LOT${1000 + i}`,
      cost: Math.round((Math.random() * 200 + 20) * 100) / 100,
      start,
      end: new Date(start.getTime() + 1000 * 60 * 60 * 2),
      user: userId
    });
  }
  await Production.insertMany(productions);

  console.log('Seed terminé avec succès !');
  mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  mongoose.disconnect();
});