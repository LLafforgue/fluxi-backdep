const request = require("supertest");
const express = require("express");
const Order = require("../models/orders");
const { handleStatus } = require("../controllers/ordersController");

jest.mock("../models/orders");

const app = express();
app.use(express.json());
app.post("/order/status", (req, res) => {
  req.user = { _id: "user123" }; // simulé par middleware d’auth
  return handleStatus(req, res);
});

describe("POST /order/status", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("✅ Mise à jour réussie", async () => {
    const mockResult = { acknowledged: true, modifiedCount: 1 };
    Order.updateOne.mockResolvedValue(mockResult);

    const res = await request(app)
      .post("/order/status")
      .send({ id: "order123", status: "shipped" });

    expect(res.status).toBe(200);
    expect(res.body.result).toBe(true);
    expect(res.body.data).toEqual(mockResult);
    expect(Order.updateOne).toHaveBeenCalledWith(
      { _id: "order123", user: "user123" },
      { status: "shipped" }
    );
  });

  test("❌ Commande introuvable", async () => {
    Order.updateOne.mockResolvedValue(null);

    const res = await request(app)
      .post("/order/status")
      .send({ id: "orderNotFound", status: "shipped" });

    expect(res.status).toBe(404);
    expect(res.body.result).toBe(false);
    expect(res.body.error).toBe("Commande non trouvée");
  });

  test("❌ Erreur serveur", async () => {
    Order.updateOne.mockRejectedValue(new Error("DB crash"));

    const res = await request(app)
      .post("/order/status")
      .send({ id: "order500", status: "pending" });

    expect(res.status).toBe(500);
    expect(res.body.result).toBe(false);
    expect(res.body.error).toBe("Erreur serveur");
  });
});
