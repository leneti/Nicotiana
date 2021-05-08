import { firebase } from "../config/firebase";

/**
 * When provided with an image uri, converts it to a Blob and uploads the image to Google's Firebase Storage.
 * @param {string} userId The uid of the current user. The uploaded image's path on Firebase Storage will include this id.
 * @param {string} imageUri The uri of the image to be converted to a blob and uploaded.
 * @param args (Optional) If provided, at least two arguments are expected - the purpose ("post") and the postID.
 * @returns A Promise for the completion of the upload and the URL the image is available at.
 */
export const uploadImage = (userId, imageUri, ...args) => {
  return new Promise((resolve, reject) => {
    if (imageUri === "") {
      console.log("Image not provided, resolving empty string")
      return resolve("");
    }
    let storagePath = "";
    switch (args[0]) {
      case "post": {
        storagePath = `users/images/mixes/${userId}/${args[1]}`;
        break;
      }
      default: {
        storagePath = `users/images/avatar/${userId}`;
        break;
      }
    }
    const storageRef = firebase.storage().ref(storagePath);

    uriToBlob(imageUri)
      .then((blob) => {
        return uploadImageToFirebase(blob, storageRef);
      })
      .then(() => {
        console.log("Image uploaded");
        storageRef.getDownloadURL().then((downloadURL) => {
          console.log("File available at: ", downloadURL);
          resolve(downloadURL);
        });
      })
      .catch(reject);
  });
};

const uriToBlob = (uri) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      // return the blob
      resolve(xhr.response);
    };

    xhr.onerror = () => {
      // something went wrong
      reject(new Error("uriToBlob failed"));
    }; // this helps us get a blob
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);

    xhr.send(null);
  });
};

const uploadImageToFirebase = (blob, storageRef) => {
  return new Promise((resolve, reject) => {
    storageRef
      .put(blob, {
        contentType: "image/jpeg",
      })
      .then((snapshot) => {
        blob.close();
        resolve(snapshot);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
