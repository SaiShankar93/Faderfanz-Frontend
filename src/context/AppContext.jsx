import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isMenuOpen, SetIsMenuOpen] = useState(false);
  const [isCartOpen, SetIsCartOpen] = useState(false);
  const [isSuccessOpen, SetIsSuccessOpen] = useState(false);
  const [isRatingFormOpen, setIsRatingFormOpen] = useState(false);
  const [isOrdersTrackForm, setIsOrdersTrackForm] = useState(false);
  const [isMobileFilterOpen, SetIsMobileFilterOpen] = useState(false);
  const [language, setLanguage] = useState("ENG");
  const [currency, setCurrency] = useState("AED");
  const [minValue, set_minValue] = useState(0);
  const [maxValue, set_maxValue] = useState(1000);
  const [filterCategories, setFilterCategories] = useState(false);
  const [filterSubCategories, setFilterSubCategories] = useState(false);
  const [filterColor, setFilterColor] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [filters, setFilters] = useState({
    price: [],
    date: [],
    category: [],
    format: []
  });

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  const [expandedSections, setExpandedSections] = useState({
    date: false,
    category: false,
    format: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <AppContext.Provider
      value={{
        isMenuOpen,
        SetIsMenuOpen,
        isCartOpen,
        SetIsCartOpen,
        isMobileFilterOpen,
        SetIsMobileFilterOpen,
        isOrdersTrackForm,
        setIsOrdersTrackForm,
        language,
        setLanguage,
        minValue,
        set_minValue,
        maxValue,
        set_maxValue,
        filterCategories,
        setFilterCategories,
        filterSubCategories,
        setFilterSubCategories,
        filterColor,
        setFilterColor,
        currency,
        setCurrency,
        cart,
        setCart,
        wishlist,
        setWishlist,
        orders,
        setOrders,
        cartTotal,
        setCartTotal,
        grandTotal,
        setGrandTotal,
        isRatingFormOpen,
        setIsRatingFormOpen,
        filters,
        handleFilterChange,
        expandedSections,
        toggleSection,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
