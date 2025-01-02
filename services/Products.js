import { doc, getDoc, getDocs, collection, query, orderBy, limit, where } from 'firebase/firestore';
import { format } from 'date-fns';

const { db } = require('@/lib/firebase');

const Products = {
  getAllProducts: async () => {
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
      console.error('Error in getAllProducts:', error);
      return false;
    }
  },
  getProductsByCategoryId: async (categoryId) => {
    try {
      const productsQuery = query(collection(db, 'products'), orderBy('name'), where('categoryId', '==', categoryId));
      const querySnapshot = await getDocs(productsQuery);

      const fetchedProducts = await Promise.all(
        querySnapshot.docs.map(async (productDoc) => {
          const productData = productDoc.data();

          return {
            id: productDoc.id,
            ...productData,
          };
        })
      );

      return fetchedProducts;
    } catch (error) {
      console.error('Error in getProductsByCategoryId:', error);
      return false;
    }
  },
  getProductById: async (productId) => {
    try {
      const productRef = doc(db, 'products', productId);
      const productSnapshot = await getDoc(productRef);

      if (productSnapshot.exists()) {
        const productData = productSnapshot.data();

        return {
          id: productSnapshot.id,
          ...productData,
        };
      }

      return null;
    } catch (error) {
      console.error('Error in getProductById:', error);
      return false;
    }
  },
};

export { Products };
