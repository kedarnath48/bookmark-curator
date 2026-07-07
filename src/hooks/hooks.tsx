import { useState, useCallback } from "react";

interface StateDict {
	[key: string]: boolean;
}

export function useToggle(initialStateDict: StateDict) {
	const [toggleState, setToggleState] = useState<StateDict>(initialStateDict);

	const toggle = useCallback((key: string) => {
		setToggleState((prevState: StateDict) => ({
			...prevState,
			[key]: !prevState[key],
		}));
	}, []);

	return [toggleState, toggle] as const;
}
