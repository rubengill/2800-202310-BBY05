function createFriendCard(friendData) {
  var friendCard = document.createElement('div');
  friendCard.innerHTML = `
    <div class="card rtl mx-auto text-center mb-3" style="max-width: 25rem;">
      ${friendData.profilePic ? `<img class="card-img-top mx-auto mt-3" src="${friendData.profilePic}" alt="Profile Picture" style="max-width: 250px; max-height: 250px;">` : ''}
      <div class="card-body">
        <h5 class="card-title">${friendData.name}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${friendData.email}</h6>
        ${friendData.favoriteGenre ? `<p class="card-text favorite-genre">Favorite Genre: ${friendData.favoriteGenre}</p>` : ''}
        ${friendData.streak && friendData.streak.count > 0 ? `<p class="card-text streak">Streak: ${friendData.streak.count} 🔥</p>` : ''}
      </div>
    </div>
  `;

  return friendCard;
}

// Process a Firestore friend document, update the corresponding friend card in the "current-friends" section of the page
function processFriendDocument(change) {
  console.log('Processing friend document change:', change);

  if (change.type === 'added' || change.type === 'modified') {
    // Create a new friend card element using the friend data
    var friendData = change.doc.data();
    console.log('Friend data:', friendData);
    var friendCard = createFriendCard(friendData);

    // Set the ID of the friend card to the document ID
    friendCard.id = change.doc.id;

    if (change.type === 'added') {
      // Add the friend card to the "current-friends" section of the page
      console.log('Adding friend card to the DOM:', friendCard);
      document.getElementById('current-friends').appendChild(friendCard);
    } else if (change.type === 'modified') {
      // Update the friend card with the modified data
      var existingFriendCard = document.getElementById(change.doc.id);
      if (existingFriendCard) {
        // Update the friend's name
        existingFriendCard.querySelector('.card-title').textContent = friendData.name;
        // Update the friend's email
        existingFriendCard.querySelector('.card-subtitle').textContent = friendData.email;

        // Update the favorite genre if available
        var favoriteGenreElement = existingFriendCard.querySelector('.favorite-genre');
        if (favoriteGenreElement) {
          if (friendData.favoriteGenre) {
            favoriteGenreElement.textContent = 'Favorite Genre: ' + friendData.favoriteGenre;
            favoriteGenreElement.style.display = 'block';
          } else {
            favoriteGenreElement.style.display = 'none';
          }
        }

        // Fetch the streak count from the 'streak' subcollection
        db.collection('users')
          .doc(change.doc.id) // Assuming friend's document ID is the same as their user ID
          .collection('streak')
          .doc('streak')
          .get()
          .then(function(streakDoc) {
            if (streakDoc.exists) {
              // Update the streak count if available
              var streakElement = existingFriendCard.querySelector('.streak');
              if (streakElement) {
                var streakCount = streakDoc.data().count || 0;
                if (streakCount > 0) {
                  streakElement.textContent = 'Streak: ' + streakCount + ' 🔥';
                  streakElement.style.display = 'block';
                } else {
                  streakElement.style.display = 'none';
                }
              }
            }
          })
          .catch(function(error) {
            console.error('Error fetching streak data:', error);
          });
      }
    }
  } else if (change.type === 'removed') {
    // Remove friend card from the DOM
    var friendCard = document.getElementById(change.doc.id);
    if (friendCard) {
      friendCard.parentNode.removeChild(friendCard);
    }
  }
}




function updateFriendInformation(userId) {
  var currentFriendsContainer = document.getElementById('current-friends');

  // Remove existing friend cards
  while (currentFriendsContainer.firstChild) {
    currentFriendsContainer.removeChild(currentFriendsContainer.firstChild);
  }

  // Fetch the friend data from Firestore
  db.collection('users')
    .doc(userId)
    .collection('friends')
    .onSnapshot(function (querySnapshot) {
      querySnapshot.docChanges().forEach(function (change) {
        if (change.type === 'added' || change.type === 'modified') {
          // Process each friend document change and update the corresponding friend card
          processFriendDocument(change);
        } else if (change.type === 'removed') {
          // Remove friend card from the DOM
          var friendCard = document.getElementById(change.doc.id);
          if (friendCard) {
            friendCard.parentNode.removeChild(friendCard);
          }
        }
      });
    }, function (error) {
      console.error('Error getting current friends:', error);
    });

  // Update friend documents with the latest information
  db.collection('users')
    .doc(userId)
    .collection('friends')
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        var friendData = doc.data();
        db.collection('users')
          .where('email', '==', friendData.email)
          .get()
          .then(function (userQuerySnapshot) {
            if (!userQuerySnapshot.empty) {
              var userData = userQuerySnapshot.docs[0].data();
              db.collection('users')
                .doc(userId)
                .collection('friends')
                .doc(doc.id)
                .set(userData, { merge: true })  // Update friend document with latest information
                .then(function () {
                  console.log('Friend document updated:', doc.id);
                })
                .catch(function (error) {
                  console.error('Error updating friend document:', error);
                });
            }
          })
          .catch(function (error) {
            console.error('Error getting user data:', error);
          });
      });
    })
    .catch(function (error) {
      console.error('Error getting current friends:', error);
    });
}


// Load friend information when the page is loaded
function loadFriendInformation() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var userId = user.uid;
      updateFriendInformation(userId);
    }
  });
}

// Call the loadFriendInformation function when the page is loaded
window.addEventListener('load', loadFriendInformation);
