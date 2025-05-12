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
  limit,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { Notification } from '../store/notificationStore';

export const createNotification = async (
  userId: string,
  title: string,
  body: string,
  link?: string
) => {
  try {
    const notificationRef = await addDoc(collection(db, 'notifications'), {
      userId,
      title,
      body,
      link,
      read: false,
      createdAt: serverTimestamp(),
    });
    
    return notificationRef.id;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    await updateDoc(notificationRef, {
      read: true,
    });
    
    return true;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    
    const querySnapshot = await getDocs(notificationsQuery);
    
    const updatePromises = querySnapshot.docs.map(doc => 
      updateDoc(doc.ref, { read: true })
    );
    
    await Promise.all(updatePromises);
    
    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const getNotificationById = async (notificationId: string): Promise<Notification | null> => {
  try {
    const notificationRef = doc(db, 'notifications', notificationId);
    const notificationSnapshot = await getDoc(notificationRef);
    
    if (notificationSnapshot.exists()) {
      const data = notificationSnapshot.data();
      return {
        id: notificationSnapshot.id,
        ...data,
        createdAt: data.createdAt?.toMillis() || Date.now(),
      } as Notification;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting notification:', error);
    throw error;
  }
};

export const getUserNotifications = async (userId: string, limit?: number): Promise<Notification[]> => {
  try {
    let notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    if (limit) {
      notificationsQuery = query(notificationsQuery, limit);
    }
    
    const querySnapshot = await getDocs(notificationsQuery);
    const notificationsList: Notification[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      notificationsList.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toMillis() || Date.now(),
      } as Notification);
    });
    
    return notificationsList;
  } catch (error) {
    console.error('Error getting user notifications:', error);
    throw error;
  }
};

export const getUnreadNotificationsCount = async (userId: string): Promise<number> => {
  try {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    
    const querySnapshot = await getDocs(notificationsQuery);
    
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting unread notifications count:', error);
    throw error;
  }
};

export const deleteNotification = async (notificationId: string) => {
  try {
    await deleteDoc(doc(db, 'notifications', notificationId));
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

// Helper function to create request stage update notification
export const createStageUpdateNotification = async (
  userId: string,
  requestId: string,
  requestTitle: string,
  stage: string
) => {
  try {
    return await createNotification(
      userId,
      'Stage Update',
      `Your request "${requestTitle}" has moved to the ${stage} stage.`,
      `/requests/${requestId}`
    );
  } catch (error) {
    console.error('Error creating stage update notification:', error);
    throw error;
  }
};

// Helper function to create feedback notification
export const createFeedbackNotification = async (
  userId: string,
  requestId: string,
  requestTitle: string,
  userDisplayName: string
) => {
  try {
    return await createNotification(
      userId,
      'New Feedback',
      `${userDisplayName} left feedback on your request "${requestTitle}".`,
      `/requests/${requestId}/feedback`
    );
  } catch (error) {
    console.error('Error creating feedback notification:', error);
    throw error;
  }
};

// Helper function to create payment notification
export const createPaymentNotification = async (
  userId: string,
  requestId: string,
  requestTitle: string,
  paymentType: string,
  status: string
) => {
  try {
    return await createNotification(
      userId,
      'Payment Update',
      `Your ${paymentType} payment for "${requestTitle}" has been ${status}.`,
      `/requests/${requestId}/payments`
    );
  } catch (error) {
    console.error('Error creating payment notification:', error);
    throw error;
  }
}; 