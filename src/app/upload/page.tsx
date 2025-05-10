"use client"; // Required for event handlers and refs

import React, { useRef } from 'react';

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  // Placeholder for drag and drop and file change handlers
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      // TODO: Handle file upload logic (e.g., display preview, send to server)
      console.log('Selected file:', event.target.files[0].name);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      // TODO: Handle file upload logic
      console.log('Dropped file:', event.dataTransfer.files[0].name);
      // Potentially set the file to the input or handle directly
      if (fileInputRef.current) {
        fileInputRef.current.files = event.dataTransfer.files;
        // Manually trigger change event if needed, or handle file directly
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 selection:bg-sky-200 selection:text-sky-900">
      <header className="mb-8 md:mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-800" style={{ color: '#03A9F4' }}>
          图床
        </h1>
        <p className="text-slate-600 mt-2 text-lg sm:text-xl">
          轻松上传和分享您的图片
        </p>
      </header>

      <main className="w-full max-w-2xl bg-white shadow-2xl rounded-xl p-6 sm:p-8 md:p-10">
        <div
          className="border-4 border-dashed rounded-lg  sm:p-12 text-center transition-all duration-300 ease-in-out cursor-pointer group hover:border-sky-500 hover:bg-sky-50"
          style={{ borderColor: '#03A9F4' }}
          onClick={handleUploadAreaClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver} // Use same handler for simplicity
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*" // Accept only image files
          />
          <svg
            className="mx-auto h-16 w-16 text-gray-400 group-hover:text-sky-500 transition-colors duration-300"
            style={{ color: '#03A9F4' }} // Initial color from theme
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 12v3m0 0v3m0-3h3m-3 0H9" />
          </svg>
          <p className="mt-4 text-lg text-slate-600 group-hover:text-sky-700">
            将文件拖放到此处，或 <span className="font-semibold" style={{ color: '#03A9F4' }}>点击选择文件</span>
          </p>
          <p className="mt-1 text-sm text-slate-500 group-hover:text-sky-600">
            支持 JPG, PNG, GIF 等图片格式
          </p>
        </div>
        
        {/* Placeholder for upload progress or file list */}
        {/* <div className="mt-6">
          <p className="text-slate-700">上传列表:</p>
        </div> */}
      </main>

      <footer className="mt-10 md:mt-16 text-center text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} 图床服务. 使用 <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="hover:text-sky-600" style={{ color: '#03A9F4' }}>Next.js</a> 构建.</p>
      </footer>
    </div>
  );
}