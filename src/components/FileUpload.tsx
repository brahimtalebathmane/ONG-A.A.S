import React, { useState, useRef } from 'react'
import { Upload, X, FileIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface FileUploadProps {
  bucket: 'profiles' | 'claims' | 'posts'
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  onUpload: (urls: string[]) => void
  label: string
  required?: boolean
  className?: string
}

export function FileUpload({ 
  bucket, 
  accept = '.jpg,.jpeg,.png,.pdf,.mp4', 
  multiple = false, 
  maxSize = 200,
  onUpload,
  label,
  required = false,
  className = ''
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    
    // Validate file sizes
    const oversizedFiles = selectedFiles.filter(file => file.size > maxSize * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      alert(`الملفات التالية كبيرة جداً (أكثر من ${maxSize}MB): ${oversizedFiles.map(f => f.name).join(', ')}`)
      return
    }

    setFiles(selectedFiles)
    handleUpload(selectedFiles)
  }

  const handleUpload = async (filesToUpload: File[]) => {
    if (filesToUpload.length === 0) return

    setUploading(true)
    const urls: string[] = []

    try {
      for (const file of filesToUpload) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
        
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) {
          console.error('Upload error:', error)
          continue
        }

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path)

        urls.push(publicUrl)
      }

      setUploadedUrls(urls)
      onUpload(urls)
    } catch (error) {
      console.error('Upload error:', error)
      alert('حدث خطأ أثناء رفع الملفات')
    } finally {
      setUploading(false)
    }
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    const newUrls = uploadedUrls.filter((_, i) => i !== index)
    setFiles(newFiles)
    setUploadedUrls(newUrls)
    onUpload(newUrls)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          required={required}
        />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        
        <p className="text-gray-600 mb-2">
          انقر لاختيار الملفات أو اسحبها هنا
        </p>
        
        <p className="text-xs text-gray-500 mb-4">
          الحد الأقصى: {maxSize}MB | الأنواع المدعومة: {accept}
        </p>
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {uploading ? 'جاري الرفع...' : 'اختر الملفات'}
        </button>
      </div>

      {/* File Preview */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">الملفات المحددة:</h4>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
              <div className="flex items-center space-x-3 space-x-reverse">
                <FileIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}