import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Input,
  Radio,
  Rating,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import strongly_unsatisfied from "../../../../assets/images/strongly_unsatisfied.png";
import unsatisfied from "../../../../assets/images/unsatisfied.png";
import neutral from "../../../../assets/images/neutral.png";
import satisfied from "../../../../assets/images/somewhat_satisfied.png";
import strongly_satisfied from "../../../../assets/images/strongly_satisfied.png";
import "./form_fields.css";
import { IFeedbackFormFieldType } from "../../feedback_form_canvas/feedback_from_canvas";

function FormField({
  onDeleteClick,
  onEditClick,
  data,
  isUserView = false,
  onChange,
}: {
  data: IFeedbackFormFieldType;
  isUserView?: boolean;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onChange?: (data: IFeedbackFormFieldType) => void;
}) {
  const getCardContentBasedOnType = () => {
    switch (data.type) {
      case "textArea":
        return (
          <div>
            <h3>{data.title}</h3>
            <Input
              fullWidth
              sx={{
                border: "1.6px solid gray",
                borderRadius: "2px",
              }}              
              rows={6}
              multiline
              value={data.value}
              onChange={(e) => {
                onChange?.({ ...data, value: e.target.value });
              }}
            ></Input>
          </div>
        );
      case "categories":
        return (
          <div>
            <h3>{data.title}</h3>
            <div className="categoryContainer">
              {data.options?.map((cat) => {
                return (
                  <div
                    className={`cat ${cat === data.value ? "addborder" : ""}`}
                    onClick={() => {
                      onChange?.({ ...data, value: cat });
                    }}
                  >
                    {cat}
                  </div>
                );
              })}
            </div>
          </div>
        );
      case "singleline":
        return (
          <div>
            <h3>{data.title}</h3>
            <Input
              fullWidth
              value={data.value}
              onChange={(e) => onChange?.({ ...data, value: e.target.value })}
              sx={{
                border: "1.6px solid gray",
                borderRadius: "2px",
              }}
            ></Input>
          </div>
        );
      case "radio":
        return (
          <div>
            <h3>{data.title}</h3>
            {data.options?.map((opt) => (
              <div className="row">
                <Radio
                  className={opt.split(" ").join("")}
                  checked={opt === data.value}
                  title={opt}
                  onChange={() => {
                    onChange?.({ ...data, value: opt });
                  }}
                />
                <label>{opt}</label>
              </div>
            ))}
          </div>
        );
      case "smiley":
        return (
          <div>
            <h3>{data.title}</h3>
            <div className="smileyContainer">
              {[
                strongly_unsatisfied,
                unsatisfied,
                neutral,
                satisfied,
                strongly_satisfied,
              ].map((smile) => {
                return (
                  <IconButton
                    onClick={() =>
                      onChange?.({
                        ...data,
                        value: smile,
                      })
                    }
                  >
                    <div
                      className={`${
                        data.value === smile
                          ? "addBorderSmiley"
                          : ""
                      }`}
                    >
                      <img src={smile} />
                    </div>
                  </IconButton>
                );
              })}
            </div>
          </div>
        );
      case "star":
        return (
          <div>
            <h3>{data.title}</h3>
            <Rating
              name="customized-10"
              defaultValue={0}
              value={Number(data.value)}
              onChange={(_, val) => {
                onChange?.({ ...data, value: val?.toString() });
              }}
              max={5}
              size="large"
            />
          </div>
        );
      case "numeric":
        return (
          <div>
            <h3>{data.title}</h3>
            <ButtonGroup
              // variant="outlined"
              aria-label="Basic button group"
              sx={{
                color: "gray",
              }}
            >
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map(
                (num) => {
                  return (
                    <Button
                      sx={{
                        color: data.value === num ? "white" : "gray",
                        borderColor: "gray",
                      }}
                      color="error"
                      onClick={() => onChange?.({ ...data, value: num })}
                      variant={data.value === num ? "contained" : "outlined"}
                    >
                      {num}
                    </Button>
                  );
                }
              )}
            </ButtonGroup>
          </div>
        );
    }
  };

  return (
    <>
      {isUserView ? (
        getCardContentBasedOnType()
      ) : (
        <Card>
          <CardContent>
            {getCardContentBasedOnType()}
            <CardActions
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <IconButton onClick={onEditClick}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={onDeleteClick}>
                <DeleteIcon />
              </IconButton>
            </CardActions>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default FormField;
