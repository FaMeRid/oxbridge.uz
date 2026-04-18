import { useEffect } from "react";

export default function TelegramLogin() {
  useEffect(() => {
    window.onTelegramAuth = async (user) => {
      console.log("Telegram user:", user);

      const res = await fetch("http://localhost:4000/auth/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      const data = await res.json();
      console.log("LOGIN RESULT:", data);
    };

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", "Oxbridgeuzielts_bot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.async = true;

    const container = document.getElementById("telegram-login");
    if (container) {
      container.innerHTML = "";
      container.appendChild(script);
    }
  }, []);

  return <div id="telegram-login" />;
}