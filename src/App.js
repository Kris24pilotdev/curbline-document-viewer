import { useEffect, useState } from "react";

function App() {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    const siteId =
      "pilotdev.sharepoint.com,248c421a-3466-4ede-82fd-682233342d1f,8fcd03e1-dcc2-4f8c-817c-a7fee27f1d3c";
    const itemId = "755d51a7-1f9c-4307-845f-1d0f230d6c21";

    alert("hello world");

    setUrl(
      `/api/documents?siteId=${encodeURIComponent(siteId)}&itemId=${itemId}`,
    );
  }, []);

  if (!url) return <div>Loading…</div>;

  return (
    <iframe
      src={url}
      title="Document"
      style={{ width: "100vw", height: "100vh", border: "none" }}
    />
  );
}

export default App;
