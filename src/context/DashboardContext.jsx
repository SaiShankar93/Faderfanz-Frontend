import { createContext, useState } from "react";

export const DashboardAppContext = createContext();

export const DashboardAppProvider = ({ children }) => {
  const [isVendorDialogOpen, setIsVendorDialogOpen] = useState(false);
  const [isVendorDetailsDialogOpen, setIsVendorDetailsDialogOpen] =
    useState(false);
  const [language, setLanguage] = useState("ENG");
  const [currency, setCurrency] = useState("AED");

  return (
    <DashboardAppContext.Provider
      value={{
        isVendorDialogOpen,
        setIsVendorDialogOpen,
        isVendorDetailsDialogOpen,
        setIsVendorDetailsDialogOpen,
        language,
        setLanguage,
        currency,
        setCurrency,
      }}
    >
      {children}
    </DashboardAppContext.Provider>
  );
};
