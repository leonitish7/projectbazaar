"use client";

import React, { useState, useRef, ReactNode, CSSProperties } from 'react';
import { motion } from 'framer-motion';

interface Card3DProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    intensity?: number;
    scale?: number;
    glare?: boolean;
    shadow?: boolean;
    disabled?: boolean;
}

const Card3D = ({
    children,
    className = '',
    style,
    intensity = 20,
    scale = 1.02,
    glare = true,
    shadow = true,
    disabled = false,
}: Card3DProps) => {
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    // Handle mouse movement for 3D effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled || !cardRef.current) return;

        // Get position of the card
        const rect = cardRef.current.getBoundingClientRect();

        // Calculate mouse position relative to card center (from -0.5 to 0.5)
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Set rotation based on mouse position and intensity
        setRotateX(-y * intensity); // Negative because we want to rotate towards the mouse
        setRotateY(x * intensity);

        // Calculate glare position (normalized from 0 to 100%)
        setGlarePosition({
            x: (e.clientX - rect.left) / rect.width * 100,
            y: (e.clientY - rect.top) / rect.height * 100
        });
    };

    const handleMouseLeave = () => {
        // Reset the rotation when mouse leaves
        setRotateX(0);
        setRotateY(0);
    };

    return (
        <motion.div
            ref={cardRef}
            className={`overflow-hidden ${className}`}
            style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
                ...style
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileHover={!disabled ? { scale } : {}}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
            }}
        >
            <motion.div
                style={{
                    width: "100%",
                    height: "100%",
                    transformStyle: "preserve-3d",
                    rotateX: rotateX,
                    rotateY: rotateY,
                    boxShadow: shadow ? "0px 10px 30px -5px rgba(0,0,0,0.1)" : "none",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {children}
            </motion.div>

            {/* Glare effect */}
            {glare && !disabled && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.2) 0%, transparent 60%)`,
                        opacity: Math.max(Math.abs(rotateX), Math.abs(rotateY)) / intensity,
                    }}
                />
            )}
        </motion.div>
    );
}

export default Card3D;