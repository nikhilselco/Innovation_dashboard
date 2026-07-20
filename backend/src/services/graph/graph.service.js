const axios = require("axios");
const { getAccessToken } = require("./auth.service");
const { driveId, fileId } = require("../../config/graph.config");

async function getItemMetadata() {
  const token = await getAccessToken();
  const metadataResponse = await axios.get(
    `https://graph.microsoft.com/v1.0/drives/${driveId}/items/${fileId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return metadataResponse.data;
}

// Cheap check (no file bytes) so the poller can skip the full download+parse
// when the sheet hasn't actually changed since the last cycle.
async function getFileLastModified() {
  const metadata = await getItemMetadata();
  return metadata.lastModifiedDateTime;
}

async function downloadExcelFile() {
  const metadata = await getItemMetadata();
  const downloadUrl = metadata["@microsoft.graph.downloadUrl"];
  const fileResponse = await axios.get(downloadUrl, {
    responseType: "arraybuffer",
  });
  return fileResponse.data;
}

module.exports = {
  downloadExcelFile,
  getFileLastModified,
};