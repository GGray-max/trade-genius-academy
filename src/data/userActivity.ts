export interface UserActivity {
  subscribedBotIds: string[]; // Bots user is subscribed to
  favoriteTags: string[]; // Tags/categories user frequently interacts with
}

// Mock user activity placeholder (TODO: replace with real user tracking)
export const userActivity: UserActivity = {
  subscribedBotIds: ["1", "3"],
  favoriteTags: ["Trend Following", "Crypto", "Low Risk", "AI"],
};
