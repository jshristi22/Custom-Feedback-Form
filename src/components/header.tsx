import { Box, AppBar, Toolbar, Button } from "@mui/material";
import thumbsUpIcon from "../assets/images/thumbs_up_blue.png";
import "./header.css";
function Header({
  showCtaBtn,
  onSaveClick,
  onPublishClick,
}: {
  showCtaBtn: boolean;
  onSaveClick: () => void;
  onPublishClick: () => void;
}) {
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="transparent">
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="customHeader">
              <img src={thumbsUpIcon}></img>
              <p>USER FEEDBACK</p>
            </div>
            {showCtaBtn && (
              <div className="ctaBtn">
                <Button variant="contained" onClick={onSaveClick}>
                  Save
                </Button>
                <Button
                  variant="contained"
                  onClick={onPublishClick}
                  color="success"
                >
                  Publish
                </Button>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}

export default Header;
