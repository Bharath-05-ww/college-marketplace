import { useState } from "react";
import { Sparkles, Plus, IndianRupee, Type, FileText } from "lucide-react";

function ListingForm({ fetchListings }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createListing = async (e) => {
    e.preventDefault();
    if (!title || !price) return;
    setIsSubmitting(true);

    try {
      await fetch("http://localhost:5000/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          price: Number(price),
        }),
      });

      setTitle("");
      setDescription("");
      setPrice("");
      fetchListings();
    } catch (err) {
      console.error("Error creating listing:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <Sparkles size={20} className="panel-icon" style={{ color: "var(--accent)" }} />
        <h2 className="panel-title">Smart List Co-Pilot</h2>
      </div>

      <form onSubmit={createListing}>
        <div className="form-group">
          <label className="form-label">Item Title</label>
          <div className="input-wrapper">
            <Type size={16} className="input-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="e.g., Semester 4 CS Textbooks"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <div className="input-wrapper">
            <FileText size={16} className="input-icon" style={{ top: "14px" }} />
            <textarea
              className="form-input"
              style={{ paddingLeft: "42px", minHeight: "80px" }}
              placeholder="Describe condition, college tags, etc..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Price (INR)</label>
          <div className="input-wrapper">
            <IndianRupee size={16} className="input-icon" />
            <input
              type="number"
              className="form-input"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
          <Plus size={16} />
          {isSubmitting ? "Listing Item..." : "Publish Listing"}
        </button>
      </form>
    </div>
  );
}

export default ListingForm;