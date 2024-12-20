import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CategoryApi from "../../api/categoryapi";
import subcategoryapi from "../../api/subcategoryapi";
import { z } from "zod";

interface CategoryModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newCategory: any) => any;
  category?: any;
}

const subCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(1, "Description is required"),
  mainCategory: z.string().min(1, "Main category is required"),
});

type SubCategoryFormData = z.infer<typeof subCategorySchema>;

const SubCategoryModalForm: React.FC<CategoryModalFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  category,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [mainCategories, setMainCategories] = useState<any[]>([]);
  const [errors, setErrors] = useState({ name: "", description: "", mainCategory: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDescription(category.description || "");
      setMainCategory(category.mainCategory || "");
    } else {
      setName("");
      setDescription("");
      setMainCategory("");
    }
  }, [category]);

  const ResetForm=()=>{
    setName('')
    setDescription('')
    setMainCategory('')
  }

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await CategoryApi.fetchAllListedCategories();
        setMainCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching main categories:", error);
      }
    };
    fetchMainCategories();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", description: "", mainCategory: "" };

    if (!name.trim()) {
      newErrors.name = "Category name is required";
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (!mainCategory) {
      newErrors.mainCategory = "Main category is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let response;
      if (category) {
        response = await subcategoryapi.updateCategory(category._id, {
          name,
          description,
          mainCategory,
        });
      } else {
        response = await subcategoryapi.addCategory({
          name,
          description,
          mainCategory,
        });
      }

      if (response.data) {
        onSuccess(response.data);
        toast.success(`Category ${category ? "updated" : "created"} successfully`);
      }
      ResetForm()
      onClose();
    } catch (error) {
      console.error("Error submitting category:", error);
      toast.error(`Failed to ${category ? "update" : "create"} category. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-99 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-4 mx-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {category ? "Edit Category" : "Add Category"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Category Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Enter category name"
                
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Enter category description"
                
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {errors.description}
                </p>
              )}
            </div>
            {/* Main Category Dropdown */}
            <div>
              <label
                htmlFor="mainCategory"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Main Category
              </label>
              <select
                id="mainCategory"
                value={mainCategory}
                onChange={(e) => setMainCategory(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                
              >
                <option value="">Select a main category</option>
                {mainCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.mainCategory && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                  {errors.mainCategory}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
            >
              {isSubmitting
                ? category
                  ? "Updating..."
                  : "Adding..."
                : category
                ? "Update Category"
                : "Add Category"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryModalForm;
