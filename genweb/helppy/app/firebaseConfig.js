// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, updateDoc, doc, getDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYadgHvdPwgOX5s8bi9bmhmPI6bg2ARso",
  authDomain: "imhelping-cfd7f.firebaseapp.com",
  projectId: "imhelping-cfd7f",
  storageBucket: "imhelping-cfd7f.firebasestorage.app",
  messagingSenderId: "941826146552",
  appId: "1:941826146552:web:9d04b130e9dda698a4bb0d",
  measurementId: "G-SJVBWSZWB1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Function to submit user text (adds `snaps: 0`)
export const submitText = async (text) => {
  try {
    const docRef = await addDoc(collection(db, "userTexts"), {
      text,
      snaps: 0, // Initial snap count
      timestamp: new Date(),
    });
    return docRef.id; // Return document ID
  } catch (error) {
    console.error("Error submitting text:", error);
    return null;
  }
};

// ✅ Function to "snap" a post (like it only once)
export const snapPost = async (postId) => {
    const snapKey = `snapped-${postId}`; // Unique key in local storage
  
    try {
      const postRef = doc(db, "userTexts", postId);
      const postSnap = await getDoc(postRef);
  
      if (postSnap.exists()) {
        let currentSnaps = postSnap.data().snaps || 0;
        let hasSnapped = localStorage.getItem(snapKey); // Check if user snapped
  
        if (hasSnapped) {
          // User is unliking (decrement snap count)
          await updateDoc(postRef, { snaps: Math.max(currentSnaps - 1, 0) }); // Prevent negatives
          localStorage.removeItem(snapKey); // Remove snap tracking
          return "unsnapped"; // Return status
        } else {
          // User is liking (increment snap count)
          await updateDoc(postRef, { snaps: currentSnaps + 1 });
          localStorage.setItem(snapKey, "true"); // Store snap tracking
          return "snapped"; // Return status
        }
      } else {
        console.error("Post does not exist.");
        return false;
      }
    } catch (error) {
      console.error("Error snapping post:", error);
      return false;
    }
  };
// ✅ Export Firebase
export { db };
export default app;