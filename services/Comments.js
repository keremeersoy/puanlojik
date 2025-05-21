import { doc, getDoc, getDocs, collection, query, orderBy, limit, setDoc, increment, where, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { generateAISummary } from '@/lib/openai';

const { db } = require('@/lib/firebase');

const generateAndSaveAiSummary = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      console.error("Product not found for AI summary generation:", productId);
      return;
    }

    const productData = productSnap.data();
    const existingAiSummary = productData.aiSummary || "";

    const commentsQuery = query(
      collection(db, 'comments'),
      where('productId', '==', productId),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    const latestComments = commentsSnapshot.docs.map(doc => doc.data().content);

    if (latestComments.length === 0 && !existingAiSummary) {
      console.log("No comments and no existing summary for product:", productId);
      return;
    }
    
    let promptContent = "";
    if (existingAiSummary) {
      promptContent += `Mevcut Özet:\n${existingAiSummary}\n\nYeni Yorumlar:\n`;
    } else {
      promptContent += "Yorumlar:\n";
    }
    promptContent += latestComments.join("\n");
    
    const prompt = `Bir ürün için kullanıcı yorumları aşağıdadır. Lütfen bu yorumları ve varsa mevcut özeti dikkate alarak ürün için genel bir değerlendirme özeti oluşturun. Bu özet tamamen Türkçe olmalı ve 200 kelimeyi geçmemelidir.\n\n${promptContent}`;

    const newAiSummary = await generateAISummary(prompt);

    if (newAiSummary) {
      await updateDoc(productRef, {
        aiSummary: newAiSummary,
        aiSummaryUpdatedAt: new Date(),
      });
      console.log("AI Summary updated for product:", productId);
    }
  } catch (error) {
    console.error("Error generating or saving AI summary for product:", productId, error);
  }
};

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
      await updateDoc(
        productRef,
        { commentCount: increment(1), totalScore: increment(commentData.score) }
      );

      generateAndSaveAiSummary(commentData.productId).catch(error => {
        console.error("Failed to trigger AI summary generation:", error);
      });

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
