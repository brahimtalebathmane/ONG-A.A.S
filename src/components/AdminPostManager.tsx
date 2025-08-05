import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, MessageCircle, Calendar } from 'lucide-react'
import { supabase, Post, Comment } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { FileUpload } from './FileUpload'

interface AdminPostManagerProps {
  onStatsUpdate: () => void
}

export function AdminPostManager({ onStatsUpdate }: AdminPostManagerProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    media: ''
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users:created_by (full_name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          users:user_id (full_name)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setComments(data || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      if (editingPost) {
        // Update existing post
        const { error } = await supabase
          .from('posts')
          .update({
            title: formData.title,
            content: formData.content,
            media: formData.media || null
          })
          .eq('id', editingPost.id)

        if (error) throw error
      } else {
        // Create new post
        const { error } = await supabase
          .from('posts')
          .insert({
            title: formData.title,
            content: formData.content,
            media: formData.media || null,
            created_by: user.id
          })

        if (error) throw error
      }

      setFormData({ title: '', content: '', media: '' })
      setShowForm(false)
      setEditingPost(null)
      fetchPosts()
      onStatsUpdate()
      alert(editingPost ? 'تم تحديث المنشور بنجاح' : 'تم إنشاء المنشور بنجاح')
    } catch (error) {
      console.error('Error saving post:', error)
      alert('حدث خطأ أثناء حفظ المنشور')
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنشور؟')) return

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) throw error
      fetchPosts()
      onStatsUpdate()
      alert('تم حذف المنشور بنجاح')
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('حدث خطأ أثناء حذف المنشور')
    }
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      media: post.media || ''
    })
    setShowForm(true)
  }

  const handleMediaUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setFormData(prev => ({ ...prev, media: urls[0] }))
    }
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingPost(null)
    setFormData({ title: '', content: '', media: '' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingPost ? 'تحديث المنشور' : 'إنشاء منشور جديد'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              العنوان *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="أدخل عنوان المنشور"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المحتوى *
            </label>
            <textarea
              required
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="اكتب محتوى المنشور..."
            />
          </div>

          <FileUpload
            bucket="posts"
            accept=".jpg,.jpeg,.png,.mp4"
            maxSize={200}
            onUpload={handleMediaUpload}
            label="ملف الوسائط (صورة أو فيديو - اختياري)"
          />

          {formData.media && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                معاينة الوسائط
              </label>
              {formData.media.includes('.mp4') ? (
                <video 
                  src={formData.media} 
                  controls 
                  className="w-full max-w-md rounded-lg"
                  style={{ maxHeight: '200px' }}
                />
              ) : (
                <img 
                  src={formData.media} 
                  alt="معاينة"
                  className="w-full max-w-md rounded-lg object-cover"
                  style={{ maxHeight: '200px' }}
                />
              )}
            </div>
          )}

          <div className="flex space-x-4 space-x-reverse">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingPost ? 'تحديث المنشور' : 'إنشاء المنشور'}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">إدارة المنشورات</h3>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 space-x-reverse"
        >
          <Plus className="h-4 w-4" />
          <span>منشور جديد</span>
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">لا توجد منشورات</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            إنشاء أول منشور
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {post.media && (
                <div className="aspect-video">
                  {post.media.includes('.mp4') ? (
                    <video 
                      src={post.media} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src={post.media} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}
              
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.content}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>
                    بواسطة: {post.users?.full_name || 'الإدارة'}
                  </span>
                  <span className="flex items-center space-x-1 space-x-reverse">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.created_at).toLocaleDateString('ar-SA')}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setSelectedPost(post)
                      fetchComments(post.id)
                    }}
                    className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 space-x-reverse"
                  >
                    <Eye className="h-4 w-4" />
                    <span>عرض</span>
                  </button>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  تفاصيل المنشور
                </h3>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedPost.title}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {selectedPost.content}
                </p>
              </div>

              {selectedPost.media && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">الوسائط المرفقة</h5>
                  {selectedPost.media.includes('.mp4') ? (
                    <video 
                      src={selectedPost.media} 
                      controls 
                      className="w-full rounded-lg"
                      style={{ maxHeight: '400px' }}
                    />
                  ) : (
                    <img 
                      src={selectedPost.media} 
                      alt={selectedPost.title}
                      className="w-full rounded-lg object-cover"
                      style={{ maxHeight: '400px' }}
                    />
                  )}
                </div>
              )}

              <div>
                <div className="flex items-center space-x-3 space-x-reverse mb-4">
                  <MessageCircle className="h-5 w-5 text-gray-400" />
                  <h5 className="font-medium text-gray-900">
                    التعليقات ({comments.length})
                  </h5>
                </div>
                
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">لا توجد تعليقات</p>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {comments.map((comment) => (
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
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}