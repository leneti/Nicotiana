import * as Google from "expo-google-app-auth";
import { firebase } from "../config/firebase";
import { userCreated } from "./NewUserCreated";

export const signInWithGoogleAsync = async () => {
  try {
    const result = await Google.logInAsync({
      androidClientId:
        "386162334155-dm99qnl933tcacgmb9lltveh5nmmqkds.apps.googleusercontent.com",
      iosClientId:
        "386162334155-43q550a5im3tbrgi0auvp7l6v6qslm84.apps.googleusercontent.com",
      scopes: ["profile", "email"],
    });
    if (result.type === "success") {
      onSignIn(result);
      console.log("Successful Google Authentication");
      return result.accessToken;
    } else {
      console.log("Cancelled Google Authentication");
      return { cancelled: true };
    }
  } catch (e) {
    console.log("Google Authentication Error");
    return { error: true };
  }
};

export const reauthWithGoogle = async () => {
  try {
    const result = await Google.logInAsync({
      androidClientId:
        "386162334155-8o64cdkj7kje017ef875pr6u0pisigek.apps.googleusercontent.com",
      iosClientId:
        "386162334155-43q550a5im3tbrgi0auvp7l6v6qslm84.apps.googleusercontent.com",
      scopes: ["profile", "email"],
    });
    if (result.type === "success") {
      return getCredential(result);
    } else {
      return { cancelled: true };
    }
  } catch (e) {
    return { error: "Could not sign in with Google" };
  }
};

const isUserEqual = (googleUser, firebaseUser) => {
  if (firebaseUser) {
    var providerData = firebaseUser.providerData;
    for (var i = 0; i < providerData.length; i++) {
      if (
        providerData[i].providerId ===
          firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
        providerData[i].uid === googleUser.getBasicProfile().getId()
      ) {
        // We don't need to reauth the Firebase connection.
        return true;
      }
    }
  }
  return false;
};

const onSignIn = (googleUser) => {
  var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
    unsubscribe();
    if (!isUserEqual(googleUser, firebaseUser)) {
      var credential = firebase.auth.GoogleAuthProvider.credential(
        googleUser.idToken,
        googleUser.accessToken
      );
      firebase
        .auth()
        .signInWithCredential(credential)
        .then((result) => {
          if (result.additionalUserInfo.isNewUser)
            userCreated(
              result.user.uid,
              result.user.photoURL,
              result.user.displayName,
              result.user.email
            );
        })
        .catch(console.log);
    } else {
      console.log("User is already signed-in.");
    }
  });
};

const getCredential = (googleUser) => {
  return firebase.auth.GoogleAuthProvider.credential(
    googleUser.idToken,
    googleUser.accessToken
  );
};
