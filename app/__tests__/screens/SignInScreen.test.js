import React from "react";
import renderer from "react-test-renderer";

import SignInScreen from "../../screens/SignInScreen";

describe("<SignInScreen />", () => {
  it("renders correctly", () => {
    const tree = renderer.create(<SignInScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
