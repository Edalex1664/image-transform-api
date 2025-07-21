import { useState } from "react";

export default function Home() {
  const [imageFile, setImageFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!imageFile) return alert("Choisis une image d’abord");

    setLoading(true);
    setResultUrl(null);

    try {
      const base64Image = await toBase64(imageFile);

      const res = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      });

      const data = await res.json();

      if (res.ok) {
        setResultUrl(data.output || data.result || null);
      } else {
        alert(data.error || "Erreur lors de la transformation");
      }
    } catch (error) {
      alert("Erreur : " + error.message);
    }
    setLoading(false);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    setImageFile(file);
    setResultUrl(null);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewSrc(url);
    } else {
      setPreviewSrc(null);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Transforme ton image (style manga)</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {previewSrc && (
          <div style={{ margin: "10px 0" }}>
            <img
              src={previewSrc}
              alt="preview"
              style={{ maxWidth: "100%", maxHeight: 200 }}
            />
          </div>
        )}
        <button type="submit" disabled={loading}>
          {loading ? "Transformation en cours..." : "Transformer l’image"}
        </button>
      </form>

      {resultUrl && (
        <div style={{ marginTop: 20 }}>
          <h2>Image transformée :</h2>
          <img src={resultUrl} alt="result" style={{ maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
}

