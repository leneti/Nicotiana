import { db, firebase } from "../config/firebase";
import { uploadImage } from "./ImageUpload";

export const userCreated = (userId, imageUri, name, email) => {
  if (imageUri.startsWith("https") || imageUri === "") {
    addUserToFirestore(userId, imageUri, name, email);
    return;
  }

  uploadImage(userId, imageUri)
    .then((downloadURL) => {
      addUserToFirestore(userId, downloadURL, name, email);
    })
    .catch((err) => {
      console.log(err);
    });
};

const addUserToFirestore = (userId, image, name, email) => {
  db.collection("users")
    .doc(userId)
    .set({
      bio: "",
      created: firebase.firestore.FieldValue.serverTimestamp(),
      followers: 0,
      imageUrl: image,
      name: name,
      postCount: 0,
      rep: 0,
      username: email.substring(0, email.indexOf("@")),
      verified: false,
    });

  db.collection("sensitive-info").doc(userId).set({ email, uptodate: false });

  db.collection("followed")
    .doc(userId)
    .set({
      lastPost: "",
      recentPosts: [],
      followers: [userId],
    });
};
