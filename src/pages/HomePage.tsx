import React, { useState, useEffect } from 'react'
import { MessageCircle, Calendar, BarChart3, Shield, FileText, Users } from 'lucide-react'
import { supabase, Post, Claim, Comment, User } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [claims, setClaims] = useState<Claim[]>([])
  const [comments, setComments] = useState<{ [postId: string]: Comment[] }>({})
  const [newComment, setNewComment] = useState<{ [postId: string]: string }>({})
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch posts
      const { data: postsData } = await supabase
        .from('posts')
        .select(`
          *,
          users:created_by (full_name)
        `)
        .order('created_at', { ascending: false })

      // Fetch claims (only show claim numbers and progress)
      const { data: claimsData } = await supabase
        .from('claims')
        .select('id, status, progress, created_at')
        .order('created_at', { ascending: false })

      // Fetch comments for all posts
      const { data: commentsData } = await supabase
        .from('comments')
        .select(`
          *,
          users:user_id (full_name)
        `)
        .order('created_at', { ascending: true })

      if (postsData) setPosts(postsData)
      if (claimsData) setClaims(claimsData)
      
      // Group comments by post_id
      if (commentsData) {
        const groupedComments = commentsData.reduce((acc, comment) => {
          if (!acc[comment.post_id]) {
            acc[comment.post_id] = []
          }
          acc[comment.post_id].push(comment)
          return acc
        }, {} as { [postId: string]: Comment[] })
        setComments(groupedComments)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCommentSubmit = async (postId: string) => {
    if (!user || !user.is_verified || !newComment[postId]?.trim()) return

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: newComment[postId].trim()
        })
        .select(`
          *,
          users:user_id (full_name)
        `)
        .single()

      if (error) throw error

      // Update comments state
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), data]
      }))

      // Clear input
      setNewComment(prev => ({ ...prev, [postId]: '' }))
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('حدث خطأ أثناء إضافة التعليق')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500'
      case 'In Progress': return 'bg-blue-500'
      case 'Resolved': return 'bg-green-500'
      default: return 'bg-gray-500'
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <img 
                src="https://i.postimg.cc/mkjyN04T/5.png" 
                alt="ONG A.A.S" 
                className="h-24 w-24 rounded-full border-4 border-white shadow-lg"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">ONG A.A.S</h1>
            <p className="text-xl md:text-2xl mb-6 text-blue-200">
              جمعية مدنية للتوعية التأمينية ومواكبة المطالبات
            </p>
            <p className="text-lg mb-8 max-w-4xl mx-auto leading-relaxed">
              نحن جمعية مدنية غير ربحية مكرسة لنشر الوعي التأميني وحماية حقوق المؤمنين ومساعدتهم في الحصول على تعويضاتهم المستحقة
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="flex flex-col items-center p-6 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
                <Shield className="h-12 w-12 mb-4 text-blue-200" />
                <h3 className="text-lg font-semibold mb-2">حماية شاملة</h3>
                <p className="text-blue-200 text-center">نحمي حقوق المؤمنين ونساعدهم في الحصول على تعويضاتهم</p>
              </div>
              
              <div className="flex flex-col items-center p-6 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
                <FileText className="h-12 w-12 mb-4 text-blue-200" />
                <h3 className="text-lg font-semibold mb-2">خدمات متطورة</h3>
                <p className="text-blue-200 text-center">نقدم خدمات متطورة لمتابعة المطالبات والتعويضات</p>
              </div>
              
              <div className="flex flex-col items-center p-6 bg-white bg-opacity-10 rounded-lg backdrop-blur-sm">
                <Users className="h-12 w-12 mb-4 text-blue-200" />
                <h3 className="text-lg font-semibold mb-2">مرجعية رسمية</h3>
                <p className="text-blue-200 text-center">جمعية معتمدة رسمياً لحماية حقوق المؤمنين</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Posts Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <MessageCircle className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">الأخبار والمقالات</h2>
            </div>
            
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {posts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>لا توجد مقالات متاحة حالياً</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{post.content}</p>
                      
                      {post.media && (
                        <div className="mb-4">
                          {post.media.includes('.mp4') ? (
                            <video 
                              src={post.media} 
                              controls 
                              className="w-full rounded-lg"
                              style={{ maxHeight: '300px' }}
                            />
                          ) : (
                            <img 
                              src={post.media} 
                              alt={post.title}
                              className="w-full rounded-lg object-cover"
                              style={{ maxHeight: '300px' }}
                            />
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>
                          بواسطة: {post.users?.full_name || 'الإدارة'}
                        </span>
                        <span>
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {new Date(post.created_at).toLocaleDateString('ar-SA')}
                        </span>
                      </div>

                      {/* Comments Section */}
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-900 mb-3">التعليقات</h4>
                        
                        {/* Existing Comments */}
                        <div className="space-y-3 mb-4 max-h-32 overflow-y-auto">
                          {(comments[post.id] || []).map((comment) => (
                            <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-900">
                                  {comment.users?.full_name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.created_at).toLocaleDateString('ar-SA')}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700">{comment.content}</p>
                            </div>
                          ))}
                        </div>

                        {/* Add Comment */}
                        {user && user.is_verified ? (
                          <div className="flex space-x-2 space-x-reverse">
                            <input
                              type="text"
                              value={newComment[post.id] || ''}
                              onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                              placeholder="اكتب تعليقك..."
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                            />
                            <button
                              onClick={() => handleCommentSubmit(post.id)}
                              disabled={!newComment[post.id]?.trim()}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                              إرسال
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-2">
                            {user ? 'يجب التحقق من حسابك لإضافة تعليق' : 'يجب تسجيل الدخول لإضافة تعليق'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Claims Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">المطالبات</h2>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {claims.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>لا توجد مطالبات متاحة حالياً</p>
                </div>
              ) : (
                claims.map((claim, index) => (
                  <div key={claim.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        المطالبة #{claims.length - index}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(claim.status)}`}>
                        {getStatusText(claim.status)}
                      </span>
                    </div>
                    
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
                    
                    <div className="text-sm text-gray-500">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      {new Date(claim.created_at).toLocaleDateString('ar-SA')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}