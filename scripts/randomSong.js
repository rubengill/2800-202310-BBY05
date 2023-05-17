async function getRandomSongs() {
    // Get current user's uid
    const uid = firebase.auth().currentUser.uid;

    // Get user's skill level
    const userDoc = await firebase.firestore().collection('users').doc(uid).get();
    if (!userDoc.exists) {
        console.log('No such user!');
        return;
    }
    const userSkillLevel = userDoc.data().skillLevel;

    // Pull random songs, which includes all of the documents fields
    const NUM_SONGS = 5;
    let songs = [];
    for (let i = 0; i < NUM_SONGS; i++) {
        const random = Math.random();
        const songDoc = await firebase.firestore().collection('database')
            .where('Difficulty', '==', userSkillLevel)
            .where('Random', '>=', random)
            .orderBy('Random')
            .limit(1)
            .get();

        if (!songDoc.empty) {
            songs.push(songDoc.docs[0].data());
        }
    }

    return songs;
}