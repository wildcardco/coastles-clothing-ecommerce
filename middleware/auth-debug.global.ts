export default defineNuxtRouteMiddleware((to, from) => {
  // Only log auth-related routes
  if (to.path.includes('authentication') || 
      to.path.includes('account') || 
      to.path.includes('challenge') || 
      to.path.includes('oauth') || 
      to.path.includes('login') || 
      to.path.includes('callback')) {
    
    console.log('Auth Debug ----');
    console.log('Route:', {
      to: {
        path: to.path,
        fullPath: to.fullPath,
        query: to.query,
        params: to.params
      },
      from: {
        path: from.path,
        fullPath: from.fullPath
      }
    });
    console.log('Headers:', useRequestHeaders());
    console.log('-------------');
  }
}) 