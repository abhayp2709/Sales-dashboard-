"use client";

import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
}

export default function Button({ children, onClick }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
        >
            {children}
        </button>
    );
}
