require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { getAccessToken } = require("./src/services/graph/auth.service");
const { downloadExcelFile } = require("./src/services/graph/graph.service");
const app = express();

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

app.get("/test-auth", async (req, res) => {
  try {
    const token = await getAccessToken();
    res.json({
      success: true,
      message: "Azure authentication successful",
      tokenLength: token.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/file-id-test", async (req, res) => {
  try {
    const token = await getAccessToken();
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/drives/${process.env.DRIVE_ID}/items/${process.env.FILE_ID}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.log(
      Buffer.isBuffer(error.response?.data)
        ? error.response.data.toString()
        : error.response?.data
    );
    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});

app.get("/download-excel", async (req, res) => {
  try {
    const fileBuffer = await downloadExcelFile();
    res.json({
      success: true,
      fileSize: fileBuffer.length,
    });
  } catch (error) {
    const errData = error.response?.data;
    if (Buffer.isBuffer(errData)) {
      console.log(errData.toString("utf8"));
    } else {
      console.log(errData);
    }
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});