require("dotenv").config();
const express = require("express");
const axios = require("axios");
const XLSX = require("xlsx");
const { getAccessToken } = require("./src/services/graph/auth.service");
const { downloadExcelFile } = require("./src/services/graph/graph.service");
const { getWorkbook } = require("./src/services/excel/excel-reader.service");
const { parseLongList } = require("./src/services/excel/longlist.service");
const dashboardRoutes = require("./src/routes/dashboard.routes");
const { startExcelMonitor } = require("./src/polling/excel-monitor.service");
const app = express();

app.use(dashboardRoutes);

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

app.get("/sheet-names", async (req, res) => {
  try {
    const fileBuffer = await downloadExcelFile();
    const workbook = getWorkbook(fileBuffer);
    res.json({
      success: true,
      sheets: workbook.SheetNames,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/long-list-preview", async (req, res) => {
  try {
    const fileBuffer = await downloadExcelFile();
    const workbook = getWorkbook(fileBuffer);
    const sheet = workbook.Sheets["Long List of Solution packages"];
    const data = XLSX.utils.sheet_to_json(sheet, {
      range: 2,
    });
    res.json({
      totalRows: data.length,
      columns: Object.keys(data[0]),
      sample: data[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/long-list-raw", async (req, res) => {
  try {
    const fileBuffer = await downloadExcelFile();
    const workbook = getWorkbook(fileBuffer);

    const sheet =
      workbook.Sheets["Long List of Solution packages"];

    const rawData = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
    });

    res.json(rawData.slice(0, 5));
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/long-list-clean", async (req, res) => {
  try {
    const fileBuffer = await downloadExcelFile();

    const workbook = getWorkbook(fileBuffer);

    const sheet =
      workbook.Sheets["Long List of Solution packages"];

    const rawData = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
    });

    const data = parseLongList(rawData);

    res.json({
      totalRows: data.length,
      columns: Object.keys(data[0]),
      sample: data[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/value-chain-preview", async (req, res) => {
  try {
    const fileBuffer = await downloadExcelFile();

    const workbook = getWorkbook(fileBuffer);

    const sheet = workbook.Sheets["Value chain"];

    const rawData = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
    });

    const data = parseLongList(rawData);

    res.json({
      totalRows: data.length,
      columns: Object.keys(data[0]),
      sample: data[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/calendar-preview", async (req, res) => {
  try {
    const fileBuffer = await downloadExcelFile();

    const workbook = getWorkbook(fileBuffer);

    const sheet =
      workbook.Sheets["Calendar_benchmarking solutions"];

    const rawData = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
    });

    const data = parseLongList(rawData);

    res.json({
      totalRows: data.length,
      columns: Object.keys(data[0]),
      sample: data[0],
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/value-chain-raw", async (req, res) => {
  try {
    const fileBuffer = await downloadExcelFile();
    const workbook = getWorkbook(fileBuffer);

    const sheet = workbook.Sheets["Value chain"];

    const rawData = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
    });

    res.json(rawData.slice(0, 10));
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/calendar-raw", async (req, res) => {
  try {
    const fileBuffer = await downloadExcelFile();
    const workbook = getWorkbook(fileBuffer);

    const sheet =
      workbook.Sheets["Calendar_benchmarking solutions"];

    const rawData = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
    });

    res.json(rawData.slice(0, 10));
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

app.listen(5000, async () => {
  console.log("Server running on port 5000");
  await startExcelMonitor();
});