// App.jsx
import "./App.css";
import "./styles/global.css";
import "animate.css";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import queryClient from "./lib/queryClient";
import { AuthProvider } from "./components/auth_components/AuthManager";
import { CartProvider } from "./components/cart_components/CartContext";
import { WishlistProvider } from "./components/wishlist_components/WishlistContext";
import MainLayout from "./components/common_components/MainLayout";
import TopArrow from "./components/common_components/TopArrow";

function App() {
  return (
    <>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <WishlistProvider>
              <Router>
                <div>
                  <MainLayout />
                </div>
                <TopArrow scrollTargetId="app-scroll" />
              </Router>
            </WishlistProvider>
          </CartProvider>
        </QueryClientProvider>
      </AuthProvider>

      <ToastContainer position="top-right" />
    </>
  );
}

export default App;
