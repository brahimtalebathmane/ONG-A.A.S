import React, { useState, useEffect } from 'react'
import { Users, FileText, MessageSquare, Settings, CheckCircle, X, Eye } from 'lucide-react'
import { supabase, User, Claim, Post } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { AdminUserManager } from '../components/AdminUserManager'
import { AdminClaimManager } from '../components/AdminClaimManager'
import { AdminPostManager } from '../components/AdminPostManager'

type TabType = 'users' | 'claims' | 'posts'

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('users')
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    totalClaims: 0,
    pendingClaims: 0,
    totalPosts: 0
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch user stats
      const { data: users } = await supabase
        .from('users')
        .select('is_verified')

      // Fetch claim stats
      const { data: claims } = await supabase
        .from('claims')
        .select('status')

      // Fetch post stats
      const { data: posts } = await supabase
        .from('posts')
        .select('id')

      setStats({
        totalUsers: users?.length || 0,
        verifiedUsers: users?.filter(u => u.is_verified).length || 0,
        totalClaims: claims?.length || 0,
        pendingClaims: claims?.filter(c => c.status === 'Pending').length || 0,
        totalPosts: posts?.length || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    {
      id: 'users' as TabType,
      label: 'إدارة المستخدمين',
      icon: Users,
      count: stats.totalUsers
    },
    {
      id: 'claims' as TabType,
      label: 'إدارة المطالبات',
      icon: FileText,
      count: stats.totalClaims
    },
    {
      id: 'posts' as TabType,
      label: 'إدارة المنشورات',
      icon: MessageSquare,
      count: stats.totalPosts
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3 space-x-reverse">
            <Settings className="h-8 w-8" />
            <span>لوحة الإدارة</span>
          </h1>
          <p className="text-gray-600 mt-2">مرحباً {user?.full_name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مستخدمين محققين</p>
                <p className="text-2xl font-bold text-green-600">{stats.verifiedUsers}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المطالبات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalClaims}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">مطالبات معلقة</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingClaims}</p>
              </div>
              <FileText className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المنشورات</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.totalPosts}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 space-x-reverse px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 space-x-reverse py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                    <span className="bg-gray-100 rounded-full px-2 py-1 text-xs">
                      {tab.count}
                    </span>
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'users' && <AdminUserManager onStatsUpdate={fetchStats} />}
            {activeTab === 'claims' && <AdminClaimManager onStatsUpdate={fetchStats} />}
            {activeTab === 'posts' && <AdminPostManager onStatsUpdate={fetchStats} />}
          </div>
        </div>
      </div>
    </div>
  )
}