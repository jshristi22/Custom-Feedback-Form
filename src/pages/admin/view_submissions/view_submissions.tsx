import { Card, CardContent, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "./view_submission.css";
import { db } from "../../../firebase/firebase";
import { IFormEntity } from "../feedback_form_canvas/feedback_from_canvas";
import CollapseCard from "../../../components/collapse_card/collapse_card";

interface IFormSubmissionType {
  id?: string;
  formId?: string;
  createdAt?: string;
  answers?: {
    id?: string;
    title?: string;
    value?: string;
  }[];
}

function ViewSubmissions({
  formId,
  onBackClick,
}: {
  formId: string;
  onBackClick: () => void;
}) {
  const [data, setData] = useState<IFormEntity>();
  const [submissions, setSubmissions] = useState<IFormSubmissionType[]>([]);
  useEffect(() => {
    // api call to fetch data
    fetchForm();
    fetchFeedbackForms();
  }, [formId]);

  const fetchForm = () => {
    let local;
    db.collection("Forms")
      .doc(formId)
      .get()
      .then((querySnapshot) => {
        local = {
          id: querySnapshot?.id,
          ...querySnapshot?.data(),
        };
        setData(local);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  const fetchFeedbackForms = () => {
    const local: IFormSubmissionType[] = [];
    db.collection("FormSubmissions")
      .where("formId", "==", formId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((que) => {          
          local.push({
            id: que?.id,
            ...que?.data(),
          });
        });
        setSubmissions(local);
      })
      .catch((error) => {
        console.log("Error getting submissions: ", error);
      });
  };  

  return (
    <div className="viewSubmissionsContainer">
      <Card>
        {/* Header */}
        <div className="viewSubmissionsCardHeader">
          <div className="viewSubmissionsTitle">
            <IconButton onClick={onBackClick}>
              <ArrowBackIosIcon
                sx={{
                  color: "#FFF",
                  cursor: "pointer",
                }}
              />
            </IconButton>
            <h4>{data?.title}</h4>
          </div>
          <p>Created Date: {dayjs(data?.datePublished).format("DD/MM/YYYY")}</p>
        </div>

        {/* Body */}
        <CardContent className="viewSubmissionsBody">
          <div className="logistics">
            <div className="views">
              <h1 className="viewSubmissionsLogisticsData">{data?.viewed}</h1>
              <p className="viewSubmissionsLogisticsText">Views</p>
            </div>
            <div className="submissions">
              <h1 className="viewSubmissionsLogisticsData">
                {data?.submissions}
              </h1>
              <p className="viewSubmissionsLogisticsText">Submission</p>
            </div>
          </div>
          <div className="details">
            {data?.logic?.url?.isEnabled && (
              <h2>Page URL contains {data?.logic?.url.value}</h2>
            )}
            {data?.logic?.date?.isEnabled && (
              <h2>Date: {data?.logic?.date?.value}</h2>
            )}
            {data?.logic?.time?.isEnabled && (
              <h2>Time: {data?.logic?.time?.value}</h2>
            )}
          </div>

          <div className="feebackForm">
            {submissions?.map((f, index) => {
              return (
                <CollapseCard
                  date={f.createdAt!}
                  title={`Feedback ${index + 1}`}
                  data={f.answers}
                />
              );
            })}
          </div>
        </CardContent>
        {}
      </Card>
    </div>
  );
}

export default ViewSubmissions;
