import { doc, getDoc, getDocs, collection, query, orderBy, limit, where, setDoc, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';

const { db } = require('@/lib/firebase');

const Products = {
  getAllProducts: async () => {
    try {
      const productsQuery = query(collection(db, 'products'), where('isEnabled', '==', true), orderBy('name'));
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
      console.error('Error in getAllProducts:', error);
      return false;
    }
  },
  getProductsByCategoryId: async (categoryId) => {
    try {
      const productsQuery = query(
        collection(db, 'products'), 
        where('categoryId', '==', categoryId),
        where('isEnabled', '==', true),
        orderBy('name')
      );
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
  suggestNewProduct: async (productData, user) => {
    try {
      const newProductRef = doc(collection(db, 'products'));
      await setDoc(newProductRef, {
        ...productData,
        isEnabled: false,
        createdAt: new Date(),
        userId: user.uid,
        commentCount: 0,
        totalScore: 0
      });

      return true;
    } catch (error) {
      console.error('Error in suggestNewProduct:', error);
      return false;
    }
  },
  getSuggestedProducts: async () => {
    try {
      const productsQuery = query(
        collection(db, 'products'),
        where('isEnabled', '==', false),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(productsQuery);

      const fetchedProducts = await Promise.all(
        querySnapshot.docs.map(async (productDoc) => {
          const productData = productDoc.data();

          // Get category name
          const categoryRef = doc(db, 'categories', productData.categoryId);
          const categorySnapshot = await getDoc(categoryRef);
          const categoryName = categorySnapshot.exists() ? categorySnapshot.data().name : 'Bilinmeyen Kategori';

          return {
            id: productDoc.id,
            categoryName,
            createdAtFormatted: format(productData.createdAt.toDate(), 'dd/MM/yyyy HH:mm'),
            ...productData,
          };
        })
      );

      return fetchedProducts;
    } catch (error) {
      console.error('Error in getSuggestedProducts:', error);
      return false;
    }
  },
  approveProduct: async (productId) => {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        isEnabled: true
      });
      return true;
    } catch (error) {
      console.error('Error in approveProduct:', error);
      return false;
    }
  }
};

export { Products };
