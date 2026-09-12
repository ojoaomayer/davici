'use server'

import { db } from '@/lib/firebase-admin';

// In-memory cache for the MVP to allow fast, full-text substring search
// without needing a paid external search engine like Algolia.
let cache: any[] | null = null;
let lastCacheTime = 0;

export async function searchSinapi(query: string) {
  try {
    // Refresh cache if it's older than 1 hour or empty
    if (!cache || Date.now() - lastCacheTime > 3600000) {
      console.log('Fetching SINAPI items from Firestore for cache...');
      const snapshot = await db.collection('sinapi_itens').get();
      // Strip 'embedding' (Firestore VectorValue) — it's a class instance and
      // cannot be serialized when passed from a Server Action to Client Components.
      cache = snapshot.docs.map(doc => {
        const { embedding, ...rest } = doc.data() as any
        return rest
      });
      lastCacheTime = Date.now();
    }

    if (!query || query.trim() === '') {
      return cache.slice(0, 50); // return first 50 items if no query
    }

    const lowerQuery = query.toLowerCase().trim();
    
    // Simple filter by code or description
    const results = cache.filter(item => 
      String(item.codigo).includes(lowerQuery) || 
      item.descricao?.toLowerCase().includes(lowerQuery)
    );

    return results.slice(0, 100); // limit to 100 results for performance
  } catch (error) {
    console.error("Error searching SINAPI:", error);
    return [];
  }
}
