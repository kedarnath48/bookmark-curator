import React from "react";
import { FilterSchema } from "../../utils/schemas";

interface FiltersTreeProps {
	activeFilter: string | null;
	setActiveFilter: React.Dispatch<React.SetStateAction<string | null>>;
	activeAlphabet: string | null;
	setActiveAlphabet: React.Dispatch<React.SetStateAction<string | null>>;
	filtersData: FilterSchema[];
}

const FiltersTree: React.FC<FiltersTreeProps> = (props) => {
	const {
		activeFilter,
		setActiveFilter,
		activeAlphabet,
		setActiveAlphabet,
		filtersData,
	} = props;

	// Create an array of alphabet characters
	const alphabet = [];
	for (let i = 97; i <= 122; i++) {
		alphabet.push(String.fromCharCode(i));
	}

	const hasFilterStartingWithLetter = (letter: string) => {
		return filtersData.some((filter) => filter.maindomain?.startsWith(letter));
	};

	// Filter data based on active alphabet letter
	const curatedFiltersData = activeAlphabet
		? filtersData.filter((filter) =>
				filter.maindomain?.startsWith(activeAlphabet)
		)
		: filtersData;

	const handleFilterClick = (filter: string) => {
		if(activeFilter === filter) {
			setActiveFilter(null)
		}else {
			setActiveFilter(filter)
		}
	return
	}

	const letterClick = (letter: string) => {
		if(activeAlphabet === letter) {
			setActiveAlphabet(null)
		}else {
			setActiveAlphabet(letter)
		}
		return
	}

	return (
		<div className="filter-tree-ctr">
			{/* Render alphabet characters */}
			{filtersData.length > 0 ? (
				<div className="alphabets-btn-ctr">
					{alphabet.map((letter, index) => (
						<button
							key={index}
							className={activeAlphabet === letter ? "active" : ""}
							onClick={() => letterClick(letter)}
							disabled={!hasFilterStartingWithLetter(letter)}
						>
							{letter}
						</button>
					))}
				</div>
			) : (
				<button>Add Bookmarks</button>
			)}
			{activeAlphabet && (
				<div className="filter-btn-ctr">
					{curatedFiltersData.map(
						(filter, index) =>
							filter.maindomain ? (
								<button
									key={index}
									className={activeFilter === filter.maindomain ? "active" : ""}
									onClick={() => handleFilterClick(filter.maindomain)}
								>
									{filter.maindomain}
								</button>
							) : null // Render null if maindomain doesn't exist
					)}
				</div>
			)}
		</div>
	);
};

export default FiltersTree;
