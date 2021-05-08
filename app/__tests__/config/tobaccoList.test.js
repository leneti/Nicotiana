import { tobaccoList, brandList } from "../../config/tobaccoList";

describe("Tobacco List", () => {
  it("brandList contains all brands from tobaccoList", () => {
    brandList.forEach((brand) => {
      expect(tobaccoList).toHaveProperty(brand);
    });
  });
});
