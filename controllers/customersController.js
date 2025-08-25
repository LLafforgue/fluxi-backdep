const Customer = require("../models/customer");



exports.addCustomer = async (req, res) => {
  try {
    const { name, email, tags, address, phone } = req.body;
    let lat = null;
    let lon = null;

    // If address is provided, fetch latitude and longitude
    if (address) {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      if (data.length > 0) {
        lat = parseFloat(data[0].lat);
        lon = parseFloat(data[0].lon);
      } else {
        return res.status(400).json({ result: false, error: "Invalid address" });
      }
    }

    const newCustomer = new Customer({
      name,
      tags,
      phone,
      email,
      address,
      latitude: lat,
      longitude: lon,
      user: req.user._id,
    })

    // TODO: sanitize inputs here

    newCustomer.save().then((data) => res.json({result: true, data}))

  } catch (error) {
    return res.status(500).json({ result: false, error });
  }
};

exports.getAllCustomers = async (req, res) => {
    try {
      const { sort, tag, search } = req.query
      let customerList = await Customer.find({user: req.user._id}).populate("order");

      if (tag){
        customerList = customerList.filter((el)=>{
          return el.tags.includes(tag)
        })
      }

      if (search){
        const regex = new RegExp(`${search}`,"ig")
        customerList = customerList.filter((el)=>{
          return regex.test(el.name)
        })
      }

      if (sort){
        customerList = customerList.sort((a,b) => {
           if (a.name < b.name) {
             return sort == "asc" ? -1 : 1;
           }
           if (a.name > b.name) {
             return sort == "asc" ? 1 : -1;
           }
          return 0;
        })
      }

      return res.status(200).json({ result: true, data: customerList });

    } catch (error) {
        res.status(500).json({result: false,error})
    }
}

exports.getCustomer = async (req, res) => {
    try {
        const customerId = req.params.id
        const customer = await Customer.findOne({
            _id: customerId, 
            user: req.user._id
        }).populate('order')
        .populate({
              path : "order",
              populate : {
                path:'products',
                populate : {
                  path : 'product',
                  model : 'finalproducts',
                }

              }

        });

        if (!customer){
            return res.status(404).json({ result: false, error: "Customer not found"});
        }
        return res.status(200).json({ result: true, data: customer });
        
    } catch (error) {
        res.json({result: false,error}).status(500)
    }
};

exports.modifyCustomer = async (req, res) => {
  try {
    const { name, tags, phone, email, address, customerId } = req.body;
    const updatedCustomer = { name, tags, phone, email, address };

    // TODO: sanitize inputs here

    const result = await Customer.updateOne(
      { _id: customerId, user: req.user._id },
      updatedCustomer
    );

    if (result.modifiedCount > 0) {
      return res.status(200).json({ result: true });
    } else {
      return res
        .status(404)
        .json({ result: false, error: "Customer not found or data unchanged" });
    }
  } catch (error) {
    return res.status(500).json({ result: false, error });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const resultTags = await Customer.distinct("tags")
    if (!resultTags){
      res.status(500).json({result: false, error: "error occured"})
    }
    res.status(200).json({result: true, data: resultTags})    
  } catch (error) {
    return res.status(500).json({ result: false, error });
  }
}

