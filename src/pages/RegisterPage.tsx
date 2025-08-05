import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Phone, Lock, Car, Calendar, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { FileUpload } from '../components/FileUpload'

export function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    carNumber: '',
    phoneNumber: '',
    pin: '',
    insuranceStart: '',
    insuranceEnd: ''
  })
  const [files, setFiles] = useState({
    profileImage: '',
    driverLicense: '',
    insuranceDocument: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = (type: 'profileImage' | 'driverLicense' | 'insuranceDocument') => (urls: string[]) => {
    if (urls.length > 0) {
      setFiles(prev => ({ ...prev, [type]: urls[0] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validate phone number (8 digits)
    if (!/^\d{8}$/.test(formData.phoneNumber)) {
      setError('رقم الهاتف يجب أن يكون 8 أرقام')
      setLoading(false)
      return
    }

    // Validate PIN (4 digits)
    if (!/^\d{4}$/.test(formData.pin)) {
      setError('الرقم السري يجب أن يكون 4 أرقام')
      setLoading(false)
      return
    }

    // Validate required files
    if (!files.profileImage || !files.driverLicense || !files.insuranceDocument) {
      setError('جميع الملفات مطلوبة')
      setLoading(false)
      return
    }

    // Validate insurance dates
    const startDate = new Date(formData.insuranceStart)
    const endDate = new Date(formData.insuranceEnd)
    if (endDate <= startDate) {
      setError('تاريخ انتهاء التأمين يجب أن يكون بعد تاريخ البداية')
      setLoading(false)
      return
    }

    try {
      const { error: dbError } = await supabase
        .from('users')
        .insert({
          full_name: formData.fullName,
          car_number: formData.carNumber,
          phone_number: formData.phoneNumber,
          pin: formData.pin,
          profile_image: files.profileImage,
          driver_license: files.driverLicense,
          insurance_image: files.insuranceDocument,
          insurance_start: formData.insuranceStart,
          insurance_end: formData.insuranceEnd,
          is_verified: false,
          role: 'user'
        })

      if (dbError) {
        if (dbError.code === '23505') { // Unique constraint violation
          setError('رقم الهاتف مستخدم من قبل')
        } else {
          setError('حدث خطأ أثناء التسجيل')
        }
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      setError('حدث خطأ أثناء التسجيل')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">تم التسجيل بنجاح!</h2>
          <p className="text-gray-600 mb-6">
            تم إرسال طلب التسجيل الخاص بك. سيتم مراجعة المستندات والتحقق من الحساب من قبل الإدارة.
          </p>
          <p className="text-sm text-gray-500">
            سيتم تحويلك إلى صفحة تسجيل الدخول...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <img 
            src="https://i.postimg.cc/mkjyN04T/5.png" 
            alt="ONG A.A.S" 
            className="h-20 w-20 rounded-full mx-auto mb-4 border-4 border-blue-600"
          />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">إنشاء حساب جديد</h2>
          <p className="text-gray-600">املأ النموذج أدناه للتسجيل في النظام</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-3 space-x-reverse">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-800">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                الاسم الكامل *
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>
            </div>

            <div>
              <label htmlFor="carNumber" className="block text-sm font-medium text-gray-700 mb-2">
                رقم السيارة *
              </label>
              <div className="relative">
                <Car className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="carNumber"
                  name="carNumber"
                  type="text"
                  required
                  value={formData.carNumber}
                  onChange={handleInputChange}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل رقم السيارة"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                رقم الهاتف (8 أرقام) *
              </label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: 12345678"
                  maxLength={8}
                />
              </div>
            </div>

            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
                الرقم السري (4 أرقام) *
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="pin"
                  name="pin"
                  type="password"
                  required
                  value={formData.pin}
                  onChange={handleInputChange}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="****"
                  maxLength={4}
                />
              </div>
            </div>

            <div>
              <label htmlFor="insuranceStart" className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ بداية التأمين *
              </label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="insuranceStart"
                  name="insuranceStart"
                  type="date"
                  required
                  value={formData.insuranceStart}
                  onChange={handleInputChange}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="insuranceEnd" className="block text-sm font-medium text-gray-700 mb-2">
                تاريخ انتهاء التأمين *
              </label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="insuranceEnd"
                  name="insuranceEnd"
                  type="date"
                  required
                  value={formData.insuranceEnd}
                  onChange={handleInputChange}
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <FileUpload
              bucket="profiles"
              accept=".jpg,.jpeg,.png"
              onUpload={handleFileUpload('profileImage')}
              label="صورة الملف الشخصي"
              required
            />

            <FileUpload
              bucket="profiles"
              accept=".jpg,.jpeg,.png,.pdf"
              onUpload={handleFileUpload('driverLicense')}
              label="رخصة القيادة"
              required
            />

            <FileUpload
              bucket="profiles"
              accept=".jpg,.jpeg,.png,.pdf"
              onUpload={handleFileUpload('insuranceDocument')}
              label="وثيقة التأمين"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'جاري التسجيل...' : 'تسجيل الحساب'}
          </button>

          <div className="text-center">
            <p className="text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                سجل الدخول
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}