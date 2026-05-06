export type StoredUser = {
  username: string;
  fullName: string;
  password?: string;
  email: string;
  countryCode: string;
  mobile: string;
  createdAt: number;
};

const STORAGE_KEYS = {
  USERS: "hci_mock_users",
  CURRENT_USER: "hci_mock_current_user",
  FLASH_MESSAGE: "hci_mock_flash_message",
  PENDING_USERNAME: "hci_mock_pending_username",
};

export function getStoredUsers(): Record<string, StoredUser> {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function findStoredUser(
  username: string,
  password?: string,
): StoredUser | null {
  const users = getStoredUsers();
  const user = Object.values(users).find(
    (u) => u.username.toLowerCase() === username.toLowerCase(),
  );

  if (!user) return null;
  if (password && user.password !== password) return null;

  return user;
}

export function registerStoredUser(user: Partial<StoredUser>): {
  success: boolean;
  message: string;
} {
  const users = getStoredUsers();

  if (!user.username || !user.password || !user.email) {
    return { success: false, message: "Missing required fields" };
  }

  const usernameKey = user.username.toLowerCase();
  if (
    Object.values(users).some((u) => u.username.toLowerCase() === usernameKey)
  ) {
    return { success: false, message: "User name is already taken" };
  }

  const newUser: StoredUser = {
    username: user.username,
    fullName: user.fullName || "",
    password: user.password,
    email: user.email,
    countryCode: user.countryCode || "+91",
    mobile: user.mobile || "",
    createdAt: Date.now(),
  };

  users[usernameKey] = newUser;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  return { success: true, message: "User registered successfully" };
}

export function getCurrentUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: StoredUser): void {
  if (typeof window !== "undefined") {
    // exclude password from session storage mock
    const { password, ...sessionUser } = user;
    localStorage.setItem(
      STORAGE_KEYS.CURRENT_USER,
      JSON.stringify(sessionUser),
    );
  }
}

export function clearCurrentUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export function setAuthFlashMessage(message: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.FLASH_MESSAGE, message);
  }
}

export function consumeAuthFlashMessage(): string | null {
  if (typeof window === "undefined") return null;
  const msg = localStorage.getItem(STORAGE_KEYS.FLASH_MESSAGE);
  if (msg) localStorage.removeItem(STORAGE_KEYS.FLASH_MESSAGE);
  return msg;
}

export function setPendingUsername(username: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.PENDING_USERNAME, username);
  }
}

export function consumePendingUsername(): string | null {
  if (typeof window === "undefined") return null;
  const username = localStorage.getItem(STORAGE_KEYS.PENDING_USERNAME);
  if (username) localStorage.removeItem(STORAGE_KEYS.PENDING_USERNAME);
  return username;
}
