import User from '../models/User.js';

export const updateUserStreak = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActivity = user.lastActivityDate 
    ? new Date(user.lastActivityDate)
    : null;
  
  if (lastActivity) {
    lastActivity.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      // Already updated today
      return;
    } else if (daysDiff === 1) {
      // Consecutive day
      user.streak += 1;
    } else {
      // Streak broken
      user.streak = 1;
    }
  } else {
    // First activity
    user.streak = 1;
  }
  
  user.lastActivityDate = today;
  await user.save();
};









