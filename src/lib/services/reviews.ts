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
  deleteDoc,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Review {
  id: string;
  requestId: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL?: string;
  stage: string;
  rating: number;  // 1-5 stars
  comment: string;
  createdAt: number;
  updatedAt: number;
}

export const addReview = async (
  requestId: string,
  userId: string,
  userDisplayName: string,
  userPhotoURL: string | null,
  stage: string,
  rating: number,
  comment: string
) => {
  try {
    // Check if user already reviewed this stage
    const existingReviews = await getUserStageReview(requestId, userId, stage);
    
    if (existingReviews.length > 0) {
      // Update existing review instead of creating a new one
      await updateDoc(doc(db, 'reviews', existingReviews[0].id), {
        rating,
        comment,
        updatedAt: serverTimestamp(),
      });
      
      return existingReviews[0].id;
    }
    
    // Create new review
    const reviewRef = await addDoc(collection(db, 'reviews'), {
      requestId,
      userId,
      userDisplayName,
      userPhotoURL,
      stage,
      rating,
      comment,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return reviewRef.id;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

export const updateReview = async (reviewId: string, updates: Partial<Review>) => {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await updateDoc(reviewRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

export const getReviewById = async (reviewId: string): Promise<Review | null> => {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    const reviewSnapshot = await getDoc(reviewRef);
    
    if (reviewSnapshot.exists()) {
      const data = reviewSnapshot.data();
      return {
        id: reviewSnapshot.id,
        ...data,
        createdAt: data.createdAt?.toMillis() || Date.now(),
        updatedAt: data.updatedAt?.toMillis() || Date.now(),
      } as Review;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting review:', error);
    throw error;
  }
};

export const getRequestReviews = async (requestId: string): Promise<Review[]> => {
  try {
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('requestId', '==', requestId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(reviewsQuery);
    const reviewsList: Review[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reviewsList.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toMillis() || Date.now(),
        updatedAt: data.updatedAt?.toMillis() || Date.now(),
      } as Review);
    });
    
    return reviewsList;
  } catch (error) {
    console.error('Error getting request reviews:', error);
    throw error;
  }
};

export const getStageReviews = async (requestId: string, stage: string): Promise<Review[]> => {
  try {
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('requestId', '==', requestId),
      where('stage', '==', stage),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(reviewsQuery);
    const reviewsList: Review[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reviewsList.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toMillis() || Date.now(),
        updatedAt: data.updatedAt?.toMillis() || Date.now(),
      } as Review);
    });
    
    return reviewsList;
  } catch (error) {
    console.error('Error getting stage reviews:', error);
    throw error;
  }
};

export const getUserStageReview = async (
  requestId: string, 
  userId: string, 
  stage: string
): Promise<Review[]> => {
  try {
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('requestId', '==', requestId),
      where('userId', '==', userId),
      where('stage', '==', stage),
      limit(1)
    );
    
    const querySnapshot = await getDocs(reviewsQuery);
    const reviewsList: Review[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      reviewsList.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toMillis() || Date.now(),
        updatedAt: data.updatedAt?.toMillis() || Date.now(),
      } as Review);
    });
    
    return reviewsList;
  } catch (error) {
    console.error('Error getting user stage review:', error);
    throw error;
  }
};

export const deleteReview = async (reviewId: string) => {
  try {
    await deleteDoc(doc(db, 'reviews', reviewId));
    return true;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
}; 