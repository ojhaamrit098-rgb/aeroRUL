import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";

export default function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("aerorul-theme") || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem("aerorul-theme", theme);
    } catch {
      // Ignore localStorage errors
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const passwordRules = useMemo(
    () => ({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }),
    [password]
  );

  const passwordValid =
    passwordRules.length &&
    passwordRules.uppercase &&
    passwordRules.lowercase &&
    passwordRules.number &&
    passwordRules.special;

  const suggestedPasswords = [
    "AeroRUL@2026",
    "Fleet#Pilot92",
    "Engine@Safe84",
    "Turbo!Flight27",
  ];

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    setMessage("");

    const cleanUsername = username.trim();
    const cleanEmail = email.trim();

    if (!cleanUsername) {
      setMessage("Please enter your username.");
      return;
    }

    if (!cleanEmail) {
      setMessage("Please enter your email address.");
      return;
    }

    if (!password) {
      setMessage("Please enter your password.");
      return;
    }

    if (isSignup && !passwordValid) {
      setMessage(
        "Please satisfy all password requirements before creating your account."
      );
      return;
    }

    setLoading(true);

    try {
      const result = isSignup
        ? await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              data: {
                username: cleanUsername,
              },
            },
          })
        : await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });

      if (result.error) {
        setMessage(result.error.message);
        return;
      }

      if (isSignup) {
        setMessage(
          "Account created successfully. Please check your email to confirm your account."
        );
      } else {
        setMessage("Login successful.");
      }
    } catch (error) {
      setMessage(
        error?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const isDark = theme === "dark";

  const colors = {
    background: isDark ? "#160e0a" : "#eee2d5",
    card: isDark ? "#261711" : "#fff8f1",
    cardBorder: isDark ? "#563526" : "#d5bba8",

    input: isDark ? "#3a2418" : "#ead9ca",
    inputBorder: isDark ? "#76503a" : "#c9a58c",
    inputText: isDark ? "#fff5ed" : "#39251a",

    heading: isDark ? "#fff9f4" : "#2e1c13",
    muted: isDark ? "#c5a99a" : "#725e51",

    accent: "#ad7048",
    accentLight: "#d39a70",

    success: isDark ? "#8bd3ad" : "#357a58",

    shadow: isDark
      ? "0 30px 80px rgba(0,0,0,.48)"
      : "0 25px 70px rgba(91,55,35,.16)",
  };

  const ruleStyle = (valid) => ({
    color: valid ? colors.success : colors.muted,
    fontSize: "11px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "5px",
  });

  return (
    <div
      className="aerorul-login"
      style={{
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        background: colors.background,
        color: colors.heading,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
        position: "relative",
        overflow: "auto",
        transition: "background .25s ease, color .25s ease",
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      {/* BACKGROUND GLOW */}
      <div
        style={{
          position: "fixed",
          width: "520px",
          height: "520px",
          borderRadius: "50%",
          background: isDark
            ? "rgba(173,112,72,.10)"
            : "rgba(173,112,72,.08)",
          filter: "blur(100px)",
          top: "-250px",
          left: "-180px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "fixed",
          width: "460px",
          height: "460px",
          borderRadius: "50%",
          background: isDark
            ? "rgba(117,70,43,.14)"
            : "rgba(117,70,43,.07)",
          filter: "blur(100px)",
          bottom: "-240px",
          right: "-180px",
          pointerEvents: "none",
        }}
      />

      {/* THEME BUTTON */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 9999,
          width: "44px",
          height: "44px",
          padding: 0,
          borderRadius: "50%",
          border: `1px solid ${colors.cardBorder}`,
          background: isDark
            ? "rgba(58,36,24,.94)"
            : "rgba(255,248,241,.94)",
          color: isDark ? "#f5d3bb" : "#6f452e",
          display: "grid",
          placeItems: "center",
          cursor: "pointer",
          fontSize: "20px",
          lineHeight: 1,
          boxShadow: isDark
            ? "0 8px 25px rgba(0,0,0,.30)"
            : "0 8px 25px rgba(76,45,28,.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        {isDark ? "☀" : "☾"}
      </button>

      {/* MAIN CONTENT */}
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* BRAND */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              width: "58px",
              height: "58px",
              margin: "0 auto 15px",
              borderRadius: "16px",
              background: `linear-gradient(135deg, ${colors.accent}, #74452f)`,
              display: "grid",
              placeItems: "center",
              boxShadow: "0 12px 30px rgba(120,70,40,.30)",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontSize: "27px",
                fontWeight: 800,
              }}
            >
              A
            </span>
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              lineHeight: 1.15,
              fontWeight: 800,
              letterSpacing: "-0.8px",
              color: colors.heading,
            }}
          >
            AeroRUL
          </h1>

          <p
            style={{
              margin: "7px 0 0",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: colors.muted,
            }}
          >
            Fleet Intelligence
          </p>
        </div>

        {/* LOGIN CARD */}
        <div
          style={{
            background: colors.card,
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: "20px",
            padding: "32px",
            boxShadow: colors.shadow,
          }}
        >
          {/* HEADER */}
          <div style={{ marginBottom: "25px" }}>
            <div
              style={{
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "1.8px",
                textTransform: "uppercase",
                color: colors.accent,
                marginBottom: "8px",
              }}
            >
              SECURE ACCESS
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: "25px",
                lineHeight: 1.2,
                fontWeight: 800,
                color: colors.heading,
              }}
            >
              {isSignup ? "Create your account" : "Welcome back"}
            </h2>

            <p
              style={{
                margin: "8px 0 0",
                color: colors.muted,
                fontSize: "13px",
                lineHeight: 1.6,
              }}
            >
              {isSignup
                ? "Create your secure AeroRUL operator account."
                : "Sign in to access your fleet command center."}
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>
            {/* USERNAME */}
            <div
              style={{
                marginBottom: "17px",
              }}
            >
              <label
                htmlFor="aerorul-username"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "11px",
                  fontWeight: 800,
                  color: colors.heading,
                  letterSpacing: ".3px",
                }}
              >
                USERNAME
              </label>

              <div
                style={{
                  width: "100%",
                  height: "52px",
                  display: "flex",
                  alignItems: "center",
                  boxSizing: "border-box",
                  borderRadius: "11px",
                  border: `1px solid ${colors.inputBorder}`,
                  background: colors.input,
                  padding: "0 15px",
                }}
              >
                <span
                  style={{
                    marginRight: "10px",
                    color: colors.accentLight,
                    fontSize: "17px",
                  }}
                >
                  @
                </span>

                <input
                  id="aerorul-username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  style={{
                    width: "100%",
                    height: "100%",
                    minWidth: 0,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: colors.inputText,
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                />
              </div>
            </div>

            {/* EMAIL */}
            <div
              style={{
                marginBottom: "17px",
              }}
            >
              <label
                htmlFor="aerorul-email"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "11px",
                  fontWeight: 800,
                  color: colors.heading,
                  letterSpacing: ".3px",
                }}
              >
                EMAIL ADDRESS
              </label>

              <div
                style={{
                  width: "100%",
                  height: "52px",
                  display: "flex",
                  alignItems: "center",
                  boxSizing: "border-box",
                  borderRadius: "11px",
                  border: `1px solid ${colors.inputBorder}`,
                  background: colors.input,
                  padding: "0 15px",
                }}
              >
                <span
                  style={{
                    marginRight: "10px",
                    color: colors.accentLight,
                    fontSize: "17px",
                  }}
                >
                  @
                </span>

                <input
                  id="aerorul-email"
                  type="email"
                  placeholder="operator@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  style={{
                    width: "100%",
                    height: "100%",
                    minWidth: 0,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: colors.inputText,
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div
              style={{
                marginBottom: isSignup ? "12px" : "20px",
              }}
            >
              <label
                htmlFor="aerorul-password"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "11px",
                  fontWeight: 800,
                  color: colors.heading,
                  letterSpacing: ".3px",
                }}
              >
                PASSWORD
              </label>

              <div
                style={{
                  width: "100%",
                  height: "52px",
                  display: "flex",
                  alignItems: "center",
                  boxSizing: "border-box",
                  borderRadius: "11px",
                  border: `1px solid ${colors.inputBorder}`,
                  background: colors.input,
                  padding: "0 8px 0 15px",
                }}
              >
                <span
                  style={{
                    marginRight: "10px",
                    color: colors.accentLight,
                    fontSize: "17px",
                  }}
                >
                  •••
                </span>

                <input
                  id="aerorul-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={
                    isSignup ? "new-password" : "current-password"
                  }
                  required
                  style={{
                    width: "100%",
                    height: "100%",
                    minWidth: 0,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    color: colors.inputText,
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                />

                {/* EYE BUTTON */}
                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  title={
                    showPassword ? "Hide password" : "Show password"
                  }
                  style={{
                    width: "38px",
                    height: "38px",
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    padding: 0,
                    border: "none",
                    borderRadius: "8px",
                    background: "transparent",
                    color: colors.muted,
                    cursor: "pointer",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    {showPassword ? (
                      <>
                        <path
                          d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                      </>
                    ) : (
                      <>
                        <path
                          d="M3 3L21 21"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                        <path
                          d="M10.58 10.58C10.21 10.95 10 11.46 10 12C10 13.1 10.9 14 12 14C12.54 14 13.05 13.79 13.42 13.42"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.88 5.09C10.56 4.9 11.27 4.8 12 4.8C18.5 4.8 22 12 22 12C22 12 20.82 14.43 18.63 16.45"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.61 6.61C3.77 8.51 2 12 2 12C2 12 5.5 19.2 12 19.2C13.73 19.2 15.29 18.79 16.67 18.1"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </>
                    )}
                  </svg>
                </button>
              </div>

              {/* PASSWORD RULES */}
              {isSignup && (
                <div
                  style={{
                    marginTop: "10px",
                    padding: "11px 12px",
                    borderRadius: "10px",
                    background: isDark
                      ? "rgba(0,0,0,.13)"
                      : "rgba(91,55,35,.05)",
                    border: `1px solid ${colors.cardBorder}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      color: colors.heading,
                      marginBottom: "7px",
                      letterSpacing: ".4px",
                    }}
                  >
                    PASSWORD REQUIREMENTS
                  </div>

                  <div style={ruleStyle(passwordRules.length)}>
                    <span>{passwordRules.length ? "✓" : "○"}</span>
                    At least 8 characters
                  </div>

                  <div style={ruleStyle(passwordRules.uppercase)}>
                    <span>{passwordRules.uppercase ? "✓" : "○"}</span>
                    One uppercase letter
                  </div>

                  <div style={ruleStyle(passwordRules.lowercase)}>
                    <span>{passwordRules.lowercase ? "✓" : "○"}</span>
                    One lowercase letter
                  </div>

                  <div style={ruleStyle(passwordRules.number)}>
                    <span>{passwordRules.number ? "✓" : "○"}</span>
                    One number
                  </div>

                  <div style={ruleStyle(passwordRules.special)}>
                    <span>{passwordRules.special ? "✓" : "○"}</span>
                    One special character
                  </div>
                </div>
              )}
            </div>

            {/* SUGGESTED PASSWORDS */}
            {isSignup && (
              <div
                style={{
                  marginBottom: "20px",
                  fontSize: "11px",
                  color: colors.muted,
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    color: colors.heading,
                    marginBottom: "7px",
                  }}
                >
                  SUGGESTED PASSWORDS
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px",
                  }}
                >
                  {suggestedPasswords.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setPassword(suggestion)}
                      style={{
                        border: `1px solid ${colors.cardBorder}`,
                        background: colors.input,
                        color: colors.heading,
                        borderRadius: "7px",
                        padding: "6px 8px",
                        fontSize: "10px",
                        cursor: "pointer",
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading || (isSignup && !passwordValid)}
              style={{
                width: "100%",
                height: "52px",
                border: "none",
                borderRadius: "11px",
                background:
                  loading || (isSignup && !passwordValid)
                    ? "#80543d"
                    : `linear-gradient(135deg, ${colors.accent}, #7d4a32)`,
                color: "#fff",
                fontSize: "14px",
                fontWeight: 800,
                cursor:
                  loading || (isSignup && !passwordValid)
                    ? "not-allowed"
                    : "pointer",
                boxShadow: "0 10px 24px rgba(126,75,48,.22)",
              }}
            >
              {loading
                ? "Please wait..."
                : isSignup
                  ? "Create Account"
                  : "Sign In"}
            </button>
          </form>

          {/* MESSAGE */}
          {message && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px 13px",
                borderRadius: "10px",
                background: isDark
                  ? "rgba(169,103,66,.12)"
                  : "rgba(169,103,66,.09)",
                border: `1px solid ${
                  isDark
                    ? "rgba(169,103,66,.28)"
                    : "rgba(169,103,66,.22)"
                }`,
                color: isDark ? "#f0c9b2" : "#70442f",
                fontSize: "12px",
                lineHeight: 1.5,
              }}
            >
              {message}
            </div>
          )}

          {/* CREATE ACCOUNT / SIGN IN */}
          <div
            style={{
              textAlign: "center",
              marginTop: "23px",
              paddingTop: "20px",
              borderTop: `1px solid ${colors.cardBorder}`,
              fontSize: "13px",
            }}
          >
            <span
              style={{
                color: colors.heading,
                fontWeight: 800,
              }}
            >
              {isSignup
                ? "Already have an account?"
                : "Don't have an account?"}
            </span>

            <button
              type="button"
              onClick={() => {
                setIsSignup((current) => !current);
                setMessage("");
                setPassword("");
                setShowPassword(false);
              }}
              style={{
                marginLeft: "7px",
                padding: 0,
                border: "none",
                background: "transparent",
                color: colors.accentLight,
                fontWeight: 800,
                fontSize: "13px",
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              {isSignup ? "Sign in" : "Create account"}
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            textAlign: "center",
            marginTop: "18px",
            color: colors.muted,
            fontSize: "10px",
            letterSpacing: ".5px",
          }}
        >
          AERORUL / COMMAND&nbsp;&nbsp;•&nbsp;&nbsp;v2.4.1
        </div>
      </div>
    </div>
  );
}