import React from "react";
import renderer from "react-test-renderer";

import SignUpScreen from "../../screens/SignUpScreen";

jest.mock("@expo/vector-icons");

describe("<SignUpScreen />", () => {
  it("renders correctly", async () => {
    const tree = renderer.create(<SignUpScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
