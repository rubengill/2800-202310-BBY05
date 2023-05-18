function handleEvent(event) {
    event.preventDefault();
  }
  
  // Get search query from input field
  function getSearchQuery() {
    return document.getElementById('search-input').value;
  }
  
  // Clear previous search results
  function clearSearchResults() {
    document.getElementById('search-results').innerHTML = '';
  }
  
  // Add email card to search results
  function addEmailCardToResults(userCard) {
    document.getElementById('search-results').appendChild(userCard);
  }
  
  // Create a new email card
  function createEmailCard(userData) {
    var userCard = document.createElement('div');
    userCard.innerHTML = `
      <div class="card rtl mx-auto text-center mb-3" style="max-width: 25rem;">
        ${userData.profilePic ? `<img class="card-img-top mx-auto mt-3" src="${userData.profilePic}" alt="Profile Picture" style="max-width: 250px; max-height: 250px;">` : ''}
        <div class="card-body">
          <h5 class="card-title">${userData.name}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${userData.email}</h6>
          <p class="card-text">${userData.message}</p>
          <button class="btn btn-success add-friend-button">Add Friend</button>
        </div>
      </div>
    `;
  
    return userCard;
  }
  
  // Check if a friend has already been added
  function checkFriendAlreadyAdded(friendEmail, userId, callback) {
    db.collection('users')
      .doc(userId)
      .collection('friends')
      .where('email', '==', friendEmail)
      .get()
      .then(function (querySnapshot) {
        callback(querySnapshot.empty);
      });
  }
  
  // Add a friend to Firestore subcollection
// Add a friend to Firestore subcollection
function addFriendToFirestore(friendData, userId, streakData, successCallback, errorCallback) {
  const { profilePic, ...dataWithoutPic } = friendData;
  const friendDataWithPic = {
    ...dataWithoutPic,
    profilePic: profilePic || '', // Use an empty string as default if profilePic is undefined
    streak: streakData // Add the streak information to the friend document
  };

  db.collection('users')
    .doc(userId)
    .collection('friends')
    .add(friendDataWithPic)
    .then(successCallback)
    .catch(errorCallback);
}


  
  // Set up the "Add Friend" button by adding appropriate event listeners and
  // modifying the button text and state based on whether the friend has already been added
  function setupAddFriendButton(addFriendButton, friendData, userId, streakData) {
    // Check if the friend has already been added to the user's friend list
    checkFriendAlreadyAdded(friendData.email, userId, function (isFriendNotAdded) {
      // If the friend has not been added yet
      if (isFriendNotAdded) {
        // Add a click event listener to the "Add Friend" button
        addFriendButton.addEventListener('click', function (event) {
          // Prevent default button behavior, such as form submission
          handleEvent(event);
  
          // Add the friend to the current user's Firestore friends collection
          addFriendToFirestore(
            friendData,
            userId,
            streakData, // Pass the streak data along with the friend data
            // Success callback function for adding the friend
            function (docRef) {
              console.log('Friend added successfully!');
              addFriendButton.textContent = 'Added';
              addFriendButton.disabled = true;
            },
            // Error callback function for adding the friend
            function (error) {
              console.error('Error adding friend: ', error);
            }
          );
        });
      } else {
        // If the friend has already been added, disable the "Add Friend" button and change the text
        addFriendButton.disabled = true;
        addFriendButton.textContent = 'Friend added';
      }
    });
  }
  
  // Process a Firestore user document, create a friend card, set up the "Add Friend" button,
  // and add the friend card to the search results section of the page
  function processUserDocument(doc, emailHtml, userId) {
    // Extract user data from the Firestore document
    var userData = doc.data();
  
    // Create a new user card element using the email card template and user data
    var userCard = createEmailCard(userData);
  
    // Set user card content
    userCard.querySelector('.card-title').textContent = userData.name;
    userCard.querySelector('.card-subtitle').textContent = userData.email;
    userCard.querySelector('.card-text').textContent = 'Favorite Genre: ' + userData.favoriteGenre;
  
    // Set profile picture if available
    if (userData.profilePic) {
      userCard.querySelector('.card-img-top').setAttribute('src', userData.profilePic);
    }
  
    // Get the "Add Friend" button element within the user card
    var addFriendButton = userCard.querySelector('.add-friend-button');
  
    // Create a friend data object with the friend's email address, name, favorite genre, and profile picture
    var friendData = {
      email: userData.email,
      name: userData.name,
      favoriteGenre: userData.favoriteGenre,
      profilePic: userData.profilePic || '', // Use an empty string as default if profilePic is undefined
    };
  
    // Create a streak data object with the friend's streak count
    var streakData = {
      count: userData.streak ? userData.streak.count : 0 // Set the initial streak count to 0 if it doesn't exist
    };
  
    // Set up the "Add Friend" button with the friend data, current user ID, and streak data
    setupAddFriendButton(addFriendButton, friendData, userId, streakData);
  
    // Add the newly created user card to the search results section of the page
    addEmailCardToResults(userCard);
  }
  
// Searches Firestore to check if friend is added, if not add them
function addFriends(event) {
  // Prevent default form behavior
  event.preventDefault();

  // Get the user's search query from the input field
  var searchQuery = getSearchQuery();

  // Clear any previous search results displayed on the page
  clearSearchResults();

  // Get the current user's Firestore document ID
  var currentUserId = firebase.auth().currentUser.uid;

  // Search Firestore for users with email addresses containing the search query
  db.collection('users')
    .where('email', '>=', searchQuery.toLowerCase())
    .where('email', '<=', searchQuery.toLowerCase() + '\uf8ff')
    .get()
    .then(function (querySnapshot) {
      // Loop through the Firestore documents with matching email addresses
      querySnapshot.forEach(function (doc) {
        // Exclude the current user's document from the search results
        if (doc.id !== currentUserId) {
          // Process each user document and create a friend card
          processUserDocument(doc, createEmailCard(doc.data()), currentUserId);
        }
      });

      // Handle the case where no users match the search query
      if (querySnapshot.empty) {
        var noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = 'No users found';
        document.getElementById('search-results').appendChild(noResultsMessage);
      }
    });
}

  
