import fetch from 'node-fetch';
import fs from 'fs';

const run = async () => {
    const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

    let res = await fetch(`https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${config.firestoreDatabaseId}/documents/pesanan`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fields: {
                customerName: {stringValue: "test"},
                items: {stringValue: "[]"},
                tanggal_po: {stringValue: "2024-05-15"},
                waktu_po: {stringValue: "pagi"},
                totalHarga: {integerValue: "1000"},
                status: {stringValue: "Baru"}
            }
        })
    });
    let d = await res.json();
    console.log("Fetch list pesanan:", d.error ? d.error.message : Object.keys(d));
}
run();
