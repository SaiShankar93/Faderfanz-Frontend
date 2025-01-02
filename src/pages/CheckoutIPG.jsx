import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import CryptoJS from "crypto-js";
import axios from "axios";

const generateRandomString = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

const PaymentForm = () => {
  const queryParams = new URLSearchParams(location.search);
  const [urlParams, setUrlParams] = useState({});
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    txntype: "sale",
    timezone: "Asia/Dubai",
    txndatetime: `${moment().tz("Asia/Dubai").format("YYYY:MM:DD-HH:mm:ss")}`,
    storename: `${import.meta.env.VITE_IPG_STORENAME}`,
    chargetotal: "",
    currency: "784", 
    oid: generateRandomString(),
    checkoutoption: "combinedpage",
    responseFailURL:
      "https://fiservsimulator.somee.com/IPGDemo/FailureResponse",
    responseSuccessURL: `${import.meta.env.VITE_SERVER_URL}/order/successTransaction`,
    transactionNotificationURL:
      "https://fiservsimulator.somee.com/IPGDemo/SuccessResponse",
    hash_algorithm: "HMACSHA256",
    hashExtended: "",
  });

  useEffect(() => {
    const params = {};
    queryParams.forEach((value, key) => {
      params[key] = value;
    });
    setUrlParams(params);

    if (params.total) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        chargetotal: params.total,
      }));
    }
    getCart(params._id);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const updateDatetime = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      txndatetime: moment()
        .tz(prevFormData.timezone)
        .format("YYYY:MM:DD-HH:mm:ss"),
    }));
  };

  const calculateMessageSignature = () => {
    const { ...params } = formData;
    const sharedsecret = "2zuW4j)G3.";
    const ignoreSignatureParameters = ["hashExtended"];
    var messageSignatureContent = [];
    Object.keys(params)
      .filter((key) => !ignoreSignatureParameters.includes(key))
      .sort()
      .forEach(function (key, index) {
        messageSignatureContent.push(params[key]);
      });

    const stringToExtendedHash = messageSignatureContent.join("|");

    // Log the string before hashing
    console.log("String to be hashed:", stringToExtendedHash);

    /* Calculate Message Signature */
    const messageSignature = CryptoJS.HmacSHA256(
      stringToExtendedHash,
      sharedsecret
    );
    const messageSignatureBase64 =
      CryptoJS.enc.Base64.stringify(messageSignature);
    console.log(messageSignatureBase64);
    return messageSignatureBase64;
  };

  const getCart = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/cart/${userId}`
      );
      const cart = response.data.cart;
      const cartProducts = cart.products;
      console.log(cartProducts);
      setCart(cartProducts);
    } catch (error) {
      console.error("Error Fetching Cart", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const customerId = urlParams._id;
    const totalAmount = urlParams.total;

    const products = cart.map((item) => ({
      product: item.productId,
      quantity: item.quantity,
    }));

    localStorage.setItem("customerId", customerId);
    localStorage.setItem("products", JSON.stringify(products));
    localStorage.setItem("totalAmount", totalAmount);

    document.querySelector("input[name='customerId']").value =
    customerId;
    document.querySelector("input[name='products']").value =
    JSON.stringify(products);
    updateDatetime();
    const hashExtendedValue = calculateMessageSignature();
    document.querySelector("input[name='hashExtended']").value =
      hashExtendedValue;
    e.target.action = "https://test.ipg-online.com/connect/gateway/processing";
    e.target.submit();

    // e.target.action = "https://test.ipg-online.com/connect/gateway/processing";
    // e.target.submit();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">
        Pay with Credit/Debit card
      </h2>
      <form
        onSubmit={handleSubmit}
        id="paymentForm"
        method="post"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input type="hidden" name="hash_algorithm" value="HMACSHA256" />
        <input
          type="hidden"
          name="hashExtended"
          value={formData.hashExtended}
        />
        <input type="hidden" name="customerId" id="customerIdInput"></input>
        <input type="hidden" name="products" id="productsIdInput"></input>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Transaction Type
          </label>
          <select
            className="w-full border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
            name="txntype"
            value={formData.txntype}
            onChange={handleChange}
            required
          >
            <option value="sale">Sale</option>
            <option value="preauth">Pre-Authorization</option>
            <option value="postauth">Post-Authorization</option>
            <option value="void">Void</option>
          </select>
        </div>

        <div>
          <label
            className="block text-gray-700
text-sm font-bold mb-2"
          >
            Timezone
          </label>
          <select
            className="w-full border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            required
          >
            <option value="Asia/Dubai">Asia/Dubai (GST/UTC+4)</option>
            <option value="Indian/Mauritius">
              Indian/Maurit ius (MUT/UTC+4)
            </option>
            <option value="Europe/Berlin">Europe/Berlin (CET/UTC+1)</option>
          </select>
        </div>

        <div className="max-w-screen">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Transaction Date and Time
          </label>
          <input
            className="w-full border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
            type="text"
            name="txndatetime"
            value={formData.txndatetime}
            readOnly
          />
        </div>

        <div>
          <input
            className="w-full border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
            name="storename"
            value={formData.storename}
            onChange={handleChange}
            required
            type="hidden"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Charge Total
          </label>
          <input
            className="w-full border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
            type="text"
            name="chargetotal"
            value={formData.chargetotal}
            onChange={handleChange}
            required
            readOnly
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Currency
          </label>
          <select
            className="w-full border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            required
          >
            <option value="784">AED (784)</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Order ID
          </label>
          <input
            className="w-full border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
            name="oid"
            value={formData.oid}
            readOnly
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Checkout Option
          </label>
          <select
            className="w-full border-[1.4px] border-[#999999] dark:bg-transparent p-2 text-[#7A7A7A] text-[14.4px]"
            name="checkoutoption"
            value={formData.checkoutoption}
            onChange={handleChange}
          >
            <option value="combinedpage">Combined Page</option>
            <option value="classic">Classic</option>
            <option value="simpleform">Simple Form</option>
          </select>
        </div>

        <input
          type="hidden"
          name="responseFailURL"
          value={formData.responseFailURL}
          onChange={handleChange}
        />

        <input
          type="hidden"
          name="responseSuccessURL"
          value={formData.responseSuccessURL}
          onChange={handleChange}
        />

        <input
          type="hidden"
          name="transactionNotificationURL"
          value={formData.transactionNotificationURL}
          onChange={handleChange}
        />

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Pay Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
