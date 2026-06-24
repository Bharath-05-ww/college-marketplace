import { useEffect, useState } from "react";
import { Tag, Search, Inbox } from "lucide-react";
import ListingCard from "../Components/ListingCard";
import ListingForm from "../Components/ListingForm";
import "../css/Home.css";

function Home() {
  const [listings, setListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchListings = async () => {
    try {
      const res = await fetch("http://localhost:5000/listings");
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Filter listings based on search query
  const filteredListings = listings.filter((listing) => {
    const titleMatch = listing.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const descMatch = listing.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || descMatch;
  });

  return (
    <div style={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          Campus<span className="gradient-text">Cart</span> Marketplace
        </h1>
        <p className="hero-subtitle">
          The smart peer-to-peer marketplace for college students. Buy, sell, and trade textbook notes, electronics, and gear instantly.
        </p>
      </section>

      {/* Main Dashboard Layout Grid */}
      <div className="dashboard-grid">
        {/* Left Side: Create Listing Panel */}
        <aside>
          <ListingForm fetchListings={fetchListings} />
        </aside>

        {/* Right Side: Listings List */}
        <main>
          <div className="listings-header">
            <div className="section-title-wrap">
              <Tag size={20} className="section-icon" />
              <h2 className="section-title">Active Listings</h2>
              <span className="listings-count">
                {filteredListings.length} {filteredListings.length === 1 ? "item" : "items"}
              </span>
            </div>

            {/* Search filter bar */}
            <div className="search-wrapper">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Search listings..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredListings.length > 0 ? (
            <div className="listings-grid">
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id || listing._id}
                  listing={listing}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Inbox size={40} className="empty-icon" />
              <h3 className="empty-title">
                {searchQuery ? "No matching listings" : "No listings available"}
              </h3>
              <p className="empty-text">
                {searchQuery 
                  ? "Try adjusting your search terms or publish a new item."
                  : "Be the first to list an item on the marketplace!"}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Home;