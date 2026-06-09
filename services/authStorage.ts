import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'admin' | 'employee';

export type AppUser = {
  id: string;
  name: string;
  email: string;
  companyCode: string;
  role: UserRole;
  department: string;
  lastLogin: string;
};

const CURRENT_USER_KEY = 'safetrack_current_user';
const LOGIN_HISTORY_KEY = 'safetrack_login_history';

const adminEmails = ['admin@safetrack.na', 'manager@safetrack.na'];

export const demoPasswords = {
  employee: 'safetrack',
  admin: 'admin123',
  manager: 'manager123',
};

function formatLoginTime() {
  return new Intl.DateTimeFormat('en-NA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

function getNameFromEmail(email: string) {
  const username = email.split('@')[0] || 'User';

  return username
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

export function resolveUserRole(email: string, companyCode: string): UserRole {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedCompanyCode = companyCode.trim().toUpperCase();

  if (
    adminEmails.includes(normalizedEmail) ||
    normalizedEmail.includes('admin') ||
    normalizedEmail.includes('manager') ||
    normalizedCompanyCode === 'ADMIN'
  ) {
    return 'admin';
  }

  return 'employee';
}

export function isValidDemoPassword(role: UserRole, password: string) {
  const normalizedPassword = password.trim();

  if (role === 'admin') {
    return [
      demoPasswords.admin,
      demoPasswords.manager,
      demoPasswords.employee,
    ].includes(normalizedPassword);
  }

  return normalizedPassword === demoPasswords.employee;
}

export async function loginUser({
  companyCode,
  email,
}: {
  companyCode: string;
  email: string;
}): Promise<AppUser> {
  const role = resolveUserRole(email, companyCode);
  const normalizedEmail = email.trim().toLowerCase();
  const lastLogin = formatLoginTime();
  const user: AppUser = {
    id: normalizedEmail,
    name: role === 'admin' ? 'Safety Manager' : getNameFromEmail(normalizedEmail),
    email: normalizedEmail,
    companyCode: companyCode.trim().toUpperCase(),
    role,
    department: role === 'admin' ? 'Safety Management' : 'Operations',
    lastLogin,
  };

  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  await recordLogin(user);

  return user;
}

export async function getCurrentUser(): Promise<AppUser | null> {
  try {
    const saved = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.log('Error loading current user:', error);
    return null;
  }
}

export async function logoutUser() {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  } catch (error) {
    console.log('Error logging out:', error);
  }
}

export async function getLoginHistory(): Promise<AppUser[]> {
  try {
    const saved = await AsyncStorage.getItem(LOGIN_HISTORY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.log('Error loading login history:', error);
    return [];
  }
}

async function recordLogin(user: AppUser) {
  try {
    const history = await getLoginHistory();
    const updatedHistory = [
      user,
      ...history.filter((item) => item.email !== user.email),
    ].slice(0, 12);

    await AsyncStorage.setItem(LOGIN_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.log('Error saving login history:', error);
  }
}
