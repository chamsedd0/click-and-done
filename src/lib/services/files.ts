import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  listAll, 
  deleteObject 
} from 'firebase/storage';
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
import { storage, db } from '../firebase';
import { FileMetadata } from "../types/database";
import { Timestamp } from "firebase/firestore";

export interface FileMetadata {
  id: string;
  requestId: string;
  userId: string;
  userDisplayName: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  path: string;
  downloadURL: string;
  stage: string;
  version: number;
  createdAt: number;
}

export const uploadFile = async (
  requestId: string,
  userId: string,
  userDisplayName: string,
  file: File,
  stage: string
) => {
  try {
    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}-${file.name}`;
    const path = `files/${requestId}/${fileName}`;
    
    // Create storage reference
    const storageRef = ref(storage, path);
    
    // Upload file
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Progress monitoring if needed
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          // Error handling
          console.error('Error uploading file:', error);
          reject(error);
        },
        async () => {
          // Upload completed successfully
          try {
            // Get download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Get the current version number
            const version = await getNextFileVersion(requestId, stage);
            
            // Store file metadata in Firestore
            const fileMetadataRef = await addDoc(collection(db, 'files'), {
              requestId,
              userId,
              userDisplayName,
              fileName: file.name,
              fileType: file.type,
              fileSize: file.size,
              path,
              downloadURL,
              stage,
              version,
              createdAt: serverTimestamp(),
            });
            
            resolve(fileMetadataRef.id);
          } catch (error) {
            console.error('Error saving file metadata:', error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in uploadFile:', error);
    throw error;
  }
};

export const getNextFileVersion = async (requestId: string, stage: string): Promise<number> => {
  try {
    const filesQuery = query(
      collection(db, 'files'),
      where('requestId', '==', requestId),
      where('stage', '==', stage),
      orderBy('version', 'desc'),
      where('version', '>=', 0)
    );
    
    const querySnapshot = await getDocs(filesQuery);
    
    if (querySnapshot.empty) {
      return 1; // First version
    }
    
    const latestVersion = querySnapshot.docs[0].data().version || 0;
    return latestVersion + 1;
  } catch (error) {
    console.error('Error getting next file version:', error);
    throw error;
  }
};

export const getFileById = async (fileId: string): Promise<FileMetadata | null> => {
  try {
    const fileRef = doc(db, 'files', fileId);
    const fileSnapshot = await getDoc(fileRef);
    
    if (fileSnapshot.exists()) {
      const data = fileSnapshot.data();
      return {
        id: fileSnapshot.id,
        ...data,
        createdAt: data.createdAt?.toMillis() || Date.now(),
      } as FileMetadata;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting file:', error);
    throw error;
  }
};

/**
 * Get files for a request
 */
export const getRequestFiles = async (requestId: string): Promise<FileMetadata[]> => {
  try {
    const filesCollection = collection(db, "files");
    const filesQuery = query(filesCollection, where("requestId", "==", requestId));
    const snapshot = await getDocs(filesQuery);
    
    const files: FileMetadata[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      files.push({
        id: doc.id,
        requestId: data.requestId,
        fileName: data.fileName,
        fileType: data.fileType,
        fileSize: data.fileSize,
        downloadURL: data.downloadURL,
        uploadedBy: data.uploadedBy,
        createdAt: data.createdAt?.toMillis() || Date.now()
      });
    });
    
    return files.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Error getting files:", error);
    throw error;
  }
};

export const getStageFiles = async (requestId: string, stage: string): Promise<FileMetadata[]> => {
  try {
    const filesQuery = query(
      collection(db, 'files'),
      where('requestId', '==', requestId),
      where('stage', '==', stage),
      orderBy('version', 'desc')
    );
    
    const querySnapshot = await getDocs(filesQuery);
    const filesList: FileMetadata[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      filesList.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toMillis() || Date.now(),
      } as FileMetadata);
    });
    
    return filesList;
  } catch (error) {
    console.error('Error getting stage files:', error);
    throw error;
  }
};

export const deleteFile = async (fileId: string) => {
  try {
    // Get file metadata
    const fileMetadata = await getFileById(fileId);
    
    if (!fileMetadata) {
      throw new Error('File not found');
    }
    
    // Delete file from Storage
    const storageRef = ref(storage, fileMetadata.path);
    await deleteObject(storageRef);
    
    // Delete metadata from Firestore
    await deleteDoc(doc(db, 'files', fileId));
    
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Upload a file for a request
 */
export const uploadRequestFile = async (
  requestId: string,
  file: File,
  userId: string,
  userName: string
): Promise<FileMetadata> => {
  try {
    // Create a storage reference
    const storageRef = ref(storage, `requests/${requestId}/${file.name}`);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    // Save file metadata to Firestore
    const timestamp = Date.now();
    const fileMetadata = {
      requestId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      downloadURL,
      uploadedBy: userId,
      userDisplayName: userName,
      createdAt: Timestamp.fromMillis(timestamp)
    };
    
    const docRef = await addDoc(collection(db, "files"), fileMetadata);
    
    return {
      id: docRef.id,
      requestId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      downloadURL,
      uploadedBy: userId,
      createdAt: timestamp
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}; 