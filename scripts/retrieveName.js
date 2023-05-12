function insertNameFromFirestore(){
  // to check if the user is logged in:
  firebase.auth().onAuthStateChanged(user =>{
      if (user){
         console.log(user.uid); // let me to know who is the user that logged in to get the UID
         currentUser= db.collection("users").doc(user.uid);
         currentUser.get().then(userDoc=>{
             //get the user name
             const userNameElement = document.getElementById("user-name");
              userNameElement.textContent = userDoc.data().name;


         })    
     }    
  })
}
insertNameFromFirestore();
