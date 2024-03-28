import { AUTHEN_TOKENS } from "@client/libs/constants";
import { server } from "@client/libs/server";
import { setUser } from "@client/redux/features/auth";
import { useAppDispatch, useAppSelector } from "@client/redux/hooks";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const validateAuthen = async () => {
    if (!user) {
      const accessToken = localStorage.getItem(AUTHEN_TOKENS.ACCESS);

      const { data } = await server.api.v1.auth.profile.get({
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      if (!data) {
        return false;
      }

      dispatch(setUser(data.data));
    }

    return true;
  };

  return { validateAuthen };
};

export type AuthContext = ReturnType<typeof useAuth>;
