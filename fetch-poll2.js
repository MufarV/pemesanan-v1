const run = async () => {
    for (let i = 0; i < 6; i++) {
        let res = await fetch("https://firestore.googleapis.com/v1/projects/gen-lang-client-0151673203/databases/ai-studio-0f662e5f-e75c-43b6-802f-9de8794d2bcf/documents/pesanan");
        let d = await res.json();
        console.log("Fetch list pesanan:", d.error ? d.error.message : Object.keys(d));
        await new Promise(r => setTimeout(r, 2000));
    }
}
run();
