import * as Device from "expo-device";

export let device = null;

export const GetDevice = async () => {
  await Device.getDeviceTypeAsync()
    .then(
      (type) => (device = type === Device.DeviceType.PHONE ? "phone" : "tablet")
    )
    .catch(console.log);
};
