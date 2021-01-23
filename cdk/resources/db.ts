import { DynamoDB } from "aws-sdk";
import { env } from "process";
import { v4 } from "uuid";
import { ISubmissionParams } from "../../src/Model/Submission";

const dynamoClient = new DynamoDB.DocumentClient();

export const saveSubmission = ({ url, submitter, title }: ISubmissionParams) =>
  dynamoClient
    .put({
      TableName: env.CURSED_SITE_SUBMISSIONS_TABLE_NAME!,
      Item: {
        id: v4(),
        url,
        submitter,
        title,
      },
    })
    .promise();
