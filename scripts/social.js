function createEmailCard(userData) {
    var userCard = document.createElement('div');
    userCard.innerHTML = `
      <div class="card rtl text-center" style="max-width: 18rem;">
        ${userData.profilePic ? `<img class="card-img-top mx-auto" src="${userData.profilePic}" alt="Profile Picture" style="max-width: 250px; max-height: 250px;">` : ''}
        <div class="card-body">
          <h5 class="card-title">${userData.name}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${userData.email}</h6>
          <p class="card-text">${userData.message}</p>
        </div>
      </div>
    `;
  
    return userCard;
  }

// Get the user's current friends from Firestore
function getCurrentFriends(userId) {
    db.collection('users')
      .doc(userId)
      .collection('friends')
      .get()
      .then(function (querySnapshot) {
        // Loop through the friend documents
        querySnapshot.forEach(function (doc) {
          // Process each friend document and create a friend card
          processFriendDocument(doc);
          console.log("Friends loaded.")
        });
      })
      .catch(function (error) {
        console.error('Error getting current friends: ', error);
      });
  }
  
  // Process a Firestore friend document and create a friend card
  function processFriendDocument(doc) {
    // Extract friend data from the Firestore document
    var friendData = doc.data();
  
    // Create a new friend card element using the email card template and friend data
    var friendCard = createEmailCard(friendData);
  
    // Set friend card content
    friendCard.querySelector('.card-title').textContent = friendData.name;
    friendCard.querySelector('.card-subtitle').textContent = friendData.email;
    friendCard.querySelector('.card-text').textContent = 'Favorite Genre: ' + friendData.favoriteGenre;
  
    // Set profile picture if available
    if (friendData.profilePic) {
      friendCard.querySelector('.card-img-top').setAttribute('src', friendData.profilePic);
    }
  
    // Add the friend card to the "current-friends" section of the page
    document.getElementById('current-friends').appendChild(friendCard);
  }
  
  // Call the getCurrentFriends function with the user's ID when the page is loaded
  document.addEventListener('DOMContentLoaded', function () {
    // Get the user's ID after the Firebase authentication is ready
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        var userId = user.uid;
        getCurrentFriends(userId);
        console.log("loaded correctly.");
      }
    });
  });
  