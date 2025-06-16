import React, { useState, useEffect } from "react";

const ModalLayout = ({ open, onClose, children }) => {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6 relative scale-95 animate-fadeInUp max-h-[99vh] overflow-y-auto">
            {/* Header */}
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default ModalLayout;
