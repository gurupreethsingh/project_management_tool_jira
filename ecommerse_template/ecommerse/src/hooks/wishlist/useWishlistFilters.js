import { useDeferredValue, useMemo, useState } from "react";

function normalizeText(v) {
  if (v === null || v === undefined) return "";
  return String(v).trim().toLowerCase();
}

const useWishlistFilters = (wishlistItems = []) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [filterBy, setFilterBy] = useState("all");
  const [density, setDensity] = useState("compact");

  const deferredSearch = useDeferredValue(searchTerm);

  const filteredSortedItems = useMemo(() => {
    let items = [...wishlistItems];
    const q = normalizeText(deferredSearch);

    if (q) {
      items = items.filter((item) => {
        const haystack = [
          item?.product_name,
          item?.brand,
          item?.category_name,
          item?.description,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return haystack.includes(q);
      });
    }

    if (filterBy === "saved") {
      items = items.filter((item) => item?.savedForLater);
    } else if (filterBy === "active") {
      items = items.filter((item) => !item?.savedForLater);
    } else if (filterBy === "instock") {
      items = items.filter((item) => item?.availability_status !== false);
    } else if (filterBy === "outofstock") {
      items = items.filter((item) => item?.availability_status === false);
    }

    items.sort((a, b) => {
      const aPrice = Number(a?.selling_price || 0);
      const bPrice = Number(b?.selling_price || 0);
      const aName = String(a?.product_name || "").toLowerCase();
      const bName = String(b?.product_name || "").toLowerCase();
      const aAdded = new Date(a?.addedAt || 0).getTime();
      const bAdded = new Date(b?.addedAt || 0).getTime();

      switch (sortBy) {
        case "name_asc":
          return aName.localeCompare(bName);
        case "name_desc":
          return bName.localeCompare(aName);
        case "price_low_high":
          return aPrice - bPrice;
        case "price_high_low":
          return bPrice - aPrice;
        case "saved_first":
          return (
            Number(Boolean(b?.savedForLater)) -
            Number(Boolean(a?.savedForLater))
          );
        case "latest":
        default:
          return bAdded - aAdded;
      }
    });

    return items;
  }, [wishlistItems, deferredSearch, sortBy, filterBy]);

  return {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    density,
    setDensity,
    filteredSortedItems,
  };
};

export default useWishlistFilters;
