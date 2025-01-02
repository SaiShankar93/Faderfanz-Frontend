import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

export const MainAppContext = createContext();

export const MainAppProvider = ({ children }) => {
  const [isDarkMode, SetIsDarkMode] = useState(false);
  const [user, setUser] = useState({});
  const [cart, setCart] = useState([]);
  const [buyNow, setBuyNow] = useState([]);
  const [Products, setProducts] = useState([]);
  const [minValue, set_minValue] = useState(0);
  const [maxValue, set_maxValue] = useState(1000);
  const [maxPrice, setMaxPrice] = useState(maxValue);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [wishlistedProducts, setWishlistedProducts] = useState([]);
  const { userLoggedIn, setUserLoggedIn } = useAuth();
  const [total, setTotal] = useState(0);
  const [productPageId, setProductPageId] = useState("");
  const [blogId, setBlogId] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [isAdminRatingFormOpen, setIsAdminRatingFormOpen] = useState(false);

  const getUser = async () => {
    try {
      const url = `${import.meta.env.VITE_SERVER_URL}/auth/google/success`;
      const response = await axios.get(url, { withCredentials: true });
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response?.data?.user);
        // // console.log(response?.data?.user);
        setUserLoggedIn(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // window.scrollTo(0, 0);
    getAllProducts();
    getUser();
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
    if (userLoggedIn) {
      getWishlist(user?._id);
      getCart(user._id);
    } else {
      getUnloggedCart();
    }
  }, []);

  const getAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/product/all`
      );
      setProducts(response.data);
      const maxPrice = response?.data?.reduce((max, product) => {
        return product.price > max ? product.price : max;
      }, 0);
      set_maxValue(Number(maxPrice));
      setMaxPrice(Number(maxPrice));

      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching Products:", error);
    }
    setLoading(false);
  };

  const getCart = async (userId) => {
    if (userLoggedIn) {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/cart/${user?._id || userId}`
        );
        setCart(response.data.cart.products);
        // console.log(response.data.cart.products);
        setCartCount(response.data.cart.products?.length);
        if (response.data.cart.products?.length > 0) {
          const total1 = response.data.cart.products.reduce(
            (acc, obj) => acc + obj.productId.price * obj.quantity,
            0
          );
          setTotal(total1);
        }
        // Handle success response, if needed
      } catch (error) {
        console.error("Error Fetching Cart", error);
      }
      setLoading(false);
    }
  };

  const getUnloggedCart = () => {
    setLoading(true);
    var tempCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartCount(tempCart?.length);
    // console.log(tempCart?.length);
    setCart(tempCart);
    // console.log(tempCart);
    const total1 = tempCart?.reduce(
      (acc, obj) => acc + obj.productId.price * obj.quantity,
      0
    );
    setTotal(total1);
    setLoading(false);
  };
  const addToCart = async (productId, quantity) => {
    if (userLoggedIn) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/cart/addProduct`,
          {
            userId: user?._id,
            productId: productId,
            quantity: quantity,
          }
        );
        // console.log(response.data.cart);
        getCart(userId);
        toast.success("Product Added to Cart");
        // Handle success response, if needed
      } catch (error) {
        console.error("Error adding product to cart:", error);
        toast.error("Failed to add product to cart");
        // Handle error
      }
    } else toast.error("You are not logged in");
  };

  const getWishlist = async (userId) => {
    setLoading(true);
    if (userLoggedIn) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/wishlist/${user?._id || userId}`
        );

        // console.log(response?.data?.wishlist?.products);
        setWishlistedProducts(response?.data?.wishlist?.products);
      } catch (error) {
        console.error("Error Fetching Cart", error);
      }
    }
    setLoading(false);
  };
  const handleRemoveWishlist = (productId) => {
    if (userLoggedIn) {
      removeFromWishlist(productId);
    } else {
      toast.error("You are not logged in");
    }
  };
  const removeFromWishlist = async (productId) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/wishlist/removeProduct`,
        {
          userId: user?._id,
          productId: productId,
        }
      );
      getWishlist(user?._id);
      toast.success("Product Removed from Wihslist");
      // Handle success response, if needed
    } catch (error) {
      console.error("Error removing product from Wishlist:", error);
      toast.error("Failed to remove product from Wishlist");
      // Handle error
    }
  };
  const handleAddToWishlist = (productId) => {
    if (userLoggedIn) {
      addToWishlist(productId);
    } else {
      toast.error("You are not logged in");
    }
  };
  const addToWishlist = async (productId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/wishlist/addProduct`,
        {
          userId: user?._id,
          productId: productId,
        }
      );
      getWishlist(user?._id);
      toast.success("Product Added to Wihslist");
      // Handle success response, if needed
    } catch (error) {
      console.error("Error adding product to Wishlist:", error);
      toast.error("Failed to add product to Wishlist");
      // Handle error
    }
  };
  return (
    <MainAppContext.Provider
      value={{
        isDarkMode,
        SetIsDarkMode,
        loading,
        setLoading,
        user,
        setUser,
        cartCount,
        setCartCount,
        cart,
        setCart,
        Products,
        minValue,
        set_minValue,
        maxValue,
        set_maxValue,
        maxPrice,
        setMaxPrice,
        total,
        setTotal,
        setProducts,
        buyNow,
        setBuyNow,
        productPageId,
        setProductPageId,
        blogId,
        setBlogId,
        wishlistedProducts,
        selectedItem,
        setSelectedItem,
        getAllProducts,
        getCart,
        getUnloggedCart,
        setWishlistedProducts,
        handleRemoveWishlist,
        handleAddToWishlist,
        isAdminRatingFormOpen,
        setIsAdminRatingFormOpen,
      }}
    >
      {children}
    </MainAppContext.Provider>
  );
};
