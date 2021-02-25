import React, { useEffect, useRef } from "react";

import "./Logout.scss";

const Logout = (props) => {
  /**
   * Hook that alerts clicks outside of the passed ref
   */
  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          props.handleOutsideLogoutModalClick();
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  return (
    <>
      {props.logoutModalState && (
        <div className="Logout" ref={wrapperRef}>
          <p onClick={(e) => props.logoutHandler(e)}>Logout</p>
        </div>
      )}
    </>
  );
};

export default Logout;
