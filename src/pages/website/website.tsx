import About from "./components/about";
import Contact from "./components/contact";
import Home from "./components/home";
import Work from "./components/work";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout";
import { useState, useEffect, useRef } from "react";
import { db } from "../../firebase/firebase";
import { IFormEntity } from "../admin/feedback_form_canvas/feedback_from_canvas";
import { Button, Modal } from "@mui/material";
import FormField from "../admin/sidebar/component/form_fields";
import CloseIcon from "@mui/icons-material/Close";
import "./website.css";
import dayjs from "dayjs";
import Dashboard from "../admin/dashboard";


function Website() {
  const [forms, setForms] = useState<IFormEntity[]>([]);
  const [feedbackForm, setFeedbackForm] = useState<IFormEntity | null>(null);
  const ref = useRef(false);

  useEffect(() => {
    if (window.location.pathname.includes("admin")) return;
    fetchForms();
  }, []);

  useEffect(() => {
    const locals = forms.filter(
      (f) =>
        f.logic?.date?.isEnabled ||
        f.logic?.time?.isEnabled ||
        f.logic?.url?.isEnabled
    );
    const local = locals.filter((loc) => {
      let flag = false;
      if (loc?.logic?.url?.isEnabled) {
        if (window.location.pathname.includes(loc?.logic.url.value ?? ""))
          flag = true;
      }
      if (loc?.logic?.date?.isEnabled) {
        if (dayjs(loc?.logic?.date?.value).isSame(dayjs(), "day")) flag = true;
      }
      if (loc?.logic?.time?.isEnabled) {
        if (loc?.logic?.time?.value === dayjs().format("HH:mm")) flag = true;
      }
      return flag;
    });

    if (!local?.length) return;

    setFeedbackForm(local[0]);
  }, [forms]);

  useEffect(() => {
    if (feedbackForm?.id && !ref.current) {
      updateForm({ view: true });
      ref.current = true;
    }
  }, [feedbackForm]);

  const fetchForms = () => {
    let local: IFormEntity[] = [];
    db.collection("Forms")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = {
            id: doc.id,
            ...doc.data(),
          };
          local.push(data);
        });
        local = local.filter((ld) => ld.isPublished);
        setForms(local);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  const updateForm = async ({
    submissions = false,
    view = false,
  }: {
    submissions?: boolean;
    view?: boolean;
  }) => {
    const payload: IFormEntity = {};

    if (submissions) payload.submissions = (feedbackForm?.submissions ?? 0) + 1;
    if (view) payload.viewed = (feedbackForm?.viewed ?? 0) + 1;
    await db
      .collection("Forms")
      .doc(feedbackForm?.id)
      .update({
        ...payload,
      })
      .then(() => {
        setFeedbackForm((prev) => ({
          ...prev,
          submissions: submissions
            ? (prev?.submissions ?? 0) + 1
            : prev?.submissions,
          viewed: view ? (prev?.viewed ?? 0) + 1 : prev?.viewed,
        }));
      })
      .catch((error) => {
        console.error("Error updating form: ", error);
      });
  };

  const submitFeedback = async () => {
    const payload = {
      formId: feedbackForm?.id,
      createdAt: dayjs().format(),
      answers: feedbackForm?.questions?.map((que) => ({
        title: que.title,
        value: que.value,
        id: que.id,
      })),
    };
    await db
      .collection("FormSubmissions")
      .add({
        ...payload,
      })
      .then(() => {
        setFeedbackForm(null);
        updateForm({ submissions: true });
      })
      .catch((error) => {
        console.error("Error submitting feeback form: ", error);
      });
  };

  return (
    <div>
      {feedbackForm && (
        <Modal
          open
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="websiteFeedbackFormContainer">
            <div className="websiteFeedbackFormTitle">
              <h1>{feedbackForm.title}</h1>
              <Button onClick={() => setFeedbackForm(null)}>
                <CloseIcon
                  style={{
                    color: "white",
                  }}
                />
              </Button>
            </div>
            <div className="websiteFeedbackFormQuestions">
              {feedbackForm.questions?.map((f, index) => {
                return (
                  <div>
                    <FormField
                      data={f}
                      isUserView
                      onChange={(data) => {
                        setFeedbackForm((prev) => {
                          const updatedQuestions = [...(prev?.questions ?? [])];
                          updatedQuestions[index] = { ...data }; // Replace the specific question

                          return {
                            ...prev,
                            questions: updatedQuestions,
                          };
                        });
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="websiteFeedbackFormCtaBtn">
              <Button variant="contained" onClick={submitFeedback}>
                Submit
              </Button>
            </div>
          </div>
        </Modal>
      )}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="work" element={<Work />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default Website;
