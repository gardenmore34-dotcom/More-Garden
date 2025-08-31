import { createClient } from '@sanity/client'

const sanityClient = createClient({
  projectId: 'mldb2kiz',      // ⬅️ Replace with your real ID
  dataset: 'production',
  useCdn: true,
  apiVersion: '2025-06-10',          // use current date
});

export default sanityClient;
