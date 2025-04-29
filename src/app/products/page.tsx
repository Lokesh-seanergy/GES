"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import MainLayout from '@/components/mainlayout/MainLayout';
import { CustomPagination } from '@/components/ui/pagination';
import { PageSizeSelector } from '@/components/ui/page-size-selector';
import { ScrollToTop } from "@/components/ui/scroll-to-top";

const ProductsPage: React.FC = () => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mt-4">
        <PageSizeSelector
          pageSize={itemsPerPage}
          setPageSize={(value) => {
            setItemsPerPage(value);
            setCurrentPage(1); // Reset to first page when changing items per page
          }}
        />
        <CustomPagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredProducts.length / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
      <ScrollToTop />
    </MainLayout>
  );
};

export default ProductsPage; 