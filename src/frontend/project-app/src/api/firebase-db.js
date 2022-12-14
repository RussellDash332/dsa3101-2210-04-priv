import { ref, set, child, get, getDatabase, update, onValue, off } from "firebase/database";
// import { database } from "./firebase-config";

const dbRef = ref(getDatabase());

/**
 * Function to initialise a new user in the database
 * @param {String} uid 
 * @param {String} email 
 */
export const storeNewUser = (uid, email) => {
    const db = getDatabase();
    set(ref(db, 'users/' + uid), {
        uid: uid,
        nodeScale: 50,
        availability: false
    })
    .then(() => {
        console.log("user stored in db successfully")
    })
    .catch((error) => {
        console("db error failed to save : ", error)
    })
}

/**
 * Function to store Flow Component state in database under user
 * @param {String} uid 
 * @param {Array} nodes 
 * @param {Array} edges 
 * @param {Function} success 
 */
export const storeUserNodes = (uid, nodes, edges, success) => {
    const db = getDatabase();
    set(ref(db, 'users/' + uid + '/flow'), {
        nodes: nodes,
        edges: edges
    }).then(() => {
        console.log("flow data stored in db successfully")

        return success();
    })
    .catch((error) => {
        console("failed to save flow data ", error)
    })
}

/**
 * Function to retrieve Flow Component state in databse under user
 * @param {String} uid 
 * @param {Function} success 
 */
export const getUserNodes = (uid, success) => {
    get(child(dbRef, `users/${uid}/flow`))
    .then((snapshot) => {

        if (snapshot.exists()) {
            console.log(snapshot.val());
        }

        return success(snapshot.val());
    })
    .catch((error) => {
        console.log(error);
    })
}

/**
 * Function to update node scale value in database under user
 * @param {String} uid 
 * @param {Integer} scale 
 */
export const updateNodeScale = (uid, scale) => {
    const db = getDatabase();

    update(ref(db, 'users/' + uid), {nodeScale: scale})
    .then(() => {console.log("updated node scale successfully");})
    .catch(() => {console.log("failed to update node scale");})
}

/**
 * Function to get node scale value in database under user
 * @param {String} uid 
 * @param {Function} scale 
 */
export const getNodeScale = (uid, success) => {
    get(child(dbRef, `users/${uid}/nodeScale`))
    .then((snapshot) => {

        if (snapshot.exists()) {
            console.log(snapshot.val());
        }

        return success(snapshot.val());
    })
    .catch((error) => {
        console.log(error);
    })
}

export const subscribeCameraLog = (success) => {

    // console.log("listen to camera log");

    const db = getDatabase();
    const cameraLogRef = ref(db, 'camera_log');

    onValue(cameraLogRef, (snapshot) => {
        const logData = snapshot.val();

        console.log("data from db", logData);

        success(logData);
    })
}

/**
 * Function to set user's project availability
 * @param {String} uid 
 * @param {boolean} availability 
 */
export const setUserAvailability = (uid, availability) => {
    const db = getDatabase();

    update(ref(db, 'users/' + uid), {availability: availability})
    .then(() => {console.log("updated availability successfully");})
    .catch(() => {console.log("failed to update availability");})
}

/**
 * Function that listens to user's project availability
 * @param {String} uid 
 * @param {Function} success 
 * @returns 
 */
export const subscribeUserAvailability = (uid, success) => {

    const db = getDatabase();
    const availabilityRef = ref(db, `users/${uid}/availability`);

    onValue(availabilityRef, (snapshot) => {
        const avail = snapshot.val();
        success(avail);
    })
}








export const getUserData = (uid, success) => {
    get(child(dbRef, `users/${uid}`))
    .then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            return success(snapshot)
        }
    })
    .catch((error) => {
        console.log(error);
    })
}