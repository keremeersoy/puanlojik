import { doc, setDoc } from "firebase/firestore";

const { auth, db } = require("@/lib/firebase");

const Auth = {
  registerUser: async (user, registerInfo) => {
    try {
      const { email, name, surname } = registerInfo;

      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        createdAt: new Date(),
        email: email,
        name: name,
        surname: surname,
        photoUrl: null,
        // fullName_lowerCase: `${name} ${surname}`.toLowerCase(),
      });

      return true;
    } catch (error) {
      console.log("errorregister", error);
      return false;
    }
  },
  getCurrentUser: () => {
    return auth?.currentUser || null;
  },
};

export { Auth };