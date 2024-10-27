<<<<<<< HEAD
import React, { useEffect, useState, useCallback } from "react";
import Table from "../../components/Tables/Table";
import ProductModalForm from "../../components/Product/ProductModalForm";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import productapi from "../../api/productapi";
import { Product } from "../../types/productTypes";
import { useNavigate } from "react-router-dom";
import { ListMinus, ListPlus, Pencil, Trash2 } from "lucide-react";
=======
import productapi from "../../api/productapi";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import ProductModalForm from "../../components/Product/ProductModalForm";
import ImagePreviewModal from "../../components/Product/ProductPreview";
import Table from "../../components/Tables/Table";
import { TableColumn } from "../../components/Tables/Table";
import { Product } from "../../types/productTypes";
import {
  ListMinus,
  ListPlus,
  Pencil,
  Trash2,
  Eye,
  ChevronDown,
} from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/Search/SearchBar";
import { debounce } from 'lodash'; // Make sure to install lodash if not already installed
>>>>>>> upstream/develop

const ProductManagement: React.FC = () => {
  const [isModal, setModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [actionType, setActionType] = useState<"delete" | "list" | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
<<<<<<< HEAD
  const [itemsPerPage] = useState(5); // Items per page
  const [totalPages, setTotalPages] = useState(1); // Total pages returned from backend
  const navigate = useNavigate();

  // Fetch products from API with pagination
  const fetchProducts = useCallback(async (page: number, limit: number) => {
    try {
      const response = await productapi.fetchAllProducts(page, limit);
      if (response.status === 200) {
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages); // Update total pages
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, []);

=======
  const [itemsPerPage] = useState(10); // Items per page
  const [totalPages, setTotalPages] = useState(1); // Total pages returned from backend
  const navigate = useNavigate();
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Modify fetchProducts to use searchByName when there's a search term
  const fetchProducts = useCallback(async (page: number, limit: number, search: string = '') => {
    setIsSearching(!!search);
    try {
      let response;
      if (search) {
        response = await productapi.searchByName(page, limit, search);
      } else {
        response = await productapi.fetchAllProducts(page, limit);
      }
      if (response.status === 200) {
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce search to avoid too many API calls
  const debouncedSearch = useCallback(
    debounce((search: string) => {
      setCurrentPage(1); // Reset to first page when searching
      fetchProducts(1, itemsPerPage, search);
    }, 300),
    [fetchProducts, itemsPerPage]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

>>>>>>> upstream/develop
  useEffect(() => {
    fetchProducts(currentPage, itemsPerPage); // Fetch products for current page
  }, [fetchProducts, currentPage, itemsPerPage]);

  // Handle delete with confirmation
  const confirmDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setActionType("delete");
    setShowDialog(true);
  };

  const handleDeleteProduct = async () => {
    try {
      if (selectedProduct) {
        await productapi.deleteProduct(selectedProduct._id);
        fetchProducts(currentPage, itemsPerPage); // Re-fetch products for the current page after delete
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setShowDialog(false);
      setSelectedProduct(null);
    }
  };

  // Handle listing/unlisting with confirmation
  const confirmProductListing = (product: Product) => {
    setSelectedProduct(product);
    setActionType("list");
    setShowDialog(true);
  };

  const handleEditProduct = (product: Product) => {
    navigate(`/update-product/${product._id}`);
    setSelectedProduct(product);
    setModal(true);
  };

  const handleProductListing = async () => {
    const { _id, isListed } = selectedProduct!;
    const action = isListed ? "unlist" : "list";
    try {
      const response = await productapi.listingProduct(_id, action);
      if (response.status === 200) {
        fetchProducts(currentPage, itemsPerPage); // Re-fetch products after listing/unlisting
      }
    } catch (error) {
      console.error("Error updating product listing:", error);
    } finally {
      setShowDialog(false);
      setSelectedProduct(null);
    }
  };
<<<<<<< HEAD
=======
  const handleBulkDownload = async () => {
    try {
      const response = await productapi.bulkDownload();

      if (response.data) {
        console.log("response", response.data);
        // Check if the response is already a Blob
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        console.log("blob", blob);

        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "products.xlsx";
        link.click();

        // Clean up
        window.URL.revokeObjectURL(link.href);
      } else {
        console.error("No data received from the server");
      }
    } catch (error) {
      console.error("Error downloading bulk data:", error);
      // Handle the error (e.g., show an error message to the user)
    }
  };

  const handlePreviewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowPreviewModal(true);
  };
>>>>>>> upstream/develop

  // Actions for Table buttons
  const productActions = useCallback((row: { [key: string]: any }) => {
    const product = row as Product; // Casting row as Product
    return (
      <div className="flex space-x-2">
        <button
<<<<<<< HEAD
=======
          onClick={() => handlePreviewProduct(product)}
          className="p-1 rounded-full bg-purple-100 text-purple-600 hover:bg-opacity-80"
          title="Preview"
        >
          <Eye size={16} />
        </button>
        <button
>>>>>>> upstream/develop
          onClick={() => confirmProductListing(product)}
          className={`p-1 rounded-full ${
            product.isListed
              ? "bg-yellow-100 text-yellow-600"
              : "bg-green-100 text-green-600"
          } hover:bg-opacity-80`}
          title={product.isListed ? "Unlist" : "List"}
        >
          {product.isListed ? <ListMinus size={16} /> : <ListPlus size={16} />}
        </button>
        <button
          onClick={() => handleEditProduct(product)}
          className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-opacity-80"
          title="Edit"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => confirmDeleteProduct(product)}
          className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-opacity-80"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    );
  }, []);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

<<<<<<< HEAD
  const productColumns = [
    { header: "Product Name", accessor: "name" },
    {
      header: "Category",
      accessor: "category",
      render: (category: any) => category?.name || "N/A",
    },
    {
      header: "Status",
      accessor: "isListed",
      render: (value: boolean) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "Listed" : "Not Listed"}
=======
  const productColumns: TableColumn[] = [
    {
      header: "Image",
      accessor: "images",
      render: (row: { [key: string]: any }) => (
        <div className="w-12 h-12">
          {" "}
          {/* Reduced from w-16 h-16 */}
          <img
            src={
              row.images && row.images.length > 0
                ? row.images[0].toString()
                : "placeholder-image-url"
            }
            alt={row.name}
            className="w-full h-full object-cover rounded"
          />
        </div>
      ),
    },
    { header: "Product Name", accessor: "name" },
    {
      header: "Status",
      accessor: "isListed",
      render: (row: { [key: string]: any }) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.isListed
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.isListed ? "Listed" : "Not Listed"}
>>>>>>> upstream/develop
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-10 w-full">
        <div className="flex w-full justify-between mb-4">
<<<<<<< HEAD
          <button
            onClick={() => navigate("/bulk-adding")}
            type="button"
            className="text-white bg-black hover:bg-[#8e8f91] hover:text-black-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Bulk Add
          </button>
=======
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              type="button"
              className="text-white bg-black hover:bg-[#8e8f91] hover:text-black-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center inline-flex items-center"
            >
              Bulk Actions
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>
            {isDropdownOpen && (
              <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li>
                    <a
                      href="#"
                      onClick={() => navigate("/bulk-upload")}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Bulk Upload
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={handleBulkDownload}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Bulk Download
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="hidden lg:flex lg:flex-grow justify-center">
            <SearchBar 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isSearching={isSearching}
            />
          </div>

>>>>>>> upstream/develop
          <button
            onClick={() => setModal(true)}
            type="button"
            className="text-white bg-black hover:bg-[#8e8f91] hover:text-black-2 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add Product
          </button>
        </div>
<<<<<<< HEAD
        <Table data={products} columns={productColumns} actions={productActions} />
=======
        <Table
          data={products}
          columns={productColumns}
          actions={productActions}
        />
>>>>>>> upstream/develop
        <div className="flex justify-center items-center space-x-4 mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            } rounded`}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            } rounded`}
          >
            Next
          </button>
        </div>
        <ProductModalForm
          isOpen={isModal}
          onClose={() => setModal(false)}
          onProductAdd={(newProduct: Product) =>
<<<<<<< HEAD
            setProducts((prevProducts) => [...prevProducts, newProduct])
=======
            setProducts((prevProducts) => [newProduct, ...prevProducts])
>>>>>>> upstream/develop
          }
        />
        {showDialog && selectedProduct && (
          <ConfirmationDialog
            message={
              actionType === "delete"
                ? `Are you sure you want to delete ${selectedProduct.name}?`
                : `Are you sure you want to ${
                    selectedProduct.isListed ? "unlist" : "list"
                  } ${selectedProduct.name}?`
            }
            confirmButtonLabel={actionType === "delete" ? "Delete" : "Confirm"}
            cancelButtonLabel="Cancel"
            onConfirm={
<<<<<<< HEAD
              actionType === "delete" ? handleDeleteProduct : handleProductListing
=======
              actionType === "delete"
                ? handleDeleteProduct
                : handleProductListing
>>>>>>> upstream/develop
            }
            onCancel={() => setShowDialog(false)}
          />
        )}
<<<<<<< HEAD
=======
        Image
        <ImagePreviewModal
          product={selectedProduct}
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
        />
>>>>>>> upstream/develop
      </div>
    </>
  );
};

export default ProductManagement;