import { useState, useEffect } from 'react';
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

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [accountType, setAccountType] = useState('parent');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Load account type from localStorage
  useEffect(() => {
    const storedAccountType = localStorage.getItem('accountType');
    if (!storedAccountType) {
      // If no account type is found, redirect to sign in
      router.push('/auth/signin');
      return;
    }
    setAccountType(storedAccountType);
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
      });

      if (response.ok) {
        // Clear localStorage
        localStorage.removeItem('accountType');
        // Redirect to sign in page
        router.push('/auth/signin');
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Sample data for charts
  const progressData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Learning Progress',
      data: [65, 75, 82, 90],
      fill: true,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const skillsData = {
    labels: ['Math', 'Logic', 'Memory', 'Problem Solving', 'Speed', 'Accuracy'],
    datasets: [{
      label: 'Skills Development',
      data: [85, 70, 90, 80, 75, 85],
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgb(54, 162, 235)',
      pointBackgroundColor: 'rgb(54, 162, 235)',
      pointBorderColor: '#fff',
    }]
  };

  const gameTimeData = {
    labels: ['Math Games', 'Logic Games', 'Memory Games', 'Puzzle Games'],
    datasets: [{
      label: 'Time Spent (hours)',
      data: [4, 3, 2, 5],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
      ],
    }]
  };

  // Add Student Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    age: '',
    grade: '',
  });

  const handleAddStudent = (e) => {
    e.preventDefault();
    // Add student logic here
    setStudents([...students, { ...newStudent, id: Date.now() }]);
    setShowAddModal(false);
    setNewStudent({ name: '', age: '', grade: '' });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Dashboard Header */}
      <header className="bg-darkGreen text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">
              {accountType === 'parent' ? 'Parent Dashboard' : 'Institution Dashboard'}
            </h1>
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center px-4 py-2 bg-white text-darkGreen rounded-lg hover:bg-gray-100 transition-all duration-300">
                <FaHome className="mr-2" />
                <span>Back to Main Site</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
              >
                Sign Out
              </button>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-white text-darkGreen'
                    : 'text-white hover:bg-green-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'students'
                    ? 'bg-white text-darkGreen'
                    : 'text-white hover:bg-green-700'
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'reports'
                    ? 'bg-white text-darkGreen'
                    : 'text-white hover:bg-green-700'
                }`}
              >
                Reports
              </button>
            </nav>
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
                <p className="text-2xl font-bold text-darkGreen">{students.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <FaClock className="text-3xl text-darkGreen mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Total Learning Time</h3>
                <p className="text-2xl font-bold text-darkGreen">14h 30m</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <FaTrophy className="text-3xl text-darkGreen mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Achievements</h3>
                <p className="text-2xl font-bold text-darkGreen">24</p>
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
                {students.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedStudent?.id === student.id
                        ? 'bg-darkGreen text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-sm">Grade {student.grade}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area - Charts and Analytics */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-4">Learning Progress</h2>
                <div className="h-64">
                  <Line data={progressData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h2 className="text-xl font-bold mb-4">Skills Development</h2>
                  <div className="h-64">
                    <Radar data={skillsData} options={{ maintainAspectRatio: false }} />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-4">Game Time Distribution</h2>
                  <div className="h-64">
                    <Bar data={gameTimeData} options={{ maintainAspectRatio: false }} />
                  </div>
                </div>
              </div>
            </div>
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
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Age</label>
                <input
                  type="number"
                  value={newStudent.age}
                  onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Grade</label>
                <input
                  type="text"
                  value={newStudent.grade}
                  onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-darkGreen text-white rounded-lg hover:bg-secondary"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Legal Links (Terms and Conditions, Privacy Policy) */}
      <div className="mt-4 text-sm">
        <Link href="/terms-and-conditions" className="text-white hover:text-gray-400 transition-colors duration-300 mx-2">
          Terms and Conditions
        </Link>
        |
        <Link href="/privacy-policy" className="text-white hover:text-gray-400 transition-colors duration-300 mx-2">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
} 