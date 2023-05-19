function createFriendCard(friendData) {
  var friendCard = document.createElement('div');
  friendCard.innerHTML = `
    <div class="card rtl mx-auto text-center mb-3" style="max-width: 25rem;">
      ${friendData.profilePic ? `<img class="card-img-top mx-auto mt-3" src="${friendData.profilePic}" alt="Profile Picture" style="max-width: 250px; max-height: 250px;">` : ''}
      <div class="card-body">
        <h5 class="card-title">${friendData.name}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${friendData.email}</h6>
        ${friendData.favoriteGenre ? `<p class="card-text">Favorite Genre: ${friendData.favoriteGenre}</p>` : ''}
        ${friendData.streak && friendData.streak.count > 0 ? `<p class="card-text">Streak: ${friendData.streak.count} 🔥</p>` : ''}
      </div>
    </div>
  `;

  return friendCard;
}

// Process a Firestore friend document, create a friend card, and add it to the "current-friends" section of the page
function processFriendDocument(doc) {
  // Extract friend data from the Firestore document
  var friendData = doc.data();

  // Create a new friend card element using the friend card template and friend data
  var friendCard = createFriendCard(friendData);

  // Add the friend card to the "current-friends" section of the page
  document.getElementById('current-friends').appendChild(friendCard);
}

// Get the user's current friends from Firestore and update the friend information
function updateFriendInformation(userId) {
  var currentFriendsContainer = document.getElementById('current-friends');

  // Remove existing friend cards
  while (currentFriendsContainer.firstChild) {
    currentFriendsContainer.removeChild(currentFriendsContainer.firstChild);
  }

  // Retrieve and append updated friend information
  db.collection('users')
    .doc(userId)
    .collection('friends')
    .get()
    .then(function (querySnapshot) {
      // Loop through the friend documents
      querySnapshot.forEach(function (doc) {
        // Process each friend document and create a friend card
        processFriendDocument(doc);
      });
    })
    .catch(function (error) {
      console.error('Error getting current friends: ', error);
    });
}

// Call the updateFriendInformation function with the user's ID when the page is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Get the user's ID after the Firebase authentication is ready
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      var userId = user.uid;
      updateFriendInformation(userId);
    }
  });
});
