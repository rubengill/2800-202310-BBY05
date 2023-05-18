function logout() {
    firebase.auth().signOut()
      .then(() => {
        console.log('User signed out successfully.');
        window.location.href = '/';
      })
      .catch((error) => {
        console.log('Error signing out:', error);
      });
  }