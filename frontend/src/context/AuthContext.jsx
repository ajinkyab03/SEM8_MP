import { createContext, useContext, useEffect, useReducer } from "react";

const parseJSON = (value) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};

const getUserFromLocalStorage = () => {
  const user = localStorage.getItem("user");
  if (!user || user === "null" || user === "undefined") return null;
  return parseJSON(user);
};

const getStoredValue = (key) => {
  const value = localStorage.getItem(key);
  if (!value || value === "null" || value === "undefined") return null;
  if (key === "token") {
    const normalized = value.trim().replace(/^Bearer\s+/i, "").replace(/^["']|["']$/g, "");
    if (!normalized || normalized.split(".").length !== 3) return null;
    return normalized;
  }
  return value;
};

const initialState = {
  user: getUserFromLocalStorage(),
  role: getStoredValue("role"),
  token: getStoredValue("token"),
};

export const authContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        role: null,
        token: null,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload.user,
        token: action.payload.token,
        role: action.payload.role,
      };
    case "LOGOUT":
      return {
        user: null,
        role: null,
        token: null,
      };

    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("user");
    }

    if (state.token) {
      localStorage.setItem("token", state.token);
    } else {
      localStorage.removeItem("token");
    }

    if (state.role) {
      localStorage.setItem("role", state.role);
    } else {
      localStorage.removeItem("role");
    }
  }, [state]);

  return (
    <authContext.Provider
      value={{
        user: state.user,
        token: state.token,
        role: state.role,
        dispatch,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
