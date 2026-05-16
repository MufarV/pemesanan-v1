fetch("https://firestore.googleapis.com/v1/projects/gen-lang-client-0151673203/databases/ai-studio-0f662e5f-e75c-43b6-802f-9de8794d2bcf/documents/pesanan", {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ fields: { test: { stringValue: "ok" } } })
}).then(r => r.json()).then(console.log)
