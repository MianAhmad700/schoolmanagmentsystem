import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter
} from "firebase/firestore";
import { db } from "../lib/firebase";

const COLLECTION_NAME = "teachers";

export const getAllTeachers = async () => {
  try {
    const q = collection(db, COLLECTION_NAME);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

export const getTeachersPaginated = async ({ 
  lastDoc = null, 
  limitSize = 10, 
  searchTerm = '' 
}) => {
  try {
    let constraints = [collection(db, COLLECTION_NAME)];

    if (searchTerm) {
      constraints.push(where("name", ">=", searchTerm));
      constraints.push(where("name", "<=", searchTerm + '\uf8ff'));
      constraints.push(orderBy("name"));
    } else {
      constraints.push(orderBy("createdAt", "desc"));
    }

    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    constraints.push(limit(limitSize));

    const q = query(...constraints);
    const querySnapshot = await getDocs(q);
    
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { 
      data, 
      lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] 
    };
  } catch (error) {
    console.error("Error fetching paginated teachers:", error);
    throw error;
  }
};

export const getTeacherById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Teacher not found");
    }
  } catch (error) {
    console.error("Error fetching teacher:", error);
    throw error;
  }
};

export const addTeacher = async (teacherData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...teacherData,
      createdAt: new Date().toISOString(),
      status: 'active'
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding teacher:", error);
    throw error;
  }
};

export const updateTeacher = async (id, teacherData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, teacherData);
  } catch (error) {
    console.error("Error updating teacher:", error);
    throw error;
  }
};

export const deleteTeacher = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting teacher:", error);
    throw error;
  }
};
