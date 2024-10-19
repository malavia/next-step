// src/services/firebase/firebaseCrudService.js

import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './initFirebase'; // Adjust the path as needed

export const getData = async (path) => {
  try {
    const querySnapshot = await getDocs(collection(db, path));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};



export const getDataBydID = async (path) => {
  try {
    const docRef = doc(db, path); // Crée une référence au document
    const docSnap = await getDoc(docRef); // Récupère le document

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }; // Retourne les données du document
    } else {
      throw new Error("Aucun document trouvé !");
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};



export const addData = async (path, data) => {
  try {
    const docRef = await addDoc(collection(db, path), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Error adding data:', error);
    throw error;
  }
};

export const deleteData = async (path, id) => {
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};

export const updateData = async (path, id, updatedData) => {
  try {
    const docRef = doc(db, path, id);
    await updateDoc(docRef, updatedData);
    return { id, ...updatedData };
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};
