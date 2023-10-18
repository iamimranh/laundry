const router = require("express").Router();
import { authMiddleware, ownerCheckMiddleware } from "./middlewares";
import {
  create,
  login,
  logout,
  profile,
  getServices,
  getServicesSubCategories,
  createOrder,
  getOrderByUser,
  updateOrderStatus,
  getOrders,
} from "./controllers";
import { upload } from "./multer";

//GET
router.get("/me", authMiddleware, profile);
router.get("/logout", authMiddleware, logout);

//GET-Services
router.get("/services", authMiddleware, getServices);
router.get(
  "/services-sub-categories",
  authMiddleware,
  getServicesSubCategories
);
//Orders
router.get("/orders", authMiddleware, getOrders);
router.get("/user-orders", authMiddleware, getOrderByUser);
router.get(
  "/user-orders-by-service-sub-category",
  authMiddleware,
  getOrderByUser
);

//POST

//Auth
router.post("/register", create);
router.post("/login", login);

//Order
router.post("/order", authMiddleware, createOrder);
router.patch(
  "/update-order-status",
  authMiddleware,
  ownerCheckMiddleware,
  updateOrderStatus
);

export { router };
