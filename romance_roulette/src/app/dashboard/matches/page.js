"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  // Simulate fetching match data
  useEffect(() => {
    const fetchMatches = async () => {
      const userEmail = "quackers@nus.com"; // Replace with the actual logged-in user's email
      try {
        // Step 1: Fetch matches for the user
        const response = await fetch(`http://127.0.0.1:5000/matches/get_all/${userEmail}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch matches.");
        }

        const matchData = await response.json();

        // Step 2: Fetch details of the other users in matches
        const detailedMatches = await Promise.all(
          matchData.map(async (match) => {
            const otherUserResponse = await fetch(
              `http://127.0.0.1:5000/users/get/${match.other_user_id}`, // Assuming you have a route to get user details by email
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (!otherUserResponse.ok) {
              throw new Error(`Failed to fetch details for user: ${match.other_user_id}`);
            }

            const otherUser = await otherUserResponse.json();

            return {
              id: match.id,
              user1: {
                name: otherUser.name || "Anonymous",
                profile_pic: otherUser.profile_pic || "/images/quackers.jpg",
              },
              user2: {
                name: "You",
                profile_pic: "/images/quackers.jpg", // Replace with your logged-in user's profile picture if available
              },
              matched_time: match.matched_time,
              is_active: match.is_active,
              went_out: match.went_out,
            };
          })
        );

        setMatches(detailedMatches);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching matches:", err);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className={styles.matchesPage}>
      <h1 className={styles.header}>Your Matches</h1>
      {error && <p className={styles.error}>Error: {error}</p>}
      <div className={styles.matchesList}>
        {matches.map((match) => (
          <div key={match.id} className={styles.matchCard}>
            <div className={styles.userContainer}>
              <img
                src={match.user1.profile_pic || "images/quakcers.jpg"}
                alt={`${match.user1.name}'s profile`}
                className={styles.userAvatar}
              />
              <p>{match.user1.name}</p>
            </div>
            <p className={styles.vs}>and</p>
            <div className={styles.userContainer}>
              <img
                src={match.user2.profile_pic|| "images/quakcers.jpg"}
                alt={`${match.user2.name}'s profile`}
                className={styles.userAvatar}
              />
              <p>{match.user2.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MatchesPage;
