import { Cpu, Sparkles } from "lucide-react";

function ListingCard({ listing }) {
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

  return (
    <div className="card">
      <div className="ai-scanlines"></div>
      
      <div className="card-top">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <span className="ai-smart-badge">
            <Cpu size={12} />
            {rating}
          </span>
          <span style={{ 
            fontSize: "11px", 
            background: "rgba(255, 255, 255, 0.04)", 
            padding: "2px 8px", 
            borderRadius: "12px", 
            border: "1px solid var(--border)",
            color: "var(--text-secondary)"
          }}>
            {category}
          </span>
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
        
        <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--accent)" }}>
          <Sparkles size={12} />
          <span>Smart Match</span>
        </div>
      </div>
    </div>
  );
}

export default ListingCard;