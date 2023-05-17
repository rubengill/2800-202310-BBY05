//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Do something for the user here.
            console.log($('#navbarPlaceholder').load('/template/navAfter.html'));
            console.log($('#footerPlaceholder').load('/template/footer.html'));
        } else {
            // No user is signed in.
            console.log($('#navbarPlaceholder').load('/template/navBefore.html'));
            console.log($('#footerPlaceholder').load('/template/footer.html'));
        }
    });
}
loadSkeleton(); //invoke the function