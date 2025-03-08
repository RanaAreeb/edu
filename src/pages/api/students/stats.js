import { getMongoDb } from '../../../utils/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { parentId, studentId } = req.query;

    // Require parentId for security
    if (!parentId) {
      return res.status(400).json({ message: 'Parent ID is required' });
    }

    const db = await getMongoDb();
    const studentsCollection = db.collection('students');

    // Always filter by parentId for security
    const query = { parentId };
    if (studentId) {
      query._id = studentId;
    }

    // Get students with their game stats
    const students = await studentsCollection
      .find(query)
      .project({
        password: 0,
        parentId: 0  // Hide parentId in response for extra security
      })
      .toArray();

    // Default stats structure
    const defaultStats = {
      gamesPlayed: 0,
      totalPlayTime: 0,
      achievements: [],
      skillsDistribution: {
        math: 0,
        logic: 0,
        memory: 0,
        problemSolving: 0,
        speed: 0,
        accuracy: 0
      },
      gameTimeDistribution: {},
      weeklyProgress: [0, 0, 0, 0]
    };

    // Calculate overall statistics
    const overallStats = {
      totalStudents: students.length,
      totalPlayTime: 0,
      achievements: 0,
      skillsDistribution: { ...defaultStats.skillsDistribution },
      gameTimeDistribution: {},
      weeklyProgress: [...defaultStats.weeklyProgress]
    };

    // Process each student's data
    const studentsWithStats = students.map(student => {
      // Ensure student has gameStats with default values
      const gameStats = {
        ...defaultStats,
        ...(student.gameStats || {})
      };

      // Update overall stats
      overallStats.totalPlayTime += gameStats.totalPlayTime || 0;
      overallStats.achievements += gameStats.achievements.length;

      // Update skills distribution
      Object.keys(gameStats.skillsDistribution).forEach(skill => {
        overallStats.skillsDistribution[skill] += gameStats.skillsDistribution[skill] || 0;
      });

      // Update game time distribution
      Object.entries(gameStats.gameTimeDistribution).forEach(([game, time]) => {
        overallStats.gameTimeDistribution[game] = (overallStats.gameTimeDistribution[game] || 0) + time;
      });

      // Update weekly progress
      gameStats.weeklyProgress.forEach((progress, index) => {
        overallStats.weeklyProgress[index] += progress;
      });

      return {
        ...student,
        stats: gameStats
      };
    });

    // Calculate averages for overall stats if there are students
    if (students.length > 0) {
      Object.keys(overallStats.skillsDistribution).forEach(skill => {
        overallStats.skillsDistribution[skill] /= students.length;
      });
      overallStats.weeklyProgress = overallStats.weeklyProgress.map(progress => 
        progress / students.length
      );
    }

    return res.status(200).json({
      overall: overallStats,
      students: studentsWithStats
    });

  } catch (error) {
    console.error('Error fetching student statistics:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 