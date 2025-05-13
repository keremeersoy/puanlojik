import { doc, getDoc, getDocs, collection, query, orderBy, limit, setDoc, where } from 'firebase/firestore';
import { format } from 'date-fns';

const { db } = require('@/lib/firebase');

const Categories = {
  getAllCategories: async () => {
    try {
      const categoriesQuery = query(collection(db, 'categories'), where('isEnabled', '==', true), orderBy('name'));
      const querySnapshot = await getDocs(categoriesQuery);

      const fetchedCategories = await Promise.all(
        querySnapshot.docs.map(async (categoryDoc) => {
          const categoryData = categoryDoc.data();

          return {
            id: categoryDoc.id,
            ...categoryData,
          };
        })
      );

      return fetchedCategories;
    } catch (error) {
      console.error('Error in getAllCategories:', error);
      return false;
    }
  },
  
  suggestNewCategory: async (categoryData, user) => {
    try {
      const newCategoryRef = doc(collection(db, 'categories'));
      await setDoc(newCategoryRef, {
        ...categoryData,
        isEnabled: false,
        createdAt: new Date(),
        userId: user.uid,
      });

      return true;
    } catch (error) {
      console.error('Error in suggestNewCategory:', error);
      return false;
    }
  },
};

export { Categories };
