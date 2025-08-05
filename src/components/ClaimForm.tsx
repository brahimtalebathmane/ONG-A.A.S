import React, { useState } from 'react'
import { Calendar, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { FileUpload } from './FileUpload'

interface ClaimFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function ClaimForm({ onSuccess, onCancel }: ClaimFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: ''
  })
  const [files, setFiles] = useState({
    accidentImages: [] as string[],
    policeReport: '',
    insuranceReceipt: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAccidentImagesUpload = (urls: string[]) => {
    setFiles(prev => ({ ...prev, accidentImages: urls }))
  }

  const handlePoliceReportUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setFiles(prev => ({ ...prev, policeReport: urls[0] }))
    }
  }

  const handleInsuranceReceiptUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setFiles(prev => ({ ...prev, insuranceReceipt: urls[0] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!user) {
      setError('يجب تسجيل الدخول أولاً')
      setLoading(false)
      return
    }

    if (!user.is_verified) {
      setError('يجب التحقق من حسابك أولاً')
      setLoading(false)
      return
    }

    // Validate required files
    if (files.accidentImages.length < 2) {
      setError('يجب رفع صورتين للحادث على الأقل')
      setLoading(false)
      return
    }

    if (!files.policeReport || !files.insuranceReceipt) {
      setError('جميع الملفات مطلوبة')
      setLoading(false)
      return
    }

    try {
      const { error: dbError } = await supabase
        .from('claims')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          date: formData.date,
          accident_images: files.accidentImages,
          police_report: files.policeReport,
          insurance_receipt: files.insuranceReceipt,
          status: 'Pending',
          progress: 0
        })

      if (dbError) {
        setError('حدث خطأ أثناء تقديم المطالبة')
        setLoading(false)
        return
      }

      onSuccess()
    } catch (err) {
      setError('حدث خطأ أثناء تقديم المطالبة')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2 space-x-reverse">
              <FileText className="h-6 w-6" />
              <span>تقديم مطالبة جديدة</span>
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-3 space-x-reverse">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <span className="text-red-800">{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                عنوان المطالبة *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل عنوان المطالبة"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                وصف المطالبة *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="اشرح تفاصيل الحادث والأضرار"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ الحادث *
              </label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <FileUpload
              bucket="claims"
              accept=".jpg,.jpeg,.png"
              multiple
              onUpload={handleAccidentImagesUpload}
              label="صور الحادث (صورتان على الأقل)"
              required
            />

            <FileUpload
              bucket="claims"
              accept=".jpg,.jpeg,.png,.pdf"
              onUpload={handlePoliceReportUpload}
              label="تقرير الشرطة"
              required
            />

            <FileUpload
              bucket="claims"
              accept=".jpg,.jpeg,.png,.pdf"
              onUpload={handleInsuranceReceiptUpload}
              label="إيصال التأمين"
              required
            />

            <div className="flex space-x-4 space-x-reverse pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'جاري التقديم...' : 'تقديم المطالبة'}
              </button>
              
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}