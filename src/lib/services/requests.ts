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
  Timestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { WebsiteRequest, RequestStatus, RequestStage } from '../store/requestStore';

// Helper function to safely convert Firebase Timestamp to milliseconds
function safeTimestampToMillis(timestamp: any): number | undefined {
  if (!timestamp) return undefined;
  
  // Check if it's a Timestamp object with toMillis method
  if (typeof timestamp.toMillis === 'function') {
    return timestamp.toMillis();
  } else if (timestamp._seconds) {
    // Handle serialized Timestamp object
    return timestamp._seconds * 1000;
  } else if (typeof timestamp === 'number') {
    // Use the value directly if it's already a number
    return timestamp;
  }
  return undefined;
}

export const createRequest = async (userId: string, requestData: Partial<WebsiteRequest>) => {
  try {
    const requestRef = await addDoc(collection(db, 'websiteRequests'), {
      ...requestData,
      userId,
      status: 'draft',
      currentStage: 'requirements',
      progress: 0,
      collaboratorIds: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return requestRef.id;
  } catch (error) {
    console.error('Error creating request:', error);
    throw error;
  }
};

export const updateRequest = async (requestId: string, updates: Partial<WebsiteRequest>) => {
  try {
    const requestRef = doc(db, 'websiteRequests', requestId);
    await updateDoc(requestRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error('Error updating request:', error);
    throw error;
  }
};

export const submitRequest = async (requestId: string) => {
  try {
    const requestRef = doc(db, 'websiteRequests', requestId);
    await updateDoc(requestRef, {
      status: 'submitted',
      updatedAt: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error('Error submitting request:', error);
    throw error;
  }
};

export const getRequestById = async (requestId: string): Promise<WebsiteRequest | null> => {
  try {
    const requestRef = doc(db, "websiteRequests", requestId);
    const requestDoc = await getDoc(requestRef);
    
    if (!requestDoc.exists()) {
      return null;
    }
    
    const data = requestDoc.data();
    return {
      id: requestDoc.id,
      title: data.title || "",
      description: data.description || "",
      userId: data.userId || "",
      status: data.status || "draft",
      progress: data.progress || 0,
      createdAt: safeTimestampToMillis(data.createdAt) || Date.now(),
      updatedAt: safeTimestampToMillis(data.updatedAt) || Date.now(),
      assignedAdminId: data.assignedAdminId || "",
      businessName: data.businessName || "",
      businessType: data.businessType || "",
      targetAudience: data.targetAudience,
      budget: data.budget,
      budgetFlexible: data.budgetFlexible,
      deadline: safeTimestampToMillis(data.deadline),
      urgency: data.urgency,
      expectedTimeline: data.expectedTimeline,
      designPreferences: data.designPreferences,
      styleDescription: data.styleDescription,
      additionalDesignNotes: data.additionalDesignNotes,
      functionalRequirements: data.functionalRequirements,
      contentManagement: data.contentManagement,
      userAccounts: data.userAccounts,
      ecommerce: data.ecommerce,
      contactForm: data.contactForm,
      newsletter: data.newsletter,
      blog: data.blog,
      socialMedia: data.socialMedia,
      analytics: data.analytics,
      customFeatures: data.customFeatures,
      collaboratorIds: data.collaboratorIds || []
    };
  } catch (error) {
    console.error("Error getting request:", error);
    throw error;
  }
};

export const getUserRequests = async (userId: string): Promise<WebsiteRequest[]> => {
  try {
    const requestsCollection = collection(db, "websiteRequests");
    const requestsQuery = query(requestsCollection, where("userId", "==", userId));
    const snapshot = await getDocs(requestsQuery);
    
    const requests: WebsiteRequest[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      requests.push({
        id: doc.id,
        title: data.title || "",
        description: data.description || "",
        userId: data.userId || "",
        status: data.status || "draft",
        progress: data.progress || 0,
        createdAt: safeTimestampToMillis(data.createdAt) || Date.now(),
        updatedAt: safeTimestampToMillis(data.updatedAt) || Date.now(),
        assignedAdminId: data.assignedAdminId || "",
        businessName: data.businessName || "",
        businessType: data.businessType || "",
        targetAudience: data.targetAudience,
        budget: data.budget,
        budgetFlexible: data.budgetFlexible,
        deadline: safeTimestampToMillis(data.deadline),
        urgency: data.urgency,
        expectedTimeline: data.expectedTimeline,
        designPreferences: data.designPreferences,
        styleDescription: data.styleDescription,
        additionalDesignNotes: data.additionalDesignNotes,
        functionalRequirements: data.functionalRequirements,
        contentManagement: data.contentManagement,
        userAccounts: data.userAccounts,
        ecommerce: data.ecommerce,
        contactForm: data.contactForm,
        newsletter: data.newsletter,
        blog: data.blog,
        socialMedia: data.socialMedia,
        analytics: data.analytics,
        customFeatures: data.customFeatures,
        collaboratorIds: data.collaboratorIds || []
      });
    });
    
    return requests;
  } catch (error) {
    console.error("Error getting user requests:", error);
    throw error;
  }
};

export const getCollaboratorRequests = async (userId: string): Promise<WebsiteRequest[]> => {
  try {
    const requestsQuery = query(
      collection(db, 'websiteRequests'),
      where('collaboratorIds', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(requestsQuery);
    const requests: WebsiteRequest[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Safely handle deadline
      let deadlineValue = safeTimestampToMillis(data.deadline);
      
      requests.push({
        id: doc.id,
        ...data,
        createdAt: safeTimestampToMillis(data.createdAt) || Date.now(),
        updatedAt: safeTimestampToMillis(data.updatedAt) || Date.now(),
        deadline: deadlineValue,
      } as WebsiteRequest);
    });
    
    return requests;
  } catch (error) {
    console.error('Error getting collaborator requests:', error);
    throw error;
  }
};

export const getAllRequests = async (): Promise<WebsiteRequest[]> => {
  try {
    const requestsQuery = query(
      collection(db, 'websiteRequests'),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(requestsQuery);
    const requests: WebsiteRequest[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Safely handle deadline
      let deadlineValue = safeTimestampToMillis(data.deadline);
      
      requests.push({
        id: doc.id,
        ...data,
        createdAt: safeTimestampToMillis(data.createdAt) || Date.now(),
        updatedAt: safeTimestampToMillis(data.updatedAt) || Date.now(),
        deadline: deadlineValue,
      } as WebsiteRequest);
    });
    
    return requests;
  } catch (error) {
    console.error('Error getting all requests:', error);
    throw error;
  }
};

export const updateRequestStage = async (
  requestId: string, 
  newStage: RequestStage, 
  progress: number
) => {
  try {
    const requestRef = doc(db, 'websiteRequests', requestId);
    await updateDoc(requestRef, {
      currentStage: newStage,
      progress,
      updatedAt: serverTimestamp(),
    });
    
    return true;
  } catch (error) {
    console.error('Error updating request stage:', error);
    throw error;
  }
};

export const addCollaborator = async (requestId: string, collaboratorId: string) => {
  try {
    const requestRef = doc(db, 'websiteRequests', requestId);
    const requestDoc = await getDoc(requestRef);
    
    if (requestDoc.exists()) {
      const data = requestDoc.data();
      const collaborators = data.collaboratorIds || [];
      
      if (!collaborators.includes(collaboratorId)) {
        await updateDoc(requestRef, {
          collaboratorIds: [...collaborators, collaboratorId],
          updatedAt: serverTimestamp(),
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error adding collaborator:', error);
    throw error;
  }
};

export const removeCollaborator = async (requestId: string, collaboratorId: string) => {
  try {
    const requestRef = doc(db, 'websiteRequests', requestId);
    const requestDoc = await getDoc(requestRef);
    
    if (requestDoc.exists()) {
      const data = requestDoc.data();
      const collaborators = data.collaboratorIds || [];
      
      await updateDoc(requestRef, {
        collaboratorIds: collaborators.filter(id => id !== collaboratorId),
        updatedAt: serverTimestamp(),
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error removing collaborator:', error);
    throw error;
  }
};

export const deleteRequest = async (requestId: string) => {
  try {
    await deleteDoc(doc(db, 'websiteRequests', requestId));
    return true;
  } catch (error) {
    console.error('Error deleting request:', error);
    throw error;
  }
}; 