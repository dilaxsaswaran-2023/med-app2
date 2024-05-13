const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

const keyFile = require('./med-app-key.json');

const authClient = new google.auth.JWT(
  keyFile.client_email,
  null,
  keyFile.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

authClient.authorize(function (err, tokens) {
  if (err) {
    console.error('Error authorizing Google Sheets API:', err);
    return;
  }
  console.log('Successfully authorized Google Sheets API');
});

const sheets = google.sheets({ version: 'v4', auth: authClient });

app.post('/update-sheet', async (req, res) => {
  try {
    const { answers, result } = req.body;

    const spreadsheetId = '1VfYm_Y_rlVVnjfiUlQ6XGUeSQfW4ztLGFtnD0_5Z_AU';
    const range = 'Sheet1!A:G';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    let nextRow = 2;

    if (rows && rows.length > 0) {
      nextRow = rows.length + 1;
    }

    const values = [
      [answers[0], answers[1], answers[2], answers[3], answers[4], answers[5], result],
    ];

		console.log(values);

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Sheet1!A${nextRow}:G${nextRow}`,
      valueInputOption: 'RAW',
      resource: { values },
    });

    res.status(200).json({ message: 'Spreadsheet updated successfully' });
  } catch (error) {
    console.error('Error updating spreadsheet:', error);
    res.status(500).json({ error: 'An error occurred while updating the spreadsheet' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
