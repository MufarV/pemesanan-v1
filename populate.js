import fetch from 'node-fetch';
import fs from 'fs';

const run = async () => {
    const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

    const fields = {
        "menerimaPesanan": { "booleanValue": true },
        "openPoDates": { "arrayValue": { "values": [
            { "stringValue": "2024-05-15" },
            { "stringValue": "2024-05-16" }
        ]}},
        "poTimes": { "arrayValue": { "values": [
            { "stringValue": "Sesi Pagi (09:00 - 12:00)" },
            { "stringValue": "Sesi Siang (13:00 - 16:00)" },
            { "stringValue": "Sesi Sore (17:00 - 20:00)" }
        ]}},
        "poLimits": { "arrayValue": { "values": [
            { "integerValue": "100" },
            { "integerValue": "50" },
            { "integerValue": "80" }
        ]}},
        "products": { "arrayValue": { "values": [
            { "mapValue": { "fields": {
                "id": { "stringValue": "p1" },
                "name": { "stringValue": "Cilok Bumbu Kacang" },
                "price": { "integerValue": "15000" }
            }}}
        ]}}
    };

    let res = await fetch(`https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${config.firestoreDatabaseId}/documents/pengaturan/pengaturan_toko?updateMask.fieldPaths=menerimaPesanan&updateMask.fieldPaths=openPoDates&updateMask.fieldPaths=poTimes&updateMask.fieldPaths=poLimits&updateMask.fieldPaths=products`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ fields })
    });
    let d = await res.json();
    console.log("Fetch populate:", d.error ? d.error.message : Object.keys(d));
}
run();
