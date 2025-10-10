import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/graphql',
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          annotationsByVideo: {
            merge: false, // Don't merge, always replace
          },
          videos: {
            merge: false, // Don't merge, always replace
          },
          video: {
            merge: false, // Don't merge, always replace
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    },
  },
});

// Clear cache on app start
if (typeof window !== 'undefined') {
  // Clear browser storage on app start
  try {
    localStorage.clear();
    sessionStorage.clear();
    console.log('🧹 Browser storage cleared on app start');
  } catch (error) {
    console.warn('⚠️ Could not clear browser storage:', error);
  }
}
