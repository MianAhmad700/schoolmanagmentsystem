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

const COLLECTION_NAME = "students";

export const getAllStudents = async (filter = {}) => {
  try {
    let q = collection(db, COLLECTION_NAME);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
};

export const getStudentsPaginated = async ({ 
  lastDoc = null, 
  limitSize = 10, 
  filterClass = null, 
  searchTerm = '' 
}) => {
  try {
    let constraints = [collection(db, COLLECTION_NAME)];

    // Search or Filter logic
    // Note: Firestore has limitations on multiple range filters and mixing equality/range
    // We prioritize Search over Class Filter if both are present to avoid complex index requirements for now,
    // or we can try to combine them if we assume indexes are/will be created.
    
    if (searchTerm) {
      // Case-sensitive prefix search (standard Firestore)
      // Ideally we store a lowercase version for case-insensitive search
      constraints.push(where("name", ">=", searchTerm));
      constraints.push(where("name", "<=", searchTerm + '\uf8ff'));
      constraints.push(orderBy("name"));
    } else {
      if (filterClass) {
        constraints.push(where("classId", "==", filterClass));
      }
      // Default ordering
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
    console.error("Error fetching paginated students:", error);
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
