import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import CategoryApi from '../../api/categoryapi';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface CategoryModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newCategory: any) => any;
  category?: any;
}

const CategoryModalForm: React.FC<CategoryModalFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  category,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<File | null>(null); // State to handle photo file
  const [photoPreview, setPhotoPreview] = useState<string | null>(null); // State for photo preview
  const [errors, setErrors] = useState({ name: '', description: '', photo: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setDescription(category.description || '');
      setPhoto(null);
      setPhotoPreview(category.photo || null); // Assuming the API provides a URL for the existing category photo
    } else {
      setName('');
      setDescription('');
      setPhoto(null);
      setPhotoPreview(null);
    }
  }, [category, onSuccess]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', description: '', photo: '' };

    if (!name.trim()) {
      newErrors.name = 'Category name is required';
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    if (photo && (photo.size > 2 * 1024 * 1024 || !photo.type.startsWith('image/'))) {
      newErrors.photo = 'Please upload a valid image file (max 2MB).';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhoto(file);

    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, photo: 'File size exceeds 2MB.' });
        setPhotoPreview(null);
      } else if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, photo: 'Invalid file type. Please upload an image.' });
        setPhotoPreview(null);
      } else {
        setPhotoPreview(URL.createObjectURL(file)); // Generate a preview URL
        setErrors({ ...errors, photo: '' });
      }
    } else {
      setPhotoPreview(null);
      setErrors({ ...errors, photo: 'Please select a valid image file.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);

      if (photo) {
        formData.append('photo', photo); // Add the photo file if selected
      }

      let response;
      if (category) {
        response = await CategoryApi.updateCategory(category._id, formData);
      } else {
        response = await CategoryApi.addCategory(formData);
      }

      if (response.data) {
        onSuccess(response.data);
        toast.success(`Category ${category ? 'updated' : 'created'} successfully`);
      }

      onClose(); // Close the modal after successful operation
    } catch (error) {
      console.error('Error submitting category:', error);
      toast.error(`Failed to ${category ? 'update' : 'create'} category. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-4 mx-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {category ? 'Edit Category' : 'Add Category'}
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
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
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
              {errors.name && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="Enter category description"
                
              />
              {errors.description && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.description}</p>}
            </div>
            <div>
              <label htmlFor="photo" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Category Photo
              </label>
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              />
              {photoPreview && (
                <img src={photoPreview} alt="Preview" className="mt-4 w-3/4 h-auto rounded-lg" />
              )}
              {errors.photo && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.photo}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white bg-black  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
            >
              {isSubmitting ? (category ? 'Updating...' : 'Adding...') : category ? 'Update Category' : 'Add Category'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryModalForm;
