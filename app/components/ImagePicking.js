import * as ImagePicker from "expo-image-picker";

export const pickImage = async (...aspect) => {
  console.log(aspect);
  const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
  let result;
  if (status !== "granted") {
    ImagePicker.requestMediaLibraryPermissionsAsync().then(async (res) => {
      if (res.status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return null;
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: aspect === null ? [4, 3] : aspect,
          quality: 0.5, // [0 - 1] compression: smallest size -> best quality
        });
      }
    });
  } else {
    result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: !aspect.length ? [4, 3] : aspect[0],
      quality: 0.5,
    });
  }

  console.log(result);
  return result;
};

export const takePicture = async () => {
  const { status } = await ImagePicker.getCameraPermissionsAsync();
  let result;
  if (status !== "granted") {
    ImagePicker.requestCameraPermissionsAsync().then(async (res) => {
      if (res.status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
        return null;
      } else {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.5,
        });
      }
    });
  } else {
    result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
  }

  console.log(result);
  return result;
};
