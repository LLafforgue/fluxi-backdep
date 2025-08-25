const request = require("supertest");
const express = require("express");
const BrutProduct = require("../models/brutProduct");
const FinalProduct = require("../models/finalProduct");
const { getProduct } = require("../controllers/productsController");

jest.mock("../models/brutProduct");
jest.mock("../models/finalProduct");

const app = express();
app.get("/product/:id", (req, res) => getProduct(req, res));

describe("GET /product/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPopulate = (data) => ({
    populate: jest.fn().mockResolvedValue(data),
  });

  test("✅ Produit trouvé dans BrutProduct", async () => {
    BrutProduct.findById.mockReturnValue(
      mockPopulate({ _id: "123", name: "Brut A" })
    );
    FinalProduct.findById.mockReturnValue(mockPopulate(null));

    const res = await request(app).get("/product/123");

    expect(res.status).toBe(200);
    expect(res.body.result).toBe(true);
    expect(res.body.data.name).toBe("Brut A");
  });

  test("✅ Produit trouvé dans FinalProduct", async () => {
    BrutProduct.findById.mockReturnValue(mockPopulate(null));
    FinalProduct.findById.mockReturnValue(
      mockPopulate({ _id: "456", name: "Final B" })
    );

    const res = await request(app).get("/product/456");

    expect(res.status).toBe(200);
    expect(res.body.result).toBe(true);
    expect(res.body.data.name).toBe("Final B");
  });

  test("❌ Produit introuvable", async () => {
    BrutProduct.findById.mockReturnValue(mockPopulate(null));
    FinalProduct.findById.mockReturnValue(mockPopulate(null));

    const res = await request(app).get("/product/999");

    expect(res.status).toBe(200); // avec ton code actuel
    expect(res.body.result).toBe(false);
    expect(res.body.data).toBe("Product not find");
  });

  test("❌ Erreur interne", async () => {
    BrutProduct.findById.mockImplementation(() => {
      throw new Error("DB crash");
    });

    const res = await request(app).get("/product/500");

    expect(res.status).toBe(500);
    expect(res.body.result).toBe(false);
    expect(res.body.error).toBe("DB crash");
  });
});
