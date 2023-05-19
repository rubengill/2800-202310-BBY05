firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in, show the page content
    document.getElementById("page-content").style.display = "block";
  } else {
    // No user is signed in, redirect to the login page
    window.location.href = "login.html";
  }
});
