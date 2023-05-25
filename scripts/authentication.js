 // Initialize the FirebaseUI Widget using Firebase.
 var ui = new firebaseui.auth.AuthUI(firebase.auth());

 var uiConfig = {
   callbacks: {
     signInSuccessWithAuthResult: function (authResult, redirectUrl) {
       user = authResult.user;
       if (authResult.additionalUserInfo.isNewUser) {
         // For new users, set their initial information
         db.collection("users")
           .doc(user.uid)
           .set({
             name: user.displayName,
             email: user.email,
             score: 0,                     
           })
           .then(function () {
             console.log("New user added to firestore");
 
             // Redirect new users to the questionnaire
             window.location.assign("/questions"); 
           })
           .catch(function (error) {
             console.log("Error adding new user: " + error);
           });
       } else {
         // For existing users, check if they have a skill level
         db.collection('users').doc(user.uid).get()
           .then((doc) => {
             if (doc.exists) {
               const userData = doc.data();
               if (userData.skillLevel) {
                 // If the user has a skillLevel, they have already completed the questionnaire
                 console.log("User has already completed the questionnaire.");
                 // Redirect to main page
                 window.location.assign("/main"); 
               } else {
                 // If the user does not have a skillLevel, redirect them to the questionnaire
                 window.location.assign("/questions");
               }
             } else {
               console.error("No such document!");
             }
           })
           .catch((error) => {
             console.error("Error getting document:", error);
           });
       }
       return false;
     },
     uiShown: function () {
       // The widget is rendered.
       // Hide the loader.
       document.getElementById("loader").style.display = "none";
     },
   },
   // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
   signInFlow: "popup",
   signInSuccessUrl: "/main",
   signInOptions: [
     // Leave the lines as is for the providers you want to offer your users.
     //   firebase.auth.GoogleAuthProvider.PROVIDER_ID,
     //   firebase.auth.FacebookAuthProvider.PROVIDER_ID,
     //   firebase.auth.TwitterAuthProvider.PROVIDER_ID,
     //   firebase.auth.GithubAuthProvider.PROVIDER_ID,
     firebase.auth.EmailAuthProvider.PROVIDER_ID,
     //   firebase.auth.PhoneAuthProvider.PROVIDER_ID
   ],
   // Terms of service url.
   tosUrl: "/tos",
   // Privacy policy url.
   privacyPolicyUrl: "/privacyPolicy",
 };
 
 ui.start("#firebaseui-auth-container", uiConfig);