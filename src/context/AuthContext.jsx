import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storageService.getSession());
  const [users, setUsers] = useState(() => storageService.getUsers());

  useEffect(() => {
    storageService.saveSession(user);
  }, [user]);

  useEffect(() => {
    storageService.saveUsers(users);
  }, [users]);

  const login = ({ email, password, role, rememberMe }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.role === role
    );

    if (!matchedUser) {
      const otherRoleUser = users.find((u) => u.email.toLowerCase() === normalizedEmail);
      if (otherRoleUser) {
        return {
          success: false,
          error: `This email is registered as ${otherRoleUser.role === 'admin' ? 'an Administrator' : 'a Student'}. Please switch to the correct login portal.`,
        };
      }
      return {
        success: false,
        error: 'No account found with this university email.',
      };
    }

    if (matchedUser.password !== password) {
      return {
        success: false,
        error: 'Incorrect password. Please check your credentials and try again.',
      };
    }

    if (rememberMe) {
      storageService.saveRememberedEmail(matchedUser.email);
    } else {
      storageService.saveRememberedEmail('');
    }

    const { password: _, ...safeUser } = matchedUser;
    setUser(safeUser);
    return { success: true, user: safeUser };
  };

  const registerStudent = (formData) => {
    const normalizedEmail = formData.email.trim().toLowerCase();
    const existingEmail = users.some((u) => u.email.toLowerCase() === normalizedEmail);
    if (existingEmail) {
      return {
        success: false,
        error: 'An account with this university email already exists.',
      };
    }

    const existingStudentId = users.some(
      (u) => u.studentId.toLowerCase() === formData.studentId.trim().toLowerCase()
    );
    if (existingStudentId) {
      return {
        success: false,
        error: 'This Student ID is already registered in VOXORA.',
      };
    }

    const newUser = {
      id: `usr-stu-${Date.now()}`,
      role: 'student',
      fullName: formData.fullName.trim(),
      email: normalizedEmail,
      studentId: formData.studentId.trim(),
      department: formData.department,
      yearOfStudy: formData.yearOfStudy,
      password: formData.password,
      phone: formData.phone?.trim() || '',
      hostelResident: formData.hostelResident?.trim() || 'Campus Student',
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    return { success: true, user: safeUser };
  };

  const updateProfile = (updates) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    const updatedUsers = users.map((u) =>
      u.id === user.id ? { ...u, ...updates } : u
    );
    setUsers(updatedUsers);

    const updatedSession = { ...user, ...updates };
    setUser(updatedSession);
    return { success: true, user: updatedSession };
  };

  const logout = () => {
    setUser(null);
    storageService.saveSession(null);
  };

  const resetPasswordDemo = (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!found) {
      return {
        success: false,
        error: 'No VOXORA account matches that university email.',
      };
    }
    return {
      success: true,
      message: `Password reset instructions sent to ${found.email}. (Demo password: ${found.password})`,
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isStudent: user?.role === 'student',
        isAdmin: user?.role === 'admin',
        login,
        registerStudent,
        updateProfile,
        logout,
        resetPasswordDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
