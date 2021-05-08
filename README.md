# Weekly Logs
### Sem 2 Week 10
Mostly finished writing the report
### Sem 2 Week 9
Fixed issues relating to the public version of the app, published the Early Access version of the app on the Google Play Store, presented the demo, wrote most of the report
### Easter Holiday
Added a Privacy Notice, Terms and Conditions page and a Settings screen. Made it possible for users to deactivate their accounts and delete stored data.
### Sem 2 Week 8
Users can now visit other users' profiles from the feed screen. Changed how following users is dealt with (so as to not overflow the database with queries). 
### Sem 2 Week 7
Posts can now be liked/disliked. This also contributes to a user's "reputation". In the future I might introduce some sort of a reward system for achieving certain levels of reputation.
### Sem 2 Week 6
Made it possible to edit own posts. Fixed a few bugs with follower counts, cloud functions and user permissions.
### Sem 2 Week 5
Implemented the mix search tab, fully completing the search page. Saved posts have now got "tags" to filter search queries by.
### Sem 2 Week 4
Wrote web scraping scripts in Python to gather tobacco flavours sold be some of the world's most well known brands. Edited the way in which tobaccos are added when reviewing mixes. 
### Sem 2 Week 3
Finished the "Edit Profile" screen, fixed a bug with Firestore permissions not letting users view the feed, added the possibility to delete owned posts and report the posts of others.  
Started writing the project report.
### Sem 2 Week 2
Fixed the 'back' button taking a few clicks to trigger by introducing a new header.  
Started working on making the app run as efficiently as possible.  
Learnt that in order to improve performance of a RN app, you have to use as few arrow functions in the 'render' method as possible.  
Users are now able to upload pictures from their camera rolls or taken from the app. Reworked the "Post" screen, fixed an issue where on iOS the keyboard would overlap the text input fields.  
Edited the loading view of the Feed and Profile screens.  
### Sem 2 Week 1
Made feed/profile page refreshing smoother. Implemented user-following, refractored firestore to store posts in a subcollection under user documents. 
### Christmas Holiday
Added a "Verified User" status. Added the user's posts to the profile section. Edited the user data saved on Firestore.  
Edited what data is saved when posting reviews. Fixed poor post ordering in the feed and profile tabs.  
Added pull-to-refresh function for post lists. Made it possible to open posts and see them in more detail.  
Wrote a few Cloud Functions that would synchronise the user data saved on Firestore with Algolia's search engine.  
After a lot of research, decided on a database model that would be relatively efficient, cost-effective and scalable (with potentially millions of users, posts etc.).  
Added image-uploading functionality, users can now select profile pictures when signing up. Posts now counted in the user firestore document.  
Slightly changed the look of buttons, tidied up the welcome screen.  
Separated sensitive information (emails) from user documents to sensitive-info documents.  
Implemented user search using Algolia's search engine.  
Edited Firestore's rules to enhance data security.
### Week 11
Pretty much finished the feed screen, so posts are now saved on the database and neatly presented on the devices. Implemented someone else's technique for lazy post loading (credited them in the comments in the code).
### Week 10
Started working on the post feed tab. Learnt how to make queries to the online database and retrieve posts, but before I could complete everything I unexpectedly ran into some issues with my machine so currently working on solving them.
### Week 9
Finished up the Post screen and now submitted posts are saved on the cloud database. Reformatted the code for user authentication, so that logging in and out would be smoother and this also fixed a few React warnings. Prepared a short presentation of what I've done so far for the inspection.
### Week 8
Learnt about Flatlists, how to programatically show/hide components, present optional arguments to functions, create custom rating bars, have dynamic arrays. Enabled personal email and password signup and login and started working on the Post tab.
### Week 7
Worked towards connecting the app to a cloud-based database. Started with the idea of MongoDB's Realm, but decided to go with Google's Firebase for more intuitive UI and somewhat more documentation online. Users can now register/login using their Google accounts and the first time they do, their emails, as well as the account creation date, are saved onto Firestore, Firebases's cloud storage.
### Week 6:
Started implementing the design into an actual front-end of the application. So far I only have the first couple of screens as I'm trying to make everything work on both Android and iOS so I wouldn't continue with a flawed workflow. This is proving to be difficult as apparently my issues are quite niche and naturally my friends aren't always able to help with iOS testing, so I've just been experimenting with different code implementations.
### Week 5:
Using Photoshop and Adobe XD made the design for the whole app. Drew everything myself, but got some inspiration from other people's app design sketches on Pinterest and talked to some friends and asked for their input/opinion. I will stick with the design unless some adjustments have to be made in the future due to some issues or expandability.
### Week 4:
Started working on a cross-platform mobile application that would work on both iOS and Android Operating Systems. Followed some tutorials on Youtube to better my understanding of developing with the React Native tool, how to test and debug the app etc. Did some research into how I could go about publishing my app in the future.
### Week 3:
Decided I would try and see if I it was feasible to develop a mobile app using the Functional Haskell language, but after reading discussions on StackOverflow, Reddit, watching videos of people that have attempted to integrate Haskell into their app development, checking out other people's Haskell projects and trying to contact a small company that produces Haskell applications (Keera Studios) I concluded that I would most likely either not finish in time, not be satisfied with my project or not have a complete product at all.
### Week 2:
Researched different ways of making mobile applications.
### Week 1:
Started thinking in depth about what kind of project I want to do.



# Sources:
### Sem 2 Week 8
*[Privacy Policy Generator](https://www.freeprivacypolicy.com)*
*[Terms and Conditions Generator](https://www.websitepolicies.com)*
### Sem 2 Week 7
### Sem 2 Week 6
### Sem 2 Week 5
### Sem 2 Week 4
### Sem 2 Week 3
### Sem 2 Week 2
### Sem 2 Week 1
### Christmas Holiday
*[Follower Feed Idea (Paid content)](https://fireship.io/courses/firestore-data-modeling/models-social-feed/)*
### Week 11
*[Infinite Scroll idea for the feed](https://github.com/jefelewis/react-native-infinite-scroll-demo)*
### Week 10
### Week 9
### Week 8
### Week 7
*[Example project using firebase](https://github.com/nathvarun/Expo-Google-Login-Firebase/tree/master)*  
*[Docs on adding data to Firebase's Firestore](https://firebase.google.com/docs/firestore/manage-data/add-data)*  
*[Building Your First Mobile App with MongoDB Realm + AMA | Twitch Live Coding](https://www.youtube.com/watch?v=UVcW8tT25Rw)*  
*[MongoDB tutorial on setting up their Realm database](https://docs.mongodb.com/realm/tutorial/react-native/)*  
*[Tutorial on setting up Google Authentification with Firebase](https://www.youtube.com/watch?v=ZcaQJoXY-3Q)*  
*[Blog post that helped me understand React Native's Functional and Class components](https://www.twilio.com/blog/react-choose-functional-components)*  
### Week 6
### Week 5
*[The App Design](https://git-teaching.cs.bham.ac.uk/mod-ug-proj-2020/dxg857/-/tree/master/design)*  
### Week 4
*[React Native Tutorial by Mosh](https://www.youtube.com/watch?v=0-S5a0eXPoc)*  
*[React Native API docs](https://reactnative.dev/docs/accessibilityinfo)*  
*[First compiling version of an app published on Expo](https://expo.io/@rummeris/projects/Nicotiana_v1_1)*  
### Week 3
*[Talk: Building Android apps with Haskell](https://medium.com/@zw3rk/talk-building-android-apps-with-haskell-45f6de51f533)*  
*[haskell.sg - January 2018 - building Android apps with haskell](https://www.youtube.com/watch?v=xTYtxfaa8ig)*  
*[Haskell breakout game "Haskanoid" by ivanperez-keera](https://github.com/ivanperez-keera/haskanoid)*  
*[Android Haskell Activity by neurocyte](https://github.com/neurocyte/android-haskell-activity)*  
*["Haskell on Android using Eta" by Brian McKenna](https://brianmckenna.org/blog/eta_android)*  
*[Keera Studios](https://keera.co.uk/2017/06/01/haskell-android-ios/)*  
### Week 2
### Week 1

# Notes
sudo npm install --unsafe-perm  
pod install --repo-update  
// Make sure .expo is not owned by "root"  
// To deploy functions run 'nvm use v12'  
// To use ESlint again put this in the firebase.json file   
// "predeploy": [  
//    "npm --prefix \"$RESOURCE_DIR\" run lint"  
//  ]  
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

## Development Preparation
sudo apt install curl  
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash  
nvm install node  
sudo apt install git  
git clone https://git-teaching.cs.bham.ac.uk/mod-ug-proj-2020/dxg857.git  
cd dxg857  
sudo npm i -g expo-cli  
npm install  
npm start  
//sudo snap install --classic code  
// code .  

## VS Code Extensions
\#region folding for VS Code  
IntelliJ IDEA Keybindings  
Prettier - Code formatter  
React Native Tools  
React-Native/React/Redux snippets for es6/es7  
