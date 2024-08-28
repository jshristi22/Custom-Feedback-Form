import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import cardIcon from "../../assets/images/survey_icon.png";
import "./feedback_card.css";
import AddIcon from "@mui/icons-material/Add";
import { IFormEntity } from "./feedback_form_canvas/feedback_from_canvas";
import dayjs from "dayjs";
import { db } from "../../firebase/firebase";

function FeedbackCard({
  data,
  onNewFormClick,
  refetchForms,
  onEditClick,
  onViewSubmissionClick,
}: {
  data?: IFormEntity;
  onNewFormClick?: () => void;
  refetchForms?: () => void;
  onEditClick?: () => void;
  onViewSubmissionClick?: () => void;
}) {
  const deleteForm = async () => {
    db.collection("Forms")
      .doc(data?.id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
        refetchForms?.();
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  if (data == null) {
    return (
      <div
        className="feedbackCard"
        onClick={() => {
          onNewFormClick?.();
        }}
      >
        <Card sx={{ minWidth: 306, minHeight: 379 }}>
          <div className="newForm">
            <AddIcon
              sx={{
                width: "60px",
                height: "60px",
              }}
              color="primary"
            />
            <Typography
              sx={{
                fontSize: "32px",
                fontWeight: "500",
              }}
            >
              New Form
            </Typography>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Card sx={{ minWidth: 306, minHeight: 379 }}>
        <div className="cardHeader">
          <img src={cardIcon} />
        </div>
        <CardContent>
          <Typography
            sx={{ fontSize: 20, fontWeight: 500 }}
            color="text.primary"
            gutterBottom
          >
            {data.title}
          </Typography>
          <Typography>
            <div className="subItems">
              <h6>Submitted</h6>
              <p>{data?.submissions}</p>
            </div>
            <div className="subItems">
              <h6>Viewed</h6>
              <p>{data?.viewed}</p>
            </div>
            <div className="subItems">
              <h6>Date published</h6>
              <p>{dayjs(data?.datePublished).format("DD/MM/YYYY")}</p>
            </div>
          </Typography>
        </CardContent>
        <CardActions className="actionBtnContainer">
          <Button
            sx={{
              padding: "8px 20px",
            }}
            variant="contained"
            size="small"
            fullWidth
            color="secondary"
            onClick={onViewSubmissionClick}
          >
            View Submission
          </Button>
          <div className="actinBtns">
            <Button
              sx={{
                padding: "8px 20px",
              }}
              variant="contained"
              size="small"
              color="success"
              onClick={onEditClick}
            >
              Edit
            </Button>
            <Button
              sx={{
                padding: "8px 20px",
              }}
              variant="contained"
              size="small"
              onClick={() => deleteForm()}
            >
              Delete
            </Button>
          </div>
        </CardActions>
      </Card>
    </div>
  );
}

export default FeedbackCard;
