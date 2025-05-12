import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { Feedback } from "../types/database";
import { Timestamp } from "firebase/firestore";

export type FeedbackType = 'change_request' | 'comment';

export interface Feedback {
  id: string;
  requestId: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string;
  stage: string;
  text: string;
  type: FeedbackType;
  addressed: boolean;
  createdAt: number;
  updatedAt: number;
}

interface FeedbackInput {
  requestId: string;
  userId: string;
  userDisplayName: string;
  content: string;
}

export const addFeedback = async (feedback: FeedbackInput): Promise<Feedback> => {
  try {
    const feedbackCollection = collection(db, "feedback");
    const timestamp = Date.now();
    
    const feedbackData = {
      ...feedback,
      createdAt: Timestamp.fromMillis(timestamp)
    };
    
    const docRef = await addDoc(feedbackCollection, feedbackData);
    
    return {
      id: docRef.id,
      ...feedback,
      createdAt: timestamp
    };
  } catch (error) {
    console.error("Error adding feedback:", error);
    throw error;
  }
};

export const updateFeedback = async (feedbackId: string, updates: Partial<Feedback>) => {
  try {
    const feedbackRef = doc(db, 'feedback', feedbackId);
    await updateDoc(feedbackRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error('Error updating feedback:', error);
    throw error;
  }
};

export const markFeedbackAsAddressed = async (feedbackId: string) => {
  try {
    const feedbackRef = doc(db, 'feedback', feedbackId);
    await updateDoc(feedbackRef, {
      addressed: true,
      updatedAt: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error('Error marking feedback as addressed:', error);
    throw error;
  }
};

export const getFeedbackById = async (feedbackId: string): Promise<Feedback | null> => {
  try {
    const feedbackRef = doc(db, 'feedback', feedbackId);
    const feedbackSnapshot = await getDoc(feedbackRef);
    
    if (feedbackSnapshot.exists()) {
      const data = feedbackSnapshot.data();
      return {
        id: feedbackSnapshot.id,
        ...data,
        createdAt: data.createdAt?.toMillis() || Date.now(),
        updatedAt: data.updatedAt?.toMillis() || Date.now(),
      } as Feedback;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting feedback:', error);
    throw error;
  }
};

/**
 * Get feedback for a request
 */
export const getRequestFeedback = async (requestId: string): Promise<Feedback[]> => {
  try {
    const feedbackCollection = collection(db, "feedback");
    const feedbackQuery = query(feedbackCollection, where("requestId", "==", requestId));
    const snapshot = await getDocs(feedbackQuery);
    
    const feedback: Feedback[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      feedback.push({
        id: doc.id,
        requestId: data.requestId,
        userId: data.userId,
        userDisplayName: data.userDisplayName,
        content: data.content,
        createdAt: data.createdAt?.toMillis() || Date.now()
      });
    });
    
    return feedback.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Error getting feedback:", error);
    throw error;
  }
};

export const getStageFeedback = async (requestId: string, stage: string): Promise<Feedback[]> => {
  try {
    const feedbackQuery = query(
      collection(db, 'feedback'),
      where('requestId', '==', requestId),
      where('stage', '==', stage),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(feedbackQuery);
    const feedbackList: Feedback[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      feedbackList.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toMillis() || Date.now(),
        updatedAt: data.updatedAt?.toMillis() || Date.now(),
      } as Feedback);
    });
    
    return feedbackList;
  } catch (error) {
    console.error('Error getting stage feedback:', error);
    throw error;
  }
};

export const deleteFeedback = async (feedbackId: string) => {
  try {
    await deleteDoc(doc(db, 'feedback', feedbackId));
    return true;
  } catch (error) {
    console.error('Error deleting feedback:', error);
    throw error;
  }
};

/**
 * Add feedback to a request
 */
export const addRequestFeedback = async (
  requestId: string,
  userId: string,
  userDisplayName: string,
  content: string,
  isAdmin: boolean
): Promise<Feedback> => {
  try {
    const feedbackCollection = collection(db, "feedback");
    
    const feedbackData = {
      requestId,
      userId,
      userDisplayName,
      text: content,
      isAdmin,
      createdAt: Timestamp.now(),
    };
    
    const docRef = await addDoc(feedbackCollection, feedbackData);
    
    return {
      id: docRef.id,
      requestId,
      userId,
      userDisplayName,
      content,
      createdAt: Date.now(),
      isAdmin,
    };
  } catch (error) {
    console.error("Error adding feedback:", error);
    throw new Error("Failed to add feedback");
  }
}; 