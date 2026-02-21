# 🗑️ Clear Local Storage Guide

## Overview
A utility page to manage and clear all user data from local storage. This is useful for testing the new role-based authentication system with fresh accounts.

## 🚀 How to Access

### Method 1: From Auth Page
1. Go to the **Auth page** (`/auth`)
2. Look at the bottom of the page
3. Click **"Manage Local Storage"** button
4. You'll be redirected to `/clear-storage`

### Method 2: Direct URL
- Navigate directly to: `http://localhost:8080/clear-storage`

## 📋 Features

### 1. **User Overview** 👥
- Shows total number of registered users
- Displays count in a prominent card

### 2. **User List** 📝
- Lists all registered users with:
  - Full Name
  - Email Address
  - Role (Student/Faculty/Admin)
  - Department
  - Student ID (if applicable)
- Scrollable list if many users
- Color-coded role badges

### 3. **Clear All Users** 🗑️
- **Two-step confirmation** to prevent accidental deletion
- First click: Shows confirmation prompt
- Second click: Permanently deletes all users
- Clears both:
  - User accounts (`cc_users`)
  - Active session (`cc_session`)

### 4. **Visual Feedback** ✨
- Warning alert about permanent deletion
- Toast notification on success
- Auto-redirect to Auth page after clearing
- Empty state when no users exist

## 🎨 UI Components

### User Count Card:
```
┌─────────────────────────────────┐
│ 👥 Total Users              5   │
│    Stored in local storage      │
└─────────────────────────────────┘
```

### User Card Example:
```
┌─────────────────────────────────┐
│ John Doe                        │
│ john.doe@klh.edu.in             │
│ [Student] [CSE]    ID: 24100123 │
└─────────────────────────────────┘
```

### Warning Alert:
```
⚠️ Warning: This action will permanently delete all user
accounts and sessions from local storage. This cannot be undone.
```

## 🔄 Workflow

### Clearing Users:
```
1. Navigate to /clear-storage
   ↓
2. View all registered users
   ↓
3. Click "Clear All Users (X)"
   ↓
4. Confirmation prompt appears
   ↓
5. Click "Yes, Delete All"
   ↓
6. All users deleted
   ↓
7. Toast notification shown
   ↓
8. Auto-redirect to /auth (1.5s delay)
```

### After Clearing:
```
1. All user accounts removed
   ↓
2. Active session cleared
   ↓
3. User logged out
   ↓
4. Can create fresh accounts
   ↓
5. Test role-based authentication
```

## 🛠️ Technical Details

### Functions Used:

#### `clearAllUsers()`
```typescript
// Removes all users and session from local storage
export function clearAllUsers(): void {
  localStorage.removeItem(USERS_KEY);      // Remove cc_users
  localStorage.removeItem(SESSION_KEY);    // Remove cc_session
  window.dispatchEvent(new Event("cc-auth-change"));
}
```

#### `getAllUsers()`
```typescript
// Gets all users for display
export function getAllUsers(): Record<string, LocalUser> {
  return loadUsers();
}
```

### Local Storage Keys:
- **`cc_users`**: Stores all user accounts
- **`cc_session`**: Stores current session

## 🎯 Use Cases

### 1. **Testing Role-Based Auth**
- Clear all old accounts
- Create new student with @klh.edu.in
- Create new faculty with any email
- Test validation rules

### 2. **Development Reset**
- Start fresh during development
- Remove test accounts
- Clean slate for new features

### 3. **Debugging**
- View all registered users
- Check user data structure
- Verify role assignments

### 4. **Demo Preparation**
- Clear all test data
- Create specific demo accounts
- Present clean system

## ⚠️ Important Notes

### Data Persistence:
- ❌ **NOT** recoverable after deletion
- ❌ No backup created
- ❌ Permanent action

### Session Impact:
- Clears active session
- User logged out immediately
- Redirected to auth page

### Browser-Specific:
- Only clears data in current browser
- Other browsers unaffected
- Incognito mode has separate storage

## 🎨 Visual Design

### Colors:
- **Red/Orange Gradient**: Database icon
- **Primary Blue**: User count
- **Muted Background**: User list
- **Red Alert**: Warning message
- **Destructive Red**: Delete button

### Animations:
- Fade-in on page load
- Smooth transitions
- Toast notifications
- Auto-redirect countdown

### Responsive:
- Mobile-friendly layout
- Scrollable user list
- Touch-friendly buttons

## 📱 Mobile View

- Stacked layout
- Full-width buttons
- Scrollable user list
- Touch-optimized

## 🔗 Navigation

### From Clear Storage:
- **"Back to Auth"** button (top-left)
- **"Go to Sign Up"** button (if no users)
- Auto-redirect after clearing

### To Clear Storage:
- **"Manage Local Storage"** link on Auth page
- Direct URL navigation

## 🎉 Benefits

1. **Easy Testing** 🧪
   - Quick reset for testing
   - No manual localStorage clearing

2. **Visual Feedback** 👀
   - See all registered users
   - Verify data before clearing

3. **Safe Deletion** 🔒
   - Two-step confirmation
   - Clear warning message

4. **Developer-Friendly** 👨‍💻
   - Quick access from auth
   - Useful during development

---

**Use this tool to clear all existing users and test the new role-based authentication system!** 🚀
