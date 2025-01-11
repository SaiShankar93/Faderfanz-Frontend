// hooks/useScrollAnimation.js
import { useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const useScrollAnimation = (threshold = 0.05) => {
	const controls = useAnimation();
	const [ref, inView] = useInView({
		triggerOnce: true,
		threshold,
	});

	useEffect(() => {
		if (inView) {
			controls.start("visible");
		}
	}, [controls, inView]);

	return [ref, controls];
};

export default useScrollAnimation;