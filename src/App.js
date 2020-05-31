import React, { useEffect, useRef, useState } from "react";
import "./styles.css";

// interface PropsType {
//   menuEl: refObject;
//   targetEl?: refObject;
// }
function useContextMenu({ menuEl, targetEl }) {
  const containerEl = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // if no target is passed set containerEl to document
  // we assume they want it to show up anywhere right click happens
  useEffect(() => {
    if (!targetEl) {
      containerEl.current = document;
    } else {
      containerEl.current = targetEl.current;
    }
  }, [targetEl]);
  useEffect(() => {
    const isClickOutside = e => {
      if (menuEl?.current && menuEl.current.contains(e.target)) {
        return setTimeout(() => setIsOpen(false), 200);
      }
      if (isOpen && !menuEl?.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleContextClick = e => {
      if (!isOpen && containerEl.current.contains(e.target)) {
        e.preventDefault();
        setIsOpen(true);
        menuEl.current.style.top = `${e.clientY}px`;
        menuEl.current.style.left = `${e.clientX}px`;
      }
    };
    window.addEventListener("contextmenu", handleContextClick);

    // no sense is having mousedown listener if menu is not open
    if (isOpen) {
      window.addEventListener("mousedown", isClickOutside);
    }
    return () => {
      window.removeEventListener("contextmenu", handleContextClick);
      window.removeEventListener("mousedown", isClickOutside);
    };
  }, [menuEl, targetEl, isOpen]);

  return { isOpen };
}
export default function App() {
  const targetEl = useRef(null);
  const menuEl = useRef(null);
  const { isOpen } = useContextMenu({ menuEl, targetEl });

  return (
    <div className="App">
      <span ref={targetEl}>
        <h1>Hello CodeSandbox</h1>
      </span>
      <h2>Start editing to see some magic happen!</h2>
      {isOpen && (
        <div ref={menuEl} className="menu">
          <ul>
            <li onClick={() => alert("charge an invoice")}>
              charge an invoice
            </li>
            <li onClick={() => alert("call client")}>call client</li>
            <li onClick={() => alert("copy")}>copy</li>
            <li onClick={() => alert("paste")}>paste</li>
          </ul>
        </div>
      )}
    </div>
  );
}
