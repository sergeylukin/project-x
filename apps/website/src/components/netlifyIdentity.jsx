import netlifyIdentity from 'netlify-identity-widget';

netlifyIdentity.on('init', (user) => {
  console.log('INIT ANYWAYS');
  if (!user) {
    console.log('SETTING UP INIT');
    netlifyIdentity.on('login', () => {
      console.log('REDIRECTING');
      document.location.href = '/admin/';
    });
  }
});

netlifyIdentity.on('logout', () => console.log('Logged out'));
netlifyIdentity.on('error', (err) => console.error('Error', err));
netlifyIdentity.on('open', () => console.log('Widget opened'));
netlifyIdentity.on('close', () => console.log('Widget closed'));

netlifyIdentity.init({
  // container: '#netlify-modal', // defaults to document.body
  locale: 'en', // defaults to 'en'
});

netlifyIdentity.open(); // open the modal
