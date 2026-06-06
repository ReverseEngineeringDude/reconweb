import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export default function NumberTicker({ value }) {
    const [displayedValue, setDisplayedValue] = useState(0);
    const springValue = useSpring(0, {
        stiffness: 100,
        damping: 30,
        mass: 1
    });

    useEffect(() => {
        springValue.set(value);
    }, [value, springValue]);

    useEffect(() => {
        const unsubscribe = springValue.on("change", (latest) => {
            setDisplayedValue(Math.floor(latest));
        });
        return () => unsubscribe();
    }, [springValue]);

    return <span>{displayedValue}</span>;
}
