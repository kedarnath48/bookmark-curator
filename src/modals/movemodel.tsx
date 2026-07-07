import React, { useRef, useEffect } from "react";
import { FolderSchema } from "./../utils/schemas";

interface MoveModelProps {
	onClose: () => void;
	folderData: FolderSchema[];
	toggleMove: (key: string) => void;
	moveBookmark: (destination: string) => void;
}

export const MoveModel: React.FC<MoveModelProps> = ({
	onClose,
	folderData,
	toggleMove,
	moveBookmark,
}) => {
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [onClose]);

	const renderFolders = (folders: FolderSchema[], level: number = 0) => {
		let margin: number = 0;
		if (level !== 0) {
			margin = 20;
		} else {
			margin = 0;
		}
		return folders.map((folder) => (
			<div key={folder.id} style={{ marginLeft: `${margin}px` }}>
				<button className="label-header" onClick={() => {
					toggleMove("moveBool");
					moveBookmark(folder.label);
				}}>
					<i className="fas fa-folder"></i>
					<h4>{folder.label}</h4>
				</button>
				{folder.children.length > 0 &&
					renderFolders(folder.children, level + 1)}
			</div>
		));
	};

	return (
		<div id="setting-model" className="modal-overlay">
			<div ref={modalRef} className="modal">
				{renderFolders(folderData)}
			</div>
		</div>
	);
};
