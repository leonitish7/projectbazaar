"use client";
import React, { useEffect, useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxSectionProps {
    children: ReactNode;
    direction?: 'up' | 'down' | 'left' | 'right';
    speed?: number;
    className?: string;
}

const ParallaxSection = ({
    children,
    direction = 'up',
    speed = 0.3,
    className = '',
}: ParallaxSectionProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    // Calculate transform based on direction
    const getTransformValue = () => {
        switch (direction) {
            case 'up':
                return useTransform(scrollYProgress, [0, 1], ['0%', `-${speed * 100}%`]);
            case 'down':
                return useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);
            case 'left':
                return useTransform(scrollYProgress, [0, 1], ['0%', `-${speed * 100}%`]);
            case 'right':
                return useTransform(scrollYProgress, [0, 1], ['0%', `${speed * 100}%`]);
            default:
                return useTransform(scrollYProgress, [0, 1], ['0%', `-${speed * 100}%`]);
        }
    };

    const transformValue = getTransformValue();

    const isHorizontal = direction === 'left' || direction === 'right';

    return (
        <motion.div
            ref={ref}
            style={{
                [isHorizontal ? 'x' : 'y']: transformValue,
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default ParallaxSection;