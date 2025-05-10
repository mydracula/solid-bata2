"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ArrowUpTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';

export default function HomePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [currentDisplayMessage, setCurrentDisplayMessage] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [displaySuccessUrl, setDisplaySuccessUrl] = useState<string | null>(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (uploadMessage) {
      setCurrentDisplayMessage(uploadMessage);
      const fadeInTimer = setTimeout(() => setShowNotification(true), 50);
      return () => clearTimeout(fadeInTimer);
    } else {
      setShowNotification(false);
      if (currentDisplayMessage) {
        const fadeOutTimer = setTimeout(() => setCurrentDisplayMessage(null), 300);
        return () => clearTimeout(fadeOutTimer);
      }
    }
  }, [uploadMessage, currentDisplayMessage]);

  useEffect(() => {
    if (uploadedImageUrl && !isUploading) {
      setDisplaySuccessUrl(uploadedImageUrl);
      const fadeInTimer = setTimeout(() => setShowSuccessNotification(true), 50);
      setUploadMessage(null);
      setCurrentDisplayMessage(null);
      setShowNotification(false);
      return () => clearTimeout(fadeInTimer);
    } else {
      setShowSuccessNotification(false);
      if (displaySuccessUrl) {
        const fadeOutTimer = setTimeout(() => setDisplaySuccessUrl(null), 300);
        return () => clearTimeout(fadeOutTimer);
      }
    }
  }, [uploadedImageUrl, isUploading, displaySuccessUrl]);


  const handleUploadAreaClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const processFile = useCallback(async (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    setUploadMessage('正在上传图片...');
    setUploadedImageUrl(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `上传失败：服务器响应 ${response.status}`);
      }

      if (!result.imageUrl || !result.imageUrl.startsWith('http')) {
        throw new Error(result.error || '上传成功，但未能获取有效的图片URL。');
      }

      setUploadedImageUrl(result.imageUrl);
      setUploadMessage(null);
    } catch (error: unknown) {
      console.error('Upload error:', error);
      if (error instanceof Error) {
        setUploadMessage(`上传出错：${error.message}`);
      } else {
        setUploadMessage(`上传出错：未知错误`);
      }
      setUploadedImageUrl(null);
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [fileInputRef]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      processFile(event.target.files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDraggingOver(false);
    if (isUploading) return;
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      processFile(event.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isUploading) return;
    if (event.dataTransfer.types.includes('Files')) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isUploading) return;
    setIsDraggingOver(false);
  };

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (isUploading) return;

      const items = event.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            if (file) {
              processFile(file);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [isUploading, processFile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-slate-50 to-white flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 selection:bg-sky-200 selection:text-sky-900">
      <header className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 sm:gap-6 mb-8 md:mb-12 px-6 sm:px-8 md:px-10 pl-0!">
        <div className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="jp_tu"
            width={64}
            height={64}
            priority
          />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-sky-600">
            图床
          </h1>
          <p className="text-slate-500 mt-1 text-base sm:text-lg">
            轻松上传和分享您的图片
          </p>
        </div>
      </header>

      <main className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-6 sm:p-8 md:p-10 min-h-[245px]">
        <div
          className={`rounded-lg p-8 sm:p-12 text-center transition-all duration-300 ease-in-out group
            ${isUploading ? 'cursor-not-allowed bg-slate-100 border-slate-400 border-2 border-dashed'
              : isDraggingOver ? 'bg-sky-100 border-sky-500 border-2 border-solid ring-2 ring-sky-500 ring-offset-2'
                : 'cursor-pointer hover:border-sky-500 hover:border-solid hover:bg-sky-100 border-sky-500 border-2 border-dashed'
            }`}
          onClick={handleUploadAreaClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
            disabled={isUploading}
          />
          {previewUrl && !uploadedImageUrl && (
            <div className="mb-4 h-48 flex items-center justify-center relative">
              {previewUrl && <Image src={previewUrl} alt="图片预览" fill style={{ objectFit: 'contain' }} className="rounded-md shadow-lg" />}
            </div>
          )}
          {!previewUrl && (
            isUploading ? (
              <ArrowPathIcon
                className="mx-auto h-16 w-16 text-slate-400 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <ArrowUpTrayIcon
                className="mx-auto h-16 w-16 text-sky-500 group-hover:text-sky-600 transition-colors duration-300"
                aria-hidden="true"
              />
            )
          )}
          <p className={`mt-4 text-lg ${isUploading ? 'text-slate-500' : 'text-slate-600 group-hover:text-sky-700'}`}>
            {isUploading ? '' : (previewUrl && !uploadedImageUrl ? '替换图片或' : '将文件拖放到此处，或')} <span className={`font-semibold ${isUploading ? 'text-slate-400' : 'text-sky-500'}`}>{isUploading ? '' : '点击选择文件'}</span>
          </p>
          {!isUploading && (
            <p className="mt-1 text-sm text-slate-500 group-hover:text-sky-600">
              支持 JPG, PNG, GIF 等图片格式
            </p>
          )}
        </div>

        {(currentDisplayMessage || displaySuccessUrl) && (
          <div className="mt-6 min-h-12">
            {currentDisplayMessage && (
              <div className={`p-4 rounded-lg text-sm flex items-start space-x-3
              transition-opacity duration-300 ease-in-out ${showNotification ? 'opacity-100' : 'opacity-0'} ${isUploading
                  ? 'bg-sky-50 border border-sky-200 text-sky-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
                }`}>
                {isUploading ? (
                  <ArrowPathIcon className="h-5 w-5 text-sky-500 animate-spin flex-shrink-0" aria-hidden="true" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0" aria-hidden="true" />
                )}
                <div className="flex-1">
                  <p className="whitespace-pre-wrap break-all">{currentDisplayMessage}</p>
                </div>
              </div>
            )}

            {displaySuccessUrl && !currentDisplayMessage && (
              <div className={`py-0 rounded-lg border border-transparent transition-opacity duration-300 ease-in-out ${showSuccessNotification ? 'opacity-100' : 'opacity-0'}`}>
                <input
                  type="text"
                  readOnly
                  value={displaySuccessUrl}
                  className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 selection:bg-sky-200 text-slate-700"
                  onFocus={(e) => e.target.select()}
                />
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="mt-10 md:mt-16 text-center text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} 图床服务. 使用 <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-600 font-medium">Next.js</a> 构建.</p>
      </footer>
    </div>
  );
}
