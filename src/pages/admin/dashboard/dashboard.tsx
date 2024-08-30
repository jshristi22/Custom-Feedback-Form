
import dayjs from "dayjs";
import { useState, useEffect, useRef } from "react";
import CustomModal from "../../../components/custom_modal/custom_modal";
import Header from "../../../components/header";
import { db } from "../../../firebase/firebase";
import FeedbackCard from "../feedback_card/feedback_card";
import FeedbackFormCanvas, { IFormEntity } from "../feedback_form_canvas/feedback_from_canvas";
import ViewSubmissions from "../view_submissions/view_submissions";
import "./dashboard.css";

function Dashboard() {
  const [createFormModal, setCreateFormModal] = useState(false);
  const [editFormId, setEditFormId] = useState<string | null>();
  const [isCanvasOpen, setIsCanvasOpen] = useState<string | null>(null);
  const [viewSubmissionFormId, setViewSubmissionFormId] = useState<
    string | null
  >();
  const [forms, setForms] = useState<IFormEntity[]>([]);
  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = () => {
    const local: IFormEntity[] = [];
    db.collection("Forms")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          local.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setForms(local);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };
  const ref = useRef<IFormEntity | null>(null);

  const openCreateFormModal = () => {
    setCreateFormModal(true);
  };

  const showAllForms = () => {
    setIsCanvasOpen(null);
    setEditFormId(null);
  };

  // Api call
  const createForm = async (isPublished: boolean) => {
    const formLength = ref?.current?.questions?.length ?? 0;
    if (formLength < 1 || formLength > 7) {
      // set snackbar
      console.log("Can't do this");
      return;
    }
    const payload = {
      ...ref.current,
      isPublished : isPublished,
      submissions: 0,
      datePublished: dayjs().format(),
      viewed: 0,
    };    
    if (editFormId === null)
      await db
        .collection("Forms")
        .add({
          ...payload,
        })
        .then(() => {
          showAllForms();
          fetchForms();
        })
        .catch((error) => {
          console.error("Error creating/publishing form: ", error);
        });
    else {
      await db
        .collection("Forms")
        .doc(editFormId)
        .set({
          ...payload,
        })
        .then(() => {
          fetchForms();
          showAllForms();
        })
        .catch((error) => {
          console.error("Error updating form: ", error);
        });
    }
  };

  const shouldShowCtaBtnsInHeader = () => {
    return (
      (isCanvasOpen !== null && isCanvasOpen !== undefined) ||
      (editFormId !== null && editFormId !== undefined)
    );
  };

  return (
    <>
      {/* Create form */}
      {createFormModal && (
        <CustomModal
          ctaBtnLabel="Create"
          handleCancelClick={() => setCreateFormModal(false)}
          handleCtaClick={(title) => {
            setIsCanvasOpen(title);
          }}
          title="Create Feedback Form"
        />
      )}

      <div className="dashboardContainer">
        <Header
          showCtaBtn={shouldShowCtaBtnsInHeader()}
          onSaveClick={() => createForm(false)}
          onPublishClick={() => createForm(true)}
        />

        {
          // view submissions
          viewSubmissionFormId ? (
            <ViewSubmissions
              formId={viewSubmissionFormId}
              onBackClick={() => setViewSubmissionFormId(null)}
            />
          ) : // Edit form
          editFormId ? (
            <FeedbackFormCanvas
              formData={forms.filter((f) => f.id === editFormId)[0]}
              onFormDataChange={(data) => {
                ref.current = data;
              }}
              onBackClick={showAllForms}
            />
          ) : // create form
          isCanvasOpen ? (
            <FeedbackFormCanvas
              title={isCanvasOpen}
              onFormDataChange={(data) => {
                ref.current = data;
              }}
              onBackClick={showAllForms}
            />
          ) : (
            // render all form
            <div className="cards">
              <FeedbackCard onNewFormClick={openCreateFormModal} />
              {forms.map((card) => (
                <FeedbackCard
                  data={card}
                  refetchForms={fetchForms}
                  onEditClick={() => setEditFormId(card.id!)}
                  onViewSubmissionClick={() => {
                    setViewSubmissionFormId(card.id);
                  }}
                />
              ))}
            </div>
          )
        }
      </div>
    </>
  );
}

export default Dashboard;
