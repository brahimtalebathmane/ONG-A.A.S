import React, { useState, useEffect } from 'react'
import { Eye, Edit, Calendar, User, BarChart3 } from 'lucide-react'
import { supabase, Claim, User as UserType } from '../lib/supabase'

interface AdminClaimManagerProps {
  onStatsUpdate: () => void
}

export function AdminClaimManager({ onStatsUpdate }: AdminClaimManagerProps) {
  const [claims, setClaims] = useState<(Claim & { users: UserType })[]>([])
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)
  const [editingClaim, setEditingClaim] = useState<{
    id: string
    status: string
    progress: number
    note: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClaims()
  }, [])

  const fetchClaims = async () => {
    try {
      const { data, error } = await supabase
        .from('claims')
        .select(`
          *,
          users:user_id (full_name, phone_number, car_number)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setClaims(data || [])
    } catch (error) {
      console.error('Error fetching claims:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateClaim = async () => {
    if (!editingClaim) return

    try {
      const { error } = await supabase
        .from('claims')
        .update({
          status: editingClaim.status,
          progress: editingClaim.progress
        })
        .eq('id', editingClaim.id)

      if (error) throw error

      // Add update record
      await supabase
        .from('claim_updates')
        .insert({
          claim_id: editingClaim.id,
          updated_by: JSON.parse(localStorage.getItem('ong_user') || '{}').id,
          new_status: editingClaim.status,
          new_progress: editingClaim.progress,
          note: editingClaim.note || null
        })

      setClaims(claims.map(claim => 
        claim.id === editingClaim.id 
          ? { ...claim, status: editingClaim.status as any, progress: editingClaim.progress }
          : claim
      ))
      
      setEditingClaim(null)
      onStatsUpdate()
      alert('تم تحديث المطالبة بنجاح')
    } catch (error) {
      console.error('Error updating claim:', error)
      alert('حدث خطأ أثناء تحديث المطالبة')
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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">إدارة المطالبات</h3>
        <div className="text-sm text-gray-500">
          إجمالي المطالبات: {claims.length}
        </div>
      </div>

      {claims.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">لا توجد مطالبات</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم المطالبة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المستخدم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العنوان
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التقدم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التاريخ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {claims.map((claim, index) => (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{claims.length - index}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {claim.users?.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {claim.users?.phone_number}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {claim.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                        {getStatusText(claim.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${claim.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{claim.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {new Date(claim.created_at).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <button
                          onClick={() => setSelectedClaim(claim)}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1 space-x-reverse"
                        >
                          <Eye className="h-4 w-4" />
                          <span>عرض</span>
                        </button>
                        <button
                          onClick={() => setEditingClaim({
                            id: claim.id,
                            status: claim.status,
                            progress: claim.progress,
                            note: ''
                          })}
                          className="text-green-600 hover:text-green-900 flex items-center space-x-1 space-x-reverse"
                        >
                          <Edit className="h-4 w-4" />
                          <span>تحديث</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">العنوان</h4>
                  <p className="text-gray-700">{selectedClaim.title}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">الحالة والتقدم</h4>
                  <div className="space-y-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedClaim.status)}`}>
                      {getStatusText(selectedClaim.status)}
                    </span>
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
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">الوصف</h4>
                <p className="text-gray-700">{selectedClaim.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">المرفقات</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {selectedClaim.accident_images.map((image, index) => (
                    <div key={index}>
                      <p className="text-sm text-gray-600 mb-2">صورة الحادث {index + 1}</p>
                      <img 
                        src={image} 
                        alt={`صورة الحادث ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg cursor-pointer"
                        onClick={() => window.open(image, '_blank')}
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
                        className="block w-full h-48 bg-blue-50 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                      >
                        <div className="text-center">
                          <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                          <span className="text-sm text-blue-600">عرض التقرير</span>
                        </div>
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
                        className="block w-full h-48 bg-green-50 rounded-lg flex items-center justify-center hover:bg-green-100 transition-colors"
                      >
                        <div className="text-center">
                          <BarChart3 className="h-12 w-12 text-green-400 mx-auto mb-2" />
                          <span className="text-sm text-green-600">عرض الإيصال</span>
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Claim Modal */}
      {editingClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                تحديث المطالبة
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة
                </label>
                <select
                  value={editingClaim.status}
                  onChange={(e) => setEditingClaim({ ...editingClaim, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">قيد الانتظار</option>
                  <option value="In Progress">قيد المعالجة</option>
                  <option value="Resolved">مكتملة</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التقدم ({editingClaim.progress}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editingClaim.progress}
                  onChange={(e) => setEditingClaim({ ...editingClaim, progress: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملاحظة (اختيارية)
                </label>
                <textarea
                  value={editingClaim.note}
                  onChange={(e) => setEditingClaim({ ...editingClaim, note: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أضف ملاحظة حول التحديث..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex space-x-3 space-x-reverse">
              <button
                onClick={handleUpdateClaim}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                حفظ التحديث
              </button>
              <button
                onClick={() => setEditingClaim(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}