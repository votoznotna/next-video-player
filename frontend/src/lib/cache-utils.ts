/**
 * Utility functions for clearing browser cache and storage
 */

export const clearBrowserCache = () => {
  try {
    // Clear localStorage
    localStorage.clear();

    // Clear sessionStorage
    sessionStorage.clear();

    // Clear IndexedDB (if used)
    if ('indexedDB' in window) {
      // Note: IndexedDB clearing is more complex and requires specific database names
      // For now, we'll just clear the common storage types
    }

    // Clear cookies (for current domain)
    document.cookie.split(';').forEach((c) => {
      const eqPos = c.indexOf('=');
      const name = eqPos > -1 ? c.substr(0, eqPos) : c;
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      document.cookie =
        name +
        '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' +
        window.location.hostname;
      document.cookie =
        name +
        '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.' +
        window.location.hostname;
    });

    console.log('✅ Browser cache cleared successfully');
    return true;
  } catch (error) {
    console.error('❌ Error clearing browser cache:', error);
    return false;
  }
};

export const clearApolloCache = (apolloClient: any) => {
  try {
    // Clear Apollo Client cache
    apolloClient.cache.reset();
    apolloClient.cache.gc();

    // Clear specific queries
    apolloClient.cache.evict({ fieldName: 'videos' });
    apolloClient.cache.evict({ fieldName: 'annotationsByVideo' });
    apolloClient.cache.evict({ fieldName: 'video' });

    console.log('✅ Apollo cache cleared successfully');
    return true;
  } catch (error) {
    console.error('❌ Error clearing Apollo cache:', error);
    return false;
  }
};

export const clearAllCache = (apolloClient?: any) => {
  console.log('🧹 Clearing all application cache...');

  const browserCleared = clearBrowserCache();
  const apolloCleared = apolloClient ? clearApolloCache(apolloClient) : true;

  if (browserCleared && apolloCleared) {
    console.log('✅ All cache cleared successfully');
    return true;
  } else {
    console.warn('⚠️ Some cache clearing operations failed');
    return false;
  }
};

// Add a global function for manual cache clearing (accessible from browser console)
if (typeof window !== 'undefined') {
  (window as any).clearVideoPlayerCache = () => {
    clearBrowserCache();
    console.log(
      '💡 To clear Apollo cache, use: clearVideoPlayerCacheWithApollo()'
    );
  };

  (window as any).clearVideoPlayerCacheWithApollo = () => {
    // This will be set by the VideoPlayerPage component
    console.log(
      '💡 Apollo cache clearing will be available after the app loads'
    );
  };
}
