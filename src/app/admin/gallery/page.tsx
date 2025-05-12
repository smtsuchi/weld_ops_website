'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function AdminGallery() {
  const [images, setImages] = useState([
    {
      id: 1,
      src: '/placeholder-1.jpg',
      alt: 'Welding Project 1',
      category: 'Industrial',
      order: 1
    },
    {
      id: 2,
      src: '/placeholder-2.jpg',
      alt: 'Welding Project 2',
      category: 'Custom',
      order: 2
    },
    {
      id: 3,
      src: '/placeholder-3.jpg',
      alt: 'Welding Project 3',
      category: 'Repair',
      order: 3
    },
  ]);

  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setIsUploading(true);
    try {
      // This will be replaced with actual file upload logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newImage = {
        id: images.length + 1,
        src: URL.createObjectURL(e.target.files[0]),
        alt: 'New Project',
        category: 'Custom',
        order: images.length + 1
      };
      
      setImages([...images, newImage]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // This will be replaced with actual delete logic
      await new Promise(resolve => setTimeout(resolve, 500));
      setImages(images.filter(img => img.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleReorder = (dragIndex: number, dropIndex: number) => {
    const newImages = [...images];
    const [removed] = newImages.splice(dragIndex, 1);
    newImages.splice(dropIndex, 0, removed);
    
    // Update order numbers
    const updatedImages = newImages.map((img, index) => ({
      ...img,
      order: index + 1
    }));
    
    setImages(updatedImages);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Gallery Management</h1>
        <div>
          <label
            htmlFor="image-upload"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
          >
            {isUploading ? 'Uploading...' : 'Upload Image'}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {images.map((image, index) => (
            <li key={image.id} className="px-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="relative h-16 w-16">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {image.alt}
                  </p>
                  <p className="text-sm text-gray-500">
                    Category: {image.category}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                  <div className="text-sm text-gray-500">
                    Order: {image.order}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 