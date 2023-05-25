// Remove a friend from Firestore
function removeFriend(userId, friendId) {
  // Create the confirmation card
  var confirmationCard = createConfirmationCard();

  // Display the confirmation card
  var container = document.getElementById('confirmation-container');
  container.innerHTML = '';
  container.appendChild(confirmationCard);

  // Add event listeners to the confirmation buttons
  var confirmButton = document.getElementById('confirm-remove-friend');
  confirmButton.addEventListener('click', function() {
    // Remove the friend if confirmed
    db.collection('users')
      .doc(userId)
      .collection('friends')
      .doc(friendId)
      .delete()
      .then(function() {
        // console.log('Friend removed:', friendId);
        // Hide the confirmation card
        container.innerHTML = '';
      })
      .catch(function(error) {
        console.error('Error removing friend:', error);
        // Hide the confirmation card
        container.innerHTML = '';
      });
  });

  var cancelButton = document.getElementById('cancel-remove-friend');
  cancelButton.addEventListener('click', function() {
    // Hide the confirmation card if canceled
    container.innerHTML = '';
  });
}

// Create a confirmation card element
function createConfirmationCard() {
  var confirmationCard = document.createElement('div');
  confirmationCard.className = 'confirmation-card';

  confirmationCard.innerHTML = `
    <div class="card rtl mx-auto text-center mb-3" style="max-width: 25rem;">
      <div class="card-body">
        <h5 class="card-title">Remove Friend</h5>
        <p class="card-text">Are you sure you want to remove this friend?</p>
        <div class="btn-group" role="group">
          <button id="confirm-remove-friend" class="btn btn-danger">Confirm</button>
          <button id="cancel-remove-friend" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  `;

  return confirmationCard;
}

// Create a friend card element using the friend data
function createFriendCard(friendData) {
  var friendCard = document.createElement('div');
  friendCard.innerHTML = `
    <div class="card rtl mx-auto text-center mb-3" style="max-width: 25rem;">
      ${friendData.profilePic ? `<img class="card-img-top mx-auto mt-3" src="${friendData.profilePic}" alt="Profile Picture" style="max-width: 250px; max-height: 250px;">` : ''}
      <div class="card-body">
        <h5 class="card-title">${friendData.name}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${friendData.email}</h6>
        ${friendData.favoriteGenre ? `<p class="card-text favorite-genre">Favorite Genre: ${friendData.favoriteGenre}</p>` : ''}
        <button class="btn btn-danger remove-friend-btn" data-friend-id="${friendData.friendId}">Remove Friend</button>
      </div>
    </div>
  `;

  return friendCard;
}

// Process a Firestore friend document, update the corresponding friend card in the "current-friends" section of the page
function processFriendDocument(change, userId) {
  // console.log('Processing friend document change:', change);

  if (change.type === 'added' || change.type === 'modified') {
    // Create a new friend card element using the friend data
    var friendData = change.doc.data();
    friendData.friendId = change.doc.id;
    var friendCard = createFriendCard(friendData);

    // Append the friend card to the "current-friends" section
    var currentFriendsContainer = document.getElementById('current-friends');
    currentFriendsContainer.appendChild(friendCard);
  } else if (change.type === 'removed') {
    // Remove the friend card from the "current-friends" section
    var removedFriendId = change.doc.id;
    var removedFriendCard = document.querySelector(`.remove-friend-btn[data-friend-id="${removedFriendId}"]`).closest('.card');
    removedFriendCard.remove();
  }
}

// Update the friend information on the page
function updateFriendInformation(userId) {
  // Listen for friend document changes in Firestore
  db.collection('users')
    .doc(userId)
    .collection('friends')
    .onSnapshot(function(snapshot) {
      snapshot.docChanges().forEach(function(change) {
        processFriendDocument(change, userId);
      });
    });

  // Attach event listener to remove friend buttons
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-friend-btn')) {
      var friendId = event.target.dataset.friendId;
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var userId = user.uid;
          removeFriend(userId, friendId);
        }
      });
    }
  });
}

// Get the current user's ID and update the friend information
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    var userId = user.uid;
    updateFriendInformation(userId);
  }
});
