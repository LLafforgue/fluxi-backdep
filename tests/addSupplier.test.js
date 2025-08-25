const request = require("supertest");
const express = require("express");
const Supplier = require("../models/suppliers");
const { addSupplier } = require("../controllers/suppliersController");

jest.mock("../models/suppliers");

const app = express();
app.use(express.json());
app.post("/suppliers", (req, res) => {
  req.user = { _id: "user123" }; // simulation utilisateur
  return addSupplier(req, res);
});

describe("POST /suppliers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("✅ Ajout réussi", async () => {
    Supplier.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue({ name: "Acme Corp" }),
    }));

    const res = await request(app)
      .post("/suppliers")
      .send({
        name: "Acme Corp",
        email: "contact@acme.com",
        tags: ["preferred"],
        phone: "0600000000",
        address: "Rue de la Paix, Paris",
      });

    expect(res.status).toBe(200);
    expect(res.body.result).toBe(true);
    expect(res.body.data.name).toBe("Acme Corp");
  });

  test("❌ Erreur interne", async () => {
    Supplier.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("DB Error")),
    }));

    const res = await request(app).post("/suppliers").send({
      name: "Crash Corp",
      email: "crash@corp.com",
      address: "Somewhere",
    });

    expect(res.status).toBe(500);
    expect(res.body.result).toBe(false);
  });
});
