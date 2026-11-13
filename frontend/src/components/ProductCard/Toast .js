import React, { useEffect, useState } from "react";
// ---------- call this from ANY file to show a message ----------
// showToast("success", "Added to cart")
// showToast("danger", "Failed to add to cart")
// showToast("warning", "Please login first")
export const showToast = (type, text) => {
    window.dispatchEvent(new CustomEvent("showToast", { detail: { type, text } }));
};

// colour + title + icon for each type
const STYLES = {
    success: {
        title: "Added to cart",
        color: "success",
        icon: "M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z",
    },
    danger: {
        title: "Something went wrong",
        color: "danger",
        icon: "M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z",
    },
    warning: {
        title: "Login required",
        color: "warning",
        icon: "M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z",
    },
};

let nextId = 1;

// put <Toast /> ONE time in App.jsx (next to your Navbar)
function Toast() {
    const [toasts, setToasts] = useState([]);

    const closeToast = (id) => {
        setToasts((list) => list.filter((t) => t.id !== id));
    };

    useEffect(() => {
        const timers = [];

        const onShow = (e) => {
            const id = nextId++;
            const { type = "success", text = "" } = e.detail || {};

            // keep max 3 toasts on screen
            setToasts((list) => [...list.slice(-2), { id, type, text }]);

            // hide by itself after 3 seconds
            timers.push(setTimeout(() => closeToast(id), 3000));
        };

        window.addEventListener("showToast", onShow);
        return () => {
            window.removeEventListener("showToast", onShow);
            timers.forEach(clearTimeout);
        };
    }, []);

    return (
        // top-right, under the navbar
        <div className="position-fixed end-0 p-3" style={{ top: "70px", zIndex: 1100 }}>
            {toasts.map((t) => {
                const s = STYLES[t.type] || STYLES.success;
                return (
                    <div
                        key={t.id}
                        className={`toast show bg-white border-0 border-start border-4 border-${s.color} shadow rounded-3 mb-2`}
                        role="alert"
                        style={{ width: "320px", maxWidth: "calc(100vw - 32px)" }}
                    >
                        <div className="d-flex align-items-start gap-3 p-3">
                            {/* round icon */}
                            <span
                                className={`rounded-circle bg-${s.color} bg-opacity-10 text-${s.color}-emphasis d-flex align-items-center justify-content-center flex-shrink-0`}
                                style={{ width: "36px", height: "36px" }}
                            >
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d={s.icon} />
                                </svg>
                            </span>

                            {/* text */}
                            <div className="flex-grow-1">
                                <div className="fw-semibold">{s.title}</div>
                                <div className="small text-body-secondary">{t.text}</div>
                            </div>

                            {/* close */}
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={() => closeToast(t.id)}
                            ></button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Toast;