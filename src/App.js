import { useEffect, useState } from "react";

function App() {
  const [url, setUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const siteName = params.get("siteName");
    const itemId = params.get("itemId");

    if (!siteName || !itemId) {
      setError("Missing siteName or itemId in URL");
      return;
    }

    setUrl(
      `/api/documents?siteName=${encodeURIComponent(siteName)}&itemId=${encodeURIComponent(itemId)}`,
    );
  }, []);

  if (error) {
    return <div style={{ padding: 16, color: "red" }}>{error}</div>;
  }

  if (!url) {
    return <div>Loading…</div>;
  }

  return (
    <iframe
      src={url}
      title="Document"
      style={{ width: "100vw", height: "100vh", border: "none" }}
    />
  );
}

export default App;
