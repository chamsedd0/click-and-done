import { db } from "../firebase";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { WebsiteRequest } from "../types/database";

/**
 * Get all website requests from the database
 */
export const getAllRequests = async (): Promise<WebsiteRequest[]> => {
  try {
    const requestsCollection = collection(db, "websiteRequests");
    const snapshot = await getDocs(requestsCollection);
    
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
        createdAt: data.createdAt?.toMillis() || Date.now(),
        updatedAt: data.updatedAt?.toMillis() || Date.now(),
        assignedAdminId: data.assignedAdminId || "",
        businessName: data.businessName || "",
        businessType: data.businessType || "",
        collaboratorIds: data.collaboratorIds || []
      });
    });
    
    return requests;
  } catch (error) {
    console.error("Error getting requests:", error);
    throw error;
  }
};

/**
 * Assign an admin to a website request
 */
export const assignAdminToRequest = async (requestId: string, adminId: string): Promise<void> => {
  try {
    const requestRef = doc(db, "websiteRequests", requestId);
    await updateDoc(requestRef, {
      assignedAdminId: adminId,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error assigning admin:", error);
    throw error;
  }
};

/**
 * Update the status of a website request
 */
export const updateRequestStatus = async (requestId: string, status: string, progress: number): Promise<void> => {
  try {
    const requestRef = doc(db, "websiteRequests", requestId);
    await updateDoc(requestRef, {
      status,
      progress,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};

export { type WebsiteRequest }; 