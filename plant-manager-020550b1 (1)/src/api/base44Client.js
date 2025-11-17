import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "691a4d93ce82cd0d020550b1", 
  requiresAuth: true // Ensure authentication is required for all operations
});
