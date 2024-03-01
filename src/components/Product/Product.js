import React, { useEffect, useState } from "react";
import { fetchProductData } from "../../shared/api/api";
import "./Product.css";

const Product = ({ productId }) => {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProductData(productId);
        setProductData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setLoading(false);
      }
    };

    if (productId) {
      fetchData();
    }

    return () => {
      setProductData(null);
      setLoading(true);
    };
  }, [productId]);

  if (loading) return <div>Loading...</div>;

  if (!productData) return null;

  const { product, price, brand } = productData;

  return (
    <div className="product-card">
      <div className="product-details">
        <h3>{product}</h3>
        <p>Price: {price}</p>
        <p>Brand: {brand || "N/A"}</p>
      </div>
    </div>
  );
};

export default Product;
