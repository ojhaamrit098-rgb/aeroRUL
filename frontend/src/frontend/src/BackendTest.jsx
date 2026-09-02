import { useEffect, useState } from "react";

export default function BackendTest() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let mounted = true;

    const checkBackend = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/health"
        );

        if (!response.ok) {
          throw new Error(
            `Backend returned ${response.status}`
          );
        }

        const data = await response.json();

        if (!mounted) {
          return;
        }

        setStatus(
          data?.status === "healthy"
            ? "connected"
            : "disconnected"
        );
      } catch (error) {
        if (!mounted) {
          return;
        }

        console.error(
          "Backend health check failed:",
          error
        );

        setStatus("disconnected");
      }
    };

    checkBackend();

    return () => {
      mounted = false;
    };
  }, []);

  return null;
}