import { NextRequest, NextResponse } from "next/server";
import { cosmic } from "@/lib/cosmic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const accountType = formData.get('accountType') as string;
    const userId = formData.get('userId') as string;

    if (!accountType || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (accountType === 'content-creator') {
      // Handle Content Creator Profile Creation
      const creatorName = formData.get('creator_name') as string;
      const bio = formData.get('bio') as string;
      const email = formData.get('email') as string || '';

      if (!creatorName || !bio) {
        return NextResponse.json(
          { error: "Creator name and bio are required" },
          { status: 400 }
        );
      }

      // Parse JSON fields
      const contentCategories = JSON.parse(formData.get('content_categories') as string || '[]');
      const platformSpecialties = JSON.parse(formData.get('platform_specialties') as string || '[]');
      const servicesOffered = JSON.parse(formData.get('services_offered') as string || '[]');
      const socialMediaLinks = JSON.parse(formData.get('social_media_links') as string || '{}');

      // Handle file uploads (in a real implementation, you'd upload to Cosmic or another service)
      // For now, we'll use placeholder URLs
      const profilePhotoUrl = formData.get('profile_photo') ? 
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format,compress' : null;

      const portfolioImages = [];
      let portfolioIndex = 0;
      while (formData.get(`portfolio_image_${portfolioIndex}`)) {
        portfolioImages.push({
          url: `https://images.unsplash.com/photo-155165097587-87deedd944c3?w=600&h=400&fit=crop&auto=format,compress`,
          imgix_url: `https://images.unsplash.com/photo-155165097587-87deedd944c3?w=600&h=400&fit=crop&auto=format,compress`
        });
        portfolioIndex++;
      }

      // Create the content creator profile
      const response = await cosmic.objects.insertOne({
        type: "content-creators",
        title: `${creatorName} - Creator`,
        metadata: {
          creator_name: creatorName,
          email: email,
          bio: bio,
          profile_photo: profilePhotoUrl ? {
            url: profilePhotoUrl,
            imgix_url: profilePhotoUrl
          } : null,
          content_categories: contentCategories,
          platform_specialties: platformSpecialties,
          follower_count_range: formData.get('follower_count_range') ? {
            key: formData.get('follower_count_range') as string,
            value: getFollowerRangeValue(formData.get('follower_count_range') as string)
          } : null,
          rate_range: formData.get('rate_range') ? {
            key: formData.get('rate_range') as string,
            value: getRateRangeValue(formData.get('rate_range') as string)
          } : null,
          services_offered: servicesOffered,
          portfolio_images: portfolioImages,
          social_media_links: socialMediaLinks,
          website_url: formData.get('website_url') as string || '',
          location: formData.get('location') as string || '',
          account_status: {
            key: 'pending',
            value: 'Pending Verification'
          },
          available_for_work: true,
          tags: formData.get('tags') as string || ''
        }
      });

      // Update the user account with the profile reference
      await cosmic.objects.updateOne(userId, {
        metadata: {
          profile_reference: response.object.slug
        }
      });

      return NextResponse.json({
        success: true,
        profile: response.object,
        slug: response.object.slug
      });

    } else if (accountType === 'product-creator') {
      // Handle Product Creator Profile Creation
      const companyName = formData.get('company_name') as string;
      const contactPerson = formData.get('contact_person') as string;
      const companyDescription = formData.get('company_description') as string;

      if (!companyName || !contactPerson || !companyDescription) {
        return NextResponse.json(
          { error: "Company name, contact person, and description are required" },
          { status: 400 }
        );
      }

      // Parse JSON fields
      const lookingFor = JSON.parse(formData.get('looking_for') as string || '[]');

      // Handle file upload (company logo)
      const companyLogoUrl = formData.get('company_logo') ? 
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&auto=format,compress' : null;

      // Create the product creator profile
      const response = await cosmic.objects.insertOne({
        type: "product-creators",
        title: companyName,
        metadata: {
          company_name: companyName,
          contact_person: contactPerson,
          email: '', // Will be populated from user account
          company_description: companyDescription,
          website_url: formData.get('website_url') as string || '',
          industry_category: formData.get('industry_category') as string || '',
          looking_for: lookingFor,
          budget_range: formData.get('budget_range') ? {
            key: formData.get('budget_range') as string,
            value: getBudgetRangeValue(formData.get('budget_range') as string)
          } : null,
          project_type: formData.get('project_type') ? {
            key: formData.get('project_type') as string,
            value: getProjectTypeValue(formData.get('project_type') as string)
          } : null,
          company_logo: companyLogoUrl ? {
            url: companyLogoUrl,
            imgix_url: companyLogoUrl
          } : null,
          phone_number: formData.get('phone_number') as string || '',
          location: formData.get('location') as string || '',
          account_status: {
            key: 'pending',
            value: 'Pending Verification'
          },
          tags: formData.get('tags') as string || ''
        }
      });

      // Update the user account with the profile reference
      await cosmic.objects.updateOne(userId, {
        metadata: {
          profile_reference: response.object.slug
        }
      });

      return NextResponse.json({
        success: true,
        profile: response.object,
        slug: response.object.slug
      });
    }

    return NextResponse.json(
      { error: "Invalid account type" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Profile creation error:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}

// Helper functions for dropdown values
function getFollowerRangeValue(key: string): string {
  const ranges: Record<string, string> = {
    'micro': '1K - 10K (Micro)',
    'mid-tier': '10K - 100K (Mid-tier)',
    'macro': '100K - 1M (Macro)',
    'mega': '1M+ (Mega)'
  };
  return ranges[key] || '';
}

function getRateRangeValue(key: string): string {
  const ranges: Record<string, string> = {
    'budget': 'Under $500',
    'mid-range': '$500 - $2,000',
    'premium': '$2,000 - $10,000',
    'enterprise': '$10,000+'
  };
  return ranges[key] || '';
}

function getBudgetRangeValue(key: string): string {
  const ranges: Record<string, string> = {
    'under-1k': 'Under $1,000',
    '1k-5k': '$1,000 - $5,000',
    '5k-10k': '$5,000 - $10,000',
    '10k-25k': '$10,000 - $25,000',
    '25k-plus': '$25,000+'
  };
  return ranges[key] || '';
}

function getProjectTypeValue(key: string): string {
  const types: Record<string, string> = {
    'product-launch': 'Product Launch',
    'brand-awareness': 'Brand Awareness',
    'content-series': 'Content Series',
    'review-campaign': 'Review Campaign',
    'ongoing-partnership': 'Ongoing Partnership'
  };
  return types[key] || '';
}