const run = async () => {
    const res = await fetch("https://firestore.googleapis.com/v1/projects/gen-lang-client-0151673203/databases/ai-studio-0f662e5f-e75c-43b6-802f-9de8794d2bcf/documents/pesanan/123");
    const d = await res.json();
    console.log("Fetch doc:", d);
}
run();
