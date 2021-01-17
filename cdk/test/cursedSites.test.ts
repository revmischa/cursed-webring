import axios from "axios";
// // eslint-disable-next-line @typescript-eslint/no-any
import { getAllAndParse } from "../resources/cursedSites"; // tslint:disable-line
jest.mock("axios");

it("fetches", async () => {
  (axios.get as jest.Mock).mockImplementationOnce(() => Promise.resolve({}));

  const res = await getAllAndParse();
  console.log(res);

  expect(axios.get).toHaveBeenCalled();
});
