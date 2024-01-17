import { axiosNT } from "./Axios";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { toast } from "react-toastify";

// ("scp -r ./build/* /var/www/renttime.kz/html");

export const registration = async (
  data,
  setRegistrationLoading,
  next = () => {}
) => {
  setRegistrationLoading(true);
  axiosNT
    .post(`/api/auth/registration`, data)
    .then(() => {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, data.email, data.password);
      next();
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    })
    .finally(() => {
      setRegistrationLoading(false);
    });
};

export const loginWithEmail = async (
  setLoginWithEmailLoading,
  email,
  password
) => {
  setLoginWithEmailLoading(true);
  try {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    const errMsg = e?.code ? e.code : "Unknown error";
    toast.error(errMsg.startsWith("auth/") ? errMsg : "Unknown error", {
      draggable: false,
    });
  } finally {
    setLoginWithEmailLoading(false);
  }
};

export const loginWithGoogle = async (setLoginWithGoogleLoading) => {
  setLoginWithGoogleLoading(true);
  try {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    await signInWithPopup(auth, provider);
  } catch (e) {
    const errMsg = e?.code ? e.code : "Unknown error";
    toast.error(errMsg.startsWith("auth/") ? errMsg : "Unknown error", {
      draggable: false,
    });
  } finally {
    setLoginWithGoogleLoading(false);
  }
};

export const signUpWithGoogle = async (registrationLoading) => {
  registrationLoading(true);
  try {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    const signUpData = await signInWithPopup(auth, provider);
    await axiosNT.post(
      "/api/auth/registrationgoogle",
      { email: signUpData.user.email },
      {}
    );
  } catch (e) {
    const errMsg = e?.code ? e.code : "Unknown error";
    const errMsg2 = e?.response?.data?.message;
    toast.error(
      errMsg.startsWith("auth/") ? errMsg : errMsg2 ? errMsg2 : "Unknown error",
      { draggable: false }
    );
  } finally {
    registrationLoading(false);
  }
};

export const resetPassword = async (setLoading, email, next) => {
  setLoading(true);
  try {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
    toast.success("Verification link successfully sent to yout E-mail", {
      draggable: false,
    });
    next();
  } catch (e) {
    const errMsg = e?.code ? e.code : "Unknown error";
    toast.error(errMsg.startsWith("auth/") ? errMsg : "Unknown error", {
      draggable: false,
    });
  } finally {
    setLoading(false);
  }
};

export const logout = async (setLogoutLoading) => {
  try {
    setLogoutLoading(true);
    const auth = getAuth();
    await signOut(auth);
  } catch (e) {
    const errMsg = e?.code ? e.code : "Unknown error";
    toast.error(errMsg.startsWith("auth/") ? errMsg : "Unknown error", {
      draggable: false,
    });
  } finally {
    setLogoutLoading(false);
  }
};

export const ping = async (
  setIsNoOrg,
  setIsNoOrgLoading,
  setIsError,
  token,
  setOrganizationId = () => {},
  setOrgData = () => {}
) => {
  if (!token) {
    setIsNoOrg(true);
    return;
  }
  setIsNoOrgLoading(true);
  axiosNT
    .get("/api/auth/orgcheck", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
    .then(({ data }) => {
      setIsNoOrg(false);
      setIsError(false);
      setOrganizationId(data.organizationId);
      setOrgData(data.orgData);
    })
    .catch((e) => {
      const errMsg = e?.response?.data?.message;
      toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
      console.log(e);
      if (e?.response?.data?.noOrg) {
        setOrganizationId(null);
        return setIsNoOrg(true);
      }
      if (e?.response?.data?.data?.noSync) {
        setOrganizationId(null);
        return setIsNoOrg(true);
      }
      setIsError(true);
      setIsNoOrg(true);
      setOrganizationId(null);
    })
    .finally(() => {
      setIsNoOrgLoading(false);
    });
};

export const authCheck = async (setIsAuth, token, setToken) => {
  try {
    const { data } = await axiosNT.get("/api/auth/authcheck", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    Object.keys(data).forEach((key) => {
      localStorage.setItem(key, data[key]);
    });
    setIsAuth(true);
    setToken(token);
  } catch (e) {
    const errMsg = e?.response?.data?.message;
    toast.error(errMsg ? errMsg : "Unknown error", { draggable: false });
    // axiosNT.post("/api/debug/printdata", { e }, {});
    setIsAuth(false);
    setToken("");
    const auth = getAuth();
    if (e?.response?.data?.email) {
      sendEmailVerification(auth.currentUser)
        .then(() => {
          toast.info(
            "Your email is not verificated! Check your email for verification link",
            { draggable: false }
          );
        })
        .catch(() => {
          toast.error("Your email is not verificated! Please try again", {
            draggable: false,
          });
        });
    }
    if (e?.response?.data?.data?.noSync) {
      auth.currentUser?.delete();
    }
    signOut(auth).catch((e) => console.log(e));
  }
};
