const Supplier = require("../models/suppliers");

exports.addSupplier = async (req, res) => {
  try {
    const { name, email, tags, address, phone } = req.body;
    const newSupplier = new Supplier({
      name,
      tags,
      phone,
      email,
      address,
      user: req.user._id,
    });


    const data = await newSupplier.save();
    return res.json({ result: true, data });
  } catch (error) {
    return res
      .status(500)
      .json({ result: false, error: error.message || "Erreur serveur" });
  }
};


exports.getAllSuppliers = async (req, res) => {
  try {
    const { sort, tag, search } = req.query;
    let suppliersList = await Supplier.find({ user: req.user._id });

    if (tag) {
      suppliersList = suppliersList.filter((el) => {
        return el.tags.includes(tag);
      });
    }

    if (search) {
      const regex = new RegExp(`${search}`, "ig");
      suppliersList = suppliersList.filter((el) => {
        return regex.test(el.name);
      });
    }

    if (sort) {
      suppliersList = suppliersList.sort((a, b) => {
        const nameA = a.name.toLowerCase()
        const nameB = b.name.toLowerCase()
        if (nameA < nameB) {
          return sort == "asc" ? -1 : 1;
        }
        if (nameA > nameB) {
          return sort == "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return res.status(200).json({ result: true, data: suppliersList });
  } catch (error) {
    res.status(500).json({ result: false, error });
  }
};

exports.getSupplier = async (req, res) => {
  try {
    const supplierId = req.params.id;
    const supplier = await Supplier.findOne({
      _id: supplierId,
      user: req.user._id,
    });

    if (!supplier) {
      return res
        .status(404)
        .json({ result: false, error: "Supplier not found" });
    }
    return res.status(200).json({ result: true, data: supplier });
  } catch (error) {
    res.json({ result: false, error }).status(500);
  }
};

exports.modifySupplier = async (req, res) => {
  try {
    const { name, tags, phone, email, address, supplierId } = req.body;
    const updatedSupplier = { name, tags, phone, email, address };

    // TODO: sanitize inputs here

    const result = await Supplier.updateOne(
      { _id: supplierId, user: req.user._id },
      updatedSupplier
    );

    if (result.modifiedCount > 0) {
      return res.status(200).json({ result: true });
    } else {
      return res
        .status(404)
        .json({ result: false, error: "Supplier not found or data unchanged" });
    }
  } catch (error) {
    return res.status(500).json({ result: false, error });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const resultTags = await Supplier.distinct("tags");
    if (!resultTags) {
      res.status(500).json({ result: false, error: "error occured" });
    }
    res.status(200).json({ result: true, data: resultTags });
  } catch (error) {
    return res.status(500).json({ result: false, error });
  }
};
