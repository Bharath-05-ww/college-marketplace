import { useEffect, useState } from "react";
import ListingCard from "../Components/ListingCard";

function MyListings() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/my-listings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      setListings(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>My Listings</h1>

      {listings.length === 0 ? (
        <p>No listings found</p>
      ) : (
        listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            onListingChange={fetchMyListings}
          />
        ))
      )}
    </div>
  );
}

export default MyListings;