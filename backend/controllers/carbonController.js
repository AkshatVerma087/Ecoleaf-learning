import CarbonEmission from '../models/CarbonEmission.js';
import User from '../models/User.js';

// @desc    Get carbon emissions data
// @route   GET /api/carbon/emissions
// @access  Private
export const getEmissions = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const emissions = await CarbonEmission.find({
      user: req.user._id,
      date: { $gte: startDate },
    }).sort({ date: 1 });
    
    // Format for chart (last 7 days)
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayEmission = emissions.find(e => {
        const eDate = new Date(e.date);
        eDate.setHours(0, 0, 0, 0);
        return eDate.getTime() === date.getTime();
      });
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      chartData.push({
        date: dayNames[date.getDay()],
        emissions: dayEmission ? dayEmission.total : 0,
      });
    }
    
    // Calculate average
    const total = emissions.reduce((sum, e) => sum + e.total, 0);
    const avgDaily = emissions.length > 0 ? total / emissions.length : 0;
    
    res.json({
      chartData,
      average: avgDaily,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log carbon emissions
// @route   POST /api/carbon/emissions
// @access  Private
export const logEmissions = async (req, res) => {
  try {
    const { transport, food, energy, shopping } = req.body;
    
    const total = (parseFloat(transport) || 0) +
                  (parseFloat(food) || 0) +
                  (parseFloat(energy) || 0) +
                  (parseFloat(shopping) || 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Update or create today's emission
    const emission = await CarbonEmission.findOneAndUpdate(
      {
        user: req.user._id,
        date: { $gte: today },
      },
      {
        user: req.user._id,
        transport: parseFloat(transport) || 0,
        food: parseFloat(food) || 0,
        energy: parseFloat(energy) || 0,
        shopping: parseFloat(shopping) || 0,
        total,
        date: today,
      },
      { upsert: true, new: true }
    );
    
    // Calculate and update carbon score
    await updateCarbonScore(req.user._id);
    
    res.json({
      message: 'Emissions logged successfully',
      emission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get carbon score
// @route   GET /api/carbon/score
// @access  Private
export const getCarbonScore = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ carbonScore: user.carbonScore });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to calculate carbon score
const updateCarbonScore = async (userId) => {
  const user = await User.findById(userId);
  
  // Get last 7 days average
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  
  const emissions = await CarbonEmission.find({
    user: userId,
    date: { $gte: startDate },
  });
  
  if (emissions.length === 0) {
    user.carbonScore = 'B';
    await user.save();
    return;
  }
  
  const avgDaily = emissions.reduce((sum, e) => sum + e.total, 0) / emissions.length;
  
  // Score based on average daily emissions (kg CO2)
  // A+: <5, A: 5-8, A-: 8-12, B: 12-18, C: >18
  let score = 'B';
  if (avgDaily < 5) score = 'A+';
  else if (avgDaily < 8) score = 'A';
  else if (avgDaily < 12) score = 'A-';
  else if (avgDaily > 18) score = 'C';
  
  user.carbonScore = score;
  await user.save();
};









