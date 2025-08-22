export const ar = {
  // Common
  common: {
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    confirm: 'تأكيد',
    search: 'بحث',
    loading: 'جاري التحميل...',
    yes: 'نعم',
    no: 'لا',
    back: 'رجوع',
    next: 'التالي',
    close: 'إغلاق',
    error: 'خطأ',
    success: 'نجح',
    view: 'عرض',
    details: 'التفاصيل',
    actions: 'الإجراءات',
    status: 'الحالة',
    date: 'التاريخ',
    created_at: 'تاريخ الإنشاء',
    updated_at: 'تاريخ التحديث',
    empty_state: {
      no_data: 'لا توجد بيانات',
      no_results: 'لا توجد نتائج',
      try_again: 'حاول مرة أخرى'
    }
  },

  // Navigation
  nav: {
    home: 'الرئيسية',
    admin: 'لوحة الإدارة',
    dashboard: 'لوحة التحكم',
    posts: 'المنشورات',
    claims: 'المطالبات',
    profile: 'الملف الشخصي',
    logout: 'تسجيل الخروج',
    login: 'تسجيل الدخول',
    register: 'التسجيل',
    language: {
      ar: 'العربية',
      fr: 'Français'
    }
  },

  // Footer
  footer: {
    organization_name: 'جمعية التأمين للتوعية',
    slogan: 'التأمين وعي… والتعويض حق.',
    license: 'الترخيص',
    license_date: 'تاريخ الترخيص',
    location: 'نواكشوط – موريتانيا',
    quick_links: 'روابط سريعة',
    contact_us: 'اتصل بنا',
    whatsapp: 'واتساب',
    phone: 'الهاتف',
    email: 'البريد الإلكتروني',
    rights_reserved: 'جميع الحقوق محفوظة'
  },

  // Authentication
  auth: {
    sign_in: {
      title: 'تسجيل الدخول',
      subtitle: 'ادخل رقم الهاتف والرقم السري الخاص بك',
      phone_label: 'رقم الهاتف (8 أرقام)',
      phone_placeholder: 'مثال: 12345678',
      pin_label: 'الرقم السري (4 أرقام)',
      pin_placeholder: '****',
      submit: 'تسجيل الدخول',
      loading: 'جاري تسجيل الدخول...',
      no_account: 'ليس لديك حساب؟',
      register_link: 'سجل الآن'
    },
    sign_up: {
      title: 'إنشاء حساب جديد',
      subtitle: 'املأ النموذج أدناه للتسجيل في النظام',
      full_name: 'الاسم الكامل',
      car_number: 'رقم السيارة',
      phone_number: 'رقم الهاتف (8 أرقام)',
      pin: 'الرقم السري (4 أرقام)',
      insurance_start: 'تاريخ بداية التأمين',
      insurance_end: 'تاريخ انتهاء التأمين',
      profile_image: 'صورة الملف الشخصي',
      driver_license: 'رخصة القيادة',
      insurance_document: 'وثيقة التأمين',
      submit: 'تسجيل الحساب',
      loading: 'جاري التسجيل...',
      success_title: 'تم التسجيل بنجاح!',
      success_message: 'تم إرسال طلب التسجيل الخاص بك. سيتم مراجعة المستندات والتحقق من الحساب من قبل الإدارة.',
      success_redirect: 'سيتم تحويلك إلى صفحة تسجيل الدخول...',
      have_account: 'لديك حساب بالفعل؟',
      login_link: 'سجل الدخول'
    },
    errors: {
      invalid_credentials: 'رقم الهاتف أو الرقم السري غير صحيح',
      phone_invalid: 'رقم الهاتف يجب أن يكون 8 أرقام',
      pin_invalid: 'الرقم السري يجب أن يكون 4 أرقام',
      phone_exists: 'رقم الهاتف مستخدم من قبل',
      registration_failed: 'حدث خطأ أثناء التسجيل',
      login_failed: 'حدث خطأ أثناء تسجيل الدخول',
      files_required: 'جميع الملفات مطلوبة',
      insurance_dates_invalid: 'تاريخ انتهاء التأمين يجب أن يكون بعد تاريخ البداية'
    }
  },

  // Posts
  posts: {
    title: 'الأخبار والمقالات',
    create: 'منشور جديد',
    create_title: 'إنشاء منشور جديد',
    edit_title: 'تحديث المنشور',
    post_title: 'العنوان',
    content: 'المحتوى',
    media: 'ملف الوسائط (صورة أو فيديو - اختياري)',
    media_preview: 'معاينة الوسائط',
    author: 'بواسطة',
    comments: 'التعليقات',
    add_comment: 'اكتب تعليقك...',
    send_comment: 'إرسال',
    comment_login_required: 'يجب تسجيل الدخول لإضافة تعليق',
    comment_verification_required: 'يجب التحقق من حسابك لإضافة تعليق',
    empty: 'لا توجد مقالات متاحة حالياً',
    create_first: 'إنشاء أول منشور',
    created_success: 'تم إنشاء المنشور بنجاح',
    updated_success: 'تم تحديث المنشور بنجاح',
    deleted_success: 'تم حذف المنشور بنجاح',
    delete_confirm: 'هل أنت متأكد من حذف هذا المنشور؟',
    comment_added_success: 'تم إضافة التعليق بنجاح',
    comment_add_error: 'حدث خطأ أثناء إضافة التعليق'
  },

  // Claims
  claims: {
    title: 'المطالبات',
    my_claims: 'مطالباتي',
    create: 'مطالبة جديدة',
    create_title: 'تقديم مطالبة جديدة',
    claim_title: 'عنوان المطالبة',
    description: 'وصف المطالبة',
    accident_date: 'تاريخ الحادث',
    accident_images: 'صور الحادث (صورتان على الأقل)',
    police_report: 'تقرير الشرطة',
    insurance_receipt: 'إيصال التأمين',
    submit: 'تقديم المطالبة',
    loading: 'جاري التقديم...',
    progress: 'التقدم',
    claim_number: 'المطالبة #{{number}}',
    status: {
      pending: 'قيد الانتظار',
      in_progress: 'قيد المعالجة',
      resolved: 'مكتملة'
    },
    attachments: 'المرفقات',
    accident_image: 'صورة الحادث {{number}}',
    empty: 'لا توجد مطالبات',
    empty_message: 'لم تقم بتقديم أي مطالبات بعد',
    create_first: 'تقديم مطالبة جديدة',
    verification_required: 'يجب التحقق من حسابك قبل تقديم المطالبات',
    login_required: 'يجب تسجيل الدخول أولاً',
    images_required: 'يجب رفع صورتين للحادث على الأقل',
    files_required: 'جميع الملفات مطلوبة',
    submit_error: 'حدث خطأ أثناء تقديم المطالبة',
    details_title: 'تفاصيل المطالبة'
  },

  // User Dashboard
  dashboard: {
    title: 'لوحة التحكم',
    welcome: 'مرحباً {{name}}',
    account_status: 'حالة الحساب',
    verification_status: 'حالة التحقق',
    verified: 'محقق',
    pending_review: 'قيد المراجعة',
    total_claims: 'إجمالي المطالبات',
    completed_claims: 'مطالبات مكتملة'
  },

  // Admin Dashboard
  admin: {
    title: 'لوحة الإدارة',
    welcome: 'مرحباً {{name}}',
    stats: {
      total_users: 'إجمالي المستخدمين',
      verified_users: 'مستخدمين محققين',
      total_claims: 'إجمالي المطالبات',
      pending_claims: 'مطالبات معلقة',
      total_posts: 'إجمالي المنشورات'
    },
    tabs: {
      users: 'إدارة المستخدمين',
      claims: 'إدارة المطالبات',
      posts: 'إدارة المنشورات'
    },
    users: {
      title: 'إدارة المستخدمين',
      total: 'إجمالي المستخدمين: {{count}}',
      table: {
        user: 'المستخدم',
        phone: 'رقم الهاتف',
        car_number: 'رقم السيارة',
        status: 'الحالة',
        registration_date: 'تاريخ التسجيل',
        actions: 'الإجراءات'
      },
      actions: {
        view: 'عرض',
        verify: 'تحقق'
      },
      details_title: 'تفاصيل المستخدم',
      personal_info: 'المعلومات الشخصية',
      insurance_info: 'معلومات التأمين',
      documents: 'المستندات',
      profile_image: 'الصورة الشخصية',
      driver_license: 'رخصة القيادة',
      insurance_document: 'وثيقة التأمين',
      verify_user: 'تحقق من المستخدم',
      verify_success: 'تم التحقق من المستخدم بنجاح',
      verify_error: 'حدث خطأ أثناء التحقق من المستخدم',
      empty: 'لا يوجد مستخدمين'
    },
    claims: {
      title: 'إدارة المطالبات',
      total: 'إجمالي المطالبات: {{count}}',
      table: {
        claim_number: 'رقم المطالبة',
        user: 'المستخدم',
        title: 'العنوان',
        status: 'الحالة',
        progress: 'التقدم',
        date: 'التاريخ',
        actions: 'الإجراءات'
      },
      actions: {
        view: 'عرض',
        update: 'تحديث'
      },
      details_title: 'تفاصيل المطالبة',
      update_title: 'تحديث المطالبة',
      update_status: 'الحالة',
      update_progress: 'التقدم ({{progress}}%)',
      update_note: 'ملاحظة (اختيارية)',
      update_note_placeholder: 'أضف ملاحظة حول التحديث...',
      save_update: 'حفظ التحديث',
      update_success: 'تم تحديث المطالبة بنجاح',
      update_error: 'حدث خطأ أثناء تحديث المطالبة',
      empty: 'لا توجد مطالبات'
    },
    posts: {
      title: 'إدارة المنشورات',
      create: 'منشور جديد',
      create_title: 'إنشاء منشور جديد',
      update_title: 'تحديث المنشور',
      post_title: 'العنوان',
      content: 'المحتوى',
      media: 'ملف الوسائط (صورة أو فيديو - اختياري)',
      media_preview: 'معاينة الوسائط',
      attached_media: 'الوسائط المرفقة',
      comments_count: 'التعليقات ({{count}})',
      no_comments: 'لا توجد تعليقات',
      empty: 'لا توجد منشورات',
      create_first: 'إنشاء أول منشور'
    }
  },

  // File Upload
  file_upload: {
    drag_drop: 'انقر لاختيار الملفات أو اسحبها هنا',
    max_size: 'الحد الأقصى: {{size}}MB',
    supported_types: 'الأنواع المدعومة: {{types}}',
    choose_files: 'اختر الملفات',
    uploading: 'جاري الرفع...',
    selected_files: 'الملفات المحددة:',
    upload_error: 'حدث خطأ أثناء رفع الملفات',
    files_too_large: 'الملفات التالية كبيرة جداً (أكثر من {{size}}MB): {{files}}'
  },

  // Validation
  validation: {
    required: 'هذا الحقل مطلوب',
    min_length: 'يجب أن يكون {{min}} أحرف على الأقل',
    max_length: 'يجب أن يكون {{max}} أحرف كحد أقصى',
    invalid_email: 'البريد الإلكتروني غير صالح',
    phone_invalid: 'رقم الهاتف غير صالح',
    pin_invalid: 'الرقم السري غير صالح'
  },

  // Notifications/Toasts
  notifications: {
    created_success: 'تم الإنشاء بنجاح',
    updated_success: 'تم التحديث بنجاح',
    deleted_success: 'تم الحذف بنجاح',
    action_failed: 'فشل في تنفيذ العملية',
    permissions_denied: 'ليس لديك صلاحية لهذا الإجراء',
    network_error: 'خطأ في الاتصال',
    try_again: 'حاول مرة أخرى'
  },

  // Homepage
  homepage: {
    hero: {
      title: 'ONG A.A.S',
      subtitle: 'جمعية مدنية للتوعية التأمينية ومواكبة المطالبات',
      about_title: 'من نحن',
      about_description: `نحن جمعية مدنية غير ربحية مكرسة لنشر الوعي التأميني وحماية حقوق المؤمنين ومساعدتهم في الحصول على تعويضاتهم المستحقة.

تأسست جمعيتنا بهدف:
- نشر الوعي التأميني في المجتمع
- حماية حقوق المؤمنين
- مساعدة المواطنين في الحصول على تعويضاتهم
- تقديم الاستشارات التأمينية المجانية

نعمل بشفافية ومهنية عالية لخدمة مجتمعنا وحماية حقوق المؤمنين في موريتانيا.`
    },
    features: {
      comprehensive_protection: {
        title: 'حماية شاملة',
        description: 'نحمي حقوق المؤمنين ونساعدهم في الحصول على تعويضاتهم'
      },
      advanced_services: {
        title: 'خدمات متطورة',
        description: 'نقدم خدمات متطورة لمتابعة المطالبات والتعويضات'
      },
      official_reference: {
        title: 'مرجعية رسمية',
        description: 'جمعية معتمدة رسمياً لحماية حقوق المؤمنين'
      }
    }
  },

  // Pluralization
  plurals: {
    user: 'مستخدم',
    user_plural: 'مستخدمين',
    claim: 'مطالبة',
    claim_plural: 'مطالبات',
    post: 'منشور',
    post_plural: 'منشورات',
    comment: 'تعليق',
    comment_plural: 'تعليقات'
  }
}