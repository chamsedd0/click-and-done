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
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { Payment } from "../types/database";

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentType = 'advance' | 'final' | 'installment';

export interface Payment {
  id: string;
  requestId: string;
  userId: string;
  amount: number;
  currency: string;
  type: PaymentType;
  status: PaymentStatus;
  transactionId?: string;
  paymentMethod?: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  paidAt?: number;
  completedAt?: number;
}

export const createPayment = async (
  requestId: string,
  userId: string,
  amount: number,
  currency: string = 'USD',
  type: PaymentType,
  description: string
) => {
  try {
    const paymentRef = await addDoc(collection(db, 'payments'), {
      requestId,
      userId,
      amount,
      currency,
      type,
      status: 'pending',
      description,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return paymentRef.id;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

export const updatePaymentStatus = async (
  paymentId: string, 
  status: PaymentStatus, 
  transactionData: { transactionId?: string; paymentMethod?: string } = {}
) => {
  try {
    const paymentRef = doc(db, 'payments', paymentId);
    
    const updateData: any = {
      status,
      updatedAt: serverTimestamp(),
    };
    
    if (status === 'paid') {
      updateData.paidAt = serverTimestamp();
    }
    
    if (transactionData.transactionId) {
      updateData.transactionId = transactionData.transactionId;
    }
    
    if (transactionData.paymentMethod) {
      updateData.paymentMethod = transactionData.paymentMethod;
    }
    
    await updateDoc(paymentRef, updateData);
    
    return true;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

export const getPaymentById = async (paymentId: string): Promise<Payment | null> => {
  try {
    const paymentRef = doc(db, 'payments', paymentId);
    const paymentSnapshot = await getDoc(paymentRef);
    
    if (paymentSnapshot.exists()) {
      const data = paymentSnapshot.data();
      return {
        id: paymentSnapshot.id,
        ...data,
        createdAt: data.createdAt?.toMillis() || Date.now(),
        updatedAt: data.updatedAt?.toMillis() || Date.now(),
        paidAt: data.paidAt?.toMillis() || undefined,
        completedAt: data.completedAt?.toMillis(),
      } as Payment;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting payment:', error);
    throw error;
  }
};

export const getRequestPayments = async (requestId: string): Promise<Payment[]> => {
  try {
    const paymentsCollection = collection(db, "payments");
    const paymentsQuery = query(paymentsCollection, where("requestId", "==", requestId));
    const snapshot = await getDocs(paymentsQuery);
    
    const payments: Payment[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      payments.push({
        id: doc.id,
        requestId: data.requestId,
        amount: data.amount,
        status: data.status,
        description: data.description,
        paymentMethod: data.paymentMethod,
        createdAt: data.createdAt?.toMillis() || Date.now(),
        completedAt: data.completedAt?.toMillis(),
      });
    });
    
    return payments.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Error getting payments:", error);
    throw error;
  }
};

export const getUserPayments = async (userId: string): Promise<Payment[]> => {
  try {
    const paymentsQuery = query(
      collection(db, 'payments'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(paymentsQuery);
    const paymentsList: Payment[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      paymentsList.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toMillis() || Date.now(),
        updatedAt: data.updatedAt?.toMillis() || Date.now(),
        paidAt: data.paidAt?.toMillis() || undefined,
        completedAt: data.completedAt?.toMillis(),
      } as Payment);
    });
    
    return paymentsList;
  } catch (error) {
    console.error('Error getting user payments:', error);
    throw error;
  }
};

export const hasAdvancePayment = async (requestId: string): Promise<boolean> => {
  try {
    const paymentsQuery = query(
      collection(db, 'payments'),
      where('requestId', '==', requestId),
      where('type', '==', 'advance'),
      where('status', '==', 'paid')
    );
    
    const querySnapshot = await getDocs(paymentsQuery);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking advance payment:', error);
    throw error;
  }
}; 