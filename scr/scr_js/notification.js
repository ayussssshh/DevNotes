import "./../scr_css/notification.css"


// const link = document.createElement("link");
// link.rel = "stylesheet";
// link.href = "/css/notification.css";

// document.head.appendChild(link);





const SUCCESS_ICON = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="24"
     height="24"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="2.5"
     stroke-linecap="round"
     stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M8 12.5l2.5 2.5L16.5 9"/>
</svg>
`;



const ERROR_ICON = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="24"
     height="24"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="2.5"
     stroke-linecap="round"
     stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9 9l6 6"/>
    <path d="M15 9l-6 6"/>
</svg>
`;




const WARNING_ICON = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="24"
     height="24"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="2.5"
     stroke-linecap="round"
     stroke-linejoin="round">
    <path d="M12 3L2.8 19a2 2 0 001.7 3h15a2 2 0 001.7-3L12 3z"/>
    <path d="M12 8v5"/>
    <circle cx="12" cy="17" r="1"/>
</svg>
`;




const INFO_ICON = `
<svg xmlns="http://www.w3.org/2000/svg"
     width="24"
     height="24"
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     stroke-width="2.5"
     stroke-linecap="round"
     stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 11v5"/>
    <circle cx="12" cy="7.5" r="0.8" fill="currentColor" stroke="none"/>
</svg>
`;




const ICONS = {
    success: SUCCESS_ICON,
    error: ERROR_ICON,
    warning: WARNING_ICON,
    info: INFO_ICON
};


export const notify = (message, type = "info") => {

    // Find or create notification container
    let container = document.getElementById("notification-container");

    if (!container) {
        container = document.createElement("div");
        container.id = "notification-container";
        document.body.appendChild(container);
    }

    // Main notification
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;

    // Icon
    const icon = document.createElement("div");
    icon.className = "notification-icon";
    icon.innerHTML = ICONS[type] || ICONS.info;

    // Content
    const content = document.createElement("div");
    content.className = "notification-content";

    const heading = document.createElement("h4");
    heading.textContent = type.charAt(0).toUpperCase() + type.slice(1);

    const text = document.createElement("p");
    text.textContent = message;

    content.append(heading, text);

    // Close button
    const close = document.createElement("button");
    close.className = "notification-close";
    close.innerHTML = "&times;";

    close.onclick = () => removeNotification();

    notification.append(icon, content, close);

    container.appendChild(notification);

    // Trigger animation
    requestAnimationFrame(() => {
        notification.classList.add("show");
    });

    function removeNotification() {

        notification.classList.remove("show");

        notification.addEventListener("transitionend", () => {
            notification.remove();
        }, { once: true });

    }

    setTimeout(removeNotification, 8000);
}