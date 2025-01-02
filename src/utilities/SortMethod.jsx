export const sortMethods = [
  {
    id: 0,
    name: "  Date: New to Old",
    value: 0,
  },
  {
    id: 1,
    name: "Date: Old to New",
    value: 1,
  },
  {
    id: 2,
    name: "Weight: Low to High",
    value: 2,
  },
  {
    id: 3,
    name: "Weight: High to Low",
    value: 3,
  },
  {
    id: 4,
    name: "Total: Low to High",
    value: 4,
  },
  {
    id: 5,
    name: "Total: High to low",
    value: 5,
  },
  {
    id: 6,
    name: " Email: a-z",
    value: 6,
  },
  {
    id: 7,
    name: " Email: z-a",
    value: 7,
  },
  {
    id: 8,
    name: "Id: High to low",
    value: 8,
  },
  {
    id: 9,
    name: "Id: Low to High",
    value: 9,
  },
];
export const sortProducts = (method, DataArray) => {
  switch (method) {
    case "1":
      return [...DataArray].sort((a, b) => new Date(a.date) - new Date(b.date));
    case "2":
      return [...DataArray].sort((a, b) => Number(a.weight) - b.weight);
    case "3":
      return [...DataArray].sort((a, b) => Number(b.weight) - a.weight);
    case "4":
      return [...DataArray].sort(
        (a, b) => parseFloat(a.total) - parseFloat(b.total)
      );
    case "5":
      return [...DataArray].sort(
        (a, b) => parseFloat(b.total) - parseFloat(a.total)
      );
    case "6":
      return [...DataArray].sort((a, b) => a.email.localeCompare(b.email));
    case "7":
      return [...DataArray].sort((a, b) => b.email.localeCompare(a.email));
    case "8":
      return [...DataArray].sort(
        (a, b) => Number(b.orderviewId) - Number(a.orderviewId)
      );
    case "9":
      return [...DataArray].sort(
        (a, b) => Number(a.orderviewId) - Number(b.orderviewId)
      );

    // --------------------
    case "10":
      return [...DataArray].sort((a, b) => a.name.localeCompare(b.name));
    case "11":
      return [...DataArray].sort((a, b) => b.name.localeCompare(a.name));
    case "12":
      return [...DataArray].sort((a, b) => Number(b.price) - Number(a.price));
    case "13":
      return [...DataArray].sort((a, b) => Number(a.price) - Number(b.price));
    // ------------------
    default:
      return [...DataArray].sort((a, b) => new Date(b.date) - new Date(a.date));
  }
};
