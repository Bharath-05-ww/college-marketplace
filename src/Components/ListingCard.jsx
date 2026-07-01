import { useState } from "react";
import { Cpu, Sparkles, Edit, Trash2, X } from "lucide-react";
import "../css/ListingCard.css";

function ListingCard({ listing, onListingChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(listing.title);
  const [editDescription, setEditDescription] = useState(listing.description);
  const [editPrice, setEditPrice] = useState(listing.price);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if current user is owner of the listing
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const isOwner = currentUser && Number(currentUser.id) === Number(listing.seller_id);

  // Simple client-side visual tag logic based on keywords
  const getCategory = (title = "") => {
    const t = title.toLowerCase();
    if (t.includes("book") || t.includes("note") || t.includes("copy") || t.includes("pen")) return "Education";
    if (t.includes("phone") || t.includes("laptop") || t.includes("charger") || t.includes("earphone") || t.includes("tech") || t.includes("keyboard")) return "Electronics";
    if (t.includes("chair") || t.includes("table") || t.includes("desk") || t.includes("bed") || t.includes("sofa")) return "Furniture";
    return "General";
  };

  // Generate a mock deal rating based on price for nice AI-themed visual decoration
  const getDealRating = (price) => {
    if (!price) return "Fair Price";
    if (price < 500) return "Excellent Value";
    if (price < 2000) return "Good Deal";
    return "Verified Listing";
  };

  const category = getCategory(listing.title);
  const rating = getDealRating(listing.price);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/listings/${listing.id || listing._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Listing deleted successfully!");
        if (onListingChange) onListingChange();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete listing.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting listing.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/listings/${listing.id || listing._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          price: editPrice,
        }),
      });

      if (response.ok) {
        alert("Listing updated successfully!");
        setIsEditing(false);
        if (onListingChange) onListingChange();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to update listing.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="ai-scanlines"></div>
      
      <div className="card-top">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span className="ai-smart-badge">
            <Cpu size={12} />
            {rating}
          </span>
          
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span className="category-tag">
              {category}
            </span>
            {isOwner && (
              <div className="card-actions">
                <button onClick={() => setIsEditing(true)} className="btn-action-edit" title="Edit Listing">
                  <Edit size={12} />
                </button>
                <button onClick={handleDelete} className="btn-action-delete" title="Delete Listing">
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
        
        <h3 className="card-title">{listing.title}</h3>
        <p className="card-description">
          {listing.description || "No description provided."}
        </p>
      </div>

      <div className="card-bottom">
        <div className="card-price-wrapper">
          <span className="card-price-label">Price</span>
          <span className="card-price">₹{listing.price}</span>
        </div>
        
        <div className="card-match-tag">
          <Sparkles size={12} />
          <span>Smart Match</span>
        </div>
      </div>

      {/* Edit Glassmorphic Modal */}
      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Listing</h3>
              <button className="btn-close-modal" onClick={() => setIsEditing(false)}>
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="modal-form">
              <div className="modal-form-group">
                <label className="modal-label">Item Title</label>
                <input
                  type="text"
                  className="modal-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Semester 4 Textbooks"
                  required
                />
              </div>

              <div className="modal-form-group">
                <label className="modal-label">Description</label>
                <textarea
                  className="modal-textarea"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Describe condition, tags, availability..."
                  required
                />
              </div>

              <div className="modal-form-group">
                <label className="modal-label">Price (₹)</label>
                <input
                  type="number"
                  className="modal-input"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="modal-actions-panel">
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)} 
                  className="btn-modal-cancel"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-modal-save" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListingCard;