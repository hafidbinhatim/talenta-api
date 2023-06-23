const axios = require("axios");
const FormData = require("form-data");
const codec = require("string-codec");

const prepForm = (obj) => {
  const { long, lat, desc, cookies, isCheckOut = false } = obj;
  const data = new FormData();
  const status = isCheckOut ? "checkout" : "checkin";

  const latEncoded = codec.encoder(codec.encoder(lat, "base64"), "rot13");
  const longEncoded = codec.encoder(codec.encoder(long, "base64"), "rot13");

  data.append("latitude", latEncoded);
  data.append("longitude", longEncoded);
  data.append("status", status);
  data.append("description", desc);

  config = {
    method: "post",
    url: "https://hr.talenta.co/api/web/live-attendance/request",
    headers: {
      Cookie: cookies,
      ...data.getHeaders(),
    },
    data: data,
  };

  return config;
};

const attendancePost = async (obj) => {
  const config = prepForm(obj);
  const resp = await axios(config);

  return resp.data;
};

const clockIn = async (obj) => {
  return await attendancePost({ ...obj, isCheckOut: false });
};

const clockOut = async (obj) => {
  return await attendancePost({ ...obj, isCheckOut: true });
};

module.exports = {
  clockIn,
  clockOut,
};
