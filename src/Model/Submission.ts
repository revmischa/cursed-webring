import axios from "axios";

const submissionUrl = `${process.env.REACT_APP_API_BASE}/sites/`;

export interface ISubmissionParams {
  url: string;
  submitter?: string;
  title?: string;
}

export const submitCursedSite = async (params: ISubmissionParams) =>
  (await axios.post(submissionUrl, params)).data;
