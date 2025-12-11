// Fixed XP thresholds for each level
// Level 1: 0-999 XP (need 1000 for level 2)
// Level 2: 1000-1999 XP (need 2000 total for level 3)
// Level 3: 2000-2999 XP (need 3000 total for level 4)
// Level 4: 3000-3999 XP (need 4000 total for level 5)
// And so on...

// Calculate XP needed for a specific level (cumulative total)
export const calculateXPForLevel = (level) => {
  // Level 1 requires 0 XP (starting level)
  // Level 2 requires 1000 XP total
  // Level 3 requires 2000 XP total
  // Level 4 requires 3000 XP total
  return (level - 1) * 1000;
};

// Calculate level from total XP
export const calculateLevelFromXP = (totalXP) => {
  if (totalXP < 0) return 1;
  
  // Level 1: 0-999 XP
  // Level 2: 1000-1999 XP
  // Level 3: 2000-2999 XP
  // Level 4: 3000-3999 XP
  // Formula: level = Math.floor(totalXP / 1000) + 1
  const level = Math.floor(totalXP / 1000) + 1;
  
  // Minimum level is 1
  return Math.max(1, level);
};

// Calculate current level XP and XP to next level
export const calculateLevelProgress = (totalXP) => {
  const level = calculateLevelFromXP(totalXP);
  
  // XP needed to reach current level (cumulative)
  const xpForCurrentLevel = (level - 1) * 1000;
  
  // Current XP within the current level
  const currentLevelXP = totalXP - xpForCurrentLevel;
  
  // XP needed to reach next level (always 1000 more than current level threshold)
  const xpToNextLevel = 1000;
  
  return {
    level,
    xp: currentLevelXP,
    xpToNextLevel,
  };
};




