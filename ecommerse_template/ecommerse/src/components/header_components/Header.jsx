// import { useContext, useMemo, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { Dialog, DialogPanel } from "@headlessui/react";
// import {
//   Bars3Icon,
//   XMarkIcon,
//   ChevronDownIcon,
//   MagnifyingGlassIcon,
// } from "@heroicons/react/24/outline";
// import { FaHeart } from "react-icons/fa";
// import { AuthContext } from "../../components/auth_components/AuthManager";
// import { CartContext } from "../../components/cart_components/CartContext";
// import { WishlistContext } from "../../components/wishlist_components/WishlistContext";
// import CustomeLink from "../common_components/CustomeLink";
// import MiniCart from "../../pages/cart_pages/MiniCart";
// import { MdOutlineCameraswitch } from "react-icons/md";

// export default function Header() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [isDropdownOpen, setDropdownOpen] = useState(false);
//   const [searchInput, setSearchInput] = useState("");

//   const { user, isLoggedIn, logout } = useContext(AuthContext);
//   const { resetCartState } = useContext(CartContext);
//   const { wishlistItems } = useContext(WishlistContext);

//   const navigate = useNavigate();

//   const handleLogout = () => {
//     resetCartState();
//     setDropdownOpen(false);
//     logout();
//     navigate("/home");
//   };

//   const goToProfile = () => {
//     navigate(`/profile/${user?.id}`);
//     setDropdownOpen(false);
//   };

//   const dashboardRoute = useMemo(() => {
//     if (!user?.role) return "/dashboard";
//     const roleRoutes = { user: "/dashboard" };
//     return roleRoutes[user.role] || "/dashboard";
//   }, [user?.role]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchInput.trim()) {
//       navigate(
//         `/search-products?query=${encodeURIComponent(searchInput.trim())}`
//       );
//       setSearchInput("");
//       setMobileMenuOpen(false); // ✅ close menu on search
//     }
//   };

//   return (
//     <header className="shadow-md sticky top-0 z-50 bg-white/90 backdrop-blur-md">
//       <nav className="containerWidth flex items-center justify-between py-3">
//         {/* Left - Logo & Shop */}
//         <div className="flex items-center gap-6">
//           <a href="/home" className="">< MdOutlineCameraswitch className="text-cyan-500 w-20 h-20"/></a>

//           <CustomeLink
//             linkAddress="/shop"
//             linkName="SHOP ALL"
//             customStyles="hidden md:inline-block text-sm font-medium text-gray-600 hover:text-black transition"
//           />
//         </div>

//         {/* Center - Desktop Search */}
//         <div className="hidden lg:flex flex-1 justify-center">
//           <form
//             onSubmit={handleSearch}
//             className="flex w-full max-w-2xl rounded-full overflow-hidden border border-gray-300 bg-white"
//           >
//             <input
//               type="text"
//               placeholder="Search for products..."
//               className="flex-grow px-5 py-2 outline-none text-gray-700 placeholder-gray-400"
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//             />
//             <button
//               type="submit"
//               className="px-4 bg-gradient-to-r from-red-500 to-orange-400 text-white flex items-center justify-center hover:opacity-90 transition"
//             >
//               <MagnifyingGlassIcon className="w-5 h-5" />
//             </button>
//           </form>
//         </div>

//         {/* Right - Wishlist + Cart + User */}
//         <div className="hidden lg:flex items-center gap-6">
//           <Link to="/wishlist" className="relative group flex items-center">
//             <div className="relative">
//               <FaHeart className="text-pink-500 text-2xl hover:scale-110 transition-transform duration-300" />
//               {isLoggedIn && wishlistItems.length > 0 && (
//                 <span className="absolute -top-3 -right-4 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow animate-bounce-slow">
//                   {wishlistItems.length}
//                 </span>
//               )}
//             </div>
//           </Link>

//           <MiniCart />

//           {isLoggedIn && user ? (
//             <div className="relative">
//               <button
//                 onClick={() => setDropdownOpen(!isDropdownOpen)}
//                 className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-black transition uppercase"
//               >
//                 {user.name}
//                 <ChevronDownIcon className="w-4 h-4" />
//               </button>
//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-3 w-44 bg-white border rounded-lg shadow-md z-20 overflow-hidden">
//                   <button
//                     onClick={goToProfile}
//                     className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
//                   >
//                     Profile
//                   </button>
//                   <button
//                     onClick={() => {
//                       navigate("/my-orders");
//                       setDropdownOpen(false);
//                     }}
//                     className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
//                   >
//                     My Orders
//                   </button>
//                   <button
//                     onClick={() => {
//                       navigate(dashboardRoute);
//                       setDropdownOpen(false);
//                     }}
//                     className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
//                   >
//                     Dashboard
//                   </button>
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 text-sm"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <Link to="/login" className="flex items-center gap-2">
//               <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-full shadow-lg">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="white"
//                   viewBox="0 0 24 24"
//                   className="w-5 h-5"
//                 >
//                   <path d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4Zm0-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
//                 </svg>
//               </div>
//               <span className="text-sm text-gray-700 font-medium">Sign in</span>
//             </Link>
//           )}
//         </div>

//         {/* Mobile Menu Toggle */}
//         <div className="flex lg:hidden">
//           <button
//             onClick={() => setMobileMenuOpen(true)}
//             className="p-2 text-gray-700 hover:text-black"
//           >
//             <Bars3Icon className="w-6 h-6" />
//           </button>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       <Dialog
//         as="div"
//         open={mobileMenuOpen}
//         onClose={setMobileMenuOpen}
//         className="lg:hidden"
//       >
//         <div className="fixed inset-0 z-40 bg-black bg-opacity-50" />
//         <DialogPanel
//           role="dialog"
//           aria-modal="true"
//           className="fixed inset-y-0 right-0 z-50 w-80 bg-white p-6 overflow-y-auto shadow-xl transition-transform duration-300 transform translate-x-0"
//         >
//           <div className="flex items-center justify-between mb-6">
//             <CustomeLink
//               linkAddress="/home"
//               linkName="ECOMMERSE"
//               customStyles="text-xl font-bold text-gray-900"
//             />
//             <button
//               onClick={() => setMobileMenuOpen(false)}
//               className="p-2 text-gray-600 hover:text-black"
//             >
//               <XMarkIcon className="w-6 h-6" />
//             </button>
//           </div>

//           {/* Mobile Search */}
//           <form onSubmit={handleSearch} className="mb-6">
//             <div className="flex rounded-full overflow-hidden border border-gray-300 bg-white shadow">
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 className="w-full px-4 py-2 text-sm text-gray-700 outline-none"
//                 value={searchInput}
//                 onChange={(e) => setSearchInput(e.target.value)}
//               />
//               <button
//                 type="submit"
//                 className="px-4 bg-gradient-to-r from-red-500 to-orange-400 text-white"
//               >
//                 <MagnifyingGlassIcon className="w-5 h-5" />
//               </button>
//             </div>
//           </form>

//           {/* Mobile Navigation Links */}
//           <div className="space-y-6">
//             <div className="flex flex-col gap-3">
//               <CustomeLink
//                 linkAddress="/shop"
//                 linkName="SHOP ALL"
//                 customStyles="block text-lg font-semibold text-gray-700 hover:text-black"
//                 onClick={() => setMobileMenuOpen(false)}
//               />
//               <CustomeLink
//                 linkAddress="/cart"
//                 linkName="Cart"
//                 customStyles="block text-lg font-semibold text-gray-700 hover:text-black"
//                 onClick={() => setMobileMenuOpen(false)}
//               />
//             </div>

//             {isLoggedIn && user ? (
//               <>
//                 <button
//                   onClick={() => {
//                     goToProfile();
//                     setMobileMenuOpen(false);
//                   }}
//                   className="block w-full text-left text-lg font-semibold text-gray-700 hover:text-black"
//                 >
//                   Profile
//                 </button>
//                 <button
//                   onClick={() => {
//                     navigate("/my-orders");
//                     setMobileMenuOpen(false);
//                   }}
//                   className="block w-full text-left text-lg font-semibold text-gray-700 hover:text-black"
//                 >
//                   My Orders
//                 </button>
//                 <button
//                   onClick={() => {
//                     handleLogout();
//                     setMobileMenuOpen(false);
//                   }}
//                   className="block w-full text-left text-lg font-semibold text-red-500 hover:text-red-700"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <CustomeLink
//                 linkAddress="/login"
//                 linkName="Login"
//                 customStyles="block text-lg font-semibold text-gray-700 hover:text-black"
//                 onClick={() => setMobileMenuOpen(false)}
//               />
//             )}
//           </div>
//         </DialogPanel>
//       </Dialog>
//     </header>
//   );
// }

//till here old code.

import { useContext, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { FaHeart } from "react-icons/fa";
import { AuthContext } from "../../components/auth_components/AuthManager";
import { CartContext } from "../../components/cart_components/CartContext";
import { WishlistContext } from "../../components/wishlist_components/WishlistContext";
import CustomeLink from "../common_components/CustomeLink";
import MiniCart from "../../pages/cart_pages/MiniCart";
import { MdOutlineCameraswitch } from "react-icons/md";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const { resetCartState } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    resetCartState();
    setDropdownOpen(false);
    logout();
    navigate("/home");
  };

  const goToProfile = () => {
    navigate(`/profile/${user?.id}`);
    setDropdownOpen(false);
  };

  const dashboardRoute = useMemo(() => {
    if (!user?.role) return "/dashboard";
    const roleRoutes = { user: "/dashboard" };
    return roleRoutes[user.role] || "/dashboard";
  }, [user?.role]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(
        `/search-products?query=${encodeURIComponent(searchInput.trim())}`
      );
      setSearchInput("");
      setMobileMenuOpen(false); // ✅ close menu on search
    }
  };

  const closeAllMenus = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 hp-font">
      {/* Modern font + a11y + small animations (lightweight) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .hp-font { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, 'Apple Color Emoji','Segoe UI Emoji'; }
        .containerFull { width: 100%; }
        .maxShell { margin: 0 auto; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes softPulse { 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.05);} }
        .pulse-soft { animation: softPulse 1.8s ease-in-out infinite; }
        @keyframes floatIn { from { opacity:0; transform: translateY(8px);} to { opacity:1; transform: translateY(0);} }
        .float-in { animation: floatIn .22s ease-out; }
      `}</style>

      {/* Full-width header background */}
      <div className="containerFull bg-white/85 backdrop-blur-xl ">
        {/* Full width bar, content constrained */}
        <nav className="maxShell px-3 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-3">
          {/* Left - Logo & Shop */}
          <div className="flex items-center gap-3 sm:gap-5 min-w-0">
            <a
              href="/home"
              className="group inline-flex items-center gap-2 rounded-2xl px-2 py-1 hover:bg-orange-50 transition"
              aria-label="Go to home"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="relative">
                <div className="absolute -inset-2 rounded-2xl bg-orange-500/15 blur-xl opacity-0 group-hover:opacity-100 transition" />
                <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center shadow-md shadow-orange-500/25">
                  <MdOutlineCameraswitch className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                </div>
              </div>

              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-[13px] font-extrabold text-gray-900 tracking-tight">
                  ECOMMERCE
                </span>
                <span className="text-[11px] font-semibold text-orange-600">
                  Shop smarter
                </span>
              </div>
            </a>

            <CustomeLink
              linkAddress="/shop"
              linkName="SHOP ALL"
              customStyles="hidden md:inline-flex items-center justify-center rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-[12px] font-extrabold text-orange-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition"
            />
          </div>

          {/* Center - Desktop Search */}
          <div className="hidden lg:flex flex-1 justify-center">
            <form
              onSubmit={handleSearch}
              className="w-full max-w-3xl"
              role="search"
            >
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                <input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  className="w-full rounded-full border border-orange-200 bg-white/95 pl-12 pr-36 py-3 text-[14px] font-semibold text-gray-800 placeholder-gray-400 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-2.5 text-white font-extrabold text-[12px] shadow-lg shadow-orange-500/25 hover:opacity-95 active:scale-[0.99] transition"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Right - Wishlist + Cart + User */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/wishlist"
              className="relative group flex items-center"
              aria-label="Wishlist"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="relative rounded-2xl  bg-white px-3 py-2  hover:shadow-md transition">
                <FaHeart className="text-orange-500 text-xl group-hover:scale-110 transition-transform duration-200" />
                {isLoggedIn && wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow pulse-soft">
                    {wishlistItems.length}
                  </span>
                )}
              </div>
            </Link>

            {/* Keep MiniCart exactly as-is */}
            <div className="rounded-2xl bg-white px-2 py-2  hover:shadow-md transition">
              <MiniCart />
            </div>

            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!isDropdownOpen)}
                  className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-[12px] font-extrabold text-orange-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition uppercase"
                  aria-haspopup="menu"
                  aria-expanded={isDropdownOpen ? "true" : "false"}
                >
                  <span className="max-w-[160px] truncate">{user.name}</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-52 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-xl z-20 float-in">
                    <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                      <p className="text-[11px] font-black text-gray-900 uppercase tracking-wide">
                        Signed in
                      </p>
                      <p className="text-[12px] font-semibold text-orange-700 truncate">
                        {user?.name}
                      </p>
                    </div>

                    <button
                      onClick={goToProfile}
                      className="block w-full text-left px-4 py-2.5 hover:bg-orange-50 text-[13px] font-semibold text-gray-700"
                    >
                      Profile
                    </button>

                    <button
                      onClick={() => {
                        navigate("/my-orders");
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2.5 hover:bg-orange-50 text-[13px] font-semibold text-gray-700"
                    >
                      My Orders
                    </button>

                    <button
                      onClick={() => {
                        navigate(dashboardRoute);
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2.5 hover:bg-orange-50 text-[13px] font-semibold text-gray-700"
                    >
                      Dashboard
                    </button>

                    <div className="border-t border-orange-100" />

                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2.5 text-[13px] font-extrabold text-red-500 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-2.5 shadow-lg shadow-orange-500/25 hover:opacity-95 transition"
                aria-label="Sign in"
              >
                <div className="bg-white/15 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                  >
                    <path d="M12 12c2.67 0 8 1.34 8 4v2H4v-2c0-2.66 5.33-4 8-4Zm0-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
                  </svg>
                </div>
                <span className="text-[12px] font-extrabold text-white">
                  SIGN IN
                </span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Mobile wishlist quick icon */}
            <Link
              to="/wishlist"
              className="relative"
              aria-label="Wishlist"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="rounded-2xl border border-orange-200 bg-white px-3 py-2 shadow-sm">
                <FaHeart className="text-orange-500 text-lg" />
                {isLoggedIn && wishlistItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-black shadow">
                    {wishlistItems.length}
                  </span>
                )}
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-2xl border border-orange-200 bg-white px-3 py-2 text-gray-800 shadow-sm hover:shadow-md transition"
              aria-label="Open menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </nav>

        {/* Mobile: compact search row */}
        <div className="lg:hidden maxShell px-3 sm:px-6 lg:px-10 pb-3">
          <form onSubmit={handleSearch} className="w-full" role="search">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-full border border-orange-200 bg-white pl-12 pr-14 py-2.5 text-[13px] font-semibold text-gray-800 placeholder-gray-400 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 p-2.5 text-white shadow shadow-orange-500/25"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      <Dialog
        as="div"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-40 bg-black/60" />

        <DialogPanel
          role="dialog"
          aria-modal="true"
          className="fixed inset-y-0 right-0 z-50 w-[86vw] max-w-[360px] bg-white shadow-2xl overflow-y-auto"
        >
          {/* top */}
          <div className="p-5 border-b border-orange-100 bg-gradient-to-b from-orange-50 to-white">
            <div className="flex items-center justify-between">
              <CustomeLink
                linkAddress="/home"
                linkName="ECOMMERCE"
                customStyles="text-[18px] font-extrabold text-gray-900"
                onClick={() => closeAllMenus()}
              />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-2xl border border-orange-200 bg-white px-3 py-2 text-gray-800 shadow-sm"
                aria-label="Close menu"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* mobile search (kept same functionality) */}
            <form onSubmit={handleSearch} className="mt-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full rounded-full border border-orange-200 bg-white pl-12 pr-14 py-2.5 text-[13px] font-semibold text-gray-800 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 p-2.5 text-white shadow shadow-orange-500/25"
                  aria-label="Search"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* links */}
          <div className="p-5 space-y-6">
            <div className="grid gap-3">
              <CustomeLink
                linkAddress="/shop"
                linkName="SHOP ALL"
                customStyles="block rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-[14px] font-extrabold text-orange-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition"
                onClick={() => setMobileMenuOpen(false)}
              />

              <CustomeLink
                linkAddress="/cart"
                linkName="Cart"
                customStyles="block rounded-2xl border border-orange-200 bg-white px-4 py-3 text-[14px] font-extrabold text-gray-800 hover:bg-orange-50 transition"
                onClick={() => setMobileMenuOpen(false)}
              />
            </div>

            <div className="border-t border-orange-100" />

            {isLoggedIn && user ? (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    goToProfile();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left rounded-2xl border border-orange-200 bg-white px-4 py-3 text-[14px] font-extrabold text-gray-800 hover:bg-orange-50 transition"
                >
                  Profile
                </button>

                <button
                  onClick={() => {
                    navigate("/my-orders");
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left rounded-2xl border border-orange-200 bg-white px-4 py-3 text-[14px] font-extrabold text-gray-800 hover:bg-orange-50 transition"
                >
                  My Orders
                </button>

                <button
                  onClick={() => {
                    navigate(dashboardRoute);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left rounded-2xl border border-orange-200 bg-white px-4 py-3 text-[14px] font-extrabold text-gray-800 hover:bg-orange-50 transition"
                >
                  Dashboard
                </button>

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left rounded-2xl bg-red-50 px-4 py-3 text-[14px] font-extrabold text-red-600 hover:bg-red-100 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <CustomeLink
                linkAddress="/login"
                linkName="Login"
                customStyles="block rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-3 text-[14px] font-extrabold text-white shadow-lg shadow-orange-500/25 hover:opacity-95 transition"
                onClick={() => setMobileMenuOpen(false)}
              />
            )}
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
