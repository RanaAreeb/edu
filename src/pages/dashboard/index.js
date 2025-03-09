import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  FaUserPlus,
  FaChartLine,
  FaGamepad,
  FaBrain,
  FaClock,
  FaTrophy,
  FaUsers,
  FaHome,
  FaFacebook,
  FaInstagram,
  FaSignOutAlt
} from 'react-icons/fa';
import { Line, Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { format } from 'date-fns';

// Add these utility functions at the top after imports
const formatTime = (minutes) => {
  if (!minutes) return '0h 0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const calculateAverageScore = (sessions) => {
  if (!sessions || sessions.length === 0) return 'N/A';
  const scores = sessions.filter(s => s.score != null).map(s => s.score);
  if (scores.length === 0) return 'N/A';
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.round(average);
};

const getFavoriteGame = (gameTimeDistribution) => {
  if (!gameTimeDistribution || Object.keys(gameTimeDistribution).length === 0) return 'None';
  const favorite = Object.entries(gameTimeDistribution)
    .reduce((a, b) => a[1] > b[1] ? a : b);
  return favorite[0];
};

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Add this component before the main Dashboard component
const GameSessionsList = ({ sessions }) => {
  if (!sessions || sessions.length === 0) {
    return <p className="text-gray-500 text-center">No game sessions recorded yet</p>;
  }

  return (
    <div className="space-y-4">
      {sessions.map((session, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-lg">{session.gameTitle}</h4>
              <p className="text-sm text-gray-600">Type: {session.gameType}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{format(new Date(session.startTime), 'MMM d, yyyy')}</p>
              <p className="text-xs text-gray-500">
                {format(new Date(session.startTime), 'h:mm a')} - {format(new Date(session.endTime), 'h:mm a')}
              </p>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Play Time</p>
              <p className="font-medium">{session.playTime} minutes</p>
            </div>
            <div>
              <p className="text-gray-600">Score</p>
              <p className="font-medium">{session.score || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600">Skills Gained</p>
              <p className="font-medium">{session.skillsGained?.join(', ') || 'None'}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Add this component after GameSessionsList
const StudentDetailsPanel = ({ student }) => {
  if (!student) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-darkGreen">{student.name}</h2>
          <p className="text-gray-600">Grade {student.grade} • Age {student.age}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Student ID</p>
          <p className="font-mono text-xs">{student._id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Contact Information</h3>
          <p className="text-sm">Email: {student.email}</p>
          <p className="text-sm">Account Type: {student.accountType}</p>
          <p className="text-sm">Created: {format(new Date(student.createdAt), 'MMM d, yyyy')}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Game Statistics</h3>
          <p className="text-sm">Games Played: {student.gameStats?.gamesPlayed || 0}</p>
          <p className="text-sm">Total Play Time: {formatTime(student.gameStats?.totalPlayTime || 0)}</p>
          <p className="text-sm">Last Played: {student.gameStats?.lastPlayed ? 
            format(new Date(student.gameStats.lastPlayed), 'MMM d, yyyy h:mm a') : 'Never'}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Achievement Summary</h3>
          <p className="text-sm">Total Achievements: {student.gameStats?.achievements?.length || 0}</p>
          <p className="text-sm">Average Score: {calculateAverageScore(student.gameStats?.sessions || [])}</p>
          <p className="text-sm">Favorite Game: {getFavoriteGame(student.gameStats?.gameTimeDistribution || {})}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Skills Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(student.gameStats?.skillsDistribution || {}).map(([skill, time]) => (
            <div key={skill} className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium capitalize">{skill}</p>
              <p className="text-lg font-bold text-darkGreen">{formatTime(time)}</p>
              <p className="text-xs text-gray-500">Time spent practicing</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const router = useRouter();
  
  // Group all useState hooks together at the top
  const [activeTab, setActiveTab] = useState('overview');
  const [accountType, setAccountType] = useState(null);
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    grade: '',
  });

  const getChartData = useCallback((data) => {
    if (!data) return null;

    // Ensure we have default values for all required properties
    const defaultData = {
      weeklyProgress: [0, 0, 0, 0],
      skillsDistribution: {
        math: 0,
        logic: 0,
        memory: 0,
        problemSolving: 0,
        speed: 0,
        accuracy: 0
      },
      gameTimeDistribution: {}
    };

    // Merge default data with actual data
    const safeData = {
      weeklyProgress: data.weeklyProgress || defaultData.weeklyProgress,
      skillsDistribution: data.skillsDistribution || defaultData.skillsDistribution,
      gameTimeDistribution: data.gameTimeDistribution || defaultData.gameTimeDistribution
    };

    return {
      progressData: {
        labels: ['Week 4', 'Week 3', 'Week 2', 'Week 1'],
        datasets: [{
          label: 'Learning Progress',
          data: [...safeData.weeklyProgress].reverse(),
          fill: true,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      skillsData: {
        labels: Object.keys(safeData.skillsDistribution),
        datasets: [{
          label: 'Skills Development',
          data: Object.values(safeData.skillsDistribution),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointBorderColor: '#fff',
        }]
      },
      gameTimeData: {
        labels: Object.keys(safeData.gameTimeDistribution),
        datasets: [{
          label: 'Time Spent (minutes)',
          data: Object.values(safeData.gameTimeDistribution),
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
          ],
        }]
      }
    };
  }, []);

  // Define fetchStats with useCallback
  const fetchStats = useCallback(async (userId) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/students/stats?parentId=${userId}&t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched data:', data);
        setStats(data.overall);
        setStudents(data.students || []);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle sign out
  const handleSignOut = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('accountType');
    router.replace('/auth/signin');
  }, [router]);

  // Handle add student
  const handleAddStudent = useCallback(async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/students/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newStudent,
          parentId: user?._id
        }),
      });

      const data = await response.json();
      console.log('Created student response:', data);

      if (response.ok) {
        const newStudentData = data.student;
        setStudents(currentStudents => [...currentStudents, newStudentData]);
        setShowAddModal(false);
        setNewStudent({ name: '', email: '', password: '', age: '', grade: '' });
        await fetchStats(user?._id);
      } else {
        alert(data.message || 'Failed to create student');
      }
    } catch (error) {
      console.error('Error creating student:', error);
      alert('An error occurred while creating the student');
    }
  }, [newStudent, user, fetchStats]);

  // Authentication effect
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      const storedAccountType = localStorage.getItem('accountType');
      
      if (!storedUser || !storedAccountType || storedAccountType === 'student') {
        router.replace('/auth/signin');
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setAccountType(storedAccountType);
      fetchStats(parsedUser._id);
    };

    checkAuth();

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [router, fetchStats]);

  // Stats polling effect
  useEffect(() => {
    if (!user?._id) return;

    const interval = setInterval(() => fetchStats(user._id), 300000);
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchStats(user._id);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, fetchStats]);

  // Debug logging effects
  useEffect(() => {
    console.log('Current students:', students);
  }, [students]);

  useEffect(() => {
    if (stats) console.log('Stats data structure:', stats);
    if (selectedStudent) console.log('Selected student data structure:', selectedStudent);
  }, [stats, selectedStudent]);

  // Calculate chart data
  const chartData = useMemo(() => {
    const data = selectedStudent?.stats || stats;
    return getChartData(data);
  }, [selectedStudent, stats, getChartData]);

  // Loading state
  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-darkGreen border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-darkGreen">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Dashboard Header */}
      <header className="bg-darkGreen text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left">
              {accountType === 'parent' ? 'Parent Dashboard' : 'Institution Dashboard'}
            </h1>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link 
                href="/" 
                className="flex items-center px-3 sm:px-4 py-2 bg-white text-darkGreen rounded-lg hover:bg-gray-100 transition-all duration-300"
                aria-label="Back to Main Site"
              >
                <FaHome className="text-xl sm:mr-2" />
                <span className="hidden sm:inline">Back to Main Site</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
                aria-label="Sign Out"
              >
                <FaSignOutAlt className="text-xl sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <FaUsers className="text-3xl text-darkGreen mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Total Students</h3>
                <p className="text-2xl font-bold text-darkGreen">{students.length || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <FaClock className="text-3xl text-darkGreen mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Total Learning Time</h3>
                <p className="text-2xl font-bold text-darkGreen">{formatTime(stats?.totalPlayTime || 0)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <FaTrophy className="text-3xl text-darkGreen mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Achievements</h3>
                <p className="text-2xl font-bold text-darkGreen">{stats?.achievements || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Student List */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Students</h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-darkGreen text-white p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <FaUserPlus />
                </button>
              </div>
              <div className="space-y-4">
                {students.length === 0 ? (
                  <p className="text-gray-500 text-center">No students added yet</p>
                ) : (
                  students.map((student) => (
                    <div
                      key={student._id}
                      onClick={() => setSelectedStudent(student)}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedStudent?._id === student._id
                          ? 'bg-darkGreen text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <h3 className="font-semibold">{student.name}</h3>
                      <p className="text-sm">Grade {student.grade}</p>
                      <p className="text-xs mt-1">
                        Email: {student.email}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area - Charts and Analytics */}
          <div className="lg:w-3/4">
            {selectedStudent && (
              <StudentDetailsPanel student={selectedStudent} />
            )}
            
            {activeTab === 'overview' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">
                    {selectedStudent ? `${selectedStudent.name}'s Progress` : 'Overall Learning Progress'}
                  </h2>
                  <div className="h-64">
                    {chartData && <Line data={chartData.progressData} options={{ maintainAspectRatio: false }} />}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div>
                    <h2 className="text-xl font-bold mb-4">Skills Development</h2>
                    <div className="h-64">
                      {chartData && <Radar data={chartData.skillsData} options={{ maintainAspectRatio: false }} />}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-4">Game Time Distribution</h2>
                    <div className="h-64">
                      {chartData && <Bar data={chartData.gameTimeData} options={{ maintainAspectRatio: false }} />}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sessions' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">
                    {selectedStudent ? `${selectedStudent.name}'s Game Sessions` : 'All Game Sessions'}
                  </h2>
                </div>
                <GameSessionsList 
                  sessions={selectedStudent ? 
                    selectedStudent.gameStats?.sessions || [] : 
                    students.flatMap(s => s.gameStats?.sessions || []).sort((a, b) => 
                      new Date(b.startTime) - new Date(a.startTime)
                    )
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Add New Student</h2>
            <form onSubmit={handleAddStudent}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-darkGreen focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-darkGreen focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-darkGreen focus:border-transparent"
                  minLength={6}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Password must be at least 6 characters long</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Age</label>
                <input
                  type="number"
                  value={newStudent.age}
                  onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-darkGreen focus:border-transparent"
                  required
                  min={5}
                  max={18}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Grade</label>
                <select
                  value={newStudent.grade}
                  onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-darkGreen focus:border-transparent"
                  required
                >
                  <option value="">Select Grade</option>
                  <option value="K">Kindergarten</option>
                  <option value="1st">1st Grade</option>
                  <option value="2nd">2nd Grade</option>
                  <option value="3rd">3rd Grade</option>
                  <option value="4th">4th Grade</option>
                  <option value="5th">5th Grade</option>
                  <option value="6th">6th Grade</option>
                  <option value="7th">7th Grade</option>
                  <option value="8th">8th Grade</option>
                  <option value="9th">9th Grade</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-darkGreen to-lightGreen text-white rounded-lg hover:opacity-90 transition-all duration-300"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <footer className="bg-darkGreen text-white text-center py-4 mt-auto">
        <p className="text-sm md:text-lg">© Copyright 2025 EFG Games, a division of Konduct Coach Learning. All Rights Reserved</p>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mt-4">
          <a href="https://www.facebook.com/profile.php?id=61559394101077&sk=about" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="text-2xl hover:text-lightGreen transition-colors duration-300" />
          </a>
          <a href="https://www.instagram.com/efggames?igsh=MTR3aHpyaHM5ZXhoaw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-2xl hover:text-lightGreen transition-colors duration-300" />
          </a>
        </div>

        {/* Legal Links */}
        <div className="mt-4 px-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs md:text-sm">
          <Link href="/" legacyBehavior>
            <a className="text-white hover:text-lightGreen transition-colors duration-300 whitespace-nowrap">
              Terms and Conditions
            </a>
          </Link>
          <span className="text-gray-400">•</span>
          <Link href="/" legacyBehavior>
            <a className="text-white hover:text-lightGreen transition-colors duration-300 whitespace-nowrap">
              Privacy Policy
            </a>
          </Link>
          <span className="text-gray-400">•</span>
          <Link href="/about" legacyBehavior>
            <a className="text-white hover:text-lightGreen transition-colors duration-300 whitespace-nowrap">
              About
            </a>
          </Link>
          <span className="text-gray-400">•</span>
          <Link href="/partnership" legacyBehavior>
            <a className="text-white hover:text-lightGreen transition-colors duration-300 inline-flex items-center whitespace-nowrap">
              Partnership
            </a>
          </Link>
        </div>
      </footer>
    </div>
  );
} 