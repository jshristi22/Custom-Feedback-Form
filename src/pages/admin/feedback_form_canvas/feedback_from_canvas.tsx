import { Button, Card, CardContent } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useEffect, useState } from "react";
import CustomModal from "../../../components/custom_modal/custom_modal";
import Sidebar, { FormFieldType } from "../sidebar/sidebar";
import FormField from "../sidebar/component/form_fields";
import { v4 as uuidv4 } from "uuid";
import "./feedback_form_canvas.css";

export interface ILogicType {
  isEnabled?: boolean;
  value?: string;
}
export interface IConditionalLogicType {
  url?: ILogicType;
  date?: ILogicType;
  time?: ILogicType;
}
export interface IFormEntity {
  id?: string;
  title?: string;
  submissions?: number;
  datePublished?: string;
  viewed?: number;
  isPublished?:boolean;
  questions?: IFeedbackFormFieldType[];
  logic?: IConditionalLogicType;
}

export interface IFeedbackFormFieldType {
  id: string;
  type: FormFieldType;
  orderNo: number; // todo
  title: string;
  isRequired: boolean;
  value?: string;
  errorText?: string;
  options?: string[];
}

interface IFieldDataType {
  title: string;
  isRequired: boolean;
  value?: string;
  errorText?: string;
  options?: string[];
}

const fieldData: { [key in FormFieldType]: IFieldDataType } = {
  [FormFieldType.TEXTAREA]: {
    title: "Would you like to add a comment?",
    isRequired: false,
    options: [],
    value: "",
    errorText: "",
  },
  [FormFieldType.CATEGORIES]: {
    title: "Pick a subject and provide your feedback:",
    options: ["Bug", "Content", "Other"],
    value: "",
    isRequired: false,
    errorText: "",
  },
  [FormFieldType.SINGLELINE]: {
    title: "Do you have any suggestions to improve our website?",
    value: "",
    isRequired: false,
    errorText: "",
    options: [],
  },
  [FormFieldType.RADIO]: {
    title: "Multiple choice - 1 answer",
    isRequired: false,
    options: ["Option one", "Option two", "Option three"],
    errorText: "",
    value: "",
  },
  [FormFieldType.SMILEY]: {
    title: "What is your opinion of this page?",
    value: "",
    isRequired: false,
    errorText: "",
    options: [],
  },
  [FormFieldType.NUMERIC]: {
    title:
      "How likely is it that you will recommend us to your family and friends?",
    isRequired: false,
    value: "",
    errorText: "",
    options: [],
  },
  [FormFieldType.STAR]: {
    title: "Give a star rating for the website.",
    isRequired: false,
    value: "",
    errorText: "",
    options: [],
  },
};

function FeedbackFormCanvas({
  formData,
  title,
  onFormDataChange,
  onBackClick,
}: {
  formData?: IFormEntity;
  title?: string;
  onFormDataChange: (data: IFormEntity) => void;
  onBackClick?: () => void;
}) {
  const [formTitle, setFormTitle] = useState(title ?? formData?.title ?? "");
  const [isEditTitleClicked, setIsEditTitleClicked] = useState(false);
  const [type, setType] = useState<FormFieldType | null>(null);
  const [editFieldId, setEditFieldId] = useState<string | null>(null);
  const [fields, setFields] = useState<IFeedbackFormFieldType[]>([]);
  const [conditionalLogics, setConditionalLogic] =
  useState<IConditionalLogicType>({...formData?.logic});

  useEffect(() => {
    setFields([...(formData?.questions ?? [])]);
  }, [formData]);

  useEffect(() => {
    if (type !== null) {
      const local = [...fields];
      local.push({
        id: uuidv4(),
        orderNo: local.length,
        type: type,
        title: fieldData[type].title,
        isRequired: fieldData[type].isRequired,
        value: fieldData[type].value,
        errorText: fieldData[type].errorText,
        options: fieldData[type].options,
      });
      setFields(local);
      setType(null);
    }
  }, [type]);

  useEffect(() => {
    onFormDataChange({
      title: formTitle,
      questions: fields,
      logic: conditionalLogics,
    });
  }, [fields, formTitle, conditionalLogics]);

  const deleteFieldsState = (id: string) => {
    const local = fields.filter((f) => f.id !== id);
    setFields(local);
  };

  const updateFieldsState = (data: IFeedbackFormFieldType) => {
    const localFields = fields.map((f) => {
      if (f.id == data.id) {
        return data;
      } else return f;
    });
    setFields(localFields);
  };

  return (
    <>
      {isEditTitleClicked && (
        <CustomModal
          title="Edit"
          ctaBtnLabel="Save"
          data={title ?? formData?.title ?? ""}
          handleCancelClick={() => setIsEditTitleClicked(false)}
          handleCtaClick={(title) => {
            setFormTitle(title);
          }}
        />
      )}

      <div className="createFeedbackFormContainer">
        {/* FeedbackFormCanvas */}
        <div className="canvasContainer">
          <div className="canvas">
            <Card sx={{ minHeight: "700px" }}>
              <div className="canvasLabel">
                <Button onClick={onBackClick}>
                  <ArrowBackIosIcon
                    sx={{
                      color: "#FFF",
                    }}
                  />
                </Button>
                <h4>{formTitle}</h4>
                <Button onClick={() => setIsEditTitleClicked(true)}>
                  <EditIcon
                    sx={{
                      color: "#FFF",
                    }}
                  />
                </Button>
              </div>
              <CardContent>
                {fields.length == 0 ? (
                  <div className="emptyFormState">
                    <p className="emptyFormStateText">Add fields</p>
                  </div>
                ) : (
                  <div className="fieldsContainer">
                    {fields?.map((f) => {
                      return (
                        <div draggable onDragStart={() => {}}>
                          <FormField
                            onDeleteClick={() => deleteFieldsState(f.id)}
                            onEditClick={() => {
                              setEditFieldId(f.id);
                            }}
                            data={f}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* sidebar */}
        <div className="sidebarContainer">
          <Sidebar
            onAddFieldClick={(t) => {
              setType(t);
            }}
            editFieldData={
              editFieldId == null
                ? null
                : fields.filter((f) => f.id == editFieldId)?.[0]
            }
            onBackClick={() => setEditFieldId(null)}
            onSaveClick={(data) => {
              updateFieldsState(data);              
            }}
            conditionalLogics={conditionalLogics}
            updateCondtionalLogics={(data) =>{
              setConditionalLogic((prev) =>{
                return {
                  ...prev,
                  ...data,
                }
              })
            }}
          />
        </div>
      </div>
    </>
  );
}

export default FeedbackFormCanvas;
