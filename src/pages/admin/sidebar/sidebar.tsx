import textAreaIcon from "../../../assets/images/text_area.png";
import categoriesIcon from "../../../assets/images/categories.png";
import numericIcon from "../../../assets/images/numeric_rating.png";
import radionBtnIcon from "../../../assets/images/radio_btn.png";
import singleLineIcon from "../../../assets/images/single_line.png";
import smileyIcon from "../../../assets/images/smiley_icon.png";
import starIcon from "../../../assets/images/star_rating.png";
import AddIcon from "@mui/icons-material/Add";
import "./sidebar.css";
import { Button, IconButton, Input, Switch, TextField } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  IConditionalLogicType,
  IFeedbackFormFieldType,
} from "../feedback_form_canvas/feedback_from_canvas";
import { useEffect, useState } from "react";

export enum FormFieldType {
  TEXTAREA = "textArea",
  NUMERIC = "numeric",
  STAR = "star",
  SMILEY = "smiley",
  SINGLELINE = "singleline",
  RADIO = "radio",
  CATEGORIES = "categories",
}

interface IFieldType {
  type: FormFieldType;
  icon: string;
  label: string;
  onClick: () => void;
}

function Sidebar({
  onAddFieldClick,
  editFieldData,
  onBackClick,
  onSaveClick,
  conditionalLogics,
  updateCondtionalLogics,
}: {
  conditionalLogics: IConditionalLogicType;
  updateCondtionalLogics: (data: IConditionalLogicType) => void;
  editFieldData: IFeedbackFormFieldType | null;
  onAddFieldClick: (type: FormFieldType) => void;
  onSaveClick: (data: IFeedbackFormFieldType) => void;
  onBackClick: () => void;
}) {
  const [data, setData] = useState<IFeedbackFormFieldType | null>(
    editFieldData
  );

  useEffect(() => {
    setData(editFieldData);
  }, [editFieldData]);

  const fields: IFieldType[] = [
    {
      type: FormFieldType.TEXTAREA,
      icon: textAreaIcon,
      label: "textarea",
      onClick: () => onAddFieldClick(FormFieldType.TEXTAREA),
    },
    {
      type: FormFieldType.NUMERIC,
      icon: numericIcon,
      label: "Numeric rating",
      onClick: () => onAddFieldClick(FormFieldType.NUMERIC),
    },
    {
      type: FormFieldType.STAR,
      icon: starIcon,
      label: "Star rating",
      onClick: () => {
        onAddFieldClick(FormFieldType.STAR);
      },
    },
    {
      type: FormFieldType.SMILEY,
      icon: smileyIcon,
      label: "Smiley rating",
      onClick: () => {
        onAddFieldClick(FormFieldType.SMILEY);
      },
    },
    {
      type: FormFieldType.SINGLELINE,
      icon: singleLineIcon,
      label: "Single line input",
      onClick: () => {
        onAddFieldClick(FormFieldType.SINGLELINE);
      },
    },
    {
      type: FormFieldType.RADIO,
      icon: radionBtnIcon,
      label: "Radio button",
      onClick: () => {
        onAddFieldClick(FormFieldType.RADIO);
      },
    },
    {
      type: FormFieldType.CATEGORIES,
      icon: categoriesIcon,
      label: "Categories",
      onClick: () => {
        onAddFieldClick(FormFieldType.CATEGORIES);
      },
    },
  ];
  const shouldRenderOptions =
    data?.type === FormFieldType.RADIO ||
    data?.type === FormFieldType.CATEGORIES;

  const updateData = ({
    key,
    value,
  }: {
    key: keyof IFeedbackFormFieldType;
    value: string | boolean | string[] | number;
  }) => {
    if (data?.id === undefined) return;
    const local = {
      ...data,
      [key]: value,
    };
    setData(local);
  };

  const getUrlError = () => {
    return (
      conditionalLogics.url?.isEnabled &&
      (conditionalLogics.url.value === null ||
        conditionalLogics.url.value === undefined)
    );
  };
  const getDateError = () => {
    return (
      conditionalLogics.date?.isEnabled &&
      (conditionalLogics.date.value === null ||
        conditionalLogics.date.value === undefined)
    );
  };
  const getTimeError = () => {
    return (
      conditionalLogics.time?.isEnabled &&
      (conditionalLogics.time.value === null ||
        conditionalLogics.time.value === undefined)
    );
  };
  
  return (
    <>
      <div className="sidebar">
        {data !== null ? (
          <div className="editView">
            <div className="header">
              <IconButton onClick={onBackClick}>
                <ArrowBackIosIcon sx={{ color: "#383838" }} />
              </IconButton>
              <h4 className="sidebarEditHeader">Back to Add fields</h4>
            </div>
            <div className="editFieldBody">
              <div className="editFieldlabel">
                <h6>Label</h6>
                <Input
                  value={data?.title}
                  onChange={(e) => {
                    updateData({ key: "title", value: e.target.value });
                  }}
                />
              </div>
              <div className="editFieldIsRequired">
                <Switch
                  checked={data?.isRequired}
                  onChange={(e) =>
                    updateData({
                      key: "isRequired",
                      value: e.target.checked,
                    })
                  }
                />
                <label>Required</label>
              </div>
              {data?.isRequired && (
                <div className="editFieldErrorMsg">
                  <h6>Error Message</h6>
                  <Input
                    value={data?.errorText}
                    onChange={(e) => {
                      updateData({ key: "errorText", value: e.target.value });
                    }}
                  />
                </div>
              )}

              {shouldRenderOptions && (
                <div className="editFieldOptions">
                  <h6>Options</h6>
                  {data?.options?.map((opt, id) => {
                    return (
                      <Input
                        value={opt}
                        onChange={(e) => {
                          const updatedValue = [...(data.options ?? [])];
                          updatedValue[id] = e.target.value;
                          updateData({ key: "options", value: updatedValue });
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <div className="ctaBtns">
              <Button variant="contained" onClick={() => onSaveClick(data)}>
                Save
              </Button>
              <Button variant="text" onClick={onBackClick}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="addfields">
            <h2>Add fields</h2>
            <div className="table">
              {fields.map((f) => {
                return (
                  <div className="sidebarTablerow">
                    <div className="rowLabel">
                      <img src={f.icon} alt="icon" />
                      <h6>{f.label}</h6>
                    </div>
                    <AddIcon
                      color="primary"
                      fontSize="large"
                      onClick={() => {
                        f.onClick();
                      }}
                      sx={{
                        cursor: "pointer",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/*   conditional logic */}
            <div className="conditionalLogics">
              <div className="logic">
                <div className="heading">
                  <h3>Show based on URL conditions</h3>
                  <Switch
                    size="small"
                    checked={conditionalLogics?.url?.isEnabled}
                    onChange={(e) => {
                      updateCondtionalLogics({
                        ...conditionalLogics,
                        url: {
                          ...conditionalLogics.url,
                          isEnabled: e.target.checked as boolean,
                        },
                      });
                    }}
                  />
                </div>
                <TextField
                  variant="standard"
                  disabled={!conditionalLogics.url?.isEnabled}
                  helperText={getUrlError() ? "It is required" : ""}
                  error={getUrlError()}
                  size="small"
                  value={conditionalLogics.url?.value}
                  placeholder="http://"
                  onChange={(e) => {
                    updateCondtionalLogics({
                      ...conditionalLogics,
                      url: {
                        ...conditionalLogics.url,
                        value: e.target.value,
                      },
                    });
                  }}
                />
              </div>
              <div className="logic">
                <div className="heading">
                  <h3>Show on a specific date</h3>
                  <Switch
                    size="small"
                    checked={conditionalLogics?.date?.isEnabled}
                    onChange={(e) => {
                      updateCondtionalLogics({
                        ...conditionalLogics,
                        date: {
                          ...conditionalLogics.date,
                          isEnabled: e.target.checked as boolean,
                        },
                      });
                    }}
                  />
                </div>
                <TextField
                  variant="standard"
                  disabled={!conditionalLogics.date?.isEnabled}
                  helperText={getDateError() ? "It is required" : ""}
                  error={getDateError()}
                  size="small"
                  type="date"
                  value={conditionalLogics.date?.value}
                  onChange={(e) => {
                    updateCondtionalLogics({
                      ...conditionalLogics,
                      date: {
                        ...conditionalLogics.date,
                        value: e.target.value,
                      },
                    });
                  }}
                />
              </div>
              <div className="logic">
                <div className="heading">
                  <h3>Show on a specific time</h3>
                  <Switch
                    size="small"
                    checked={conditionalLogics?.time?.isEnabled}
                    onChange={(e) => {
                      updateCondtionalLogics({
                        ...conditionalLogics,
                        time: {
                          ...conditionalLogics.time,
                          isEnabled: e.target.checked as boolean,
                        },
                      });
                    }}
                  />
                </div>
                <TextField
                  variant="standard"
                  disabled={!conditionalLogics.time?.isEnabled}
                  helperText={getTimeError() ? "It is required" : ""}
                  error={getTimeError()}
                  size="small"
                  type="time"
                  value={conditionalLogics.time?.value}                  
                  onChange={(e) => {
                    updateCondtionalLogics({
                      ...conditionalLogics,
                      time: {
                        ...conditionalLogics.time,
                        value: e.target.value,
                      },
                    });
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Sidebar;
