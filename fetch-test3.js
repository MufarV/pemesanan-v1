const run = async () => {
    let res = await fetch("https://firestore.googleapis.com/v1/projects/gen-lang-client-0151673203/databases/ai-studio-0f662e5f-e75c-43b6-802f-9de8794d2bcf/documents/somethingelse123");
    let d = await res.json();
    console.log("Fetch list somethingelse123:", d.error ? d.error.message : Object.keys(d));
}
run();
