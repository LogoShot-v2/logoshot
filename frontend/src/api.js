global.Buffer = global.Buffer || require("buffer").Buffer;
import axios from "./axios";
import * as FileSystem from "expo-file-system";
import { images, icons, COLORS, FONTS, SIZES } from "../constant/";

// export async function GET_TEXT() {
//   axios
//     .get("/function1")
//     .then((res) => console.log(res.data))
//     .catch((err) => console.log(err));
// }

// export async function GET_IMAGE(CaseNo) {
//   const photo = await axios
//     .get("/function2", {
//       params: {
//         caseno: CaseNo,
//       },
//       responseType: "arraybuffer",
//     })
//     .then((res) => {
//       metadata = {
//         trademark_name: decodeURI(res.headers.trademark_name),
//         sdate: res.headers.sdate,
//         edate: res.headers.edate,
//         bchinese: decodeURI(res.headers.bchinese),
//         class_: res.headers.class_,
//         achinese: decodeURI(res.headers.achinese),
//         aenglish: res.headers.aenglish,
//         address: decodeURI(res.headers.address),
//       };
//       // console.log("metadata:", metadata);
//       return {
//         base64Image: Buffer.from(res.data, "binary").toString("base64"),
//         metadata: metadata,
//       };
//     })
//     .then((x) => {
//       x.uri = `data:image/jpeg;base64,${x.base64Image}`;
//       return x;
//     });
//   return photo;
// }

export async function SEND_IMAGE(ImageURL) {
  // Check if any file is selected or not
  if (ImageURL != null) {
    // If file selected then create FormData
    const data = new FormData();
    data.append("name", Date.now());
    // console.log("ImageURL.uri: ", ImageURL.uri);
    const base64 = await FileSystem.readAsStringAsync(ImageURL.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    data.append("file_attachment", base64);
    // Please change file upload URL

    let res = await axios.post("/function3", data, {
      headers: { "Content-Type": "multipart/form-data; " },
    });
    // console.log(res.data);
    if (res.data.status == 1) {
      alert("Upload Successful");
    }
  } else {
    // If no file selected the show alert
    alert("Please Select File first");
  }

  return;
}

export async function GET_IMAGE2() {
  return await axios
    .get("/function4", {
      responseType: "json",
    })
    .then((res) => {
      // console.log(res.data.images[0]);
      // console.log(res.data.images[1]);
      // console.log(res.data.metadatas[0]);
      // console.log(res.data.metadatas[1]);
      const metadatas = res.data.metadatas;
      const base64Images = res.data.base64Images.map((base64Image) => `data:image/jpeg;base64,${base64Image}`);
      let photos = {
        metadatas: [],
        base64Images: [],
      };
      var steps = metadatas.length / 2;
      for (var i = 0; i < steps; i++) {
        photos.metadatas.push([metadatas[2 * i], metadatas[2 * i + 1]]);
        photos.base64Images.push([base64Images[2 * i], base64Images[2 * i + 1]]);
      }
      // console.log(photos.metadatas);
      return photos;
    });
}

function ImagePreprocessing(metadatas, base64Images) {
  let photos = {
    metadatas: [],
    base64Images: [],
  };
  var steps = parseInt(metadatas.length / 2);
  for (var i = 0; i < steps; i++) {
    photos.metadatas.push([metadatas[2 * i], metadatas[2 * i + 1]]);
    photos.base64Images.push([base64Images[2 * i], base64Images[2 * i + 1]]);
  }
  return photos;
}

export async function Searching(ImageURL, searchQuery, checkList) {
  const data = new FormData();
  var initial = "Image Search";
  data.append("name", Date.now());
  if (ImageURL !== images.uploading2) {
    const base64 = await FileSystem.readAsStringAsync(ImageURL.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    data.append("file_attachment", base64);
  } else {
    data.append("file_attachment", null);
    initial = "Text Search";
  }
  data.append("searchQuery", searchQuery);
  data.append("check1", checkList[0] ? "true" : "false");
  data.append("check2", checkList[1] ? "true" : "false");
  data.append("check3", checkList[2] ? "true" : "false");
  data.append("check4", checkList[3] ? "true" : "false");

  return await axios
    .post("/function5", data, {
      headers: { "Content-Type": "multipart/form-data; " },
      responseType: "json",
    })
    .then((res) => {
      const metadatas1 = res.data.metadatas1;
      const base64Images1 = res.data.base64Images1.map((base64Image) => `data:image/jpeg;base64,${base64Image}`);
      const metadatas2 = res.data.metadatas2;
      const base64Images2 = res.data.base64Images2.map((base64Image) => `data:image/jpeg;base64,${base64Image}`);
      let photos1 = ImagePreprocessing(metadatas1, base64Images1);
      let photos2 = ImagePreprocessing(metadatas2, base64Images2);
      // console.log(photos1.metadatas);
      // console.log(photos2.metadatas);
      return { photos1: photos1, photos2: photos2, initial: initial };
    });
}

export async function GET_IMAGE3(label) {
  return await axios
    .get("/function6", {
      responseType: "json",
      params: {
        label: label,
      },
    })
    .then((res) => {
      const base64Images = res.data.base64Images.map((base64Image) => `data:image/jpeg;base64,${base64Image}`);
      return base64Images;
    });
}
