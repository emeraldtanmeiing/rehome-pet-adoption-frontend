import React, { useEffect, useState } from "react";
import { filter, isEmpty, omitBy, isNil } from "lodash";
import { useNavigate } from "react-router-dom";
import { updateApplications } from "../../services/application.services";

import { Grid, Spin, Collapse, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import EditableForm from "../editableForm/editableForm";

import "./applicationForm.scss";

const { Panel } = Collapse;

const ApplicationFormNoteAndDocs = ({
  application = {},
  editable = true,
  size = "default",
  showNoteForStaff = true,
}) => {
  const navigate = useNavigate();

  const [applicationFields, setApplicationFields] = useState({
    status: "idle",
    data: null,
  });

  const isLoading = applicationFields.status !== "success";

  useEffect(() => {
    loadApplicationFields();
  }, []);

  const loadApplicationFields = async () => {
    setApplicationFields({ ...applicationFields, status: "loading" });

    let a;
    if (!isEmpty(application)) {
      a = application;
    }

    let fields = [];

    fields.push({
      name: "note",
      label: editable ? "Notes (for applicant)" : "Notes",
      value: a.note,
      extra: editable ? "Applicant is able to see this note on his/her side." : null,
      editable: true,
      required: false,
      type: "textArea-small",
    })

    if(showNoteForStaff){
      fields.push({
        name: "noteInternal",
        label: "Notes (for internal staff)",
        value: a.noteInternal,
        extra: "Applicant is NOT able to see this note on his/her side.",
        editable: true,
        required: false,
        type: "textArea-small",
      });
    }

    fields.push({
      name: "documents",
      label: "Documents",
      value: a?.documents ? a.documents : null,
      extra: editable ? "Applicant is able to see the documents." : null,
      editable: true,
      required: false,
      type: "document",
    });

    setApplicationFields({
      ...applicationFields,
      status: "success",
      data: fields,
    });
  };

  const handleUpdateApplication = async ({
    note,
    noteInternal,
    documents,
  }) => {
    const res = await updateApplications({
      adoptionApplication: omitBy(
        {
          ...application,
          note,
          noteInternal,
          documents,

          adopterID: application.adopterID._id,
          petID: application.petID._id,
          rescuerID: application.rescuerID._id,
          paymentID: application.paymentID?._id
            ? application.paymentID._id
            : null,
        },
        (v) => isNil(v) || v.toString().trim() === ""
      ),
    });
    if (res?.error) {
      message.error(res.error.description);
      return false;
    } else {
      message.success("Updated adoption application successfully!");
      return res;
    }
  };

  const breakpoint = Grid.useBreakpoint();

  return (
    <div className="application">
      <div className="note-and-documents">
        {isLoading && (
          <>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          </>
        )}

        {!isLoading && (
          <Collapse defaultActiveKey={["1"]}>
            <Panel header="Notes & Documents" key="1">
              {(editable ? (
              <>
                <EditableForm
                  fields={applicationFields.data}
                  api={handleUpdateApplication}
                  editable={true}
                  size={size}
                />
              </>
              ) : (
              <>
                <EditableForm
                  fields={filter(applicationFields.data, (v) => {
                    return (
                      v.name !== "image" && v.value !== null && v.value !== ""
                    );
                  })}
                  api={handleUpdateApplication}
                  editable={false}
                  size={size}
                />
              </>
              ))}
            </Panel>
          </Collapse>
        )}
      </div>
    </div>
  );
};

export default ApplicationFormNoteAndDocs;
