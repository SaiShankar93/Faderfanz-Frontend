// animations/variants.js
export const variants = {
	hidden: { opacity: 0, y: 100 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const scaleUpVariants = {
	hidden: { opacity: 0, scale: 0.8 },
	visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};