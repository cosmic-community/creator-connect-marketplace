import { createBucketClient } from '@cosmicjs/sdk'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Fetch all content creators with categories
export async function getContentCreators() {
  try {
    const response = await cosmic.objects
      .find({ type: 'content-creators' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects || [];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch content creators');
  }
}

// Fetch all product creators with categories
export async function getProductCreators() {
  try {
    const response = await cosmic.objects
      .find({ type: 'product-creators' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    
    return response.objects || [];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch product creators');
  }
}

// Fetch all categories
export async function getCategories() {
  try {
    const response = await cosmic.objects
      .find({ type: 'categories' })
      .props(['id', 'title', 'slug', 'metadata']);
    
    return response.objects || [];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch categories');
  }
}

// Fetch single content creator by slug
export async function getContentCreatorBySlug(slug: string) {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'content-creators', slug })
      .depth(1);
    
    return response.object;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch content creator');
  }
}

// Fetch single product creator by slug
export async function getProductCreatorBySlug(slug: string) {
  try {
    const response = await cosmic.objects
      .findOne({ type: 'product-creators', slug })
      .depth(1);
    
    return response.object;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch product creator');
  }
}

// Send message
export async function sendMessage(messageData: {
  fromProductCreatorId: string;
  toContentCreatorId: string;
  subject: string;
  messageContent: string;
}) {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'messages',
      title: messageData.subject,
      metadata: {
        from_product_creator: messageData.fromProductCreatorId,
        to_content_creator: messageData.toContentCreatorId,
        subject: messageData.subject,
        message_content: messageData.messageContent,
        message_status: 'sent',
        email_sent: false
      }
    });
    
    return response.object;
  } catch (error) {
    throw new Error('Failed to send message');
  }
}

// Create user account
export async function createUserAccount(userData: {
  email: string;
  passwordHash: string;
  accountType: 'product-creator' | 'content-creator';
}) {
  try {
    // Create the account type object structure to match existing data
    const accountTypeValue = userData.accountType === 'content-creator' ? 'Content Creator' : 'Product Creator';
    
    const response = await cosmic.objects.insertOne({
      type: 'user-accounts',
      title: `${userData.email} Account`,
      metadata: {
        email: userData.email,
        password_hash: userData.passwordHash,
        account_type: {
          key: userData.accountType,
          value: accountTypeValue
        },
        email_verified: false,
        profile_reference: '',
        email_verification_token: '',
        password_reset_token: '',
        last_login: ''
      }
    });
    
    return response.object;
  } catch (error) {
    console.error('Create user account error:', error);
    throw new Error('Failed to create user account');
  }
}

// Find user account by email
export async function getUserByEmail(email: string) {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'user-accounts',
        'metadata.email': email
      })
      .props(['id', 'title', 'slug', 'metadata']);
    
    return response.objects[0] || null;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch user');
  }
}