import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Products } from "./pages/Products";
import { Receipts } from "./pages/Receipts";
import { DeliveryOrders } from "./pages/DeliveryOrders";
import { InventoryAdjustment } from "./pages/InventoryAdjustment";
import { MoveHistory } from "./pages/MoveHistory";
import { Settings } from "./pages/Settings";
import { MyProfile } from "./pages/MyProfile";
import { Login } from "./pages/Login";
import { ForgotPassword } from "./pages/ForgotPassword";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "products", Component: Products },
      { path: "receipts", Component: Receipts },
      { path: "delivery-orders", Component: DeliveryOrders },
      { path: "inventory-adjustment", Component: InventoryAdjustment },
      { path: "move-history", Component: MoveHistory },
      { path: "settings", Component: Settings },
      { path: "profile", Component: MyProfile },
    ],
  },
]);
