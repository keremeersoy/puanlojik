const getErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/user-not-found':
      return "The email you entered doesn't belong to an account. Please check your email and try again.";
      break;

    case 'auth/wrong-password':
      return 'The password you entered is incorrect. Please try again.';
      break;

    case 'auth/invalid-email':
      return 'You entered an invalid email address. Please try again.';
      break;

    case 'auth/invalid-phone-number':
      return 'You entered an invalid phone number. Please try again.';
      break;

    case 'auth/invalid-credential':
      return 'The credential you entered is invalid. Please try again.';
      break;

    case 'auth/phone-number-already-exists':
      return 'The phone number is already in use. Please try again.';
      break;

    case 'auth/too-many-requests':
      return 'Too many requests. Please try again later.';
      break;

    case 'auth/email-already-in-use':
      return 'The email address is already in use. Please try again.';
      break;

    default:
      toast.error(error.message);
      break;
  }
};

export { getErrorMessage };
