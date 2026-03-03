import React from "react";

interface TypographyProps {
    children: React.ReactNode;
}

export function Title({ children }: TypographyProps) {
    return <h1 className="text-2xl font-bold">{children}</h1>;
}

export function Text({ children }: TypographyProps) {
    return <p className="text-gray-700">{children}</p>;
}
