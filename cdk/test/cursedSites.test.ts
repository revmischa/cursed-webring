import axios from "axios";
import { getAllAndParse } from "../resources/cursedSites";

jest.mock("axios");

it("fetches", async () => {
  (axios.get as jest.Mock).mockResolvedValue({
    data: `http://rapturenow.com/,Rapture Now,"153,000 Souls die every day. Most go to hell."`,
  });

  const res = await getAllAndParse();
  console.log(res);
  expect(res).toMatchObject([{ title: "Rapture Now" }]);

  expect(axios.get).toHaveBeenCalled();
});
