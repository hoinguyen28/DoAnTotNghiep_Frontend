import React, { useState } from "react";
import { BrowseTable } from "./components/browse-art/browseTable";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import { FadeModal } from "../layouts/utils/FadeModal";
import RequireAdmin from "./RequireAdmin";
import { BrowseForm } from "./components/browse-art/BrowseForm";

const ArtManagement: React.FC = () => {
	// Tạo ra biến để mỗi khi thao tác CRUD thì sẽ update lại table
	const [keyCountReload, setKeyCountReload] = useState(0);
	const [option, setOption] = useState(""); // Truyền vào là có thể là (add, update, view)
	const [openModal, setOpenModal] = React.useState(false);
	const handleOpenModal = () => setOpenModal(true);
	const handleCloseModal = () => setOpenModal(false);

	const [id, setId] = useState<number>(0);

	return (
		<div className='conatiner p-5'>
			<div className='shadow-4-strong rounded p-5'>
				
				<div>
					<BrowseTable
						keyCountReload={keyCountReload}
						setOption={setOption}
						setId={setId}
						handleOpenModal={handleOpenModal}
						setKeyCountReload={setKeyCountReload}
					/>
				</div>
			</div>
			<FadeModal
				open={openModal}
				handleOpen={handleOpenModal}
				handleClose={handleCloseModal}
			>
				<BrowseForm
					id={id}
					handleCloseModal={handleCloseModal}
					option={option}
					setKeyCountReload={setKeyCountReload}
				/>
			</FadeModal>
		</div>
	);
};

const ArtManagementPage = RequireAdmin(ArtManagement);
export default ArtManagementPage;
