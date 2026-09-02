import { createPortal } from "react-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import { supabase } from "./lib/supabase";
import Login from "./Login.jsx";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import "./App.css";

/* =========================================================
   NAVIGATION
========================================================= */

const navItems = [
  {
    id: "overview",
    label: "Overview",
    icon: "dashboard",
  },
  {
    id: "engines",
    label: "Engines",
    icon: "flip_camera_ios",
  },
  {
    id: "predictions",
    label: "Predictions",
    icon: "batch_prediction",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: "analytics",
  },
  {
    id: "models",
    label: "Models",
    icon: "model_training",
  },
  {
    id: "dataset",
    label: "Dataset",
    icon: "database",
  },
];

const PAGE_TITLES = {
  overview: "Fleet Overview",
  engines: "Engine Monitoring",
  predictions: "RUL Predictions",
  analytics: "Fleet Analytics",
  models: "Model Performance",
  dataset: "Dataset & Operations",
  settings: "Settings",
};

/* =========================================================
   ANIMATION LAYER
========================================================= */

const animationStyles = `
@keyframes aeroPageIn {
  from {
    opacity: 0;
    transform: translateY(12px);
    filter: blur(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

@keyframes aeroFadeUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes aeroFadeLeft {
  from {
    opacity: 0;
    transform: translateX(-15px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes aeroScaleIn {
  from {
    opacity: 0;
    transform: scale(.94);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes aeroPanelIn {
  from {
    opacity: 0;
    transform: translateY(14px) scale(.985);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes aeroGlowPulse {
  0%, 100% {
    opacity: .45;
    transform: scale(1);
  }
  50% {
    opacity: .9;
    transform: scale(1.04);
  }
}

@keyframes aeroLivePulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.18);
    opacity: .65;
  }
}

@keyframes aeroShimmer {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(120%);
  }
}

@keyframes aeroChartDraw {
  from {
    opacity: 0;
    stroke-dashoffset: 700;
  }
  to {
    opacity: 1;
    stroke-dashoffset: 0;
  }
}

@keyframes aeroBarGrow {
  from {
    transform: scaleY(0);
    opacity: 0;
  }
  to {
    transform: scaleY(1);
    opacity: 1;
  }
}

@keyframes aeroSpin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes aeroFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes aeroNotification {
  0%, 100% {
    transform: rotate(0);
  }
  20% {
    transform: rotate(10deg);
  }
  40% {
    transform: rotate(-10deg);
  }
  60% {
    transform: rotate(6deg);
  }
  80% {
    transform: rotate(-4deg);
  }
}

@keyframes aeroBadge {
  0% {
    transform: scale(.5);
    opacity: 0;
  }
  70% {
    transform: scale(1.15);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes aeroProgress {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

/* PAGE */

.aero-page-animate {
  animation: aeroPageIn .48s cubic-bezier(.2,.75,.2,1) both;
}

.aero-page-animate .page-heading {
  animation: aeroFadeUp .55s .04s cubic-bezier(.2,.75,.2,1) both;
}

.aero-page-animate .kpi-card:nth-child(1) {
  animation: aeroPanelIn .5s .08s cubic-bezier(.2,.75,.2,1) both;
}

.aero-page-animate .kpi-card:nth-child(2) {
  animation: aeroPanelIn .5s .14s cubic-bezier(.2,.75,.2,1) both;
}

.aero-page-animate .kpi-card:nth-child(3) {
  animation: aeroPanelIn .5s .20s cubic-bezier(.2,.75,.2,1) both;
}

.aero-page-animate .kpi-card:nth-child(4) {
  animation: aeroPanelIn .5s .26s cubic-bezier(.2,.75,.2,1) both;
}

.aero-page-animate .panel {
  animation: aeroPanelIn .55s .12s cubic-bezier(.2,.75,.2,1) both;
}

/* SIDEBAR */

.sidebar .nav-item {
  transition:
    transform .22s ease,
    color .22s ease,
    background .22s ease,
    padding-left .22s ease;
}

.sidebar .nav-item:hover {
  transform: translateX(4px);
}

.sidebar .nav-item .material-symbols-outlined {
  transition:
    transform .25s ease,
    color .25s ease;
}

.sidebar .nav-item:hover .material-symbols-outlined {
  transform: scale(1.12);
}

.sidebar .nav-item.active .material-symbols-outlined {
  animation: aeroScaleIn .3s ease both;
}

.brand-mark {
  transition:
    transform .3s ease,
    box-shadow .3s ease;
}

.brand-mark:hover {
  transform: rotate(-4deg) scale(1.05);
}

/* SYSTEM */

.system-state .pulse-ring {
  animation: aeroLivePulse 2.2s ease-in-out infinite;
}

/* KPI */

.kpi-card {
  position: relative;
  overflow: hidden;
  transition:
    transform .25s ease,
    border-color .25s ease,
    box-shadow .25s ease;
}

.kpi-card:hover {
  transform: translateY(-5px);
  box-shadow:
    0 18px 45px rgba(0,0,0,.18),
    0 0 0 1px rgba(215,165,111,.08);
}

.kpi-card::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(
      110deg,
      transparent 25%,
      rgba(255,255,255,.045) 50%,
      transparent 75%
    );
  transform: translateX(-120%);
}

.kpi-card:hover::after {
  animation: aeroShimmer .8s ease;
}

.kpi-icon {
  transition:
    transform .25s ease,
    background .25s ease;
}

.kpi-card:hover .kpi-icon {
  transform: rotate(-5deg) scale(1.08);
}

/* BUTTONS */

.primary-button,
.secondary-button,
.text-button,
.icon-button,
.avatar-button {
  transition:
    transform .2s ease,
    box-shadow .2s ease,
    background .2s ease,
    border-color .2s ease,
    color .2s ease;
}

.primary-button:hover,
.secondary-button:hover {
  transform: translateY(-2px);
}

.primary-button:active,
.secondary-button:active,
.icon-button:active,
.avatar-button:active {
  transform: translateY(0) scale(.97);
}

.primary-button .material-symbols-outlined,
.secondary-button .material-symbols-outlined,
.text-button .material-symbols-outlined {
  transition: transform .25s ease;
}

.primary-button:hover .material-symbols-outlined {
  transform: translateX(3px);
}

.secondary-button:hover .material-symbols-outlined {
  transform: translateX(2px);
}

.text-button:hover .material-symbols-outlined {
  transform: translateX(4px);
}

/* SEARCH */

.search-box {
  transition:
    transform .2s ease,
    border-color .2s ease,
    box-shadow .2s ease;
}

.search-box:focus-within {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(0,0,0,.12);
}

/* TABLE */

.table-wrap tbody tr {
  transition:
    background .2s ease,
    transform .2s ease;
}

.table-wrap tbody tr:hover {
  transform: translateX(3px);
}

/* STATUS */

.status-dot {
  animation: aeroLivePulse 2.3s ease-in-out infinite;
}

.status-pill.critical .status-dot,
.status-dot.critical {
  animation-duration: 1.05s;
}

.live-badge i,
.model-status i {
  animation: aeroLivePulse 1.8s ease-in-out infinite;
}

/* PROGRESS */

.mini-progress i,
.rul-track i,
.progress i {
  transform-origin: left center;
  animation: aeroProgress .9s cubic-bezier(.2,.75,.2,1) both;
}

/* CHARTS */

.donut {
  animation: aeroScaleIn .65s .2s cubic-bezier(.2,.75,.2,1) both;
}

.donut-wrap {
  animation: aeroFloat 4s ease-in-out 1s infinite;
}

.sparkline path {
  stroke-dasharray: 700;
  animation: aeroChartDraw 1.4s .3s ease-out both;
}

.line-chart svg polyline {
  stroke-dasharray: 700;
  animation: aeroChartDraw 1.6s .25s ease-out both;
}

.line-chart svg path {
  animation: aeroFadeUp 1s .25s ease both;
}

.bar {
  transform-origin: bottom;
  animation: aeroBarGrow .7s cubic-bezier(.2,.75,.2,1) both;
}

.bar-column:nth-child(1) .bar {
  animation-delay: .05s;
}

.bar-column:nth-child(2) .bar {
  animation-delay: .08s;
}

.bar-column:nth-child(3) .bar {
  animation-delay: .11s;
}

.bar-column:nth-child(4) .bar {
  animation-delay: .14s;
}

.bar-column:nth-child(5) .bar {
  animation-delay: .17s;
}

.bar-column:nth-child(6) .bar {
  animation-delay: .20s;
}

.bar-column:nth-child(7) .bar {
  animation-delay: .23s;
}

.bar-column:nth-child(8) .bar {
  animation-delay: .26s;
}

.bar-column:nth-child(9) .bar {
  animation-delay: .29s;
}

.bar-column:nth-child(10) .bar {
  animation-delay: .32s;
}

.bar-column:nth-child(11) .bar {
  animation-delay: .35s;
}

.bar-column:nth-child(12) .bar {
  animation-delay: .38s;
}

/* PREDICTION */

.prediction-orbit {
  animation: aeroFloat 5s ease-in-out infinite;
}

.orbit-1 {
  animation: aeroSpin 14s linear infinite;
}

.orbit-2 {
  animation: aeroSpin 19s linear reverse infinite;
}

.prediction-core {
  animation: aeroGlowPulse 3s ease-in-out infinite;
}

/* TELEMETRY */

.telemetry-mini {
  transition:
    transform .25s ease,
    border-color .25s ease;
}

.telemetry-mini:hover {
  transform: translateY(-3px);
}

/* =========================================================
   PORTAL DROPDOWNS
========================================================= */

.aero-overlay-root {
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  pointer-events: none;
}

.aero-dropdown {
  position: fixed;
  pointer-events: auto;
  box-sizing: border-box;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--panel);
  box-shadow: 0 22px 55px rgba(0,0,0,.28);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  animation: aeroScaleIn .22s cubic-bezier(.2,.75,.2,1) both;
  transform-origin: top right;
}

.aero-notification-panel {
  width: 340px;
  max-width: calc(100vw - 24px);
  padding: 14px;
}

.aero-profile-panel {
  width: 240px;
  max-width: calc(100vw - 24px);
  padding: 14px;
}

.aero-notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.aero-notification-header strong {
  display: block;
  font-family: "Hanken Grotesk", sans-serif;
  font-size: 14px;
}

.aero-notification-header small {
  display: block;
  margin-top: 2px;
  color: var(--muted);
  font-size: 9px;
}

.aero-notification-item {
  display: flex;
  gap: 10px;
  padding: 11px;
  margin-top: 7px;
  border-radius: 10px;
  background: var(--panel2);
  border: 1px solid transparent;
  transition:
    transform .2s ease,
    border-color .2s ease,
    background .2s ease;
}

.aero-notification-item:hover {
  transform: translateX(3px);
  border-color: var(--line);
  background: var(--panel3);
}

.aero-notification-icon {
  width: 30px;
  height: 30px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: rgba(255,80,80,.10);
  color: var(--bad);
}

.aero-notification-item.warning .aero-notification-icon {
  color: var(--warn);
  background: rgba(220,170,70,.10);
}

.aero-notification-item strong {
  display: block;
  font-size: 10px;
}

.aero-notification-item p {
  margin: 3px 0 0;
  color: var(--muted);
  font-size: 9px;
  line-height: 1.45;
}

.aero-notification-item time {
  display: block;
  margin-top: 4px;
  color: var(--muted2);
  font-family: "JetBrains Mono", monospace;
  font-size: 7px;
}

.aero-profile-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

.aero-profile-avatar {
  width: 36px;
  height: 36px;
  flex: none;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: white;
  background: linear-gradient(
    135deg,
    var(--accent),
    var(--accent2)
  );
  font-weight: 700;
}

.aero-profile-user strong {
  display: block;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 10px;
}

.aero-profile-user small {
  display: block;
  margin-top: 2px;
  color: var(--muted);
  font-size: 8px;
}

.aero-profile-action {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 9px;
  margin-top: 9px;
  padding: 9px;
  border: 0;
  border-radius: 8px;
  color: var(--muted);
  background: transparent;
  text-align: left;
  font-size: 9px;
  cursor: pointer;
  transition:
    background .2s ease,
    color .2s ease,
    transform .2s ease;
}

.aero-profile-action:hover {
  background: var(--panel2);
  color: var(--text);
  transform: translateX(3px);
}

.aero-alert-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 15px;
  height: 15px;
  padding: 0 4px;
  display: grid;
  place-items: center;
  box-sizing: border-box;
  border-radius: 999px;
  background: var(--bad);
  color: white;
  font-family: "JetBrains Mono", monospace;
  font-size: 7px;
  font-weight: 700;
  border: 2px solid var(--panel);
  animation: aeroBadge .35s ease both;
}

.aero-notification-button .material-symbols-outlined {
  transition: transform .2s ease;
}

.aero-notification-button:hover .material-symbols-outlined {
  transform: translateY(-1px);
}

.aero-notification-button.has-alerts .material-symbols-outlined {
  animation: aeroNotification .7s ease;
}

/* REDUCED MOTION */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
`;

function AnimationLayer() {
  return <style>{animationStyles}</style>;
}

/* =========================================================
   ICON
========================================================= */

function Icon({
  children,
  className = "",
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

/* =========================================================
   STATUS
========================================================= */

function StatusDot({ status }) {
  const statusClass = String(
    status || "unknown"
  )
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span
      className={`status-dot ${statusClass}`}
      aria-hidden="true"
    />
  );
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  activePage,
  setActivePage,
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <Icon>air</Icon>
        </div>

        <div>
          <h1>AeroRUL</h1>
          <p>Fleet Intelligence</p>
        </div>
      </div>

      <div className="nav-label">
        OPERATIONS
      </div>

      <nav
        className="sidebar-nav"
        aria-label="Primary navigation"
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${
              activePage === item.id
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActivePage(item.id)
            }
            aria-current={
              activePage === item.id
                ? "page"
                : undefined
            }
          >
            <Icon>{item.icon}</Icon>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className={`nav-item ${
            activePage === "settings"
              ? "active"
              : ""
          }`}
          onClick={() =>
            setActivePage("settings")
          }
          aria-current={
            activePage === "settings"
              ? "page"
              : undefined
          }
        >
          <Icon>settings</Icon>
          <span>Settings</span>
        </button>

        <div className="system-state">
          <span
            className="pulse-ring"
            aria-hidden="true"
          >
            <span />
          </span>

          <div>
            <strong>
              Systems nominal
            </strong>

            <small>
              Last sync 14 sec ago
            </small>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* =========================================================
   PORTAL POSITIONING
========================================================= */

function getDropdownPosition(
  anchor,
  width
) {
  if (!anchor) {
    return {
      top: 70,
      right: 20,
    };
  }

  const rect =
    anchor.getBoundingClientRect();

  const gap = 10;

  let left =
    rect.right - width;

  if (
    left <
    12
  ) {
    left = 12;
  }

  const maxLeft =
    window.innerWidth -
    width -
    12;

  if (left > maxLeft) {
    left = maxLeft;
  }

  return {
    top: rect.bottom + gap,
    left,
  };
}

/* =========================================================
   NOTIFICATION PANEL
========================================================= */

function NotificationPanel({
  anchor,
  onClose,
  notifications = [],
}) {
  const [position, setPosition] =
    useState(() =>
      getDropdownPosition(
        anchor,
        340
      )
    );

  useEffect(() => {
    const update = () => {
      setPosition(
        getDropdownPosition(
          anchor,
          340
        )
      );
    };

    update();

    window.addEventListener(
      "resize",
      update
    );

    window.addEventListener(
      "scroll",
      update,
      true
    );

    return () => {
      window.removeEventListener(
        "resize",
        update
      );

      window.removeEventListener(
        "scroll",
        update,
        true
      );
    };
  }, [anchor]);

  if (!anchor) {
    return null;
  }

  return createPortal(
    <div className="aero-overlay-root">
      <div
        className="aero-dropdown aero-notification-panel"
        style={position}
        role="dialog"
        aria-label="Fleet notifications"
      >
        <div className="aero-notification-header">
          <div>
            <strong>
              Fleet alerts
            </strong>

            <small>
              Active engine notifications
            </small>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close notifications"
          >
            <Icon>close</Icon>
          </button>
        </div>

        {notifications.map(
          (notification) => (
            <div
              key={notification.id}
              className={`aero-notification-item ${
                notification.type ===
                "warning"
                  ? "warning"
                  : ""
              }`}
            >
              <div className="aero-notification-icon">
                <Icon>
                  {notification.icon}
                </Icon>
              </div>

              <div>
                <strong>
                  {notification.title}
                </strong>

                <p>
                  {notification.text}
                </p>

                <time>
                  {notification.time}
                </time>
              </div>
            </div>
          )
        )}
      </div>
    </div>,
    document.body
  );
}

/* =========================================================
   PROFILE PANEL
========================================================= */

function ProfilePanel({
  anchor,
  userEmail,
  onLogout,
  onSettings,
}) {
  const [position, setPosition] =
    useState(() =>
      getDropdownPosition(
        anchor,
        240
      )
    );

  useEffect(() => {
    const update = () => {
      setPosition(
        getDropdownPosition(
          anchor,
          240
        )
      );
    };

    update();

    window.addEventListener(
      "resize",
      update
    );

    window.addEventListener(
      "scroll",
      update,
      true
    );

    return () => {
      window.removeEventListener(
        "resize",
        update
      );

      window.removeEventListener(
        "scroll",
        update,
        true
      );
    };
  }, [anchor]);

  if (!anchor) {
    return null;
  }

  const initial =
    userEmail
      ?.charAt(0)
      ?.toUpperCase() || "U";

  return createPortal(
    <div className="aero-overlay-root">
      <div
        className="aero-dropdown aero-profile-panel"
        style={position}
        role="dialog"
        aria-label="Profile menu"
      >
        <div className="aero-profile-user">
          <div className="aero-profile-avatar">
            {initial}
          </div>

          <div>
            <strong>
              {userEmail ||
                "AeroRUL Operator"}
            </strong>

            <small>
              Fleet operator
            </small>
          </div>
        </div>

        <button
          type="button"
          className="aero-profile-action"
          onClick={onSettings}
        >
          <Icon>settings</Icon>
          Account settings
        </button>

        <button
          type="button"
          className="aero-profile-action"
          onClick={onLogout}
        >
          <Icon>logout</Icon>
          Sign out
        </button>
      </div>
    </div>,
    document.body
  );
}

/* =========================================================
   TOP BAR
========================================================= */

function TopBar({
  title,
  theme,
  toggleTheme,
  userEmail,
  setActivePage,
  onLogout,
  notifications = [],
}) {
  const [
    notificationsOpen,
    setNotificationsOpen,
  ] = useState(false);

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);

  const [
    notificationAnchor,
    setNotificationAnchor,
  ] = useState(null);

  const [
    profileAnchor,
    setProfileAnchor,
  ] = useState(null);

  const [
    loggingOut,
    setLoggingOut,
  ] = useState(false);

  const alertCount = notifications.length;

  const closeAllMenus = () => {
    setNotificationsOpen(false);
    setProfileOpen(false);
    setNotificationAnchor(null);
    setProfileAnchor(null);
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeAllMenus();
      }
    };

    const handlePointerDown = (
      event
    ) => {
      const target =
        event.target;

      if (
        target?.closest?.(
          "[data-aero-notification-trigger]"
        ) ||
        target?.closest?.(
          "[data-aero-profile-trigger]"
        )
      ) {
        return;
      }

      if (
        target?.closest?.(
          ".aero-dropdown"
        )
      ) {
        return;
      }

      closeAllMenus();
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );
    };
  }, []);

  const handleNotificationToggle =
    (event) => {
      event.stopPropagation();

      const button =
        event.currentTarget;

      if (notificationsOpen) {
        setNotificationsOpen(
          false
        );
        setNotificationAnchor(null);
        return;
      }

      setProfileOpen(false);
      setProfileAnchor(null);

      setNotificationAnchor(
        button
      );

      setNotificationsOpen(true);
    };

  const handleProfileToggle =
    (event) => {
      event.stopPropagation();

      const button =
        event.currentTarget;

      if (profileOpen) {
        setProfileOpen(false);
        setProfileAnchor(null);
        return;
      }

      setNotificationsOpen(false);
      setNotificationAnchor(null);

      setProfileAnchor(button);
      setProfileOpen(true);
    };

  const handleLogout = async () => {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      const {
        error,
      } = await supabase.auth.signOut();

      if (error) {
        console.error(
          "Supabase sign out failed:",
          error
        );

        setLoggingOut(false);
        return;
      }

      closeAllMenus();

      onLogout?.();
    } catch (error) {
      console.error(
        "Unexpected sign out error:",
        error
      );

      setLoggingOut(false);
    }
  };

  const openSettings = () => {
    closeAllMenus();
    setActivePage("settings");
  };

  return (
    <header className="topbar">
      <div className="topbar-title">
        <div className="title-indicator" />

        <div>
          <span className="eyebrow">
            AERORUL / COMMAND
          </span>

          <h2>{title}</h2>
        </div>
      </div>

      <div className="topbar-actions">
        <div className="search-box">
          <Icon>search</Icon>

          <input
            type="search"
            placeholder="Search engines, telemetry..."
            aria-label="Search engines and telemetry"
          />
        </div>

        <button
          type="button"
          className={`icon-button notification aero-notification-button ${
            alertCount > 0
              ? "has-alerts"
              : ""
          }`}
          aria-label={`Notifications, ${alertCount} alerts`}
          aria-expanded={
            notificationsOpen
          }
          data-aero-notification-trigger
          onClick={
            handleNotificationToggle
          }
        >
          <Icon>
            notifications
          </Icon>

          {alertCount > 0 && (
            <span className="aero-alert-badge">
              {alertCount}
            </span>
          )}
        </button>

        {notificationsOpen && (
          <NotificationPanel
            anchor={
              notificationAnchor
            }
            notifications={notifications}
            onClose={() => {
              setNotificationsOpen(
                false
              );
              setNotificationAnchor(
                null
              );
            }}
          />
        )}

        <button
          type="button"
          className="icon-button"
          onClick={toggleTheme}
          title={
            theme === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
          aria-label={
            theme === "dark"
              ? "Switch to light mode"
              : "Switch to dark mode"
          }
        >
          <Icon>
            {theme === "dark"
              ? "light_mode"
              : "dark_mode"}
          </Icon>
        </button>

        <button
          type="button"
          className="avatar-button"
          title="Open profile"
          aria-label="Open profile"
          aria-expanded={
            profileOpen
          }
          data-aero-profile-trigger
          onClick={
            handleProfileToggle
          }
          disabled={loggingOut}
        >
          <span>
            {userEmail
              ?.charAt(0)
              ?.toUpperCase() ||
              "U"}
          </span>
        </button>

        {profileOpen && (
          <ProfilePanel
            anchor={profileAnchor}
            userEmail={userEmail}
            onLogout={
              handleLogout
            }
            onSettings={
              openSettings
            }
          />
        )}
      </div>
    </header>
  );
}

/* =========================================================
   PAGE SHELL
========================================================= */

function PageShell({
  children,
  pageKey,
}) {
  return (
    <main
      className="page-content aero-page-animate"
      key={pageKey}
    >
      {children}
    </main>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  eyebrow,
  title,
  action = null,
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">
          {eyebrow}
        </span>

        <h2>{title}</h2>
      </div>

      {action}
    </div>
  );
}

/* =========================================================
   KPI CARD
========================================================= */

function KpiCard({
  icon,
  label,
  value,
  suffix = "",
  delta = "",
  tone = "default",
}) {
  const isNegative =
    typeof delta === "string" &&
    delta.trim().startsWith("-");

  return (
    <article
      className={`kpi-card ${tone}`}
    >
      <div className="card-glow" />

      <div className="kpi-top">
        <span className="kpi-label">
          {label}
        </span>

        <span className="kpi-icon">
          <Icon>{icon}</Icon>
        </span>
      </div>

      <div className="kpi-number">
        {value}
        <small>{suffix}</small>
      </div>

      <div className="kpi-bottom">
        <span
          className={
            isNegative
              ? "negative"
              : "positive"
          }
        >
          <Icon>
            {isNegative
              ? "trending_down"
              : "trending_up"}
          </Icon>

          {delta}
        </span>

        <span>
          vs last 24h
        </span>
      </div>
    </article>
  );
}

/* =========================================================
   SPARKLINE
========================================================= */

function Sparkline({
  variant = 1,
}) {
  const paths = {
    1: "M0 70 C25 65 38 42 60 50 S95 64 120 40 S155 32 180 35 S220 16 250 24 S285 35 320 12",
    2: "M0 22 C25 28 45 18 65 30 S105 48 125 42 S165 62 190 50 S225 54 250 68 S285 58 320 76",
    3: "M0 70 C30 62 48 58 72 62 S112 46 132 50 S170 30 194 40 S230 20 250 27 S292 12 320 18",
  };

  const path =
    paths[variant] ||
    paths[1];

  return (
    <svg
      className="sparkline"
      viewBox="0 0 320 90"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   FLEET STATUS CHART
========================================================= */

function FleetStatusChart() {
  const points =
    "0,110 28,106 56,98 84,103 112,82 140,88 168,69 196,72 224,54 252,62 280,39 308,44 336,27 364,32 392,20 420,25 448,13 476,18 504,9";

  return (
    <div className="line-chart">
      <div className="chart-y">
        <span>100%</span>
        <span>75%</span>
        <span>50%</span>
        <span>25%</span>
        <span>0%</span>
      </div>

      <svg
        viewBox="0 0 504 130"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="fleet-health-area"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0"
              stopOpacity=".28"
            />

            <stop
              offset="1"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        <path
          d={`M${points} L504,130 L0,130 Z`}
          fill="url(#fleet-health-area)"
        />

        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
      </svg>

      <div className="chart-x">
        <span>01:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>NOW</span>
      </div>
    </div>
  );
}

/* =========================================================
   OVERVIEW (WITH DUAL MODEL BREAKDOWN)
========================================================= */

function OverviewPage({
  setActivePage,
  username,
  engines = [],
  onUploadDataset,
  uploading
}) {
  const stats = calculateEngineStats(engines);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUploadDataset(e.target.files[0]);
    }
  };

  // Simulate model specific stats for gru_combined.keras & xgboost.json
  const gruStats = {
    accuracy: "96.4%",
    good: Math.round(stats.healthy * 0.95),
    degraded: Math.round(stats.degraded * 1.05),
    critical: stats.critical
  };

  const xgbStats = {
    accuracy: "95.8%",
    good: Math.round(stats.healthy * 1.02),
    degraded: Math.round(stats.degraded * 0.95),
    critical: stats.critical
  };

  return (
    <PageShell pageKey="overview">
      <input 
        type="file" 
        accept=".csv,.txt" 
        ref={fileInputRef} 
        style={{ display: "none" }} 
        onChange={handleFileChange} 
      />
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            FLEET COMMAND CENTER
          </span>

          <h1>
            Welcome {username || "Operator"}!
          </h1>

          <p>
            Real-time readiness and remaining
            useful life evaluated across dual models.
          </p>
        </div>

        <div className="heading-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              setActivePage("engines")
            }
          >
            <Icon>view_list</Icon>
            View fleet
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Icon>{uploading ? "sync" : "upload_file"}</Icon>
            {uploading ? "Processing Models..." : "Upload files"}
          </button>
        </div>
      </div>

      <section className="kpi-grid">
        <KpiCard
          icon="flight"
          label="Active engines"
          value={stats.healthy}
          suffix={`/ ${stats.total}`}
          delta="+2.4%"
          tone="accent"
        />

        <KpiCard
          icon="health_and_safety"
          label="Fleet health"
          value={stats.avgHealth.toFixed(1)}
          suffix="%"
          delta="+1.8%"
        />

        <KpiCard
          icon="schedule"
          label="Avg. RUL"
          value={Math.round(stats.avgRul)}
          suffix="cycles"
          delta="+4.1%"
        />

        <KpiCard
          icon="warning"
          label="Attention required"
          value={String(stats.attention).padStart(2, "0")}
          suffix="units"
          delta="-16.7%"
          tone="warning"
        />
      </section>

      {/* DUAL MODEL EVALUATION & BREAKDOWN SECTION */}
      <div className="overview-grid">
        {/* GRU MODEL CARD */}
        <section className="panel model-card">
          <SectionHeader
            eyebrow="MODEL EVALUATION"
            title="gru_combined.keras"
            action={
              <span className="model-status">
                <i />
                GRU Sequence
              </span>
            }
          />
          <div className="model-metric">
            <strong>{gruStats.accuracy}</strong>
            <span>Model Accuracy</span>
          </div>
          <div className="readiness-list" style={{ marginTop: "16px" }}>
            <div>
              <span><StatusDot status="Healthy" /> Good / Healthy</span>
              <b>{gruStats.good}</b>
            </div>
            <div>
              <span><StatusDot status="Degraded" /> Degraded / Watch</span>
              <b>{gruStats.degraded}</b>
            </div>
            <div>
              <span><StatusDot status="Critical" /> Critical / Failure</span>
              <b>{gruStats.critical}</b>
            </div>
          </div>
        </section>

        {/* XGBOOST MODEL CARD */}
        <section className="panel model-card">
          <SectionHeader
            eyebrow="MODEL EVALUATION"
            title="xgboost.json"
            action={
              <span className="model-status">
                <i />
                XGBoost Boosting
              </span>
            }
          />
          <div className="model-metric">
            <strong>{xgbStats.accuracy}</strong>
            <span>Model Accuracy</span>
          </div>
          <div className="readiness-list" style={{ marginTop: "16px" }}>
            <div>
              <span><StatusDot status="Healthy" /> Good / Healthy</span>
              <b>{xgbStats.good}</b>
            </div>
            <div>
              <span><StatusDot status="Degraded" /> Degraded / Watch</span>
              <b>{xgbStats.degraded}</b>
            </div>
            <div>
              <span><StatusDot status="Critical" /> Critical / Failure</span>
              <b>{xgbStats.critical}</b>
            </div>
          </div>
        </section>
      </div>

      <div className="overview-grid lower">
        <section className="panel">
          <SectionHeader
            eyebrow="PRIORITY QUEUE"
            title="Engines to watch"
            action={
              <button
                type="button"
                className="text-button"
                onClick={() =>
                  setActivePage(
                    "engines"
                  )
                }
              >
                View all
                <Icon>
                  arrow_forward
                </Icon>
              </button>
            }
          />

          <EngineTable 
            compact 
            engines={engines} 
          />
        </section>

        <section className="panel fleet-health">
          <SectionHeader
            eyebrow="LIVE TELEMETRY"
            title="Fleet health trend"
            action={
              <span className="live-badge">
                <i />
                LIVE
              </span>
            }
          />
          <FleetStatusChart />
        </section>
      </div>
    </PageShell>
  );
}

/* =========================================================
   ENGINE TABLE
========================================================= */

function EngineTable({
  compact = false,
  onSelect,
  engines = [],
}) {
  const displayedEngines = compact
    ? engines
        .filter(
          (engine) =>
            engine.status !==
            "Healthy"
        )
        .slice(0, 4)
    : engines;

  const handleRowKeyDown =
    (
      event,
      engine
    ) => {
      if (!onSelect) {
        return;
      }

      if (
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        onSelect(engine);
      }
    };

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Unit</th>
            <th>Status</th>
            <th>Cycle</th>
            <th>RUL</th>
            <th>Health</th>
            <th>Trend</th>
          </tr>
        </thead>

        <tbody>
          {displayedEngines.map(
            (engine) => {
              const statusClass =
                String(
                  engine.status
                )
                  .toLowerCase()
                  .replace(
                    /\s+/g,
                    "-"
                  );

              const trendClass =
                String(
                  engine.trend
                )
                  .toLowerCase()
                  .replace(
                    /\s+/g,
                    "-"
                  );

              let trendIcon =
                "priority_high";

              if (
                engine.trend ===
                "Stable"
              ) {
                trendIcon =
                  "trending_flat";
              } else if (
                engine.trend ===
                "Watch"
              ) {
                trendIcon =
                  "trending_down";
              }

              return (
                <tr
                  key={engine.id}
                  onClick={() =>
                    onSelect?.(
                      engine
                    )
                  }
                  onKeyDown={(
                    event
                  ) =>
                    handleRowKeyDown(
                      event,
                      engine
                    )
                  }
                  tabIndex={
                    onSelect
                      ? 0
                      : undefined
                  }
                  role={
                    onSelect
                      ? "button"
                      : undefined
                  }
                >
                  <td>
                    <strong>
                      {engine.id}
                    </strong>

                    <small>
                      {engine.model}
                    </small>
                  </td>

                  <td>
                    <span
                      className={`status-pill ${statusClass}`}
                    >
                      <StatusDot
                        status={
                          engine.status
                        }
                      />

                      {
                        engine.status
                      }
                    </span>
                  </td>

                  <td className="mono">
                    {engine.cycle}
                  </td>

                  <td className="mono">
                    <b>
                      {engine.rul}
                    </b>{" "}
                    cyc
                  </td>

                  <td>
                    <div className="mini-progress">
                      <i
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(
                              engine.health,
                              100
                            )
                          )}%`,
                        }}
                      />
                    </div>

                    <span className="health-number">
                      {
                        engine.health
                      }
                      %
                    </span>
                  </td>

                  <td>
                    <span
                      className={`trend ${trendClass}`}
                    >
                      <Icon>
                        {
                          trendIcon
                        }
                      </Icon>

                      {
                        engine.trend
                      }
                    </span>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================================
   ENGINES
========================================================= */

function EnginesPage({
  setActivePage,
  engines = [],
}) {
  const [
    selected,
    setSelected,
  ] = useState(null);

  useEffect(() => {
    setSelected((current) => {
      if (!engines.length) return null;
 
      if (current) {
        return (
          engines.find(
            (engine) => engine.id === current.id
          ) || engines[0]
        );
      }
 
      return engines[0];
    });
  }, [engines]);

  const stats = calculateEngineStats(engines);

  return (
    <PageShell pageKey="engines">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            PROPULSION / UNITS
          </span>

          <h1>
            Engine monitoring
          </h1>

          <p>
            Inspect unit health, telemetry state
            and predicted lifecycle at a glance.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            setActivePage(
              "predictions"
            )
          }
        >
          <Icon>
            batch_prediction
          </Icon>

          Run fleet prediction
        </button>
      </div>

      <section className="engine-layout">
        <div className="panel">
          <div className="filter-row">
            <div className="segmented">
              <button
                type="button"
                className="selected"
              >
                All <b>{stats.total}</b>
              </button>

              <button type="button">
                Healthy <b>{stats.healthy}</b>
              </button>

              <button type="button">
                Watch <b>{stats.degraded}</b>
              </button>

              <button type="button">
                Critical <b>{stats.critical}</b>
              </button>
            </div>

            <button
              type="button"
              className="secondary-button small"
            >
              <Icon>
                filter_list
              </Icon>

              Filters
            </button>
          </div>

          <EngineTable
            engines={engines}
            onSelect={
              setSelected
            }
          />
        </div>

        <EngineDetail
          engine={selected}
        />
      </section>
    </PageShell>
  );
}

/* =========================================================
   ENGINE DETAIL
========================================================= */

function EngineDetail({
  engine,
}) {
  if (!engine) {
    return null;
  }

  const rulPercentage =
    Math.max(
      0,
      Math.min(
        (engine.rul / 120) *
          100,
        100
      )
    );

  const statusClass =
    String(
      engine.status
    )
      .toLowerCase()
      .replace(
        /\s+/g,
        "-"
      );

  return (
    <aside className="panel engine-detail">
      <div className="detail-head">
        <div>
          <span className="eyebrow">
            SELECTED UNIT
          </span>

          <h2>
            {engine?.id || "—"}
          </h2>
        </div>

        <span
          className={`status-pill ${statusClass}`}
        >
          <StatusDot
            status={
              engine?.status || "—"
            }
          />

          {engine?.status || "—"}
        </span>
      </div>

      <div className="detail-rul">
        <span>
          REMAINING USEFUL LIFE
        </span>

        <strong>
          {engine?.rul ?? "—"}
        </strong>

        <em>
          CYCLES
        </em>

        <div className="rul-track">
          <i
            style={{
              width: `${rulPercentage}%`,
            }}
          />
        </div>

        <small>
          Estimated failure at cycle{" "}
          {(engine?.cycle ?? 0) + (engine?.rul ?? 0)}
        </small>
      </div>

      <div className="detail-grid">
        <div>
          <span>
            Current cycle
          </span>

          <b>
            {engine?.cycle ?? "—"}
          </b>
        </div>

        <div>
          <span>
            Health index
          </span>

          <b>
            {engine?.health ?? "—"}%
          </b>
        </div>

        <div>
          <span>
            Model
          </span>

          <b>
            {engine?.model || "—"}
          </b>
        </div>

        <div>
          <span>
            Confidence
          </span>

          <b>
            96.4%
          </b>
        </div>
      </div>

      <div className="telemetry-mini">
        <div className="telemetry-title">
          <span>
            LIVE TELEMETRY
          </span>

          <small>
            2 sec ago
          </small>
        </div>

        <Sparkline
          variant={
            engine.status ===
            "Healthy"
              ? 1
              : 2
          }
        />

        <div className="sensor-values">
          <span>
            Temp <b>0.71</b>
          </span>

          <span>
            Press <b>0.64</b>
          </span>

          <span>
            Speed <b>0.82</b>
          </span>
        </div>
      </div>

      <button
        type="button"
        className="secondary-button full"
        onClick={() =>
          console.log(
            `Opening detailed analysis for ${engine.id}`
          )
        }
      >
        <Icon>
          open_in_new
        </Icon>

        Open detailed analysis
      </button>
    </aside>
  );
}

/* =========================================================
   PREDICTIONS
========================================================= */

function PredictionsPage({ engines = [] }) {
  const targetEngine =
    engines.find((engine) => engine.id === "Engine 042") ||
    engines[0] ||
    null;

  const [
    running,
    setRunning,
  ] = useState(false);

  const [
    progress,
    setProgress,
  ] = useState(0);

  const [
    result,
    setResult,
  ] = useState(targetEngine?.rul ?? 0);

  useEffect(() => {
    setResult(targetEngine?.rul ?? 0);
  }, [targetEngine?.id, targetEngine?.rul]);

  useEffect(() => {
    if (!running) {
      return undefined;
    }

    let currentProgress = 0;

    const timerId =
      window.setInterval(
        () => {
          currentProgress += 5;

          setProgress(
            Math.min(
              currentProgress,
              100
            )
          );

          if (
            currentProgress >=
            100
          ) {
            window.clearInterval(
              timerId
            );

            setRunning(
              false
            );

            setResult(targetEngine?.rul ?? 0);
          }
        },
        90
      );

    return () =>
      window.clearInterval(
        timerId
      );
  }, [running, targetEngine?.rul]);

  const run = () => {
    if (running) {
      return;
    }

    setProgress(0);
    setRunning(true);
  };

  return (
    <PageShell pageKey="predictions">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            PREDICTIVE MAINTENANCE
          </span>

          <h1>
            RUL predictions
          </h1>

          <p>
            Run dual models (gru_combined.keras & xgboost.json) against telemetry.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={run}
          disabled={running}
        >
          <Icon>
            {running
              ? "sync"
              : "play_arrow"}
          </Icon>

          {running
            ? "Processing Dual Models..."
            : "Run prediction"}
        </button>
      </div>

      <section className="prediction-grid">
        <div className="panel prediction-hero">
          <div className="prediction-orbit">
            <div className="orbit orbit-1" />
            <div className="orbit orbit-2" />

            <div className="prediction-core">
              <span>
                {targetEngine?.id || "—"}
              </span>

              <strong>
                {running
                  ? `${progress}%`
                  : result}
              </strong>

              <small>
                {running
                  ? "ANALYZING"
                  : "CYCLES RUL"}
              </small>
            </div>
          </div>

          <div className="prediction-copy">
            <span className="eyebrow">
              {running
                ? "INFERENCE IN PROGRESS"
                : "INFERENCE COMPLETE"}
            </span>

            <h2>
              {running
                ? "Evaluating GRU & XGBoost..."
                : `${targetEngine?.id || "—"} prediction ready`}
            </h2>

            <p>
              {running
                ? "Processing tensors through gru_combined.keras and feature weights through xgboost.json."
                : `Current cycle ${targetEngine?.cycle ?? "—"}. Estimated failure boundary is cycle ${(targetEngine?.cycle ?? 0) + (targetEngine?.rul ?? 0)}.`}
            </p>

            {running && (
              <div
                className="progress"
                aria-label={`Prediction progress ${progress}%`}
              >
                <i
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            )}

            <div className="confidence">
              <span>
                Confidence{" "}
                <b>{targetEngine?.health ?? "—"}%</b>
              </span>

              <span>
                Model{" "}
                <b>
                  {targetEngine?.model || "Dual Ensemble"}
                </b>
              </span>
            </div>
          </div>
        </div>

        <section className="panel degradation">
          <SectionHeader
            eyebrow="LIFECYCLE MODEL"
            title="RUL degradation curve"
          />

          <DegradationChart />
        </section>
      </section>
    </PageShell>
  );
}

/* =========================================================
   DEGRADATION CHART
========================================================= */

function DegradationChart() {
  return (
    <div className="degradation-chart">
      <svg
        viewBox="0 0 720 260"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 28 C100 45 180 68 250 88 S380 135 450 164 S570 212 720 246"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />

        <path
          d="M450 164 C510 178 560 193 610 214 S680 235 720 246"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="8 8"
        />

        <line
          x1="450"
          x2="450"
          y1="0"
          y2="260"
          stroke="currentColor"
          strokeDasharray="4 6"
          opacity=".55"
        />

        <circle
          cx="450"
          cy="164"
          r="7"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

/* =========================================================
   ANALYTICS (UPDATED WITH RECHARTS PREDICTED VS ACTUAL)
========================================================= */

/* =========================================================
   ANALYTICS (UPDATED WITH FANCY UPLOAD BUTTONS)
========================================================= */

function AnalyticsPage() {
  const [testFile, setTestFile] = useState(null);
  const [rulFile, setRulFile] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const handleComparisonSubmit = async (e) => {
    e.preventDefault();
    if (!testFile || !rulFile) {
      alert("Please upload both the Test dataset file and the RUL file!");
      return;
    }

    const formData = new FormData();
    formData.append("test_file", testFile);
    formData.append("rul_file", rulFile);

    setAnalyticsLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/analytics/rul-comparison", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setChartData(data.data);
      } else {
        alert("Error: " + data.detail);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend analytics endpoint.");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  return (
    <PageShell pageKey="analytics">
      <div className="page-heading">
        <div>
          <span className="eyebrow">FLEET INTELLIGENCE</span>
          <h1>Analytics</h1>
          <p>Performance signals across lifecycle, sensor stability and maintenance risk.</p>
        </div>
      </div>

      <div className="analytics-grid" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* File Upload Form */}
        <form onSubmit={handleComparisonSubmit} className="panel" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '16px' }}>
          
          <div style={{ flex: '1 1 200px' }}>
            <span style={{ fontSize: '12px', marginBottom: '8px', display: 'block', color: 'var(--muted)'}}>
              Test Dataset File (.txt)
            </span>
            <label className="secondary-button" style={{ display: 'flex', justifyContent: 'center', width: '100%', cursor: 'pointer', height: '40px', margin: 0, boxSizing: 'border-box' }}>
              <Icon>snippet_folder</Icon>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                {testFile ? testFile.name : "Select Test File"}
              </span>
              <input type="file" accept=".txt" onChange={(e) => setTestFile(e.target.files[0])} style={{ display: 'none' }} />
            </label>
          </div>

          <div style={{ flex: '1 1 200px' }}>
            <span style={{ fontSize: '12px', marginBottom: '8px', display: 'block', color: 'var(--muted)'}}>
              True RUL File (.txt)
            </span>
            <label className="secondary-button" style={{ display: 'flex', justifyContent: 'center', width: '100%', cursor: 'pointer', height: '40px', margin: 0, boxSizing: 'border-box' }}>
              <Icon>rule_folder</Icon>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                {rulFile ? rulFile.name : "Select RUL File"}
              </span>
              <input type="file" accept=".txt" onChange={(e) => setRulFile(e.target.files[0])} style={{ display: 'none' }} />
            </label>
          </div>

          <button type="submit" disabled={analyticsLoading} className="primary-button" style={{ height: '40px' }}>
            <Icon>{analyticsLoading ? "sync" : "analytics"}</Icon>
            {analyticsLoading ? "Evaluating Models..." : "Compare Predictions"}
          </button>
        </form>

        {/* Comparison Graph (Using Recharts) */}
        {chartData.length > 0 && (
          <section className="panel wide">
            <SectionHeader eyebrow="MODEL ACCURACY" title="Predicted vs Actual Remaining Useful Life (RUL)" />
            <div style={{ height: "400px", width: "100%", marginTop: "20px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                  <XAxis dataKey="engine" stroke="var(--muted)" tick={{fill: 'var(--muted)', fontSize: 12}} />
                  <YAxis stroke="var(--muted)" tick={{fill: 'var(--muted)', fontSize: 12}} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--panel2)', borderColor: 'var(--line)', borderRadius: '8px', color: 'var(--text)' }} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line type="monotone" dataKey="Actual RUL" stroke="#22c55e" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  <Line type="monotone" dataKey="GRU Predicted" stroke="#3b82f6" strokeWidth={2} dot={{r: 3}} />
                  <Line type="monotone" dataKey="XGBoost Predicted" stroke="#f59e0b" strokeWidth={2} dot={{r: 3}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}

/* =========================================================
   MODELS
========================================================= */

function ModelsPage() {
  return (
    <PageShell pageKey="models">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            ML OPERATIONS / REGISTRY
          </span>

          <h1>
            Model performance
          </h1>

          <p>
            Active models: <b>gru_combined.keras</b> & <b>xgboost.json</b>
          </p>
        </div>
      </div>

      <div className="overview-grid">
        <section className="panel active-model">
          <h2>gru_combined.keras</h2>
          <p>Recurrent Neural Network sequence model for temporal RUL prediction.</p>
          <div className="model-score">
            <strong>96.4%</strong>
            <span>GRU Accuracy</span>
          </div>
          <Sparkline variant={1} />
        </section>

        <section className="panel active-model">
          <h2>xgboost.json</h2>
          <p>Gradient Boosting feature model for rapid degradation scoring.</p>
          <div className="model-score">
            <strong>95.8%</strong>
            <span>XGBoost Accuracy</span>
          </div>
          <Sparkline variant={3} />
        </section>
      </div>
    </PageShell>
  );
}

/* =========================================================
   DATASET
========================================================= */

function DatasetPage() {
  return (
    <PageShell pageKey="dataset">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            DATA OPERATIONS
          </span>

          <h1>
            Dataset management
          </h1>

          <p>
            Telemetry ingestion, sequence health
            and training data readiness.
          </p>
        </div>
      </div>

      <section className="dataset-grid">
        <KpiCard
          icon="database"
          label="Total sequences"
          value="218,420"
          delta="+12.4%"
        />

        <KpiCard
          icon="data_check"
          label="Validated"
          value="98.7"
          suffix="%"
          delta="+0.4%"
        />

        <KpiCard
          icon="storage"
          label="Storage used"
          value="4.2"
          suffix="TB"
          delta="+0.1%"
        />
      </section>
    </PageShell>
  );
}

/* =========================================================
   SETTINGS
========================================================= */

function SettingsPage() {
  return (
    <PageShell pageKey="settings">
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            SYSTEM CONFIGURATION
          </span>

          <h1>
            Settings
          </h1>

          <p>
            Configure AeroRUL command center
            preferences and system behavior.
          </p>
        </div>
      </div>

      <section className="panel settings-placeholder">
        <SectionHeader
          eyebrow="SYSTEM"
          title="Command center settings"
        />

        <div className="detail-grid">
          <div>
            <span>
              Telemetry status
            </span>

            <b>
              Connected
            </b>
          </div>

          <div>
            <span>
              Prediction engines
            </span>

            <b>
              GRU & XGBoost
            </b>
          </div>

          <div>
            <span>
              Sync interval
            </span>

            <b>
              15 seconds
            </b>
          </div>

          <div>
            <span>
              Environment
            </span>

            <b>
              Production
            </b>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

const normalizeEngineStatus = (status, health) => {
  const value = String(status || "").trim().toLowerCase();
  const numericHealth = Number(health);

  if (value === "critical") return "Critical";
  if (
    value === "degraded" ||
    value === "watch" ||
    value === "warning"
  ) {
    return "Degraded";
  }
  if (
    value === "healthy" ||
    value === "normal" ||
    value === "stable"
  ) {
    return "Healthy";
  }

  if (numericHealth <= 40) return "Critical";
  if (numericHealth <= 75) return "Degraded";

  return "Healthy";
};

const normalizeEnginePrediction = (row) => {
  const health = Number(row.health) || 0;
  const status = normalizeEngineStatus(row.status, health);

  let trend = row.trend || "Stable";

  if (!row.trend) {
    if (status === "Critical") trend = "Action";
    else if (status === "Degraded") trend = "Watch";
  }

  return {
    id: row.engine_id,
    engine_id: row.engine_id,
    status,
    cycle: Number(row.cycle) || 0,
    rul: Number(row.rul) || 0,
    health,
    model: row.model || "GRU/XGB",
    trend,
    created_at: row.created_at,
    prediction_id: row.id,
  };
};

const getLatestEngines = (rows) => {
  const latest = new Map();

  rows.forEach((row) => {
    if (!row.engine_id) return;

    const current = latest.get(row.engine_id);
    const rowTime = new Date(row.created_at).getTime();
    
    if (!current) {
      latest.set(row.engine_id, normalizeEnginePrediction(row));
    } else {
      const currentTime = new Date(current.created_at).getTime();
      if (rowTime > currentTime) {
        latest.set(row.engine_id, normalizeEnginePrediction(row));
      }
    }
  });

  return Array.from(latest.values()).sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  );
};

const calculateEngineStats = (engines) => {
  const total = engines.length;

  const healthy = engines.filter(
    (engine) => engine.status === "Healthy"
  ).length;

  const degraded = engines.filter(
    (engine) => engine.status === "Degraded"
  ).length;

  const critical = engines.filter(
    (engine) => engine.status === "Critical"
  ).length;

  const avgHealth =
    total > 0
      ? engines.reduce((sum, engine) => sum + engine.health, 0) / total
      : 0;

  const avgRul =
    total > 0
      ? engines.reduce((sum, engine) => sum + engine.rul, 0) / total
      : 0;

  return {
    total,
    healthy,
    degraded,
    critical,
    attention: degraded + critical,
    avgHealth,
    avgRul,
    readiness: total > 0 ? (healthy / total) * 100 : 0,
  };
};

export default function App() {
  const [
    activePage,
    setActivePage,
  ] = useState("overview");

  const [
    theme,
    setTheme,
  ] = useState(() => {
    try {
      return (
        localStorage.getItem(
          "aerorul-theme"
        ) || "dark"
      );
    } catch {
      return "dark";
    }
  });

  const [
    user,
    setUser,
  ] = useState(null);

  const [
    authReady,
    setAuthReady,
  ] = useState(false);

  const [engines, setEngines] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [dataError, setDataError] = useState("");
  const [datasetUploaded, setDatasetUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [
    backendStatus,
    setBackendStatus,
  ] = useState("checking");

  useEffect(() => {
    let mounted = true;

    const initializeAuth =
      async () => {
        try {
          const {
            data,
            error,
          } =
            await supabase.auth.getSession();

          if (
            error &&
            error.message
          ) {
            console.warn(
              "Unable to retrieve current session:",
              error.message
            );
          }

          if (!mounted) {
            return;
          }

          setUser(
            data?.session?.user ||
              null
          );
        } catch (error) {
          console.error(
            "Unable to initialize authentication:",
            error
          );

          if (mounted) {
            setUser(null);
          }
        } finally {
          if (mounted) {
            setAuthReady(true);
          }
        }
      };

    initializeAuth();

    const {
      data: authData,
    } =
      supabase.auth.onAuthStateChange(
        (
          event,
          session
        ) => {
          if (!mounted) {
            return;
          }

          setUser(
            session?.user ||
              null
          );

          if (
            event ===
            "SIGNED_OUT"
          ) {
            setActivePage(
              "overview"
            );
            setDatasetUploaded(false);
            setInitialDataLoaded(false);
          }
        }
      );

    return () => {
      mounted = false;

      authData?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setEngines([]);
      setDatasets([]);
      setDataError("");
      setDatasetUploaded(false);
      setInitialDataLoaded(false);
      return;
    }
  
    let mounted = true;
  
    const loadDashboardData = async () => {
      setDataLoading(true);
      setDataError("");
  
      try {
        const [
          predictionsResponse,
          datasetsResponse,
        ] = await Promise.all([
          supabase
            .from("engine_predictions")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
  
          supabase
            .from("datasets")
            .select("*")
            .eq("user_id", user.id)
            .order("uploaded_at", { ascending: false }),
        ]);
  
        if (predictionsResponse.error) {
          throw predictionsResponse.error;
        }
  
        if (datasetsResponse.error) {
          throw datasetsResponse.error;
        }
  
        if (!mounted) return;
  
        const latestEngines = getLatestEngines(
          predictionsResponse.data || []
        );
        const loadedDatasets = datasetsResponse.data || [];
  
        setEngines(latestEngines);
        setDatasets(loadedDatasets);

        if (loadedDatasets.length > 0) {
          setDatasetUploaded(true);
        } else {
          setDatasetUploaded(false);
        }
      } catch (error) {
        console.error("Failed to load AeroRUL data:", error);
  
        if (mounted) {
          setDataError(
            error?.message || "Unable to load dashboard data."
          );
        }
      } finally {
        if (mounted) {
          setDataLoading(false);
          setInitialDataLoaded(true);
        }
      }
    };
  
    loadDashboardData();
  
    const engineChannel = supabase
      .channel(`engine-predictions-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "engine_predictions",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadDashboardData();
        }
      )
      .subscribe();

    const datasetChannel = supabase
      .channel(`datasets-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "datasets",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadDashboardData();
        }
      )
      .subscribe();
  
    return () => {
      mounted = false;
      supabase.removeChannel(engineChannel);
      supabase.removeChannel(datasetChannel);
    };
  }, [user?.id]);

  /* -------------------------------------------------------
     UPLOAD DATASET & TEST BOTH MODELS VIA FASTAPI
  ------------------------------------------------------- */
  const handleUploadAndTestModels = async (file) => {
    if (!file || !user) return;
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: storageError } = await supabase.storage.from('datasets').upload(filePath, file);
      if (storageError) throw storageError;

      const { data, error: dbError } = await supabase.from('datasets').insert([{
        user_id: user.id,
        file_name: file.name,
        storage_path: filePath
      }]).select();
      if (dbError) throw dbError;

      const response = await fetch("http://127.0.0.1:8000/api/process-dataset", {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataset_id: data[0].id, storage_path: filePath, user_id: user.id })
      });
      if (!response.ok) throw new Error("Backend dual-model processing failed.");

      setActivePage("overview");
      window.location.reload(); 
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to process models: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const liveNotifications = useMemo(() => {
    const alerts = [];
    let idCounter = 1;
    
    engines.forEach((engine) => {
      if (engine.status === "Critical") {
        alerts.push({
          id: `crit-${idCounter++}`,
          type: "critical",
          icon: "error",
          title: `${engine.id} approaching failure`,
          text: `Only ${engine.rul} cycles of estimated RUL remain.`,
          time: "Live",
        });
      } else if (engine.status === "Degraded") {
        alerts.push({
          id: `warn-${idCounter++}`,
          type: "warning",
          icon: "warning",
          title: `${engine.id} degraded`,
          text: `Health index is at ${engine.health}%.`,
          time: "Live",
        });
      }
    });

    return alerts;
  }, [engines]);

  useEffect(() => {
    let mounted = true;

    const checkBackend = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/health");

        if (!response.ok) {
          throw new Error(
            `Backend returned ${response.status}`
          );
        }

        const data =
          await response.json();

        if (!mounted) {
          return;
        }

        if (
          data?.status ===
          "healthy"
        ) {
          setBackendStatus(
            "connected"
          );
        } else {
          setBackendStatus(
            "disconnected"
          );
        }
      } catch (error) {
        if (!mounted) {
          return;
        }

        setBackendStatus(
          "disconnected"
        );
      }
    };

    checkBackend();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    try {
      localStorage.setItem(
        "aerorul-theme",
        theme
      );
    } catch {
      // Ignore localStorage errors
    }
  }, [theme]);

  const toggleTheme =
    () => {
      setTheme(
        (current) =>
          current === "dark"
            ? "light"
            : "dark"
      );
    };

  const renderContent = () => {
    switch (activePage) {
      case "overview":
        return (
          <OverviewPage
            setActivePage={setActivePage}
            username={user?.user_metadata?.username || ""}
            engines={engines}
            onUploadDataset={handleUploadAndTestModels}
            uploading={uploading}
          />
        );

      case "engines":
        return (
          <EnginesPage
            setActivePage={setActivePage}
            engines={engines}
          />
        );

      case "predictions":
        return <PredictionsPage engines={engines} />;

      case "analytics":
        return <AnalyticsPage />;

      case "models":
        return <ModelsPage />;

      case "dataset":
        return <DatasetPage />;

      case "settings":
        return <SettingsPage />;

      default:
        return (
          <OverviewPage
            setActivePage={setActivePage}
            username={user?.user_metadata?.username || ""}
            engines={engines}
            onUploadDataset={handleUploadAndTestModels}
            uploading={uploading}
          />
        );
    }
  };

  if (!authReady || (user && !initialDataLoaded)) {
    return (
      <>
        <AnimationLayer />

        <div
          className={`app-wrapper ${theme}`}
        >
          <div
            style={{
              width: "100%",
              minHeight:
                "100vh",
              display: "grid",
              placeItems:
                "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems:
                  "center",
                gap: "10px",
                opacity: 0.7,
              }}
            >
              <Icon>
                sync
              </Icon>

              <span>
                Initializing AeroRUL...
              </span>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <AnimationLayer />

        <Login />
      </>
    );
  }

  return (
    <>
      <AnimationLayer />

      <div
        className={`app-wrapper ${theme}`}
      >
        <Sidebar
          activePage={
            activePage
          }
          setActivePage={
            setActivePage
          }
        />

        <div className="main-content">
          <TopBar
            title={
              PAGE_TITLES[
                activePage
              ] ||
              "Dashboard"
            }
            theme={theme}
            toggleTheme={
              toggleTheme
            }
            userEmail={
              user?.email || ""
            }
            setActivePage={
              setActivePage
            }
            onLogout={() =>
              setUser(null)
            }
            notifications={liveNotifications}
          />

          {renderContent()}
        </div>
      </div>
    </>
  );
}