//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
const logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", logout);
function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.href = "../login.html";
      // Sign-out successful.
      console.log("logging out user");
    })
    .catch((error) => {
      // An error happened.
    });
}
