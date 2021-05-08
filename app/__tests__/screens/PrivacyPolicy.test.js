import React from "react";
import renderer from "react-test-renderer";

import PrivacyPolicy from "../../screens/PrivacyPolicy";

jest.mock("@expo/vector-icons");

describe("<PrivacyPolicy />", () => {
  it("renders correctly", async () => {
    const tree = renderer.create(<PrivacyPolicy />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
