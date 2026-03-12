const TOKEN_KEY = "@minhaclinica:token";
const USER_KEY = "@minhaclinica:user";
const REMEMBER_ME_KEY = "@minhaclinica:remember_me";

const getStorageWithToken = (): Storage | null => {
  if (localStorage.getItem(TOKEN_KEY)) return localStorage;
  if (sessionStorage.getItem(TOKEN_KEY)) return sessionStorage;
  return null;
};

const getStorageByRemember = (rememberMe: boolean): Storage => {
  return rememberMe ? localStorage : sessionStorage;
};

const getAlternativeStorage = (storage: Storage): Storage => {
  return storage === localStorage ? sessionStorage : localStorage;
};

const getPreferredStorage = (): Storage => {
  if (localStorage.getItem(REMEMBER_ME_KEY) === "1") return localStorage;
  if (sessionStorage.getItem(REMEMBER_ME_KEY) === "0") return sessionStorage;

  const storageWithToken = getStorageWithToken();
  if (storageWithToken) return storageWithToken;

  return localStorage;
};

export const setRememberMePreference = (rememberMe: boolean): void => {
  localStorage.removeItem(REMEMBER_ME_KEY);
  sessionStorage.removeItem(REMEMBER_ME_KEY);

  if (rememberMe) {
    localStorage.setItem(REMEMBER_ME_KEY, "1");
    return;
  }

  sessionStorage.setItem(REMEMBER_ME_KEY, "0");
};

export const isRememberMeEnabled = (): boolean => {
  if (localStorage.getItem(REMEMBER_ME_KEY) === "1") return true;
  if (sessionStorage.getItem(REMEMBER_ME_KEY) === "0") return false;

  const storageWithToken = getStorageWithToken();
  return storageWithToken === localStorage;
};

export const storeAuthToken = (token: string, rememberMe?: boolean): void => {
  const storage =
    rememberMe === undefined ? getPreferredStorage() : getStorageByRemember(rememberMe);
  const otherStorage = getAlternativeStorage(storage);

  storage.setItem(TOKEN_KEY, token);
  otherStorage.removeItem(TOKEN_KEY);
  otherStorage.removeItem(USER_KEY);

  if (rememberMe !== undefined) {
    setRememberMePreference(rememberMe);
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
};

export const storeAuthUser = (user: unknown): void => {
  const storage = getStorageWithToken() ?? getPreferredStorage();
  const otherStorage = getAlternativeStorage(storage);

  storage.setItem(USER_KEY, JSON.stringify(user));
  otherStorage.removeItem(USER_KEY);
};

export const getStoredAuthUser = (): string | null => {
  return localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY);
};

export const clearStoredAuthUser = (): void => {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
};

export const clearAuthStorage = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(REMEMBER_ME_KEY);

  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(REMEMBER_ME_KEY);
};
