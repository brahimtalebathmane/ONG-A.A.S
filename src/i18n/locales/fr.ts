export const fr = {
  // Common
  common: {
    save: 'Enregistrer',
    cancel: 'Annuler',
    edit: 'Modifier',
    delete: 'Supprimer',
    confirm: 'Confirmer',
    search: 'Rechercher',
    loading: 'Chargement...',
    yes: 'Oui',
    no: 'Non',
    back: 'Retour',
    next: 'Suivant',
    close: 'Fermer',
    error: 'Erreur',
    success: 'Succès',
    view: 'Voir',
    details: 'Détails',
    actions: 'Actions',
    status: 'Statut',
    date: 'Date',
    created_at: 'Date de création',
    updated_at: 'Date de modification',
    empty_state: {
      no_data: 'Aucune donnée',
      no_results: 'Aucun résultat',
      try_again: 'Réessayer'
    }
  },

  // Navigation
  nav: {
    home: 'Accueil',
    admin: 'Administration',
    dashboard: 'Tableau de bord',
    posts: 'Publications',
    claims: 'Réclamations',
    profile: 'Profil',
    logout: 'Déconnexion',
    login: 'Connexion',
    register: 'Inscription',
    language: {
      ar: 'العربية',
      fr: 'Français'
    }
  },

  // Footer
  footer: {
    organization_name: 'Association de Sensibilisation Assurance',
    slogan: 'L\'assurance est une conscience… et l\'indemnisation est un droit.',
    license: 'Licence',
    license_date: 'Date de licence',
    location: 'Nouakchott – Mauritanie',
    quick_links: 'Liens rapides',
    contact_us: 'Contactez-nous',
    whatsapp: 'WhatsApp',
    phone: 'Téléphone',
    email: 'Email',
    rights_reserved: 'Tous droits réservés'
  },

  // Authentication
  auth: {
    sign_in: {
      title: 'Connexion',
      subtitle: 'Entrez votre numéro de téléphone et votre code PIN',
      phone_label: 'Numéro de téléphone (8 chiffres)',
      phone_placeholder: 'Ex: 12345678',
      pin_label: 'Code PIN (4 chiffres)',
      pin_placeholder: '****',
      submit: 'Se connecter',
      loading: 'Connexion en cours...',
      no_account: 'Pas de compte ?',
      register_link: 'S\'inscrire maintenant'
    },
    sign_up: {
      title: 'Créer un nouveau compte',
      subtitle: 'Remplissez le formulaire ci-dessous pour vous inscrire',
      full_name: 'Nom complet',
      car_number: 'Numéro de plaque',
      phone_number: 'Numéro de téléphone (8 chiffres)',
      pin: 'Code PIN (4 chiffres)',
      insurance_start: 'Date de début d\'assurance',
      insurance_end: 'Date de fin d\'assurance',
      profile_image: 'Photo de profil',
      driver_license: 'Permis de conduire',
      insurance_document: 'Document d\'assurance',
      submit: 'Créer le compte',
      loading: 'Inscription en cours...',
      success_title: 'Inscription réussie !',
      success_message: 'Votre demande d\'inscription a été envoyée. Les documents seront examinés et le compte sera vérifié par l\'administration.',
      success_redirect: 'Redirection vers la page de connexion...',
      have_account: 'Vous avez déjà un compte ?',
      login_link: 'Se connecter'
    },
    errors: {
      invalid_credentials: 'Numéro de téléphone ou code PIN incorrect',
      phone_invalid: 'Le numéro de téléphone doit contenir 8 chiffres',
      pin_invalid: 'Le code PIN doit contenir 4 chiffres',
      phone_exists: 'Ce numéro de téléphone est déjà utilisé',
      registration_failed: 'Erreur lors de l\'inscription',
      login_failed: 'Erreur lors de la connexion',
      files_required: 'Tous les fichiers sont requis',
      insurance_dates_invalid: 'La date de fin d\'assurance doit être postérieure à la date de début'
    }
  },

  // Posts
  posts: {
    title: 'Actualités et Articles',
    create: 'Nouvelle publication',
    create_title: 'Créer une nouvelle publication',
    edit_title: 'Modifier la publication',
    post_title: 'Titre',
    content: 'Contenu',
    media: 'Fichier média (image ou vidéo - optionnel)',
    media_preview: 'Aperçu du média',
    author: 'Par',
    comments: 'Commentaires',
    add_comment: 'Écrivez votre commentaire...',
    send_comment: 'Envoyer',
    comment_login_required: 'Vous devez vous connecter pour ajouter un commentaire',
    comment_verification_required: 'Votre compte doit être vérifié pour ajouter un commentaire',
    empty: 'Aucun article disponible actuellement',
    create_first: 'Créer la première publication',
    created_success: 'Publication créée avec succès',
    updated_success: 'Publication mise à jour avec succès',
    deleted_success: 'Publication supprimée avec succès',
    delete_confirm: 'Êtes-vous sûr de vouloir supprimer cette publication ?',
    comment_added_success: 'Commentaire ajouté avec succès',
    comment_add_error: 'Erreur lors de l\'ajout du commentaire'
  },

  // Claims
  claims: {
    title: 'Réclamations',
    my_claims: 'Mes réclamations',
    create: 'Nouvelle réclamation',
    create_title: 'Soumettre une nouvelle réclamation',
    claim_title: 'Titre de la réclamation',
    description: 'Description de la réclamation',
    accident_date: 'Date de l\'accident',
    accident_images: 'Photos de l\'accident (au moins deux)',
    police_report: 'Rapport de police',
    insurance_receipt: 'Reçu d\'assurance',
    submit: 'Soumettre la réclamation',
    loading: 'Soumission en cours...',
    progress: 'Progrès',
    claim_number: 'Réclamation #{{number}}',
    status: {
      pending: 'En attente',
      in_progress: 'En cours',
      resolved: 'Résolue'
    },
    attachments: 'Pièces jointes',
    accident_image: 'Photo d\'accident {{number}}',
    empty: 'Aucune réclamation',
    empty_message: 'Vous n\'avez soumis aucune réclamation',
    create_first: 'Soumettre une nouvelle réclamation',
    verification_required: 'Votre compte doit être vérifié avant de soumettre des réclamations',
    login_required: 'Vous devez d\'abord vous connecter',
    images_required: 'Vous devez télécharger au moins deux photos de l\'accident',
    files_required: 'Tous les fichiers sont requis',
    submit_error: 'Erreur lors de la soumission de la réclamation',
    details_title: 'Détails de la réclamation'
  },

  // User Dashboard
  dashboard: {
    title: 'Tableau de bord',
    welcome: 'Bienvenue {{name}}',
    account_status: 'Statut du compte',
    verification_status: 'Statut de vérification',
    verified: 'Vérifié',
    pending_review: 'En cours d\'examen',
    total_claims: 'Total des réclamations',
    completed_claims: 'Réclamations terminées'
  },

  // Admin Dashboard
  admin: {
    title: 'Administration',
    welcome: 'Bienvenue {{name}}',
    stats: {
      total_users: 'Total des utilisateurs',
      verified_users: 'Utilisateurs vérifiés',
      total_claims: 'Total des réclamations',
      pending_claims: 'Réclamations en attente',
      total_posts: 'Total des publications'
    },
    tabs: {
      users: 'Gestion des utilisateurs',
      claims: 'Gestion des réclamations',
      posts: 'Gestion des publications'
    },
    users: {
      title: 'Gestion des utilisateurs',
      total: 'Total des utilisateurs : {{count}}',
      table: {
        user: 'Utilisateur',
        phone: 'Téléphone',
        car_number: 'Numéro de plaque',
        status: 'Statut',
        registration_date: 'Date d\'inscription',
        actions: 'Actions'
      },
      actions: {
        view: 'Voir',
        verify: 'Vérifier'
      },
      details_title: 'Détails de l\'utilisateur',
      personal_info: 'Informations personnelles',
      insurance_info: 'Informations d\'assurance',
      documents: 'Documents',
      profile_image: 'Photo de profil',
      driver_license: 'Permis de conduire',
      insurance_document: 'Document d\'assurance',
      verify_user: 'Vérifier l\'utilisateur',
      verify_success: 'Utilisateur vérifié avec succès',
      verify_error: 'Erreur lors de la vérification de l\'utilisateur',
      empty: 'Aucun utilisateur'
    },
    claims: {
      title: 'Gestion des réclamations',
      total: 'Total des réclamations : {{count}}',
      table: {
        claim_number: 'N° de réclamation',
        user: 'Utilisateur',
        title: 'Titre',
        status: 'Statut',
        progress: 'Progrès',
        date: 'Date',
        actions: 'Actions'
      },
      actions: {
        view: 'Voir',
        update: 'Mettre à jour'
      },
      details_title: 'Détails de la réclamation',
      update_title: 'Mettre à jour la réclamation',
      update_status: 'Statut',
      update_progress: 'Progrès ({{progress}}%)',
      update_note: 'Note (optionnelle)',
      update_note_placeholder: 'Ajouter une note sur la mise à jour...',
      save_update: 'Enregistrer la mise à jour',
      update_success: 'Réclamation mise à jour avec succès',
      update_error: 'Erreur lors de la mise à jour de la réclamation',
      empty: 'Aucune réclamation'
    },
    posts: {
      title: 'Gestion des publications',
      create: 'Nouvelle publication',
      create_title: 'Créer une nouvelle publication',
      update_title: 'Modifier la publication',
      post_title: 'Titre',
      content: 'Contenu',
      media: 'Fichier média (image ou vidéo - optionnel)',
      media_preview: 'Aperçu du média',
      attached_media: 'Média joint',
      comments_count: 'Commentaires ({{count}})',
      no_comments: 'Aucun commentaire',
      empty: 'Aucune publication',
      create_first: 'Créer la première publication'
    }
  },

  // File Upload
  file_upload: {
    drag_drop: 'Cliquez pour sélectionner des fichiers ou glissez-les ici',
    max_size: 'Taille max : {{size}}MB',
    supported_types: 'Types supportés : {{types}}',
    choose_files: 'Choisir les fichiers',
    uploading: 'Téléchargement...',
    selected_files: 'Fichiers sélectionnés :',
    upload_error: 'Erreur lors du téléchargement des fichiers',
    files_too_large: 'Les fichiers suivants sont trop volumineux (plus de {{size}}MB) : {{files}}'
  },

  // Validation
  validation: {
    required: 'Ce champ est requis',
    min_length: 'Doit contenir au moins {{min}} caractères',
    max_length: 'Doit contenir au maximum {{max}} caractères',
    invalid_email: 'Email invalide',
    phone_invalid: 'Numéro de téléphone invalide',
    pin_invalid: 'Code PIN invalide'
  },

  // Notifications/Toasts
  notifications: {
    created_success: 'Créé avec succès',
    updated_success: 'Mis à jour avec succès',
    deleted_success: 'Supprimé avec succès',
    action_failed: 'Échec de l\'opération',
    permissions_denied: 'Vous n\'avez pas l\'autorisation pour cette action',
    network_error: 'Erreur de connexion',
    try_again: 'Réessayer'
  },

  // Homepage
  homepage: {
    hero: {
      title: 'ONG A.A.S',
      subtitle: 'Association civile de sensibilisation à l\'assurance et d\'accompagnement des réclamations',
      about_title: 'Qui sommes-nous',
      about_description: `Nous sommes une association civile à but non lucratif dédiée à la sensibilisation à l'assurance et à la protection des droits des assurés en les aidant à obtenir leurs indemnisations légitimes.

Notre association a été fondée dans le but de :
- Sensibiliser la communauté à l'assurance
- Protéger les droits des assurés
- Aider les citoyens à obtenir leurs indemnisations
- Fournir des conseils d'assurance gratuits

Nous travaillons avec transparence et professionnalisme pour servir notre communauté et protéger les droits des assurés en Mauritanie.`
    },
    features: {
      comprehensive_protection: {
        title: 'Protection complète',
        description: 'Nous protégeons les droits des assurés et les aidons à obtenir leurs indemnisations'
      },
      advanced_services: {
        title: 'Services avancés',
        description: 'Nous offrons des services avancés pour le suivi des réclamations et indemnisations'
      },
      official_reference: {
        title: 'Référence officielle',
        description: 'Association officiellement accréditée pour la protection des droits des assurés'
      }
    }
  },

  // Pluralization
  plurals: {
    user: 'utilisateur',
    user_plural: 'utilisateurs',
    claim: 'réclamation',
    claim_plural: 'réclamations',
    post: 'publication',
    post_plural: 'publications',
    comment: 'commentaire',
    comment_plural: 'commentaires'
  }
}