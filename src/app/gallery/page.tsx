'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Gallery() {
  // This will be replaced with data from the database
  const [images] = useState([
    {
      id: 1,
      src: '/placeholder-1.jpg',
      alt: 'Welding Project 1',
      category: 'Industrial'
    },
    {
      id: 2,
      src: '/placeholder-2.jpg',
      alt: 'Welding Project 2',
      category: 'Custom'
    },
    {
      id: 3,
      src: '/placeholder-3.jpg',
      alt: 'Welding Project 3',
      category: 'Repair'
    },
    // Add more placeholder images as needed
  ]);

  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-12">Our Work</h1>
        
        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative aspect-square cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => setSelectedImage(image.id)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                <span className="text-white opacity-0 hover:opacity-100 transition-opacity">
                  {image.alt}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl w-full aspect-video">
              <Image
                src={images.find(img => img.id === selectedImage)?.src || ''}
                alt={images.find(img => img.id === selectedImage)?.alt || ''}
                fill
                className="object-contain"
              />
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300"
                onClick={() => setSelectedImage(null)}
              >
                <svg
                  className="h-8 w-8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 