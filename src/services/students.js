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
  orderBy 
} from "firebase/firestore";
import { db } from "../lib/firebase";

const COLLECTION_NAME = "students";

export const getAllStudents = async ({ filterClass = null, searchTerm = '' } = {}) => {
  try {
    let constraints = [collection(db, COLLECTION_NAME)];

    if (searchTerm) {
      constraints.push(where("name", ">=", searchTerm));
      constraints.push(where("name", "<=", searchTerm + '\uf8ff'));
      constraints.push(orderBy("name"));
    } else {
      if (filterClass) {
        constraints.push(where("classId", "==", filterClass));
      }
      // Removed server-side sorting to prevent missing index errors and ensure all docs are returned
      // constraints.push(orderBy("createdAt", "desc"));
    }

    const q = query(...constraints);
    const querySnapshot = await getDocs(q);
    
    let results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Client-side sorting
    if (!searchTerm) {
      results.sort((a, b) => {
        const dateA = a.createdAt || '';
        const dateB = b.createdAt || '';
        return dateB.localeCompare(dateA);
      });
    }

    return results;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};



export const getStudentsByClass = async (className) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where("classId", "==", className)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching students by class:", error);
    throw error;
  }
};

export const getStudentById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Student not found");
    }
  } catch (error) {
    console.error("Error fetching student:", error);
    throw error;
  }
};

export const addStudent = async (studentData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...studentData,
      createdAt: new Date().toISOString(),
      status: 'active'
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding student:", error);
    throw error;
  }
};

export const updateStudent = async (id, studentData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, studentData);
  } catch (error) {
    console.error("Error updating student:", error);
    throw error;
  }
};

export const deleteStudent = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
};

export const bulkAddStudents = async (students) => {
  try {
    const promises = students.map(student => addStudent(student));
    await Promise.all(promises);
  } catch (error) {
    console.error("Error in bulk add:", error);
    throw error;
  }
};
