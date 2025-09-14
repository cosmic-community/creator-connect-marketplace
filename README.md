# Creator Connect - Marketplace Platform

![Creator Connect Preview](https://imgix.cosmicjs.com/2ff682a0-9124-11f0-adb3-4db705379c06-photo-1460925895917-afdab827c52f-1757824505618.jpg?w=1200&h=300&fit=crop&auto=format,compress)

A dual-sided marketplace connecting product creators with content creators and influencers. This platform enables entrepreneurs to discover talented creators for authentic brand partnerships, product launches, and ongoing collaborations.

## Features

- **Dual-sided marketplace** with separate discovery pages for each user type
- **Advanced filtering** by categories, budget, follower count, and services
- **User authentication** with secure account management and email verification
- **Direct messaging system** with email notifications via Resend
- **Rich profiles** with portfolio galleries, social media links, and service details
- **Responsive design** optimized for all devices
- **Real-time search** with keyword filtering and category-based discovery

## Clone this Project

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket and code repository to get started instantly:

[![Clone this Project](https://img.shields.io/badge/Clone%20this%20Project-29abe2?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmicjs.com/projects/new?clone_bucket=68c644600a2eeaef39f42ca9&clone_repository=68c647540a2eeaef39f42ccb)

## Prompts

This application was built using the following prompts to generate the content structure and code:

### Content Model Prompt

> "Create a directory website which is dual-sided marketplace for product creators and content creators to help product developers and entrepreneurs find online content creators and influencers. There should be clear pages for both product creators and content creators and the ability to filter by category / tags / keyword for each. There should be a way to signup and login to an account for each and be able to receive email messages (using Resend)."

### Code Generation Prompt

> "Based on the content model I created for "Create a directory website which is dual-sided marketplace for product creators and content creators to help product developers and entrepreneurs find online content creators and influencers. There should be clear pages for both product creators and content creators and the ability to filter by category / tags / keyword for each. There should be a way to signup and login to an account for each and be able to receive email messages (using Resend).", now build a complete web application that showcases this content. Include a modern, responsive design with proper navigation, content display, and user-friendly interface."

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Cosmic CMS** - Headless content management
- **Resend** - Email delivery service
- **Lucide React** - Modern icon library

## Getting Started

### Prerequisites

- Node.js 18+ or Bun runtime
- Cosmic CMS account with bucket access
- Resend account for email functionality

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables in `.env.local`:
   ```env
   COSMIC_BUCKET_SLUG=your-bucket-slug
   COSMIC_READ_KEY=your-read-key
   COSMIC_WRITE_KEY=your-write-key
   RESEND_API_KEY=your-resend-api-key
   JWT_SECRET=your-jwt-secret-key-minimum-32-characters
   ```

4. Run the development server:
   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

## Cosmic SDK Examples

```typescript
// Fetch content creators with categories
const creators = await cosmic.objects
  .find({ type: 'content-creators' })
  .depth(1);

// Filter by category and availability
const availableCreators = await cosmic.objects
  .find({ 
    type: 'content-creators',
    'metadata.available_for_work': true 
  })
  .depth(1);

// Search product creators by industry
const techCompanies = await cosmic.objects
  .find({ 
    type: 'product-creators',
    'metadata.industry_category': categoryId 
  })
  .depth(1);
```

## Cosmic CMS Integration

The application integrates with your Cosmic bucket structure:

- **Product Creators** - Company profiles with industry categories and project requirements
- **Content Creators** - Creator profiles with platform specialties and service offerings
- **Categories** - Industry and content categorization system
- **User Accounts** - Authentication and account management
- **Messages** - Direct messaging between creators with email notifications

All content is fetched dynamically with depth queries to include related objects and metadata.

## Deployment Options

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables in the Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Build command: `bun run build`
2. Publish directory: `.next`
3. Add environment variables in Netlify settings

Environment variables must be configured in your deployment platform for full functionality.
<!-- README_END -->