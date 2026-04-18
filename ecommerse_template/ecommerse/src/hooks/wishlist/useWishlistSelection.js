import { useMemo, useState, useCallback } from "react";

const useWishlistSelection = (visibleItems = []) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  const visibleIds = useMemo(
    () => visibleItems.map((item) => String(item._id)),
    [visibleItems],
  );

  const toggleSelectOne = useCallback((productId) => {
    const id = String(productId);
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const selectAllVisible = useCallback(() => {
    setSelectedIds((prev) => {
      const merged = new Set([...prev, ...visibleIds]);
      return [...merged];
    });
  }, [visibleIds]);

  const deselectAllVisible = useCallback(() => {
    setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
  }, [visibleIds]);

  const replaceSelection = useCallback((ids) => {
    setSelectedIds([...new Set((ids || []).map(String))]);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const removeFromSelection = useCallback((id) => {
    const normalized = String(id);
    setSelectedIds((prev) => prev.filter((x) => x !== normalized));
  }, []);

  return {
    selectedIds,
    selectedSet,
    selectedCount: selectedIds.length,
    toggleSelectOne,
    selectAllVisible,
    deselectAllVisible,
    replaceSelection,
    clearSelection,
    removeFromSelection,
  };
};

export default useWishlistSelection;
