import { doc, getDoc, getDocs, collection, query, orderBy, limit } from 'firebase/firestore';
import { format } from 'date-fns';

const { db } = require('@/lib/firebase');

const Categories = {
  getAllCategories: async () => {
    try {
        const categoriesQuery = query(collection(db, 'categories'), orderBy('name'));
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
};

export { Categories };
