import React, { useState, useEffect } from 'react'
import { Eye, CheckCircle, X, Calendar, Phone, Car } from 'lucide-react'
import { supabase, User } from '../lib/supabase'

interface AdminUserManagerProps {
  onStatsUpdate: () => void
}

export function AdminUserManager({ onStatsUpdate }: AdminUserManagerProps) {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_verified: true })
        .eq('id', userId)

      if (error) throw error

      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_verified: true } : user
      ))
      onStatsUpdate()
      alert('تم التحقق من المستخدم بنجاح')
    } catch (error) {
      console.error('Error verifying user:', error)
      alert('حدث خطأ أثناء التحقق من المستخدم')
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
        <h3 className="text-lg font-semibold text-gray-900">إدارة المستخدمين</h3>
        <div className="text-sm text-gray-500">
          إجمالي المستخدمين: {users.length}
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">لا يوجد مستخدمين</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المستخدم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم الهاتف
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم السيارة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    تاريخ التسجيل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        {user.profile_image && (
                          <img
                            src={user.profile_image}
                            alt={user.full_name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.full_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.role === 'admin' ? 'مدير' : 'مستخدم'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{user.phone_number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Car className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">{user.car_number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.is_verified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.is_verified ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            محقق
                          </>
                        ) : (
                          'قيد المراجعة'
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {new Date(user.created_at).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-blue-600 hover:text-blue-900 flex items-center space-x-1 space-x-reverse"
                        >
                          <Eye className="h-4 w-4" />
                          <span>عرض</span>
                        </button>
                        {!user.is_verified && user.role !== 'admin' && (
                          <button
                            onClick={() => handleVerifyUser(user.id)}
                            className="text-green-600 hover:text-green-900 flex items-center space-x-1 space-x-reverse"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>تحقق</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  تفاصيل المستخدم
                </h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">المعلومات الشخصية</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">الاسم الكامل</label>
                      <p className="text-gray-900">{selectedUser.full_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">رقم الهاتف</label>
                      <p className="text-gray-900">{selectedUser.phone_number}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">رقم السيارة</label>
                      <p className="text-gray-900">{selectedUser.car_number}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">الحالة</label>
                      <p className={`font-medium ${selectedUser.is_verified ? 'text-green-600' : 'text-yellow-600'}`}>
                        {selectedUser.is_verified ? 'محقق' : 'قيد المراجعة'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">معلومات التأمين</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">تاريخ بداية التأمين</label>
                      <p className="text-gray-900">
                        {selectedUser.insurance_start ? new Date(selectedUser.insurance_start).toLocaleDateString('ar-SA') : 'غير محدد'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">تاريخ انتهاء التأمين</label>
                      <p className="text-gray-900">
                        {selectedUser.insurance_end ? new Date(selectedUser.insurance_end).toLocaleDateString('ar-SA') : 'غير محدد'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">تاريخ التسجيل</label>
                      <p className="text-gray-900">
                        {new Date(selectedUser.created_at).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">المستندات</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedUser.profile_image && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-2">الصورة الشخصية</label>
                      <img
                        src={selectedUser.profile_image}
                        alt="الصورة الشخصية"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    </div>
                  )}

                  {selectedUser.driver_license && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-2">رخصة القيادة</label>
                      <a
                        href={selectedUser.driver_license}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img
                          src={selectedUser.driver_license}
                          alt="رخصة القيادة"
                          className="w-full h-48 object-cover rounded-lg border hover:opacity-80 transition-opacity"
                        />
                      </a>
                    </div>
                  )}

                  {selectedUser.insurance_image && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 block mb-2">وثيقة التأمين</label>
                      <a
                        href={selectedUser.insurance_image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img
                          src={selectedUser.insurance_image}
                          alt="وثيقة التأمين"
                          className="w-full h-48 object-cover rounded-lg border hover:opacity-80 transition-opacity"
                        />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {!selectedUser.is_verified && selectedUser.role !== 'admin' && (
                <div className="flex justify-end pt-4 border-t">
                  <button
                    onClick={() => {
                      handleVerifyUser(selectedUser.id)
                      setSelectedUser(null)
                    }}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 space-x-reverse"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>تحقق من المستخدم</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}