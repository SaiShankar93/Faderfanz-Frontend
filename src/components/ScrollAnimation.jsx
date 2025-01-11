// components/ScrollAnimation.js
import { motion } from "framer-motion";
import useScrollAnimation from "../hooks/useScrollAnimation";

const ScrollAnimation = ({ children, variants }) => {
	const [ref, controls] = useScrollAnimation();

	return (
		<motion.div
			ref={ref}
			initial="hidden"
			animate={controls}
			variants={variants}
		>
			{children}
		</motion.div>
	);
};

export default ScrollAnimation;