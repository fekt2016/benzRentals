import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";

const COMPARISON_STORAGE_KEY = "carComparison";
const MAX_COMPARISON_ITEMS = 4; // Limit to 4 cars for comparison

export const useCarComparison = () => {
  const [comparisonCars, setComparisonCars] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COMPARISON_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setComparisonCars(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error("Error loading comparison from localStorage:", error);
      setComparisonCars([]);
    }
  }, []);

  // Save to localStorage whenever comparison changes
  useEffect(() => {
    try {
      localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(comparisonCars));
    } catch (error) {
      console.error("Error saving comparison to localStorage:", error);
    }
  }, [comparisonCars]);

  const addToComparison = useCallback((car) => {
    setComparisonCars((prev) => {
      const carId = car._id || car.id;
      
      // Check if already in comparison
      if (prev.some((c) => (c._id || c.id) === carId)) {
        toast.info("Car is already in comparison");
        return prev;
      }

      // Check if limit reached
      if (prev.length >= MAX_COMPARISON_ITEMS) {
        toast.error(`You can compare up to ${MAX_COMPARISON_ITEMS} cars at a time`);
        return prev;
      }

      toast.success("Car added to comparison");
      return [...prev, car];
    });
  }, []);

  const removeFromComparison = useCallback((carId) => {
    setComparisonCars((prev) => {
      const filtered = prev.filter((c) => (c._id || c.id) !== carId);
      if (filtered.length < prev.length) {
        toast.success("Car removed from comparison");
      }
      return filtered;
    });
  }, []);

  const clearComparison = useCallback(() => {
    setComparisonCars([]);
    toast.success("Comparison cleared");
  }, []);

  const isInComparison = useCallback(
    (carId) => {
      return comparisonCars.some((c) => (c._id || c.id) === carId);
    },
    [comparisonCars]
  );

  return {
    comparisonCars,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    comparisonCount: comparisonCars.length,
    maxItems: MAX_COMPARISON_ITEMS,
  };
};

