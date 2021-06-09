/*
 *
 * In order to deploy functions
 * run 'nvm use v12' first
 *
 */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const algoliasearch = require("algoliasearch");
const env = functions.config();

admin.initializeApp();

const client = algoliasearch(env.algolia.app, env.algolia.key);
const index = client.initIndex(env.algolia.index);

const db = admin.firestore();

exports.algoliaUsersSync = functions
  .region("europe-west1")
  .firestore.document("/users/{userId}")
  .onWrite(async (change, _context) => {
    const oldData = change.before;
    const newData = change.after;
    const data = newData.data();
    const objectID = newData.id;
    if (!oldData.exists && newData.exists) {
      // New User Created
      return index.saveObject(Object.assign({}, { objectID }, data));
    } else if ((!newData.exists && oldData.exists) || data.name === undefined) {
      // User Deleted
      const remove = admin.firestore.FieldValue.arrayRemove;
      const batch = db.batch();
      const snaps = await db
        .collection("followed")
        .where("followers", "array-contains", objectID)
        .get();
      snaps.forEach((snap) =>
        batch.update(snap.ref, { followers: remove(objectID) })
      );
      batch.delete(db.collection("sensitive-info").doc(objectID));
      batch.delete(db.collection("followed").doc(objectID));
      batch
        .commit()
        .then(() =>
          admin
            .storage()
            .bucket()
            .file(`users/images/avatar/${objectID}`)
            .delete()
        )
        .catch(console.log);
      return index.deleteObject(objectID);
    } else {
      // User Data Updated
      return index.saveObject(Object.assign({}, { objectID }, data));
    }
  });

exports.addFirestoreDataToAlgolia = functions
  .region("europe-west1")
  .https.onRequest((_req, res) => {
    const arr = [];
    admin
      .firestore()
      .collection("users")
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          const { email, ...user } = doc.data();
          user.objectID = doc.id;
          arr.push(user);
        });
        index.saveObjects(arr).then((users) => res.status(200).send(users));
      });
  });

exports.removeUserDataFromAlgolia = functions
  .region("europe-west1")
  .https.onRequest((_req, res) => {
    const arr = [];
    admin
      .firestore()
      .collection("users")
      .get()
      .then((docs) => {
        docs.forEach((doc) => arr.push(doc.id));
        index.deleteObjects(arr).then((users) => res.status(200).send(users));
      });
  });

exports.addPostToFeeds = functions
  .region("europe-west1")
  .firestore.document("/users/{userId}/posts/{postId}")
  .onCreate(async (snapshot, _context) => {
    const post = snapshot.data();
    const followedRef = db.doc(`followed/${post.userUid}`);
    const followedSnap = await followedRef.get();
    const recentPosts = followedSnap.data().recentPosts;
    if (recentPosts.length >= 5) {
      let toDelete = recentPosts[0];
      for (let i = 1; i < recentPosts.length; i++)
        if (recentPosts[i].created < toDelete.created)
          toDelete = recentPosts[i];
      recentPosts.splice(recentPosts.indexOf(toDelete));
    }
    const { flavours, ...postWithoutTags } = post;
    return followedRef.update({
      recentPosts: [postWithoutTags, ...recentPosts],
      lastPost: post.created,
    });
  });

exports.postUpdated = functions
  .region("europe-west1")
  .firestore.document("/users/{userId}/posts/{postId}")
  .onUpdate(async (change, _context) => {
    try {
      const batch = db.batch();
      /* Update the info about the post on the "followed" collection */
      const newData = change.after;
      const post = newData.data();
      const followedRef = db.doc(`followed/${post.userUid}`);
      const snap = await followedRef.get();
      const recentPosts = snap.data().recentPosts;
      for (let i = 0; i < recentPosts.length; i++) {
        if (recentPosts[i].id === post.id) {
          const { flavours, ...postWithoutTags } = post;
          recentPosts.splice(i, 1, postWithoutTags);
          // followedRef.update({ recentPosts }).catch(console.log);
          batch.update(followedRef, { recentPosts });
          break;
        }
      }
      /* Update user rep */
      const oldData = change.before.data();
      const userRef = db.doc(`users/${post.userUid}`);
      const increment = admin.firestore.FieldValue.increment;
      // userRef
      //   .update({ rep: increment(post.likeCount > oldData.likeCount ? 1 : -1) })
      //   .catch(console.log);
      if (post.likeCount !== oldData.likeCount)
        batch.update(userRef, {
          rep: increment(post.likeCount > oldData.likeCount ? 1 : -1),
        });
      batch.commit().catch(console.log);
    } catch (err) {
      console.log(err);
    }
  });

exports.postDeleted = functions
  .region("europe-west1")
  .firestore.document("/users/{userId}/posts/{postId}")
  .onDelete(async (snapshot, _context) => {
    const post = snapshot.data();
    /* Decrement user's post count */
    const userRef = db.collection("users").doc(post.userUid);
    userRef.update({
      postCount: admin.firestore.FieldValue.increment(-1),
    });
    /* Remove the post image from storage if one exists */
    admin
      .storage()
      .bucket()
      .file(`users/images/mixes/${post.userUid}/${post.id}`)
      .delete();
  });

exports.followUser = functions
  .region("europe-west1")
  .firestore.document("/followed/{userId}")
  .onUpdate(async (change, _context) => {
    try {
      const newData = change.after.data();
      const userRef = db.collection("users").doc(change.after.id);
      console.log("Followers: " + newData.followers.length);
      return userRef.update({
        followers: newData.followers.length - 1,
      });
    } catch (err) {
      console.log(err);
    }
  });

exports.refractorPosts = functions
  .region("europe-west1")
  .https.onRequest((_req, res) => {
    const newPostsRef = db
      .collection("users")
      .doc("f9Nzkh9HQ7auCouMHG3UQ2E3Of23")
      .collection("posts");
    const oldPostsRef = db
      .collection("users")
      .doc("TEBsixyPJ4NbuFlOckErZuabd393")
      .collection("posts");

    oldPostsRef
      .get()
      .then((snap) =>
        snap.forEach((post) => newPostsRef.doc(post.id).set(post.data()))
      )
      .then(() => {
        res.status(200).send("Posts refractored");
      })
      .catch(console.log);
    // const postsRef = db.collectionGroup("posts");
    // postsRef
    //   .get()
    //   .then((postsSnap) => {
    //     postsSnap.forEach((postSnap) => {
    //       const postRef = postSnap.ref;
    //       postRef
    //         .update({ likeCount: 0, likedBy: [] })
    //         .then(async () => {
    //           const postData = postSnap.data();
    //           const followedRef = db.doc(`followed/${postData.userUid}`);
    //           const snap = await followedRef.get();
    //           const recentPosts = snap.data().recentPosts;
    //           for (let i = 0; i < recentPosts.length; i++) {
    //             if (recentPosts[i].id === postData.id) {
    //               const { flavours, likedBy, ...postWithoutTags } = postData;
    //               recentPosts.splice(i, 1, postWithoutTags);
    //               followedRef.update({ recentPosts });
    //               break;
    //             }
    //           }
    //         })
    //         .catch(console.log);
    //     });
    //   })
    //   .then(() => {
    //     res.status(200).send("Posts refractored");
    //   })
    //   .catch(console.log);
  });

exports.updateTermsOrPrivacy = functions
  .region("europe-west1")
  .https.onRequest((_req, res) => {
    const sensitiveRef = db.collection("sensitive-info");
    sensitiveRef
      .get()
      .then((snap) => {
        const batch = db.batch();
        snap.forEach((user) => batch.update(user.ref, { uptodate: false }));
        return batch.commit();
      })
      .then(() => {
        res.status(200).send("Users notified of the update");
      })
      .catch(console.log);
  });
