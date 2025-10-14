import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import "./ContextMenu.css";

export interface ContextMenuItem {
    label: string;
    onClick?: () => void;
    icon?: ReactNode;
    hint?: string;
    type?: "divider"; // optional để thêm đường kẻ chia
}

interface ContextMenuProps {
    id?: string;
    items: ContextMenuItem[];
    children: ReactNode;
}

const MENU_WIDTH = 220;

const ContextMenu: React.FC<ContextMenuProps> = ({ items, children }) => {
    const [visible, setVisible] = useState(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const rootRef = useRef<HTMLDivElement>(null);

    // Đóng khi nhấn ESC
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setVisible(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // Đóng khi click ra ngoài
    useEffect(() => {
        if (!visible) return;

        const onClickOutside = (e: MouseEvent) => {
            const target = e.target as Element;

            // Không đóng nếu click vào menu
            if (target.closest('.context-menu')) return;

            // Không đóng nếu click vào wrapper
            if (rootRef.current?.contains(target)) return;

            setVisible(false);
        };

        // Delay để tránh đóng ngay sau khi mở
        const timeoutId = setTimeout(() => {
            window.addEventListener("mousedown", onClickOutside);
        }, 10);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("mousedown", onClickOutside);
        };
    }, [visible]);

    // Khi click chuột phải
    const onContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();

        const clickX = e.clientX;
        const clickY = e.clientY;

        const ww = window.innerWidth;
        const hh = window.innerHeight;

        // Tính toán chiều cao menu dựa trên số items (bao gồm cả divider)
        const itemCount = items.filter(item => item.type !== 'divider').length;
        const dividerCount = items.filter(item => item.type === 'divider').length;
        const menuHeight = itemCount * 44 + dividerCount * 17 + 12; // 44px per item, 17px per divider, 12px padding

        let x = clickX;
        let y = clickY;

        // Điều chỉnh vị trí nếu menu bị tràn ra ngoài viewport
        if (clickX + MENU_WIDTH > ww) x = ww - MENU_WIDTH - 8;
        if (clickY + menuHeight > hh) y = hh - menuHeight - 8;

        setPos({ x, y });
        setVisible(true);
    };

    const onItemClick = (fn?: () => void) => {
        setVisible(false);
        if (fn) fn();
    };

    return (
        <>
            <div
                ref={rootRef}
                className="context-wrapper"
                onContextMenu={onContextMenu}
            >
                {children}
            </div>
            {visible && createPortal(
                <div
                    className="context-menu"
                    style={{
                        left: `${pos.x}px`,
                        top: `${pos.y}px`,
                        position: 'fixed',
                        zIndex: 9999
                    }}
                    role="menu"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="context-menu-body">
                        {items.map((item, idx) =>
                            item.type === "divider" ? (
                                <div key={`divider-${idx}`} className="divider" />
                            ) : (
                                <button
                                    key={`item-${idx}`}
                                    className="context-menu-item"
                                    onClick={() => onItemClick(item.onClick)}
                                    role="menuitem"
                                    disabled={!item.onClick}
                                >
                                    {item.icon && (
                                        <span className="context-menu-icon">{item.icon}</span>
                                    )}
                                    <span className="context-menu-label">{item.label}</span>
                                    {item.hint && (
                                        <span className="context-menu-hint">{item.hint}</span>
                                    )}
                                </button>
                            )
                        )}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default ContextMenu;