import { LinearProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import * as React from "react";
import { submitCursedSite } from "../Model/Submission";

interface ISubmitFormProps {
  onDone(): void;
}

const SubmitForm = ({ onDone }: ISubmitFormProps) => {
  const [url, setUrl] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [submitter, setSubmitter] = React.useState("");

  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = React.useCallback(async () => {
    setSubmitting(true);
    try {
      await submitCursedSite({ url, title, submitter });
      onDone();
    } finally {
      setSubmitting(false);
    }
  }, [url, onDone, title, submitter]);

  return (
    <div style={{ width: "30rem" }}>
      <div>
        Cursed URL:
        <Input
          required
          onChange={(e) => setUrl(e.target.value)}
          value={url}
          style={{ width: "20rem" }}
        />
      </div>

      <div>
        Title:
        <Input
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          style={{ width: "20rem" }}
        />
      </div>

      <div>
        Your Name:
        <Input
          required
          onChange={(e) => setSubmitter(e.target.value)}
          value={submitter}
          style={{ width: "20rem" }}
        />
      </div>

      <div
        style={{
          display: "flex",
          width: "95%",
          justifyContent: "space-between",
          marginTop: "2rem",
        }}
      >
        <Button variant="contained" color="secondary" onClick={onDone}>
          Cancel
        </Button>
        {submitting && <LinearProgress style={{ width: "5rem" }} />}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default SubmitForm;
