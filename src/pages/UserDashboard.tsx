import React, { useState, useEffect } from 'react'
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase, Claim } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { ClaimForm } from '../components/ClaimForm'

export function UserDashboard() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [showClaimForm, setShowClaimForm] = useState(false)
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchUserClaims()
    }
  }, [user])

  const fetchUserClaims = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('claims')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setClaims(data || [])
    } catch (error) {
      console.error('Error fetching claims:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="h-5 w-5 text-yellow-500" />
      case 'In Progress': return <AlertCircle className="h-5 w-5 text-blue-500" />
      case 'Resolved': return <CheckCircle className="h-5 w-5 text-green-500" />
      default: return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Pending': return 'قيد الانتظار'
      case 'In Progress': return 'قيد المعالجة'
      case 'Resolved': return 'مكتملة'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Resolved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (showClaimForm) {
    return (
      <ClaimForm 
        onSuccess={() => {
          setShowClaimForm(false)
          fetchUserClaims()
        }}
        onCancel={() => setShowClaimForm(false)}
      />
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
              <p className="text-gray-600 mt-2">مرحباً {user?.full_name}</p>
            </div>
            
            {user?.is_verified ? (
              <button
                onClick={() => setShowClaimForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 space-x-reverse"
              >
                <Plus className="h-5 w-5" />
                <span>مطالبة جديدة</span>
              </button>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  يجب التحقق من حسابك قبل تقديم المطالبات
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">حالة الحساب</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                user?.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user?.is_verified ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    محقق
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 mr-1" />
                    قيد المراجعة
                  </>
                )}
              </div>
              <p className="text-gray-600 text-sm mt-2">حالة التحقق</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{claims.length}</div>
              <p className="text-gray-600 text-sm">إجمالي المطالبات</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {claims.filter(c => c.status === 'Resolved').length}
              </div>
              <p className="text-gray-600 text-sm">مطالبات مكتملة</p>
            </div>
          </div>
        </div>

        {/* Claims List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2 space-x-reverse">
              <FileText className="h-6 w-6" />
              <span>مطالباتي</span>
            </h2>
          </div>

          {claims.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد مطالبات</h3>
              <p className="text-gray-600 mb-4">لم تقم بتقديم أي مطالبات بعد</p>
              {user?.is_verified && (
                <button
                  onClick={() => setShowClaimForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  تقديم مطالبة جديدة
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {claims.map((claim, index) => (
                <div key={claim.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      {getStatusIcon(claim.status)}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {claim.title}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                        {getStatusText(claim.status)}
                      </span>
                      <span className="text-sm text-gray-500">
                        المطالبة #{claims.length - index}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{claim.description}</p>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">التقدم</span>
                      <span className="text-sm text-gray-600">{claim.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${claim.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>تاريخ الحادث: {new Date(claim.date).toLocaleDateString('ar-SA')}</span>
                    <span>تاريخ التقديم: {new Date(claim.created_at).toLocaleDateString('ar-SA')}</span>
                  </div>

                  <button
                    onClick={() => setSelectedClaim(claim)}
                    className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    عرض التفاصيل
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Claim Detail Modal */}
        {selectedClaim && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    تفاصيل المطالبة
                  </h3>
                  <button
                    onClick={() => setSelectedClaim(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">العنوان</h4>
                  <p className="text-gray-700">{selectedClaim.title}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">الوصف</h4>
                  <p className="text-gray-700">{selectedClaim.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">الحالة</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedClaim.status)}`}>
                      {getStatusText(selectedClaim.status)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">التقدم</h4>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${selectedClaim.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{selectedClaim.progress}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">المرفقات</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedClaim.accident_images.map((image, index) => (
                      <div key={index}>
                        <p className="text-sm text-gray-600 mb-2">صورة الحادث {index + 1}</p>
                        <img 
                          src={image} 
                          alt={`صورة الحادث ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                    
                    {selectedClaim.police_report && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">تقرير الشرطة</p>
                        <a 
                          href={selectedClaim.police_report}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <FileText className="h-12 w-12 text-gray-400" />
                        </a>
                      </div>
                    )}
                    
                    {selectedClaim.insurance_receipt && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">إيصال التأمين</p>
                        <a 
                          href={selectedClaim.insurance_receipt}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                        >
                          <FileText className="h-12 w-12 text-gray-400" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}