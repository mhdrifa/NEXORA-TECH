import { relations } from 'drizzle-orm';
import { pgTable, text, serial, timestamp, boolean, integer, jsonb, decimal } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  role: text('role').notNull().default('viewer'), // super_admin, admin, editor, viewer
  createdAt: timestamp('created_at').defaultNow(),
});

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  shortDescription: text('short_description'),
  fullDescription: text('full_description'),
  icon: text('icon'),
  image: text('image'),
  category: text('category'),
  features: jsonb('features'), // array of strings
  pricing: text('pricing'),
  status: text('status').default('active'),
  orderIndex: integer('order_index').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const portfolioProjects = pgTable('portfolio_projects', {
  id: serial('id').primaryKey(),
  projectName: text('project_name').notNull(),
  description: text('description'),
  client: text('client'),
  technologies: jsonb('technologies'),
  screenshots: jsonb('screenshots'),
  category: text('category'),
  liveUrl: text('live_url'),
  githubUrl: text('github_url'),
  completionDate: text('completion_date'),
  featuredProject: boolean('featured_project').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  clientName: text('client_name').notNull(),
  company: text('company'),
  photo: text('photo'),
  rating: integer('rating'),
  review: text('review').notNull(),
  status: text('status').default('pending'), // pending, approved, rejected
  createdAt: timestamp('created_at').defaultNow(),
});

export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content'),
  featuredImage: text('featured_image'),
  category: text('category'),
  tags: jsonb('tags'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  publishDate: timestamp('publish_date'),
  status: text('status').default('draft'), // draft, published
  authorId: integer('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const careers = pgTable('careers', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  department: text('department'),
  location: text('location'),
  employmentType: text('employment_type'),
  salary: text('salary'),
  requirements: jsonb('requirements'),
  responsibilities: jsonb('responsibilities'),
  benefits: jsonb('benefits'),
  status: text('status').default('draft'), // draft, published
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const aboutContent = pgTable('about_content', {
  id: serial('id').primaryKey(),
  companyStory: text('company_story'),
  mission: text('mission'),
  vision: text('vision'),
  companyValues: jsonb('company_values'),
  companyTimeline: jsonb('company_timeline'),
  achievements: jsonb('achievements'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  position: text('position'),
  bio: text('bio'),
  photo: text('photo'),
  email: text('email'),
  linkedin: text('linkedin'),
  github: text('github'),
  skills: jsonb('skills'),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const contactInformation = pgTable('contact_information', {
  id: serial('id').primaryKey(),
  emailAddress: text('email_address'),
  phoneNumber: text('phone_number'),
  officeAddress: text('office_address'),
  googleMapsLink: text('google_maps_link'),
  socialMediaLinks: jsonb('social_media_links'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const seoSettings = pgTable('seo_settings', {
  id: serial('id').primaryKey(),
  page: text('page').notNull().unique(), // home, about, services, portfolio, blog, careers, contact
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  keywords: text('keywords'),
  openGraphData: jsonb('open_graph_data'),
  twitterCards: jsonb('twitter_cards'),
  sitemapSettings: jsonb('sitemap_settings'),
  robotsTxtSettings: text('robots_txt_settings'),
  updatedAt: timestamp('updated_at').defaultNow(),
});
export const websiteSettings = pgTable('website_settings', {
  id: serial('id').primaryKey(),
  companyName: text('company_name'),
  logoUrl: text('logo_url'),
  faviconUrl: text('favicon_url'),
  brandColors: jsonb('brand_colors'),
  footerContent: text('footer_content'),
  copyrightText: text('copyright_text'),
  contactDetails: jsonb('contact_details'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const homepageContent = pgTable('homepage_content', {
  id: serial('id').primaryKey(),
  heroHeading: text('hero_heading'),
  heroSubHeading: text('hero_sub_heading'),
  heroCtaText: text('hero_cta_text'),
  heroCtaLink: text('hero_cta_link'),
  heroBgImage: text('hero_bg_image'),
  statsProjects: text('stats_projects'),
  statsClients: text('stats_clients'),
  statsCountries: text('stats_countries'),
  statsSatisfaction: text('stats_satisfaction'),
  whyFeatures: jsonb('why_features'),
  ctaHeading: text('cta_heading'),
  ctaDescription: text('cta_description'),
  ctaButtonText: text('cta_button_text'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const mediaLibrary = pgTable('media_library', {
  id: serial('id').primaryKey(),
  url: text('url').notNull(),
  publicId: text('public_id'),
  filename: text('filename'),
  fileType: text('file_type'), // image, video, pdf
  size: integer('size'),
  category: text('category'),
  uploadedById: integer('uploaded_by_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const files = pgTable('files', {
  id: serial('id').primaryKey(),
  fileName: text('file_name').notNull(),
  originalName: text('original_name').notNull(),
  fileType: text('file_type'), // image, pdf, resume, project
  fileFormat: text('file_format'), // jpg, png, pdf, zip
  fileSize: integer('file_size'),
  url: text('url').notNull(),
  publicId: text('public_id'),
  uploadedBy: integer('uploaded_by').references(() => users.id).notNull(),
  clientId: integer('client_id').references(() => users.id),
  projectId: integer('project_id').references(() => clientProjects.id),
  visibility: text('visibility').default('private'), // public, private, restricted
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const emailLogs = pgTable('email_logs', {
  id: serial('id').primaryKey(),
  recipientEmail: text('recipient_email').notNull(),
  subject: text('subject').notNull(),
  emailType: text('email_type').notNull(),
  status: text('status').default('pending'), // sent, failed, pending
  errorMessage: text('error_message'),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id), // Nullable for anonymous actions
  action: text('action').notNull(), // e.g., 'LOGIN_FAILED', 'FILE_UPLOADED'
  entity: text('entity'), // e.g., 'Invoice', 'Project', 'File'
  entityId: text('entity_id'), // To store IDs of affected entities
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const clientProjects = pgTable('client_projects', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id').references(() => users.id).notNull(),
  projectName: text('project_name').notNull(),
  description: text('description'),
  status: text('status').default('Pending'), // Pending, Active, Review, Completed
  progressPercentage: integer('progress_percentage').default(0),
  deadline: timestamp('deadline'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const clientInvoices = pgTable('client_invoices', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id').references(() => users.id).notNull(),
  projectId: integer('project_id').references(() => clientProjects.id),
  invoiceNumber: text('invoice_number').notNull().unique(),
  amount: decimal('amount').notNull(),
  status: text('status').default('Draft'), // Draft, Sent, Paid, Overdue
  issueDate: timestamp('issue_date').defaultNow(),
  dueDate: timestamp('due_date'),
  pdfUrl: text('pdf_url'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const clientPayments = pgTable('client_payments', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id').references(() => users.id).notNull(),
  invoiceId: integer('invoice_id').references(() => clientInvoices.id).notNull(),
  amount: decimal('amount').notNull(),
  paymentMethod: text('payment_method'), // Stripe, PayPal
  transactionId: text('transaction_id'),
  status: text('status').default('completed'), // pending, completed, failed
  paidAt: timestamp('paid_at').defaultNow(),
});

export const supportTickets = pgTable('support_tickets', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id').references(() => users.id).notNull(),
  subject: text('subject').notNull(),
  description: text('description'),
  status: text('status').default('Open'), // Open, In Progress, Resolved, Closed
  priority: text('priority').default('medium'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const ticketMessages = pgTable('ticket_messages', {
  id: serial('id').primaryKey(),
  ticketId: integer('ticket_id').references(() => supportTickets.id).notNull(),
  senderId: integer('sender_id').references(() => users.id).notNull(),
  message: text('message').notNull(),
  attachments: jsonb('attachments'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const sharedFiles = pgTable('shared_files', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id').references(() => users.id).notNull(),
  projectId: integer('project_id').references(() => clientProjects.id),
  uploadedById: integer('uploaded_by_id').references(() => users.id).notNull(),
  filename: text('filename').notNull(),
  url: text('url').notNull(),
  fileType: text('file_type'),
  size: integer('size'),
  createdAt: timestamp('created_at').defaultNow(),
});
