import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/features/auth/authStore";
import "../styles/globals.css";

// ════════════════════════════════════════
// ICONS
// ════════════════════════════════════════
const Icons = {
  ArrowLeft: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  User: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Lock: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Bell: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Palette: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="7" r="1.5" />
      <circle cx="17.66" cy="14.66" r="1.5" />
      <circle cx="6.34" cy="14.66" r="1.5" />
    </svg>
  ),
  Globe: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Shield: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Download: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Trash2: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  LogOut: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Check: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  AlertCircle: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  ChevronRight: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
};

// ════════════════════════════════════════
// SETTINGS TABS
// ════════════════════════════════════════
const SETTINGS_TABS = [
  { id: "profile", label: "Profile", icon: Icons.User },
  { id: "security", label: "Security", icon: Icons.Lock },
  { id: "notifications", label: "Notifications", icon: Icons.Bell },
  { id: "preferences", label: "Preferences", icon: Icons.Palette },
  { id: "privacy", label: "Privacy", icon: Icons.Shield },
  { id: "data", label: "Data & Privacy", icon: Icons.Download },
];

// ════════════════════════════════════════
// NOTIFICATION SETTINGS
// ════════════════════════════════════════
const NOTIFICATION_SETTINGS = [
  {
    id: "email-tests",
    title: "Test Reminders",
    description: "Get reminded when new practice tests are available",
    enabled: true,
  },
  {
    id: "email-results",
    title: "Test Results",
    description: "Receive notifications when test results are ready",
    enabled: true,
  },
  {
    id: "email-courses",
    title: "New Courses",
    description: "Be notified about new courses and learning materials",
    enabled: false,
  },
  {
    id: "email-updates",
    title: "Platform Updates",
    description: "Updates about new features and platform improvements",
    enabled: true,
  },
  {
    id: "push-notifications",
    title: "Push Notifications",
    description: "Desktop and mobile push notifications",
    enabled: true,
  },
  {
    id: "weekly-digest",
    title: "Weekly Digest",
    description: "Summary of your weekly progress and achievements",
    enabled: true,
  },
];

// ════════════════════════════════════════
// HELPER COMPONENTS
// ════════════════════════════════════════
function SettingTab({ icon: Icon, label, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 20px",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        borderLeft: isActive ? "4px solid #a81011" : "4px solid transparent",
        background: isActive ? "#fff5f5" : "transparent",
        color: isActive ? "#a81011" : "#475569",
        fontWeight: isActive ? 700 : 600,
        fontSize: "0.95rem",
        transition: "all 0.2s",
        width: "100%",
        textAlign: "left",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "#f9fafb";
          e.currentTarget.style.color = "#0c1f4a";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#475569";
        }
      }}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );
}

function SettingInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  description,
  error,
}) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <label
        style={{
          display: "block",
          fontWeight: 700,
          color: "#0c1f4a",
          marginBottom: "8px",
          fontSize: "0.9rem",
        }}
      >
        {label}
      </label>
      {description && (
        <p
          style={{
            fontSize: "0.85rem",
            color: "#94a3b8",
            marginBottom: "10px",
          }}
        >
          {description}
        </p>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "12px 16px",
          border: error ? "1.5px solid #dc2626" : "1.5px solid #e2e8f0",
          borderRadius: "10px",
          fontSize: "0.95rem",
          outline: "none",
          transition: "all 0.2s",
          boxSizing: "border-box",
          background: error ? "#fef2f2" : "#fff",
        }}
        onFocus={(e) => {
          if (!error) {
            e.target.style.borderColor = "#a81011";
            e.target.style.boxShadow = "0 0 0 3px rgba(168,16,17,0.1)";
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? "#dc2626" : "#e2e8f0";
          e.target.style.boxShadow = "none";
        }}
      />
      {error && (
        <p style={{ color: "#dc2626", fontSize: "0.85rem", marginTop: "6px" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function ToggleSetting({ id, title, description, enabled, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px",
        background: "#f9fafb",
        borderRadius: "10px",
        marginBottom: "12px",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#f4f6fb";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#f9fafb";
      }}
    >
      <div>
        <p
          style={{
            fontWeight: 600,
            color: "#0c1f4a",
            marginBottom: "4px",
            fontSize: "0.95rem",
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#94a3b8",
            margin: 0,
          }}
        >
          {description}
        </p>
      </div>
      <label
        style={{
          position: "relative",
          display: "inline-flex",
          cursor: "pointer",
          marginLeft: "20px",
          flexShrink: 0,
        }}
      >
        <input
          type="checkbox"
          checked={enabled}
          onChange={() => onChange(id, !enabled)}
          style={{
            display: "none",
          }}
        />
        <div
          style={{
            width: "48px",
            height: "28px",
            background: enabled ? "#10b981" : "#cbd5e1",
            borderRadius: "14px",
            transition: "background 0.3s",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "24px",
              height: "24px",
              background: "#fff",
              borderRadius: "50%",
              top: "2px",
              left: enabled ? "22px" : "2px",
              transition: "left 0.3s",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      </label>
    </div>
  );
}

// ════════════════════════════════════════
// PROFILE TAB
// ════════════════════════════════════════
function ProfileTab({ user }) {
  const [formData, setFormData] = useState({
    firstName: user?.displayName?.split(" ")[0] || "",
    lastName: user?.displayName?.split(" ")[1] || "",
    email: user?.email || "",
    phone: "",
    bio: "",
    location: "",
  });

  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSave = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "1.8rem",
            fontWeight: 800,
            color: "#0c1f4a",
            marginBottom: "8px",
          }}
        >
          Profile Settings
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
          Update your personal information and profile picture
        </p>
      </div>

      {/* Profile Picture */}
      <div
        style={{
          padding: "28px",
          background: "#fff",
          border: "1.5px solid #e2e8f0",
          borderRadius: "14px",
          marginBottom: "32px",
        }}
      >
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#0c1f4a",
            marginBottom: "20px",
          }}
        >
          Profile Picture
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #a81011, #d42022)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "2.5rem",
              fontWeight: 800,
              border: "3px solid #a81011",
            }}
          >
            {user?.displayName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <button
              style={{
                padding: "10px 20px",
                background: "linear-gradient(135deg, #a81011, #d42022)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 700,
                cursor: "pointer",
                marginBottom: "10px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Upload Photo
            </button>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0 }}>
              JPG, PNG or GIF. Max 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div
        style={{
          padding: "28px",
          background: "#fff",
          border: "1.5px solid #e2e8f0",
          borderRadius: "14px",
          marginBottom: "32px",
        }}
      >
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#0c1f4a",
            marginBottom: "20px",
          }}
        >
          Personal Information
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <SettingInput
            label="First Name"
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            error={errors.firstName}
          />
          <SettingInput
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            error={errors.lastName}
          />
        </div>
        <SettingInput
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
        />
        <SettingInput
          label="Phone Number"
          type="tel"
          placeholder="+998 99 999 99 99"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />
        <SettingInput
          label="Location"
          placeholder="City, Country"
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />
        <SettingInput
          label="Bio"
          placeholder="Tell us about yourself..."
          value={formData.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
        />

        {saved && (
          <div
            style={{
              padding: "14px 16px",
              background: "#d1fae5",
              border: "1.5px solid #6ee7b7",
              borderRadius: "10px",
              color: "#065f46",
              fontWeight: 600,
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Icons.Check size={18} />
            Profile updated successfully!
          </div>
        )}

        <button
          onClick={handleSave}
          style={{
            padding: "12px 28px",
            background: "linear-gradient(135deg, #a81011, #d42022)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// SECURITY TAB
// ════════════════════════════════════════
function SecurityTab() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordChanged, setPasswordChanged] = useState(false);

  const handlePasswordChange = () => {
    const errors = {};

    if (!passwordData.currentPassword)
      errors.currentPassword = "Current password is required";
    if (!passwordData.newPassword)
      errors.newPassword = "New password is required";
    if (passwordData.newPassword.length < 8)
      errors.newPassword = "Password must be at least 8 characters";
    if (passwordData.newPassword !== passwordData.confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordChanged(true);
    setShowPasswordForm(false);
    setTimeout(() => setPasswordChanged(false), 3000);
  };

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "1.8rem",
            fontWeight: 800,
            color: "#0c1f4a",
            marginBottom: "8px",
          }}
        >
          Security Settings
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
          Manage your password and two-factor authentication
        </p>
      </div>

      {/* Change Password */}
      <div
        style={{
          padding: "28px",
          background: "#fff",
          border: "1.5px solid #e2e8f0",
          borderRadius: "14px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#0c1f4a",
                margin: "0 0 4px 0",
              }}
            >
              Password
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: 0 }}>
              Change your password regularly for better security
            </p>
          </div>
          {!showPasswordForm && (
            <button
              onClick={() => setShowPasswordForm(true)}
              style={{
                padding: "10px 18px",
                background: "#fff",
                border: "1.5px solid #e2e8f0",
                borderRadius: "8px",
                color: "#0c1f4a",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#a81011";
                e.currentTarget.style.color = "#a81011";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.color = "#0c1f4a";
              }}
            >
              Change Password
            </button>
          )}
        </div>

        {showPasswordForm && (
          <>
            <SettingInput
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              error={passwordErrors.currentPassword}
            />
            <SettingInput
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              error={passwordErrors.newPassword}
              description="Must be at least 8 characters"
            />
            <SettingInput
              label="Confirm Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              error={passwordErrors.confirmPassword}
            />

            {passwordChanged && (
              <div
                style={{
                  padding: "14px 16px",
                  background: "#d1fae5",
                  border: "1.5px solid #6ee7b7",
                  borderRadius: "10px",
                  color: "#065f46",
                  fontWeight: 600,
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Icons.Check size={18} />
                Password changed successfully!
              </div>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={handlePasswordChange}
                style={{
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #a81011, #d42022)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Update Password
              </button>
              <button
                onClick={() => setShowPasswordForm(false)}
                style={{
                  padding: "12px 24px",
                  background: "#f9fafb",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "8px",
                  color: "#475569",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f4f6fb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f9fafb";
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div
        style={{
          padding: "28px",
          background: "#fff",
          border: "1.5px solid #e2e8f0",
          borderRadius: "14px",
          marginBottom: "24px",
        }}
      >
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#0c1f4a",
            marginBottom: "8px",
          }}
        >
          Two-Factor Authentication
        </h3>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#94a3b8",
            marginBottom: "20px",
          }}
        >
          Add an extra layer of security to your account
        </p>
        <div
          style={{
            padding: "16px",
            background: "#f4f6fb",
            border: "1.5px solid rgba(12,31,74,0.1)",
            borderRadius: "10px",
            marginBottom: "16px",
          }}
        >
          <p
            style={{
              fontSize: "0.9rem",
              color: "#0c1f4a",
              margin: 0,
              fontWeight: 600,
            }}
          >
            ⚠️ Not enabled
          </p>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", margin: "6px 0 0 0" }}>
            Enable 2FA to secure your account with an authenticator app
          </p>
        </div>
        <button
          style={{
            padding: "10px 18px",
            background: "linear-gradient(135deg, #a81011, #d42022)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Enable 2FA
        </button>
      </div>

      {/* Active Sessions */}
      <div
        style={{
          padding: "28px",
          background: "#fff",
          border: "1.5px solid #e2e8f0",
          borderRadius: "14px",
        }}
      >
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#0c1f4a",
            marginBottom: "20px",
          }}
        >
          Active Sessions
        </h3>
        <div
          style={{
            padding: "16px",
            background: "#f9fafb",
            borderRadius: "10px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p
                style={{
                  fontWeight: 600,
                  color: "#0c1f4a",
                  margin: "0 0 4px 0",
                }}
              >
                Current Session
              </p>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#94a3b8",
                  margin: 0,
                }}
              >
                Chrome on Windows • Last active: Now
              </p>
            </div>
            <span
              style={{
                background: "#d1fae5",
                color: "#065f46",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// NOTIFICATIONS TAB
// ════════════════════════════════════════
function NotificationsTab() {
  const [notifications, setNotifications] = useState(NOTIFICATION_SETTINGS);

  const handleToggle = (id, newValue) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, enabled: newValue } : notif
      )
    );
  };

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "1.8rem",
            fontWeight: 800,
            color: "#0c1f4a",
            marginBottom: "8px",
          }}
        >
          Notification Settings
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
          Choose how and when you want to receive notifications
        </p>
      </div>

      <div
        style={{
          padding: "28px",
          background: "#fff",
          border: "1.5px solid #e2e8f0",
          borderRadius: "14px",
        }}
      >
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#0c1f4a",
            marginBottom: "20px",
          }}
        >
          Email & Push Notifications
        </h3>
        <div>
          {notifications.map((notif) => (
            <ToggleSetting
              key={notif.id}
              id={notif.id}
              title={notif.title}
              description={notif.description}
              enabled={notif.enabled}
              onChange={handleToggle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// PREFERENCES TAB
// ════════════════════════════════════════
function PreferencesTab() {
  const [preferences, setPreferences] = useState({
    theme: "light",
    language: "en",
    timeFormat: "12h",
  });

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "1.8rem",
            fontWeight: 800,
            color: "#0c1f4a",
            marginBottom: "8px",
          }}
        >
          Preferences
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
          Customize your learning experience
        </p>
      </div>

      <div
        style={{
          padding: "28px",
          background: "#fff",
          border: "1.5px solid #e2e8f0",
          borderRadius: "14px",
          marginBottom: "24px",
        }}
      >
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#0c1f4a",
            marginBottom: "20px",
          }}
        >
          Display Preferences
        </h3>

        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontWeight: 700,
              color: "#0c1f4a",
              marginBottom: "12px",
              fontSize: "0.9rem",
            }}
          >
            Theme
          </label>
          <div style={{ display: "flex", gap: "12px" }}>
            {[
              { id: "light", label: "☀️ Light" },
              { id: "dark", label: "🌙 Dark" },
              { id: "auto", label: "🔄 Auto" },
            ].map((theme) => (
              <button
                key={theme.id}
                onClick={() =>
                  setPreferences((prev) => ({ ...prev, theme: theme.id }))
                }
                style={{
                  padding: "10px 18px",
                  background:
                    preferences.theme === theme.id ? "#a81011" : "#f9fafb",
                  color:
                    preferences.theme === theme.id ? "#fff" : "#475569",
                  border:
                    preferences.theme === theme.id
                      ? "none"
                      : "1.5px solid #e2e8f0",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontWeight: 700,
              color: "#0c1f4a",
              marginBottom: "12px",
              fontSize: "0.9rem",
            }}
          >
            Language
          </label>
          <select
            value={preferences.language}
            onChange={(e) =>
              setPreferences((prev) => ({ ...prev, language: e.target.value }))
            }
            style={{
              width: "100%",
              maxWidth: "300px",
              padding: "10px 14px",
              border: "1.5px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "0.95rem",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="en">English</option>
            <option value="uz">Uzbek</option>
            <option value="ru">Русский</option>
          </select>
        </div>

        <div>
          <label
            style={{
              display: "block",
              fontWeight: 700,
              color: "#0c1f4a",
              marginBottom: "12px",
              fontSize: "0.9rem",
            }}
          >
            Time Format
          </label>
          <select
            value={preferences.timeFormat}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                timeFormat: e.target.value,
              }))
            }
            style={{
              width: "100%",
              maxWidth: "300px",
              padding: "10px 14px",
              border: "1.5px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "0.95rem",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="12h">12-hour (AM/PM)</option>
            <option value="24h">24-hour</option>
          </select>
        </div>
      </div>

      {/* Learning Preferences */}
      <div
        style={{
          padding: "28px",
          background: "#fff",
          border: "1.5px solid #e2e8f0",
          borderRadius: "14px",
        }}
      >
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#0c1f4a",
            marginBottom: "20px",
          }}
        >
          Learning Preferences
        </h3>
        <ToggleSetting
          id="auto-play"
          title="Auto-play Videos"
          description="Automatically play videos when loading lessons"
          enabled={true}
          onChange={() => {}}
        />
        <ToggleSetting
          id="show-tips"
          title="Show Learning Tips"
          description="Display helpful tips while practicing"
          enabled={true}
          onChange={() => {}}
        />
        <ToggleSetting
          id="dark-mode-study"
          title="Dark Mode During Study"
          description="Use dark mode in practice sessions"
          enabled={false}
          onChange={() => {}}
        />
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// PRIVACY TAB
// ════════════════════════════════════════
function PrivacyTab() {
  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "1.8rem",
            fontWeight: 800,
            color: "#0c1f4a",
            marginBottom: "8px",
          }}
        >
          Privacy & Safety
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
          Control who can see your profile and activity
        </p>
      </div>

      <div
        style={{
          padding: "28px",
          background: "#fff",
          border: "1.5px solid #e2e8f0",
          borderRadius: "14px",
          marginBottom: "24px",
        }}
      >
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#0c1f4a",
            marginBottom: "20px",
          }}
        >
          Profile Visibility
        </h3>
        <ToggleSetting
          id="public-profile"
          title="Public Profile"
          description="Allow others to see your profile"
          enabled={true}
          onChange={() => {}}
        />
        <ToggleSetting
          id="show-scores"
          title="Show Test Scores"
          description="Display your test scores publicly"
          enabled={false}
          onChange={() => {}}
        />
        <ToggleSetting
          id="show-achievements"
          title="Show Achievements"
          description="Show badges and certificates publicly"
          enabled={true}
          onChange={() => {}}
        />
      </div>

      <div
        style={{
          padding: "28px",
          background: "#fff",
          border: "1.5px solid #e2e8f0",
          borderRadius: "14px",
        }}
      >
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#0c1f4a",
            marginBottom: "20px",
          }}
        >
          Blocking & Reporting
        </h3>
        <p style={{ fontSize: "0.9rem", color: "#475569", marginBottom: "16px" }}>
          You haven't blocked any users or reported any content
        </p>
        <button
          style={{
            padding: "10px 18px",
            background: "#f9fafb",
            border: "1.5px solid #e2e8f0",
            borderRadius: "8px",
            color: "#475569",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#f4f6fb";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f9fafb";
          }}
        >
          View Blocked Users
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// DATA & PRIVACY TAB
// ════════════════════════════════════════
function DataTab() {
  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "1.8rem",
            fontWeight: 800,
            color: "#0c1f4a",
            marginBottom: "8px",
          }}
        >
          Data & Privacy
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
          Download, manage, or delete your personal data
        </p>
      </div>

      {/* Download Data */}
      <div
        style={{
          padding: "28px",
          background: "#fff",
          border: "1.5px solid #e2e8f0",
          borderRadius: "14px",
          marginBottom: "24px",
        }}
      >
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#0c1f4a",
            marginBottom: "8px",
          }}
        >
          Download Your Data
        </h3>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#94a3b8",
            marginBottom: "20px",
          }}
        >
          Get a copy of your personal data in a portable format
        </p>
        <button
          style={{
            padding: "12px 24px",
            background: "#fff",
            border: "1.5px solid #e2e8f0",
            borderRadius: "8px",
            color: "#0c1f4a",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#a81011";
            e.currentTarget.style.color = "#a81011";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e2e8f0";
            e.currentTarget.style.color = "#0c1f4a";
          }}
        >
          <Icons.Download size={18} />
          Download Data (JSON)
        </button>
      </div>

      {/* Delete Account */}
      <div
        style={{
          padding: "28px",
          background: "#fff5f5",
          border: "1.5px solid rgba(220,38,38,0.2)",
          borderRadius: "14px",
        }}
      >
        <h3
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#dc2626",
            marginBottom: "8px",
          }}
        >
          ⚠️ Delete Account
        </h3>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#7f1d1d",
            marginBottom: "16px",
          }}
        >
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <button
          style={{
            padding: "12px 24px",
            background: "#fff",
            border: "1.5px solid rgba(220,38,38,0.3)",
            borderRadius: "8px",
            color: "#dc2626",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fee2e2";
            e.currentTarget.style.borderColor = "rgba(220,38,38,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.borderColor = "rgba(220,38,38,0.3)";
          }}
        >
          <Icons.Trash2 size={18} />
          Delete Account
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// MAIN SETTINGS PAGE
// ════════════════════════════════════════
export default function Settings() {
  const [, setLocation] = useLocation();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");

  const renderTab = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab user={user} />;
      case "security":
        return <SecurityTab />;
      case "notifications":
        return <NotificationsTab />;
      case "preferences":
        return <PreferencesTab />;
      case "privacy":
        return <PrivacyTab />;
      case "data":
        return <DataTab />;
      default:
        return <ProfileTab user={user} />;
    }
  };

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh", paddingBottom: "80px" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #a81011, #d42022)",
          color: "#fff",
          padding: "40px 28px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <button
            onClick={() => setLocation("/dashboard")}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: "8px",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.2)";
            }}
            aria-label="Go back"
            title="Go back to dashboard"
          >
            <Icons.ArrowLeft size={20} />
          </button>
          <div>
            <h1
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "2rem",
                fontWeight: 800,
                margin: "0 0 4px 0",
              }}
            >
              Settings
            </h1>
            <p style={{ fontSize: "0.95rem", opacity: 0.9, margin: 0 }}>
              Manage your account preferences and security
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 28px",
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: "40px",
        }}
      >
        {/* Sidebar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            height: "fit-content",
            position: "sticky",
            top: "100px",
          }}
        >
          {SETTINGS_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <SettingTab
                key={tab.id}
                icon={Icon}
                label={tab.label}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            );
          })}
        </div>

        {/* Content */}
        <div style={{ marginBottom: "60px" }}>{renderTab()}</div>
      </div>
    </div>
  );
}