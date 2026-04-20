import type { FormTemplate } from '../types/form.types'

export const TEMPLATES: FormTemplate[] = [
  // ─────────────────────────────────────────────
  // 1. Contact Us Form
  // ─────────────────────────────────────────────
  {
    id: 'tmpl-001',
    name: 'Contact Us Form',
    description: 'A clean contact form for collecting inquiries, support requests, and feedback from your visitors.',
    category: 'business',
    fieldCount: 8,
    settings: { paperSize: 'A4', orientation: 'portrait', showPageNumbers: false, primaryColor: '#4F46E5' },
    pages: [
      {
        title: 'Contact Us',
        order: 0,
        fields: [
          {
            id: 'f-1-1', type: 'form-header', label: 'Contact Us', metadata: 'Get in touch with us — we\'d love to hear from you.',
            required: false, width: 'full', order: 0,
          },
          {
            id: 'f-1-2', type: 'text', label: 'Full Name', placeholder: 'Enter your full name',
            required: true, width: 'half', order: 1,
          },
          {
            id: 'f-1-3', type: 'email', label: 'Email Address', placeholder: 'you@example.com',
            required: true, width: 'half', order: 2,
          },
          {
            id: 'f-1-4', type: 'phone', label: 'Phone Number', placeholder: '+1 (555) 000-0000',
            required: false, width: 'half', order: 3,
          },
          {
            id: 'f-1-5', type: 'dropdown', label: 'Subject',
            options: [
              { label: 'General Inquiry', value: 'general' },
              { label: 'Support', value: 'support' },
              { label: 'Partnership', value: 'partnership' },
              { label: 'Feedback', value: 'feedback' },
            ],
            required: true, width: 'half', order: 4,
          },
          {
            id: 'f-1-6', type: 'textarea', label: 'Message', placeholder: 'Write your message here...',
            required: true, width: 'full', order: 5,
            validation: { minLength: 20 },
          },
          {
            id: 'f-1-7', type: 'divider', label: '', required: false, width: 'full', order: 6,
          },
          {
            id: 'f-1-8', type: 'checkbox', label: 'Subscribe to our newsletter for updates and offers',
            required: false, width: 'full', order: 7,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 2. Job Application
  // ─────────────────────────────────────────────
  {
    id: 'tmpl-002',
    name: 'Job Application',
    description: 'A professional job application form collecting applicant details, experience, education, and a cover letter.',
    category: 'hr',
    fieldCount: 12,
    settings: { paperSize: 'A4', orientation: 'portrait', showPageNumbers: true, primaryColor: '#0EA5E9' },
    pages: [
      {
        title: 'Job Application',
        order: 0,
        fields: [
          {
            id: 'f-2-1', type: 'form-header', label: 'Job Application', metadata: 'Please fill in all required fields carefully.',
            required: false, width: 'full', order: 0,
          },
          {
            id: 'f-2-2', type: 'text', label: 'Full Name', placeholder: 'Enter your full name',
            required: true, width: 'half', order: 1,
          },
          {
            id: 'f-2-3', type: 'email', label: 'Email Address', placeholder: 'you@example.com',
            required: true, width: 'half', order: 2,
          },
          {
            id: 'f-2-4', type: 'phone', label: 'Phone Number', placeholder: '+1 (555) 000-0000',
            required: false, width: 'half', order: 3,
          },
          {
            id: 'f-2-5', type: 'text', label: 'Position Applied For', placeholder: 'e.g. Senior Developer',
            required: true, width: 'half', order: 4,
          },
          {
            id: 'f-2-6', type: 'address', label: 'Home Address',
            required: false, width: 'full', order: 5,
          },
          {
            id: 'f-2-7', type: 'divider', label: '', required: false, width: 'full', order: 6,
          },
          {
            id: 'f-2-8', type: 'number', label: 'Years of Experience', placeholder: '0',
            required: false, width: 'third', order: 7,
            validation: { min: 0, max: 60 },
          },
          {
            id: 'f-2-9', type: 'dropdown', label: 'Highest Education',
            options: [
              { label: 'High School', value: 'high_school' },
              { label: 'Associate', value: 'associate' },
              { label: "Bachelor's", value: 'bachelor' },
              { label: "Master's", value: 'master' },
              { label: 'PhD', value: 'phd' },
            ],
            required: false, width: 'third', order: 8,
          },
          {
            id: 'f-2-10', type: 'dropdown', label: 'Availability',
            options: [
              { label: 'Immediately', value: 'immediately' },
              { label: '2 Weeks Notice', value: '2_weeks' },
              { label: '1 Month Notice', value: '1_month' },
            ],
            required: false, width: 'third', order: 9,
          },
          {
            id: 'f-2-11', type: 'textarea', label: 'Cover Letter', placeholder: 'Tell us why you are a great fit for this role...',
            required: true, width: 'full', order: 10,
            validation: { minLength: 50 },
          },
          {
            id: 'f-2-12', type: 'signature', label: 'Applicant Signature',
            required: true, width: 'full', order: 11,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 3. Event Registration
  // ─────────────────────────────────────────────
  {
    id: 'tmpl-003',
    name: 'Event Registration',
    description: 'A versatile event registration form for conferences, workshops, and networking events.',
    category: 'events',
    fieldCount: 10,
    settings: { paperSize: 'A4', orientation: 'portrait', showPageNumbers: false, primaryColor: '#F97316' },
    pages: [
      {
        title: 'Event Registration',
        order: 0,
        fields: [
          {
            id: 'f-3-1', type: 'form-header', label: 'Event Registration', metadata: 'We look forward to seeing you at the event!',
            required: false, width: 'full', order: 0,
          },
          {
            id: 'f-3-2', type: 'text', label: 'Full Name', placeholder: 'Enter your full name',
            required: true, width: 'half', order: 1,
          },
          {
            id: 'f-3-3', type: 'email', label: 'Email Address', placeholder: 'you@example.com',
            required: true, width: 'half', order: 2,
          },
          {
            id: 'f-3-4', type: 'phone', label: 'Phone Number', placeholder: '+1 (555) 000-0000',
            required: false, width: 'half', order: 3,
          },
          {
            id: 'f-3-5', type: 'text', label: 'Organization / Company', placeholder: 'Your organization name',
            required: false, width: 'half', order: 4,
          },
          {
            id: 'f-3-6', type: 'dropdown', label: 'Select Event',
            options: [
              { label: 'Conference Day 1', value: 'conf_day1' },
              { label: 'Conference Day 2', value: 'conf_day2' },
              { label: 'Workshop', value: 'workshop' },
              { label: 'Networking Dinner', value: 'networking' },
            ],
            required: true, width: 'full', order: 5,
          },
          {
            id: 'f-3-7', type: 'radio', label: 'Ticket Type',
            options: [
              { label: 'Standard', value: 'standard' },
              { label: 'VIP', value: 'vip' },
              { label: 'Student', value: 'student' },
            ],
            required: true, width: 'full', order: 6,
          },
          {
            id: 'f-3-8', type: 'checkbox-group', label: 'Dietary Requirements',
            options: [
              { label: 'Vegetarian', value: 'vegetarian' },
              { label: 'Vegan', value: 'vegan' },
              { label: 'Gluten-Free', value: 'gluten_free' },
              { label: 'Halal', value: 'halal' },
              { label: 'Kosher', value: 'kosher' },
              { label: 'None', value: 'none' },
            ],
            required: false, width: 'full', order: 7,
          },
          {
            id: 'f-3-9', type: 'textarea', label: 'Special Requests', placeholder: 'Any additional requests or accessibility requirements...',
            required: false, width: 'full', order: 8,
          },
          {
            id: 'f-3-10', type: 'divider', label: '', required: false, width: 'full', order: 9,
          },
          {
            id: 'f-3-11', type: 'label', label: 'By submitting this form you agree to our terms and conditions.',
            required: false, width: 'full', order: 10,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 4. Medical Intake Form
  // ─────────────────────────────────────────────
  {
    id: 'tmpl-004',
    name: 'Medical Intake Form',
    description: 'A comprehensive patient intake form collecting personal, insurance, and medical history information.',
    category: 'healthcare',
    fieldCount: 18,
    settings: { paperSize: 'A4', orientation: 'portrait', showPageNumbers: true, primaryColor: '#10B981' },
    pages: [
      {
        title: 'Patient Information',
        order: 0,
        fields: [
          {
            id: 'f-4-1', type: 'form-header', label: 'Patient Intake Form', metadata: 'Please complete before your appointment.',
            required: false, width: 'full', order: 0,
          },
          {
            id: 'f-4-2', type: 'text', label: 'Patient Full Name', placeholder: 'Enter patient\'s full name',
            required: true, width: 'half', order: 1,
          },
          {
            id: 'f-4-3', type: 'date', label: 'Date of Birth',
            required: false, width: 'quarter', order: 2,
          },
          {
            id: 'f-4-4', type: 'dropdown', label: 'Gender',
            options: [
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Non-binary', value: 'non_binary' },
              { label: 'Prefer not to say', value: 'prefer_not' },
            ],
            required: false, width: 'quarter', order: 3,
          },
          {
            id: 'f-4-5', type: 'email', label: 'Email Address', placeholder: 'patient@example.com',
            required: false, width: 'half', order: 4,
          },
          {
            id: 'f-4-6', type: 'phone', label: 'Phone Number', placeholder: '+1 (555) 000-0000',
            required: false, width: 'half', order: 5,
          },
          {
            id: 'f-4-7', type: 'address', label: 'Home Address',
            required: false, width: 'full', order: 6,
          },
          {
            id: 'f-4-8', type: 'divider', label: '', required: false, width: 'full', order: 7,
          },
          {
            id: 'f-4-9', type: 'form-header', label: 'Medical History', metadata: 'Current health and insurance information.',
            required: false, width: 'full', order: 8,
          },
          {
            id: 'f-4-10', type: 'text', label: 'Primary Physician', placeholder: 'Dr. Name',
            required: false, width: 'half', order: 9,
          },
          {
            id: 'f-4-11', type: 'text', label: 'Insurance Provider', placeholder: 'e.g. Blue Cross Blue Shield',
            required: false, width: 'half', order: 10,
          },
          {
            id: 'f-4-12', type: 'text', label: 'Insurance Member Number', placeholder: 'Member ID',
            required: false, width: 'half', order: 11,
          },
          {
            id: 'f-4-13', type: 'text', label: 'Emergency Contact Name', placeholder: 'Full name',
            required: false, width: 'half', order: 12,
          },
          {
            id: 'f-4-14', type: 'phone', label: 'Emergency Contact Phone', placeholder: '+1 (555) 000-0000',
            required: false, width: 'half', order: 13,
          },
          {
            id: 'f-4-15', type: 'textarea', label: 'Current Medications', placeholder: 'List all current medications and dosages...',
            required: false, width: 'full', order: 14,
          },
          {
            id: 'f-4-16', type: 'textarea', label: 'Known Allergies', placeholder: 'List all known allergies...',
            required: false, width: 'full', order: 15,
          },
          {
            id: 'f-4-17', type: 'checkbox-group', label: 'Medical Conditions',
            options: [
              { label: 'Diabetes', value: 'diabetes' },
              { label: 'Heart Disease', value: 'heart_disease' },
              { label: 'Hypertension', value: 'hypertension' },
              { label: 'Asthma', value: 'asthma' },
              { label: 'Cancer', value: 'cancer' },
              { label: 'None of the above', value: 'none' },
            ],
            required: false, width: 'full', order: 16,
          },
          {
            id: 'f-4-18', type: 'signature', label: 'Patient / Guardian Signature',
            required: true, width: 'full', order: 17,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 5. Customer Feedback Survey
  // ─────────────────────────────────────────────
  {
    id: 'tmpl-005',
    name: 'Customer Feedback Survey',
    description: 'Collect structured customer feedback on product quality, service, and overall satisfaction.',
    category: 'surveys',
    fieldCount: 11,
    settings: { paperSize: 'A4', orientation: 'portrait', showPageNumbers: false, primaryColor: '#8B5CF6' },
    pages: [
      {
        title: 'Customer Feedback',
        order: 0,
        fields: [
          {
            id: 'f-5-1', type: 'form-header', label: 'Customer Feedback', metadata: 'Your opinion matters to us — thank you for taking the time!',
            required: false, width: 'full', order: 0,
          },
          {
            id: 'f-5-2', type: 'text', label: 'Your Name', placeholder: 'Optional',
            required: false, width: 'half', order: 1,
          },
          {
            id: 'f-5-3', type: 'email', label: 'Email Address', placeholder: 'Optional — for follow-up',
            required: false, width: 'half', order: 2,
          },
          {
            id: 'f-5-4', type: 'rating', label: 'Overall Satisfaction',
            required: false, width: 'full', order: 3, maxRating: 5,
          },
          {
            id: 'f-5-5', type: 'rating', label: 'Product Quality',
            required: false, width: 'full', order: 4, maxRating: 5,
          },
          {
            id: 'f-5-6', type: 'rating', label: 'Customer Service',
            required: false, width: 'full', order: 5, maxRating: 5,
          },
          {
            id: 'f-5-7', type: 'divider', label: '', required: false, width: 'full', order: 6,
          },
          {
            id: 'f-5-8', type: 'fill-blank',
            label: 'Complete the sentence',
            metadata: 'I would describe my experience as ___ and I would rate the value as ___.',
            required: false, width: 'full', order: 7,
          },
          {
            id: 'f-5-9', type: 'textarea', label: 'What did you like most?', placeholder: 'Share your favourite part of your experience...',
            required: false, width: 'full', order: 8,
          },
          {
            id: 'f-5-10', type: 'textarea', label: 'What can we improve?', placeholder: 'Help us get better...',
            required: false, width: 'full', order: 9,
          },
          {
            id: 'f-5-11', type: 'radio', label: 'Would you recommend us?',
            options: [
              { label: 'Definitely', value: 'definitely' },
              { label: 'Probably', value: 'probably' },
              { label: 'Probably Not', value: 'probably_not' },
              { label: 'Definitely Not', value: 'definitely_not' },
            ],
            required: false, width: 'full', order: 10,
          },
          {
            id: 'f-5-12', type: 'divider', label: '', required: false, width: 'full', order: 11,
          },
          {
            id: 'f-5-13', type: 'checkbox', label: 'Subscribe to our newsletter for exclusive offers',
            required: false, width: 'full', order: 12,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 6. Purchase Order
  // ─────────────────────────────────────────────
  {
    id: 'tmpl-006',
    name: 'Purchase Order',
    description: 'A structured purchase order form for companies to submit item requests with billing details.',
    category: 'business',
    fieldCount: 10,
    settings: { paperSize: 'A4', orientation: 'portrait', showPageNumbers: true, primaryColor: '#4F46E5' },
    pages: [
      {
        title: 'Purchase Order',
        order: 0,
        fields: [
          {
            id: 'f-6-1', type: 'form-header', label: 'Purchase Order', metadata: 'Please fill in all order and billing details accurately.',
            required: false, width: 'full', order: 0,
          },
          {
            id: 'f-6-2', type: 'text', label: 'Company Name', placeholder: 'Your company name',
            required: true, width: 'half', order: 1,
          },
          {
            id: 'f-6-3', type: 'text', label: 'Contact Name', placeholder: 'Primary contact person',
            required: true, width: 'half', order: 2,
          },
          {
            id: 'f-6-4', type: 'email', label: 'Email Address', placeholder: 'billing@company.com',
            required: true, width: 'half', order: 3,
          },
          {
            id: 'f-6-5', type: 'phone', label: 'Phone Number', placeholder: '+1 (555) 000-0000',
            required: true, width: 'half', order: 4,
          },
          {
            id: 'f-6-6', type: 'address', label: 'Billing Address',
            required: false, width: 'full', order: 5,
          },
          {
            id: 'f-6-7', type: 'divider', label: '', required: false, width: 'full', order: 6,
          },
          {
            id: 'f-6-8', type: 'form-header', label: 'Order Details', metadata: 'List the items you wish to order below.',
            required: false, width: 'full', order: 7,
          },
          {
            id: 'f-6-9', type: 'table', label: 'Order Items',
            required: false, width: 'full', order: 8,
            tableColumns: ['Item Description', 'Quantity', 'Unit Price', 'Total'],
            tableRows: 5,
          },
          {
            id: 'f-6-10', type: 'date', label: 'Required Delivery Date',
            required: false, width: 'half', order: 9,
          },
          {
            id: 'f-6-11', type: 'dropdown', label: 'Payment Method',
            options: [
              { label: 'Bank Transfer', value: 'bank_transfer' },
              { label: 'Credit Card', value: 'credit_card' },
              { label: 'Check', value: 'check' },
              { label: 'Cash', value: 'cash' },
            ],
            required: true, width: 'half', order: 10,
          },
          {
            id: 'f-6-12', type: 'textarea', label: 'Special Instructions', placeholder: 'Packaging, delivery, or handling notes...',
            required: false, width: 'full', order: 11,
          },
          {
            id: 'f-6-13', type: 'divider', label: '', required: false, width: 'full', order: 12,
          },
          {
            id: 'f-6-14', type: 'signature', label: 'Authorized Signature',
            required: true, width: 'full', order: 13,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 7. Employee Performance Review
  // ─────────────────────────────────────────────
  {
    id: 'tmpl-007',
    name: 'Employee Performance Review',
    description: 'An annual employee performance evaluation covering competency ratings, goals, and reviewer sign-off.',
    category: 'hr',
    fieldCount: 19,
    settings: { paperSize: 'A4', orientation: 'portrait', showPageNumbers: true, primaryColor: '#0EA5E9' },
    pages: [
      {
        title: 'Performance Review',
        order: 0,
        fields: [
          {
            id: 'f-7-1', type: 'form-header', label: 'Employee Performance Review', metadata: 'Annual evaluation — to be completed by the direct supervisor.',
            required: false, width: 'full', order: 0,
          },
          {
            id: 'f-7-2', type: 'text', label: 'Employee Name', placeholder: 'Full name',
            required: true, width: 'half', order: 1,
          },
          {
            id: 'f-7-3', type: 'dropdown', label: 'Department',
            options: [
              { label: 'Engineering', value: 'engineering' },
              { label: 'Sales', value: 'sales' },
              { label: 'Marketing', value: 'marketing' },
              { label: 'HR', value: 'hr' },
              { label: 'Finance', value: 'finance' },
              { label: 'Operations', value: 'operations' },
            ],
            required: true, width: 'half', order: 2,
          },
          {
            id: 'f-7-4', type: 'text', label: 'Review Period', placeholder: 'e.g. Jan 2025 – Dec 2025',
            required: false, width: 'half', order: 3,
          },
          {
            id: 'f-7-5', type: 'text', label: 'Reviewer Name', placeholder: 'Supervisor full name',
            required: false, width: 'half', order: 4,
          },
          {
            id: 'f-7-6', type: 'divider', label: '', required: false, width: 'full', order: 5,
          },
          {
            id: 'f-7-7', type: 'form-header', label: 'Performance Ratings', metadata: 'Rate each competency area from 1 (poor) to 5 (excellent).',
            required: false, width: 'full', order: 6,
          },
          {
            id: 'f-7-8', type: 'rating', label: 'Job Knowledge',
            required: false, width: 'half', order: 7, maxRating: 5,
          },
          {
            id: 'f-7-9', type: 'rating', label: 'Work Quality',
            required: false, width: 'half', order: 8, maxRating: 5,
          },
          {
            id: 'f-7-10', type: 'rating', label: 'Attendance & Punctuality',
            required: false, width: 'half', order: 9, maxRating: 5,
          },
          {
            id: 'f-7-11', type: 'rating', label: 'Teamwork & Collaboration',
            required: false, width: 'half', order: 10, maxRating: 5,
          },
          {
            id: 'f-7-12', type: 'rating', label: 'Communication Skills',
            required: false, width: 'half', order: 11, maxRating: 5,
          },
          {
            id: 'f-7-13', type: 'rating', label: 'Initiative & Leadership',
            required: false, width: 'half', order: 12, maxRating: 5,
          },
          {
            id: 'f-7-14', type: 'divider', label: '', required: false, width: 'full', order: 13,
          },
          {
            id: 'f-7-15', type: 'textarea', label: 'Key Strengths', placeholder: 'Describe the employee\'s main strengths...',
            required: false, width: 'full', order: 14,
          },
          {
            id: 'f-7-16', type: 'textarea', label: 'Areas for Improvement', placeholder: 'Identify areas needing development...',
            required: false, width: 'full', order: 15,
          },
          {
            id: 'f-7-17', type: 'textarea', label: 'Goals for Next Year', placeholder: 'List agreed-upon goals and objectives...',
            required: false, width: 'full', order: 16,
          },
          {
            id: 'f-7-18', type: 'radio', label: 'Overall Performance Rating',
            options: [
              { label: 'Exceeds Expectations', value: 'exceeds' },
              { label: 'Meets Expectations', value: 'meets' },
              { label: 'Needs Improvement', value: 'needs_improvement' },
              { label: 'Unsatisfactory', value: 'unsatisfactory' },
            ],
            required: true, width: 'full', order: 17,
          },
          {
            id: 'f-7-19', type: 'signature', label: 'Reviewer Signature',
            required: true, width: 'half', order: 18,
          },
          {
            id: 'f-7-20', type: 'date', label: 'Review Date',
            required: true, width: 'half', order: 19,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 8. School Enrollment Form
  // ─────────────────────────────────────────────
  {
    id: 'tmpl-008',
    name: 'School Enrollment Form',
    description: 'A thorough school enrollment form covering student details, parent/guardian contacts, and medical information.',
    category: 'education',
    fieldCount: 22,
    settings: { paperSize: 'A4', orientation: 'portrait', showPageNumbers: true, primaryColor: '#F59E0B' },
    pages: [
      {
        title: 'School Enrollment',
        order: 0,
        fields: [
          {
            id: 'f-8-1', type: 'form-header', label: 'School Enrollment Form', metadata: 'Academic Year 2025–2026. Please complete all sections accurately.',
            required: false, width: 'full', order: 0,
          },
          {
            id: 'f-8-2', type: 'text', label: 'Student Full Name', placeholder: 'Enter student\'s full name',
            required: true, width: 'half', order: 1,
          },
          {
            id: 'f-8-3', type: 'date', label: 'Date of Birth',
            required: false, width: 'quarter', order: 2,
          },
          {
            id: 'f-8-4', type: 'dropdown', label: 'Grade Applying For',
            options: [
              { label: 'Kindergarten', value: 'kindergarten' },
              { label: 'Grade 1', value: 'grade_1' },
              { label: 'Grade 2', value: 'grade_2' },
              { label: 'Grade 3', value: 'grade_3' },
              { label: 'Grade 4', value: 'grade_4' },
              { label: 'Grade 5', value: 'grade_5' },
              { label: 'Grade 6', value: 'grade_6' },
              { label: 'Grade 7', value: 'grade_7' },
              { label: 'Grade 8', value: 'grade_8' },
              { label: 'Grade 9', value: 'grade_9' },
              { label: 'Grade 10', value: 'grade_10' },
              { label: 'Grade 11', value: 'grade_11' },
              { label: 'Grade 12', value: 'grade_12' },
            ],
            required: true, width: 'quarter', order: 3,
          },
          {
            id: 'f-8-5', type: 'dropdown', label: 'Gender',
            options: [
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Non-binary', value: 'non_binary' },
            ],
            required: false, width: 'half', order: 4,
          },
          {
            id: 'f-8-6', type: 'text', label: 'Previous School Attended', placeholder: 'School name (if applicable)',
            required: false, width: 'full', order: 5,
          },
          {
            id: 'f-8-7', type: 'address', label: 'Home Address',
            required: false, width: 'full', order: 6,
          },
          {
            id: 'f-8-8', type: 'divider', label: '', required: false, width: 'full', order: 7,
          },
          {
            id: 'f-8-9', type: 'form-header', label: 'Parent / Guardian Information', metadata: 'Primary contact information.',
            required: false, width: 'full', order: 8,
          },
          {
            id: 'f-8-10', type: 'text', label: 'Parent / Guardian Name', placeholder: 'Full name',
            required: true, width: 'half', order: 9,
          },
          {
            id: 'f-8-11', type: 'dropdown', label: 'Relationship to Student',
            options: [
              { label: 'Mother', value: 'mother' },
              { label: 'Father', value: 'father' },
              { label: 'Guardian', value: 'guardian' },
              { label: 'Other', value: 'other' },
            ],
            required: true, width: 'half', order: 10,
          },
          {
            id: 'f-8-12', type: 'email', label: 'Email Address', placeholder: 'parent@example.com',
            required: true, width: 'half', order: 11,
          },
          {
            id: 'f-8-13', type: 'phone', label: 'Phone Number', placeholder: '+1 (555) 000-0000',
            required: true, width: 'half', order: 12,
          },
          {
            id: 'f-8-14', type: 'text', label: 'Emergency Contact Name', placeholder: 'Full name',
            required: false, width: 'half', order: 13,
          },
          {
            id: 'f-8-15', type: 'phone', label: 'Emergency Contact Phone', placeholder: '+1 (555) 000-0000',
            required: false, width: 'half', order: 14,
          },
          {
            id: 'f-8-16', type: 'divider', label: '', required: false, width: 'full', order: 15,
          },
          {
            id: 'f-8-17', type: 'textarea', label: 'Medical Conditions / Health Notes', placeholder: 'List any known medical conditions, medications, or health concerns...',
            required: false, width: 'full', order: 16,
          },
          {
            id: 'f-8-18', type: 'textarea', label: 'Special Needs or Accommodations', placeholder: 'Describe any special educational or physical needs...',
            required: false, width: 'full', order: 17,
          },
          {
            id: 'f-8-19', type: 'dropdown', label: 'How Did You Hear About Us?',
            options: [
              { label: 'Website', value: 'website' },
              { label: 'Referral', value: 'referral' },
              { label: 'Social Media', value: 'social_media' },
              { label: 'Advertisement', value: 'advertisement' },
              { label: 'Other', value: 'other' },
            ],
            required: false, width: 'full', order: 18,
          },
          {
            id: 'f-8-20', type: 'checkbox', label: 'I agree to the school\'s terms and conditions and code of conduct.',
            required: true, width: 'full', order: 19,
          },
          {
            id: 'f-8-21', type: 'signature', label: 'Parent / Guardian Signature',
            required: true, width: 'full', order: 20,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 9. Invoice
  // ─────────────────────────────────────────────
  {
    id: 'tmpl-009',
    name: 'Service Invoice',
    description: 'A clean, professional invoice form for freelancers and small businesses to bill clients for services.',
    category: 'business',
    fieldCount: 10,
    settings: { paperSize: 'A4', orientation: 'portrait', showPageNumbers: false, primaryColor: '#4F46E5' },
    pages: [
      {
        title: 'Invoice',
        order: 0,
        fields: [
          {
            id: 'f-9-1', type: 'form-header', label: 'Invoice', metadata: 'Please remit payment within 30 days of invoice date.',
            required: false, width: 'full', order: 0,
          },
          {
            id: 'f-9-2', type: 'text', label: 'Invoice Number', placeholder: 'INV-001',
            required: true, width: 'half', order: 1,
          },
          {
            id: 'f-9-3', type: 'date', label: 'Invoice Date',
            required: true, width: 'half', order: 2,
          },
          {
            id: 'f-9-4', type: 'text', label: 'Bill To (Client Name)', placeholder: 'Client or company name',
            required: true, width: 'half', order: 3,
          },
          {
            id: 'f-9-5', type: 'email', label: 'Client Email', placeholder: 'client@example.com',
            required: false, width: 'half', order: 4,
          },
          {
            id: 'f-9-6', type: 'address', label: 'Client Billing Address',
            required: false, width: 'full', order: 5,
          },
          {
            id: 'f-9-7', type: 'divider', label: '', required: false, width: 'full', order: 6,
          },
          {
            id: 'f-9-8', type: 'table', label: 'Services / Line Items',
            required: false, width: 'full', order: 7,
            tableColumns: ['Description', 'Qty', 'Rate', 'Amount'],
            tableRows: 6,
          },
          {
            id: 'f-9-9', type: 'textarea', label: 'Notes / Payment Instructions', placeholder: 'Bank details, payment terms, or any additional notes…',
            required: false, width: 'full', order: 8,
          },
          {
            id: 'f-9-10', type: 'signature', label: 'Authorized Signature',
            required: false, width: 'half', order: 9,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 10. Non-Disclosure Agreement
  // ─────────────────────────────────────────────
  {
    id: 'tmpl-010',
    name: 'Non-Disclosure Agreement',
    description: 'A mutual NDA form for protecting confidential information between two parties.',
    category: 'legal',
    fieldCount: 12,
    settings: { paperSize: 'A4', orientation: 'portrait', showPageNumbers: true, primaryColor: '#1E293B' },
    pages: [
      {
        title: 'Non-Disclosure Agreement',
        order: 0,
        fields: [
          {
            id: 'f-10-1', type: 'form-header', label: 'Mutual Non-Disclosure Agreement',
            metadata: 'This NDA is entered into between the parties named below.',
            required: false, width: 'full', order: 0,
          },
          {
            id: 'f-10-2', type: 'text', label: 'Disclosing Party (Company / Individual)', placeholder: 'Full legal name',
            required: true, width: 'half', order: 1,
          },
          {
            id: 'f-10-3', type: 'text', label: 'Receiving Party (Company / Individual)', placeholder: 'Full legal name',
            required: true, width: 'half', order: 2,
          },
          {
            id: 'f-10-4', type: 'date', label: 'Effective Date',
            required: true, width: 'half', order: 3,
          },
          {
            id: 'f-10-5', type: 'text', label: 'Agreement Duration', placeholder: 'e.g. 2 years from effective date',
            required: false, width: 'half', order: 4,
          },
          {
            id: 'f-10-6', type: 'textarea', label: 'Purpose of Disclosure', placeholder: 'Describe the business purpose for sharing confidential information…',
            required: true, width: 'full', order: 5,
          },
          {
            id: 'f-10-7', type: 'textarea', label: 'Definition of Confidential Information', placeholder: 'Describe what constitutes confidential information under this agreement…',
            required: false, width: 'full', order: 6,
          },
          {
            id: 'f-10-8', type: 'divider', label: '', required: false, width: 'full', order: 7,
          },
          {
            id: 'f-10-9', type: 'label', label: 'By signing below, both parties agree to the terms and conditions of this Non-Disclosure Agreement.',
            required: false, width: 'full', order: 8,
          },
          {
            id: 'f-10-10', type: 'signature', label: 'Disclosing Party Signature',
            required: true, width: 'half', order: 9,
          },
          {
            id: 'f-10-11', type: 'signature', label: 'Receiving Party Signature',
            required: true, width: 'half', order: 10,
          },
          {
            id: 'f-10-12', type: 'date', label: 'Date Signed',
            required: true, width: 'half', order: 11,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 11. Property Inspection Report
  // ─────────────────────────────────────────────
  {
    id: 'tmpl-011',
    name: 'Property Inspection Report',
    description: 'A detailed checklist-style form for real estate or rental property inspections.',
    category: 'real-estate',
    fieldCount: 14,
    settings: { paperSize: 'A4', orientation: 'portrait', showPageNumbers: true, primaryColor: '#0369A1' },
    pages: [
      {
        title: 'Property Inspection',
        order: 0,
        fields: [
          {
            id: 'f-11-1', type: 'form-header', label: 'Property Inspection Report',
            metadata: 'Complete this form during or immediately after the property inspection.',
            required: false, width: 'full', order: 0,
          },
          {
            id: 'f-11-2', type: 'text', label: 'Property Address', placeholder: '123 Main St, City, State',
            required: true, width: 'full', order: 1,
          },
          {
            id: 'f-11-3', type: 'date', label: 'Inspection Date',
            required: true, width: 'half', order: 2,
          },
          {
            id: 'f-11-4', type: 'text', label: 'Inspector Name', placeholder: 'Full name',
            required: true, width: 'half', order: 3,
          },
          {
            id: 'f-11-5', type: 'divider', label: '', required: false, width: 'full', order: 4,
          },
          {
            id: 'f-11-6', type: 'form-header', label: 'Condition Checklist', metadata: 'Rate each area.',
            required: false, width: 'full', order: 5,
          },
          {
            id: 'f-11-7', type: 'radio', label: 'Exterior Condition',
            options: [
              { label: 'Excellent', value: 'excellent' },
              { label: 'Good', value: 'good' },
              { label: 'Fair', value: 'fair' },
              { label: 'Poor', value: 'poor' },
            ],
            required: true, width: 'half', order: 6,
          },
          {
            id: 'f-11-8', type: 'radio', label: 'Interior Condition',
            options: [
              { label: 'Excellent', value: 'excellent' },
              { label: 'Good', value: 'good' },
              { label: 'Fair', value: 'fair' },
              { label: 'Poor', value: 'poor' },
            ],
            required: true, width: 'half', order: 7,
          },
          {
            id: 'f-11-9', type: 'radio', label: 'Plumbing',
            options: [
              { label: 'Functional', value: 'functional' },
              { label: 'Minor Issues', value: 'minor' },
              { label: 'Needs Repair', value: 'repair' },
            ],
            required: false, width: 'half', order: 8,
          },
          {
            id: 'f-11-10', type: 'radio', label: 'Electrical',
            options: [
              { label: 'Functional', value: 'functional' },
              { label: 'Minor Issues', value: 'minor' },
              { label: 'Needs Repair', value: 'repair' },
            ],
            required: false, width: 'half', order: 9,
          },
          {
            id: 'f-11-11', type: 'checkbox-group', label: 'Defects Found',
            options: [
              { label: 'Roof Damage', value: 'roof' },
              { label: 'Foundation Cracks', value: 'foundation' },
              { label: 'Water Damage / Mould', value: 'water' },
              { label: 'Pest Infestation', value: 'pest' },
              { label: 'HVAC Issues', value: 'hvac' },
              { label: 'None', value: 'none' },
            ],
            required: false, width: 'full', order: 10,
          },
          {
            id: 'f-11-12', type: 'textarea', label: 'Additional Notes', placeholder: 'Describe any other observations or concerns…',
            required: false, width: 'full', order: 11,
          },
          {
            id: 'f-11-13', type: 'signature', label: 'Inspector Signature',
            required: true, width: 'half', order: 12,
          },
          {
            id: 'f-11-14', type: 'date', label: 'Report Date',
            required: true, width: 'half', order: 13,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 12. Travel Expense Report
  // ─────────────────────────────────────────────
  {
    id: 'tmpl-012',
    name: 'Travel Expense Report',
    description: 'Submit and document business travel expenses with receipts breakdown and manager approval.',
    category: 'business',
    fieldCount: 10,
    settings: { paperSize: 'A4', orientation: 'portrait', showPageNumbers: false, primaryColor: '#059669' },
    pages: [
      {
        title: 'Travel Expense Report',
        order: 0,
        fields: [
          {
            id: 'f-12-1', type: 'form-header', label: 'Travel Expense Report',
            metadata: 'Submit within 14 days of trip completion. Attach all receipts.',
            required: false, width: 'full', order: 0,
          },
          {
            id: 'f-12-2', type: 'text', label: 'Employee Name', placeholder: 'Full name',
            required: true, width: 'half', order: 1,
          },
          {
            id: 'f-12-3', type: 'text', label: 'Department', placeholder: 'Your department',
            required: false, width: 'half', order: 2,
          },
          {
            id: 'f-12-4', type: 'text', label: 'Purpose of Travel', placeholder: 'e.g. Client meeting, Conference',
            required: true, width: 'full', order: 3,
          },
          {
            id: 'f-12-5', type: 'date', label: 'Travel Start Date',
            required: true, width: 'half', order: 4,
          },
          {
            id: 'f-12-6', type: 'date', label: 'Travel End Date',
            required: true, width: 'half', order: 5,
          },
          {
            id: 'f-12-7', type: 'table', label: 'Expense Breakdown',
            required: false, width: 'full', order: 6,
            tableColumns: ['Date', 'Category', 'Description', 'Amount'],
            tableRows: 8,
          },
          {
            id: 'f-12-8', type: 'textarea', label: 'Additional Notes', placeholder: 'Any exceptional expenses or explanations…',
            required: false, width: 'full', order: 7,
          },
          {
            id: 'f-12-9', type: 'signature', label: 'Employee Signature',
            required: true, width: 'half', order: 8,
          },
          {
            id: 'f-12-10', type: 'signature', label: 'Manager Approval',
            required: false, width: 'half', order: 9,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 13. Volunteer Registration
  // ─────────────────────────────────────────────
  {
    id: 'tmpl-013',
    name: 'Volunteer Registration',
    description: 'A registration form for volunteers at nonprofits, community events, or charitable organizations.',
    category: 'nonprofit',
    fieldCount: 12,
    settings: { paperSize: 'A4', orientation: 'portrait', showPageNumbers: false, primaryColor: '#D97706' },
    pages: [
      {
        title: 'Volunteer Registration',
        order: 0,
        fields: [
          {
            id: 'f-13-1', type: 'form-header', label: 'Volunteer Registration',
            metadata: 'Thank you for your interest in volunteering with us!',
            required: false, width: 'full', order: 0,
          },
          {
            id: 'f-13-2', type: 'text', label: 'Full Name', placeholder: 'Your full name',
            required: true, width: 'half', order: 1,
          },
          {
            id: 'f-13-3', type: 'email', label: 'Email Address', placeholder: 'you@example.com',
            required: true, width: 'half', order: 2,
          },
          {
            id: 'f-13-4', type: 'phone', label: 'Phone Number', placeholder: '+1 (555) 000-0000',
            required: false, width: 'half', order: 3,
          },
          {
            id: 'f-13-5', type: 'date', label: 'Date of Birth',
            required: false, width: 'half', order: 4,
          },
          {
            id: 'f-13-6', type: 'checkbox-group', label: 'Areas of Interest',
            options: [
              { label: 'Event Setup & Logistics', value: 'events' },
              { label: 'Food & Kitchen', value: 'food' },
              { label: 'Tutoring / Mentoring', value: 'tutoring' },
              { label: 'Fundraising', value: 'fundraising' },
              { label: 'Administration', value: 'admin' },
              { label: 'Social Media & Marketing', value: 'social' },
            ],
            required: false, width: 'full', order: 5,
          },
          {
            id: 'f-13-7', type: 'radio', label: 'Availability',
            options: [
              { label: 'Weekdays only', value: 'weekdays' },
              { label: 'Weekends only', value: 'weekends' },
              { label: 'Both weekdays and weekends', value: 'both' },
              { label: 'Flexible', value: 'flexible' },
            ],
            required: false, width: 'half', order: 6,
          },
          {
            id: 'f-13-8', type: 'radio', label: 'Hours Per Week Available',
            options: [
              { label: '1–5 hours', value: '1_5' },
              { label: '5–10 hours', value: '5_10' },
              { label: '10+ hours', value: '10_plus' },
            ],
            required: false, width: 'half', order: 7,
          },
          {
            id: 'f-13-9', type: 'textarea', label: 'Skills / Experience', placeholder: 'Describe any relevant skills, experience, or languages spoken…',
            required: false, width: 'full', order: 8,
          },
          {
            id: 'f-13-10', type: 'text', label: 'Emergency Contact Name', placeholder: 'Full name',
            required: false, width: 'half', order: 9,
          },
          {
            id: 'f-13-11', type: 'phone', label: 'Emergency Contact Phone', placeholder: '+1 (555) 000-0000',
            required: false, width: 'half', order: 10,
          },
          {
            id: 'f-13-12', type: 'checkbox', label: 'I agree to the volunteer terms, code of conduct, and consent to a background check if required.',
            required: true, width: 'full', order: 11,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 14. Incident Report
  // ─────────────────────────────────────────────
  {
    id: 'tmpl-014',
    name: 'Incident Report',
    description: 'Document workplace accidents, safety incidents, or security events for compliance and insurance.',
    category: 'business',
    fieldCount: 14,
    settings: { paperSize: 'A4', orientation: 'portrait', showPageNumbers: true, primaryColor: '#DC2626' },
    pages: [
      {
        title: 'Incident Report',
        order: 0,
        fields: [
          {
            id: 'f-14-1', type: 'form-header', label: 'Incident Report Form',
            metadata: 'Complete as soon as possible after the incident. Be factual and accurate.',
            required: false, width: 'full', order: 0,
          },
          {
            id: 'f-14-2', type: 'text', label: 'Reporter Name', placeholder: 'Your full name',
            required: true, width: 'half', order: 1,
          },
          {
            id: 'f-14-3', type: 'text', label: 'Job Title / Department', placeholder: 'Your role',
            required: false, width: 'half', order: 2,
          },
          {
            id: 'f-14-4', type: 'date', label: 'Date of Incident',
            required: true, width: 'half', order: 3,
          },
          {
            id: 'f-14-5', type: 'time', label: 'Time of Incident',
            required: false, width: 'half', order: 4,
          },
          {
            id: 'f-14-6', type: 'text', label: 'Location of Incident', placeholder: 'e.g. Warehouse Floor B, Room 204',
            required: true, width: 'full', order: 5,
          },
          {
            id: 'f-14-7', type: 'radio', label: 'Type of Incident',
            options: [
              { label: 'Workplace Injury', value: 'injury' },
              { label: 'Property Damage', value: 'property' },
              { label: 'Security Breach', value: 'security' },
              { label: 'Near Miss', value: 'near_miss' },
              { label: 'Other', value: 'other' },
            ],
            required: true, width: 'half', order: 6,
          },
          {
            id: 'f-14-8', type: 'radio', label: 'Severity',
            options: [
              { label: 'Critical', value: 'critical' },
              { label: 'Major', value: 'major' },
              { label: 'Minor', value: 'minor' },
              { label: 'No Injury', value: 'none' },
            ],
            required: false, width: 'half', order: 7,
          },
          {
            id: 'f-14-9', type: 'textarea', label: 'Description of Incident', placeholder: 'Describe exactly what happened, in chronological order…',
            required: true, width: 'full', order: 8,
          },
          {
            id: 'f-14-10', type: 'textarea', label: 'Immediate Action Taken', placeholder: 'What steps were immediately taken after the incident?',
            required: false, width: 'full', order: 9,
          },
          {
            id: 'f-14-11', type: 'text', label: 'Witness Name(s)', placeholder: 'Names of any witnesses',
            required: false, width: 'full', order: 10,
          },
          {
            id: 'f-14-12', type: 'checkbox', label: 'Medical attention was required or recommended',
            required: false, width: 'full', order: 11,
          },
          {
            id: 'f-14-13', type: 'signature', label: 'Reporter Signature',
            required: true, width: 'half', order: 12,
          },
          {
            id: 'f-14-14', type: 'signature', label: 'Supervisor Signature',
            required: false, width: 'half', order: 13,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 15. Course Evaluation
  // ─────────────────────────────────────────────
  {
    id: 'tmpl-015',
    name: 'Course Evaluation',
    description: 'Let students rate instructors, course content, and learning outcomes at the end of a course.',
    category: 'education',
    fieldCount: 12,
    settings: { paperSize: 'A4', orientation: 'portrait', showPageNumbers: false, primaryColor: '#7C3AED' },
    pages: [
      {
        title: 'Course Evaluation',
        order: 0,
        fields: [
          {
            id: 'f-15-1', type: 'form-header', label: 'Course Evaluation',
            metadata: 'Your honest feedback helps us improve the learning experience.',
            required: false, width: 'full', order: 0,
          },
          {
            id: 'f-15-2', type: 'text', label: 'Course Name / Code', placeholder: 'e.g. CS101 Introduction to Programming',
            required: false, width: 'half', order: 1,
          },
          {
            id: 'f-15-3', type: 'text', label: 'Instructor Name', placeholder: 'Instructor / Professor name',
            required: false, width: 'half', order: 2,
          },
          {
            id: 'f-15-4', type: 'divider', label: '', required: false, width: 'full', order: 3,
          },
          {
            id: 'f-15-5', type: 'rating', label: 'Overall Course Quality',
            required: false, width: 'half', order: 4, maxRating: 5,
          },
          {
            id: 'f-15-6', type: 'rating', label: 'Instructor Effectiveness',
            required: false, width: 'half', order: 5, maxRating: 5,
          },
          {
            id: 'f-15-7', type: 'rating', label: 'Course Materials & Resources',
            required: false, width: 'half', order: 6, maxRating: 5,
          },
          {
            id: 'f-15-8', type: 'rating', label: 'Workload & Difficulty Level',
            required: false, width: 'half', order: 7, maxRating: 5,
          },
          {
            id: 'f-15-9', type: 'radio', label: 'Would you recommend this course?',
            options: [
              { label: 'Definitely Yes', value: 'yes' },
              { label: 'Probably Yes', value: 'probably' },
              { label: 'Probably Not', value: 'probably_not' },
              { label: 'Definitely Not', value: 'no' },
            ],
            required: false, width: 'full', order: 8,
          },
          {
            id: 'f-15-10', type: 'textarea', label: 'What did you enjoy most?', placeholder: 'Share what worked well for you…',
            required: false, width: 'full', order: 9,
          },
          {
            id: 'f-15-11', type: 'textarea', label: 'What could be improved?', placeholder: 'Constructive feedback is appreciated…',
            required: false, width: 'full', order: 10,
          },
          {
            id: 'f-15-12', type: 'checkbox', label: 'I consent to this feedback being used anonymously for course improvement.',
            required: false, width: 'full', order: 11,
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 16. Leave Request
  // ─────────────────────────────────────────────
  {
    id: 'tmpl-016',
    name: 'Leave Request Form',
    description: 'An HR leave application form for employees to request time off with manager approval.',
    category: 'hr',
    fieldCount: 10,
    settings: { paperSize: 'A4', orientation: 'portrait', showPageNumbers: false, primaryColor: '#0EA5E9' },
    pages: [
      {
        title: 'Leave Request',
        order: 0,
        fields: [
          {
            id: 'f-16-1', type: 'form-header', label: 'Leave Request Form',
            metadata: 'Submit at least 5 business days in advance. Urgent requests require manager approval.',
            required: false, width: 'full', order: 0,
          },
          {
            id: 'f-16-2', type: 'text', label: 'Employee Name', placeholder: 'Full name',
            required: true, width: 'half', order: 1,
          },
          {
            id: 'f-16-3', type: 'text', label: 'Department', placeholder: 'Your department',
            required: false, width: 'half', order: 2,
          },
          {
            id: 'f-16-4', type: 'date', label: 'Leave Start Date',
            required: true, width: 'half', order: 3,
          },
          {
            id: 'f-16-5', type: 'date', label: 'Leave End Date',
            required: true, width: 'half', order: 4,
          },
          {
            id: 'f-16-6', type: 'radio', label: 'Type of Leave',
            options: [
              { label: 'Annual / Vacation Leave', value: 'annual' },
              { label: 'Sick Leave', value: 'sick' },
              { label: 'Maternity / Paternity Leave', value: 'parental' },
              { label: 'Unpaid Leave', value: 'unpaid' },
              { label: 'Other', value: 'other' },
            ],
            required: true, width: 'full', order: 5,
          },
          {
            id: 'f-16-7', type: 'textarea', label: 'Reason for Leave', placeholder: 'Brief description of reason for leave…',
            required: false, width: 'full', order: 6,
          },
          {
            id: 'f-16-8', type: 'text', label: 'Covering Employee (if applicable)', placeholder: 'Name of colleague covering duties',
            required: false, width: 'full', order: 7,
          },
          {
            id: 'f-16-9', type: 'signature', label: 'Employee Signature',
            required: true, width: 'half', order: 8,
          },
          {
            id: 'f-16-10', type: 'signature', label: 'Manager Approval',
            required: false, width: 'half', order: 9,
          },
        ],
      },
    ],
  },
]

export const TEMPLATE_CATEGORIES: Record<string, string> = {
  business: 'Business',
  hr: 'Human Resources',
  healthcare: 'Healthcare',
  education: 'Education',
  events: 'Events',
  surveys: 'Surveys',
  legal: 'Legal',
  'real-estate': 'Real Estate',
  nonprofit: 'Nonprofit',
  general: 'General',
}
