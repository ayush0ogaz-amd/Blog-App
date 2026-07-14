import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { get } from "../services/Endpoint";
import { removeUser, setUser } from "../redux/AuthSlice";

export default function AuthSession() {
  const dispatch = useDispatch();

  useEffect(() => {
    const verifySession = async () => {
      try {
        const { data } = await get("/auth/checkauth");
        if (data.authenticated) dispatch(setUser(data.user));
      } catch {
        dispatch(removeUser());
      }
    };
    verifySession();
  }, [dispatch]);

  return null;
}
