import "./ProductList.css";
import React, { useState, useEffect } from "react";
import Pagination from "../Pagination/Pagination";
import Filter from "../Filter/Filter";
import Product from "../Product/Product";
import { fetchAllProductIds, filterProducts } from "../../shared/api/api";

const ProductList = () => {
  const [productIds, setProductIds] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProductIds = async () => {
    try {
      const allProductIds = await fetchAllProductIds();
      setProductIds(allProductIds);
    } catch (error) {
      console.error("Error fetching all product ids:", error);
    }
  };

  const handleSearch = async (value) => {
    setPage(1);
    try {
      const filteredProductIds = await filterProducts(value);
      setProductIds(filteredProductIds);
      setTotalPages(Math.ceil(filteredProductIds.length / 50));
    } catch (error) {
      console.error("Error fetching filtered product ids:", error);
    }
  };


  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const getProductIdsForPage = () => {
    const startIndex = (page - 1) * 50;
    const endIndex = startIndex + 50;
    return productIds.slice(startIndex, endIndex);
  };

  useEffect(() => {
    fetchProductIds();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(productIds.length / 50));
  }, [productIds]);

  return (
    <div className="product-list">
      <h2>Product List</h2>
      <Filter onSearch={handleSearch} />
      <div className="grid-container">
        {getProductIdsForPage().map((productId, index) => (
          <Product key={`${productId}-${index}`} productId={productId} />
        ))}
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductList;
