const run = async () => {
    const res = await fetch("https://firestore.googleapis.com/v1/projects/gen-lang-client-0151673203/databases/(default)/documents/pesanan");
    const d = await res.json();
    console.log("Fetch default:", d.error ? d.error.message : Object.keys(d));

    const res2 = await fetch("https://firestore.googleapis.com/v1/projects/gen-lang-client-0151673203/databases/ai-studio-0f662e5f-e75c-43b6-802f-9de8794d2bcf/documents/pesanan");
    const d2 = await res2.json();
    console.log("Fetch ai-studio:", d2.error ? d2.error.message : Object.keys(d2));

}
run();
