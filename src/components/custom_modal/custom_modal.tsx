import { Button, Input } from "@mui/material";
import Modal from "@mui/material/Modal";
import "./custom_modal.css";
import { useState } from "react";

function CustomModal({
  title,
  ctaBtnLabel,
  handleCancelClick,
  handleCtaClick,
  data = "",
}: {
  title: string;
  data?: string;
  ctaBtnLabel: string;
  handleCtaClick: (title: string) => void;
  handleCancelClick: () => void;
}) {
  const [value, setValue] = useState(data);
  return (
    <Modal
      open={true}
      onClose={handleCancelClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="customModal">
        <div className="title">
          <h5>{title}</h5>
          <Input
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter title"
            value={value}
            fullWidth
          />
        </div>
        <div className="ctaBtns">
          <Button
            sx={{
              color: "#189657",
            }}
            onClick={() => {
              handleCtaClick(value);
              handleCancelClick();
            }}
          >
            {ctaBtnLabel}
          </Button>
          <Button onClick={handleCancelClick}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
}

export default CustomModal;
