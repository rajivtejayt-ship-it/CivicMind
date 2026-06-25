import { db, handleFirestoreError, OperationType } from "./client";
import { collection, addDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { CivicIssue } from "../../types/civic";

export async function createIssue(issue: CivicIssue): Promise<void> {
  try {
    // Strip 'id' field for document creation since Firestore generates it automatically
    const { id, ...data } = issue;
    await addDoc(collection(db, "issues"), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, "issues");
  }
}

export async function getIssue(id: string): Promise<CivicIssue | null> {
  try {
    const docRef = doc(db, "issues", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
      } as CivicIssue;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `issues/${id}`);
  }
}

export async function getIssues(): Promise<CivicIssue[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "issues"));
    const issues: CivicIssue[] = [];
    querySnapshot.forEach((docSnap) => {
      issues.push({
        id: docSnap.id,
        ...docSnap.data(),
      } as CivicIssue);
    });
    return issues;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "issues");
  }
}
