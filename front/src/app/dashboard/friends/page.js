"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css"; // Ensure the CSS file includes the refined styles
import { FaChevronLeft } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HorizontalSwipe from "@/app/dashboard/friends/HorizontalSwipe";

// matchmake -> call backend
// addFriend -> call backend
// collate to button ->
const FriendsPage = () => {
  const [friends, setFriends] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  async function fetchUsers() {
    const email = localStorage.getItem("email");
    try {
      // const response = await fetch(`http://127.0.0.1:5000/matches/get_all/${email}`, {
      const response = await fetch(`http://127.0.0.1:5000/users/load`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching matches");
      }

      const data = await response.json();
      setAllUsers(data); // Store the matches data
      setSearchResults(
        data.filter(
          (user) => user.email !== email && user.email !== friendChosen,
        ),
      );
    } catch (error) {
      toast.error("Failed to fetch matches");
    }
  }
  useEffect(() => {
    const getFriends = async () => {
      try {
        const email = localStorage.getItem("email");
        const response = await fetch(
          `http://127.0.0.1:5000/friends/list/${email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        // console.log(response);
        if (!response.ok) {
          throw new Error("Error fetching friends");
        }

        const data = await response.json();
        setFriends(data); // Update state with fetched data
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      }
    };

    getFriends();

    fetchUsers();
  }, []); // Empty dependency array ensures this runs only once

  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [page1, setPage1] = useState(styles.midPos);
  const [page2, setPage2] = useState(styles.rightPos);
  const [friendChosen, setFriendChosen] = useState(null);
  const [isMatchMake, setMatchMake] = useState(false);
  const openPage2 = (matchmake, friendEmail) => {
    setMatchMake(matchmake); // Set matchmake mode (true for Matchmake, false for Add Friend)
    if (matchmake) setFriendChosen(friendEmail);
    setPage1(styles.leftPos);
    setPage2(styles.midPos);
  };

  const openPage1 = () => {
    setPage1(styles.midPos);
    setPage2(styles.rightPos);
  };

  // Handle adding friends
  const handleAddFriend = (friend) => {
    if (!friends.some((f) => f.id === friend.id)) {
      setFriends((prev) => [...prev, friend]);
      toast.success(`${friend.name} has been added to your friends list!`);
    } else {
      toast.info(`${friend.name} is already your friend.`);
    }
    setShowPopup(false); // Close popup
  };

  // Search functionality for popup
  const handleSearch = () => {
    //console.log(searchQuery)
    const email = localStorage.getItem("email");
    if (searchQuery.trim() === "") {
      fetchUsers();
    } else {
      const filteredResults = allUsers.filter(
        (user) =>
          user.email !== email &&
          user.email !== friendChosen &&
          user.name &&
          user.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setSearchResults(filteredResults);
    }
  };
  const handleAddFriendOrMatchmake = async (friend) => {
    const email = localStorage.getItem("email"); // User's email
    const endpoint = isMatchMake
      ? "http://127.0.0.1:5000/matches/matchmake" // Matchmake endpoint
      : "http://127.0.0.1:5000/friends/add"; // Add friend endpoint

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user1_id: email, // The current user's email
          user2_id: friend.email, // The friend or match's email
        }),
      });

      if (!response.ok) {
        throw new Error("Error processing request");
      }

      const data = await response.json();
      console.log("Action result:", data);

      if (isMatchMake) {
        toast.success(`Matchmade ${friend.name} successfully!`);
      } else {
        toast.success(`Added ${friend.name} as a friend successfully!`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to process the request.");
    }
  };

  const handleRemoveFriend = (friend_id) => {
    // Perform the action (e.g., remove friend)
    closeToast(); // Close the toast after action
  };
  const closeToast = () => {
    toast.dismiss(); // Close the active toast
  };

  const matchmake = (friendEmail) => {
    setMatchMake(true); // Set matchmake mode
    openPage2(true, friendEmail); // Open Matchmake page
  };

  const messageFriend = () => {
    // openPage3();
  };
  const removeFriend = (friend_id) => {
    showConfirmationToast(friend_id);
  };

  const friendsList = (
    <div className={`${styles.loginContainer} ${page1}`}>
      <div className={`${styles.logo} logo`}>Your Friends</div>
      <div className={`${styles.subtitle} subtitle`}>
        Talk to your friends or Matchmake them (winking emoji)
      </div>
      <div className={styles.friendsList}>
        {friends.length > 0 ? (
          friends.map((friend) => (
            <HorizontalSwipe
              onSwipeLeft1={() => matchmake(friend.email)}
              onSwipeLeft2={messageFriend}
              onSwipeRight={() => showConfirmationToast(friend.id)}
              key={friend.email}
            >
              <div key={friend.email} className={styles.friendCard}>
                <img
                  src={"../" + friend.profile_pic}
                  alt={`${friend.name}'s profile`}
                  className={styles.friendAvatar}
                />
                <div className={styles.friendInfo}>
                  <h2>{friend.name}</h2>
                  <p>{friend.biography}</p>
                  <p className={styles.friendLocation}>{friend.location}</p>
                </div>
              </div>
            </HorizontalSwipe>
          ))
        ) : (
          <p>No friends found.</p>
        )}
      </div>
    </div>
  );
  console.log(friends);
  const floatingButton = (
    <button
      className={styles.addFriendButton}
      onClick={() => {
        setMatchMake(false);
        openPage2(false);
      }}
    >
      +
    </button>
  );

  const addFriendsPage = (
    <div className={`${styles.loginContainer} ${page2}`}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <FaChevronLeft
          className="lol"
          style={{ marginBottom: "20px", color: "#ff6666", cursor: "pointer" }}
          onClick={openPage1}
        />
        <div className={`${styles.logo} logo`}>
          {isMatchMake ? "Matchmake" : "Add Friends"} {/* Update title */}
        </div>
      </div>
      <div className={`${styles.subtitle} subtitle`}>
        {isMatchMake
          ? "Find perfect matches for your friends and connect them!"
          : "Add new friends to your list and expand your connections."}
      </div>
      <div className={styles.searchBarContainer}>
        <input
          type="text"
          placeholder="Search for friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className={styles.searchBar}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          Search
        </button>
      </div>
      <div className={styles.searchResults}>
        {searchResults.map((result) => (
          <div key={result.email} className={styles.friendCard}>
            <img
              src={result.profile_pic || "/images/male/male1.jpg"}
              alt={`${result.name}'s profile`}
              className={styles.friendAvatar}
            />
            <div className={styles.friendInfo}>
              <h2>{result.name}</h2>
              <p>{result.biography}</p>
              <p className={styles.friendLocation}>{result.location}</p>
            </div>
            <button
              className={styles.addFriendPopupButton}
              onClick={() => handleAddFriendOrMatchmake(result)}
            >
              {isMatchMake ? "Matchmake" : "Add Friend"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.full}>
      {friendsList}
      {addFriendsPage}
      {floatingButton}
      <ToastContainer />
    </div>
  );
};

export default FriendsPage;
