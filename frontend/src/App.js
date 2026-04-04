import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { CartProvider } from "./context/CartContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { CheckoutSuccessPage } from "./pages/CheckoutSuccessPage";
import { ProductPage } from "./pages/ProductPage";
import { StaffLoginPage } from "./pages/StaffLoginPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminRoute } from "./components/admin/AdminRoute";

function App() {
  return (
    <div className="App min-h-screen bg-[#F9F8F6]">
      <BrowserRouter>
        <AdminAuthProvider>
          <CartProvider>
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/shop/:slug" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/staff/login" element={<StaffLoginPage />} />
                <Route
                  path="/staff"
                  element={
                    <AdminRoute>
                      <AdminDashboardPage />
                    </AdminRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
          </CartProvider>
        </AdminAuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
