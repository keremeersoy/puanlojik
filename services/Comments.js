import { doc, getDoc, getDocs, collection, query, orderBy, limit, setDoc, increment, where } from 'firebase/firestore';
import { format } from 'date-fns';

const { db } = require('@/lib/firebase');

const Comments = {
  getLatestComments: async (count) => {
    try {
      const commentsQuery = query(collection(db, 'comments'), orderBy('createdAt', 'desc'), limit(count));
      const querySnapshot = await getDocs(commentsQuery);

      const fetchedComments = await Promise.all(
        querySnapshot.docs.map(async (commentDoc) => {
          const commentData = commentDoc.data();

          let productName = null;
          if (commentData.productId) {
            const productRef = doc(db, 'products', commentData.productId);
            const productSnapshot = await getDoc(productRef);
            if (productSnapshot.exists()) {
              productName = productSnapshot.data().name;
            }
          }

          return {
            id: commentDoc.id,
            createdAtFormatted: format(commentData.createdAt.toDate(), 'dd/MM/yyyy HH:mm'),
            productName,
            ...commentData,
          };
        })
      );

      return fetchedComments;
    } catch (error) {
      console.error('Error in getLatestComments:', error);
      return false;
    }
  },
  createComment: async (commentData, user) => {
    try {
      const newCommentRef = doc(collection(db, 'comments'));
      await setDoc(newCommentRef, {
        ...commentData,
        createdAt: new Date(),
        userId: user.uid,
      });

      const productRef = doc(db, 'products', commentData.productId);
      await setDoc(
        productRef,
        { commentCount: increment(1), totalScore: increment(commentData.score) },
        { merge: true }
      );

      return true;
    } catch (error) {
      console.error('Error in createComment:', error);
      return false;
    }
  },
  getCommentsByProductId: async (productId) => {
    try {
      const commentsQuery = query(collection(db, 'comments'), orderBy('createdAt', 'desc'), where('productId', '==', productId));
      const querySnapshot = await getDocs(commentsQuery);

      const fetchedComments = await Promise.all(
        querySnapshot.docs.map(async (commentDoc) => {
          const commentData = commentDoc.data();

          let productName = null;
          if (commentData.productId) {
            const productRef = doc(db, 'products', commentData.productId);
            const productSnapshot = await getDoc(productRef);
            if (productSnapshot.exists()) {
              productName = productSnapshot.data().name;
            }
          }

          return {
            id: commentDoc.id,
            createdAtFormatted: format(commentData.createdAt.toDate(), 'dd/MM/yyyy HH:mm'),
            productName,
            ...commentData,
          };
        })
      );

      return fetchedComments;
    } catch (error) {
      console.error('Error in getCommentsByProductId:', error);
      return false;
    }
  },
};

export { Comments };
