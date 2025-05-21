import { doc, getDoc, getDocs, collection, query, orderBy, limit, where, setDoc, updateDoc, getCountFromServer } from 'firebase/firestore';
import { format } from 'date-fns';

const { db } = require('@/lib/firebase');

const Categories = {
  getAllCategories: async () => {
    try {
      const categoriesQuery = query(collection(db, 'categories'), where('isEnabled', '==', true), orderBy('name'));
      const categoriesSnapshot = await getDocs(categoriesQuery);

      const fetchedCategories = await Promise.all(
        categoriesSnapshot.docs.map(async (categoryDoc) => {
          const categoryData = categoryDoc.data();
          const categoryId = categoryDoc.id;

          let productCount = 0;
          try {
            const productsQuery = query(
              collection(db, 'products'), 
              where('categoryId', '==', categoryId),
              where('isEnabled', '==', true)
            );
            const snapshot = await getCountFromServer(productsQuery);
            productCount = snapshot.data().count;
          } catch (countError) {
            console.error(`Error fetching product count for category ${categoryId}:`, countError);
          }

          return {
            id: categoryId,
            productCount: productCount, 
            ...categoryData,
          };
        })
      );

      return fetchedCategories;
    } catch (error) {
      console.error('Error in getAllCategories:', error);
      return [];
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

  getSuggestedCategories: async () => {
    try {
      const categoriesQuery = query(
        collection(db, 'categories'),
        where('isEnabled', '==', false),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(categoriesQuery);

      const fetchedCategories = await Promise.all(
        querySnapshot.docs.map(async (categoryDoc) => {
          const categoryData = categoryDoc.data();

          return {
            id: categoryDoc.id,
            createdAtFormatted: format(categoryData.createdAt.toDate(), 'dd/MM/yyyy HH:mm'),
            ...categoryData,
          };
        })
      );

      return fetchedCategories;
    } catch (error) {
      console.error('Error in getSuggestedCategories:', error);
      return [];
    }
  },

  approveCategory: async (categoryId) => {
    try {
      const categoryRef = doc(db, 'categories', categoryId);
      await updateDoc(categoryRef, {
        isEnabled: true
      });
      return true;
    } catch (error) {
      console.error('Error in approveCategory:', error);
      return false;
    }
  }
};

export { Categories };
