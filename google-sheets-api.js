const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Enable CORS
app.use(bodyParser.json());

const keyFile = {
  "type": "service_account",
  "project_id": "med-app-419807",
  "private_key_id": "2d2f4f4e5345f6b0bf80180f23248591987e6355",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCbKO57lMABbO6k\nULa3rCJIUtU2u6HJoDDfV9VCgwGwixWjJeNIWZnB8Ys3Cfpzcn0kxyJzcP5PMpHf\nJ1jnsW3Sc0Ro4oNLTg9TRUfu6Bqtt8F9i18gGYQmivZV0aaDo4IC+BnPp3DTzlMa\nN3rneW/p0+NjQshTxlsnBxU/nDn1fi/xeEoIhnZMEyOn2Xy/YX6WYPgTtbuX7gF5\n4uvH4y79dZ8d9NeQ9c+5HGuETYFdRW9wcNQJk89Vb5bJw4UKlG/88a2tbqn295fH\nl6Ay0AonT4Qn8nZU41OV269jTBTraQxxVpgIRDCZ7pcgwEVU1JMBIUqjo9qwRcMx\nEDmfn0VhAgMBAAECggEAJ2hE8cQ849/L2JXbYljouB+5oVYUaEY0Q3VmZ6coVbNt\ngmtMB4MiRxzW89qn7oxkdmPRPyqynGDGpbuzm9z3fJzkAhONryGbSNXuyCHRLM/f\n58fvGBMC+lsO54sA1KxBiAmFXLU1NcZQWvc+Uu4H24aCWSKMCKL3Ybktz2MZYV0O\n/xlrHGs+2VIqzCLRc2RxHWxrutwH9qimhKV+F+IDWSQvvMwPGK0sk4hauYH5fEBL\nEIPmTjNrkbv73f5BzQKEjJ0mAlrJKJn/DnhnabjKBmTl7JMK4zn3ne5YC7kWKLvU\nknt3/jZPkeuitE1OHKdO+bLIunkYSnryiZu72oggFQKBgQDM9dszikwkO9iFsIRM\nwAF0zC9ttRAUddr8oHLVNvAvcSqRWeuoADuUzeSHegBOhFQ2wjyZESiD8X50/7wX\nyrw8VH0jffPF2OJtEd9GOdQNTMeRFYcwB45swDhviH4wAbHyMFKYbt3CSQW8hBLn\nRsN3mFdHhILCFXf6wWyICi6FRwKBgQDBzFBStVA/kWPReBWoui6lMPwzSKw5DEGK\na4hBDivmkYt/cIaQrb7PO4yRrrfjxoFL3L6Tfv+PqOml51dj+J1pLap/pHajaG1c\naSq0GPDbQssQGiPrcsTPFuFWvTYMoHnS7p/WK6Dg1Pl0abUwgAK/c8YtDxNF67Lt\n4LlvE5pUFwKBgBwKTrDgbMZQQbEYkyEE664U+TAjI04JSapiMROmbnmvG8nC6ZCU\nZ5JWELvQHxae1/6d2DiAtnBGq6xKCGug2tvOG0itxJn+sAuH9GnhI3emV28r6NDT\nV9LdAVuQ6uKaeMPPhJ1CHaik4NoHn6ZwcfF8sAQixtjSoxV1POnnqrGlAoGAGOqV\n4SxilumwdbwEvN7DJIX5xvYu/l6vBobwy7xwtII99zKWen98KtSzK//UsLpS4VgO\nQJRxcxz6fVQTDk1mn6E5bJPOlQ/WD62Nyf3y6Z3a0cUqnRjyaNW+PxKwokr3nsED\nV9vgIUgAkpEMtKGguNC/yAdKKRE2vhLIhJl2nB0CgYBo7nogw05evC7O2Q3dMT5Z\n19PjX8Mj7XHHFuElMJcx7OwQ3G8yR0wU7gQZHZIQSHW7iA+i16sdx3KW/we1Kpfg\nCh1qRRi4zCUfAihj2v/YOA0BfQEUf/FjfXvDXWjrwZc+m3n/JiCFLG/+/auThnLR\nMfdcSAPL1ABvudo/FKsi+w==\n-----END PRIVATE KEY-----\n",
  "client_email": "med-app-2024@med-app-419807.iam.gserviceaccount.com",
  "client_id": "111001471666096953910",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/med-app-2024%40med-app-419807.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

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
