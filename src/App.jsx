import { useEffect, useState } from "react";
import ListingCard from "./Components/ListingCard";
import ListingForm from "./Components/ListingForm";
import { Zap, Search, ShieldCheck, Database, SlidersHorizontal, BookOpen, Laptop, Sofa, Package2, HelpCircle } from "lucide-react";

// Mock data to provide a premium default look when DB is empty or disconnected
const MOCK_LISTINGS = [
  {
    id: 1,
    title: "M1 MacBook Air (8GB/256GB)",
    description: "Perfect condition, used for 2 semesters. Battery health 92%. Includes original box and Apple USB-C charger. Great for coding and college assignments.",
    price: 42000
  },
  {
    id: 2,
    title: "Introduction to Algorithms (CLRS) - 4th Edition",
    description: "Essential textbook for CS Core courses. No markings or highlights, looks practically brand new. Selling because course completed.",
    price: 950
  },
  {
    id: 3,
    title: "Ergonomic Desk Chair",
    description: "Adjustable height and lumbar support. Breathable mesh back. Extremely comfortable for long study sessions.",
    price: 2400
  },
  {
    id: 4,
    title: "Sony WH-1000XM4 Noise Cancelling Headphones",
    description: "Industry leading noise cancellation. Perfect for studying in noisy dorm rooms or library. Comes with carrying case and cable.",
    price: 12500
  }
];

function App() {
  const [listings, setListings] = useState([]);
  const [dbStatus, setDbStatus] = useState("connecting"); // connecting, connected, fallback
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchListings = async () => {
    try {
      const res = await fetch("http://localhost:5000/listings");
      if (res.ok) {
        const data = await res.json();
        // If server DB is connected but empty, prepend mock listings for a nice first-time experience
        setListings(data.length > 0 ? data : MOCK_LISTINGS);
        setDbStatus("connected");
      } else {
        setListings(MOCK_LISTINGS);
        setDbStatus("fallback");
      }
    } catch (err) {
      console.warn("Backend server not running. Using fallback UI demonstration mode.", err);
      setListings(MOCK_LISTINGS);
      setDbStatus("fallback");
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const getCategory = (title = "") => {
    const t = title.toLowerCase();
    if (t.includes("book") || t.includes("note") || t.includes("copy") || t.includes("pen")) return "Education";
    if (t.includes("phone") || t.includes("laptop") || t.includes("charger") || t.includes("earphone") || t.includes("tech") || t.includes("keyboard")) return "Electronics";
    if (t.includes("chair") || t.includes("table") || t.includes("desk") || t.includes("bed") || t.includes("sofa")) return "Furniture";
    return "General";
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = 
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (listing.description && listing.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedCategory === "All") return matchesSearch;
    return matchesSearch && getCategory(listing.title) === selectedCategory;
  });

  return (
    <div className="app-container">
      {/* Premium Navigation Header */}
      <header className="app-header">
        <div className="logo-container">
          <Zap size={28} className="logo-icon" />
          <h1 className="logo-text">
            CampusCart
            <span className="logo-badge">Smart</span>
          </h1>
        </div>
        <div className="header-meta">
          <div className={`db-status ${dbStatus === "connected" ? "connected" : "disconnected"}`}>
            <div className="indicator"></div>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Database size={13} />
              {dbStatus === "connected" ? "Live Database" : "Offline Sandbox"}
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <h2 className="hero-title">
          The Smartest Way to <span className="gradient-text">Trade Campus Gear</span>
        </h2>
        <p className="hero-subtitle">
          List books, electronics, and dorm furniture in seconds. Connect with fellow students instantly on our fully optimized marketplace.
        </p>
      </section>

      {/* Search and Category Filters Panel */}
      <div className="panel" style={{ marginBottom: "32px", padding: "20px" }}>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
          {/* Smart AI Search Bar */}
          <div className="input-wrapper" style={{ flex: 1, minWidth: "280px" }}>
            <Search size={18} className="input-icon" style={{ color: "var(--accent)" }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: "46px" }}
              placeholder="Search listings (e.g. 'macbook', 'Algorithms book')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Quick Categories */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              { name: "All", icon: <SlidersHorizontal size={14} /> },
              { name: "Education", icon: <BookOpen size={14} /> },
              { name: "Electronics", icon: <Laptop size={14} /> },
              { name: "Furniture", icon: <Sofa size={14} /> },
              { name: "General", icon: <Package2 size={14} /> }
            ].map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className="btn"
                style={{
                  padding: "8px 14px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  backgroundColor: selectedCategory === cat.name ? "var(--primary)" : "rgba(255, 255, 255, 0.03)",
                  border: `1px solid ${selectedCategory === cat.name ? "var(--primary)" : "var(--border)"}`,
                  color: selectedCategory === cat.name ? "#fff" : "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Left Side: Form */}
        <aside>
          <ListingForm fetchListings={fetchListings} />
        </aside>

        {/* Right Side: Listings Container */}
        <main>
          <div className="listings-header">
            <div className="section-title-wrap">
              <ShieldCheck size={20} className="section-icon" />
              <h2 className="section-title">Campus Listings</h2>
            </div>
            <div className="listings-count">
              {filteredListings.length} {filteredListings.length === 1 ? "Item" : "Items"} Found
            </div>
          </div>

          <div className="listings-grid">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id || Math.random()} listing={listing} />
            ))}

            {filteredListings.length === 0 && (
              <div className="empty-state">
                <HelpCircle size={48} className="empty-icon" />
                <h3 className="empty-title">No listings found</h3>
                <p className="empty-text">Try adjusting your search query or category filters.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;