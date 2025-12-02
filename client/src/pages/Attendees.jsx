import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { getAttendees, markAttendeeEntry, exportAttendeesCSV, exportAttendeesPDF, downloadBlob } from '../services/apiService';
import Table from '../components/Table';

const Attendees = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [designation, setDesignation] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });
  const [selectedAttendee, setSelectedAttendee] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAttendees();
    }
  }, [isAuthenticated, pagination.page, search, designation]);

  const fetchAttendees = async () => {
    setLoading(true);
    try {
      const response = await getAttendees({
        page: pagination.page,
        limit: pagination.limit,
        ...(search && { search }),
        ...(designation && { designation }),
      });
      setAttendees(response.data.attendees);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch attendees');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await exportAttendeesCSV();
      downloadBlob(blob, 'attendees_export.csv');
      toast.success('CSV exported successfully');
    } catch (error) {
      toast.error('Failed to export CSV');
    }
  };

  const handleExportPDF = async () => {
    try {
      const blob = await exportAttendeesPDF();
      downloadBlob(blob, 'attendees_export.pdf');
      toast.success('PDF exported successfully');
    } catch (error) {
      toast.error('Failed to export PDF');
    }
  };

  const handleMarkEntry = async (id) => {
    try {
      await markAttendeeEntry(id);
      toast.success('Entry marked successfully');
      fetchAttendees();
      setSelectedAttendee(null);
    } catch (error) {
      toast.error('Failed to mark entry');
    }
  };

  const columns = [
    { key: 'attendeeCode', label: 'Code' },
    { key: 'fullName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'designation', label: 'Designation' },
    {
      key: 'isScanned',
      label: 'Status',
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            value
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {value ? 'Scanned' : 'Pending'}
        </span>
      ),
    },
    {
      key: 'entryTime',
      label: 'Entry Time',
      render: (value) =>
        value ? new Date(value).toLocaleString() : 'Not entered',
    },
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Attendees</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleExportCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Export CSV
            </button>
            <button
              onClick={handleExportPDF}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Export PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
                placeholder="Search by name, email, phone, or code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Designation
              </label>
              <select
                value={designation}
                onChange={(e) => {
                  setDesignation(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All</option>
                <option value="Student">Student</option>
                <option value="Alumni">Alumni</option>
                <option value="Staff">Staff</option>
                <option value="Guest">Guest</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table
            data={attendees}
            columns={columns}
            onRowClick={(row) => setSelectedAttendee(row)}
          />

          {pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-700">
                Page {pagination.page} of {pagination.pages} (Total:{' '}
                {pagination.total})
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page - 1 })
                  }
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page + 1 })
                  }
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {selectedAttendee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Attendee Details</h2>
                <button
                  onClick={() => setSelectedAttendee(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Code:</span>{' '}
                  {selectedAttendee.attendeeCode}
                </p>
                <p>
                  <span className="font-semibold">Name:</span>{' '}
                  {selectedAttendee.fullName}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{' '}
                  {selectedAttendee.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span>{' '}
                  {selectedAttendee.phone}
                </p>
                <p>
                  <span className="font-semibold">Designation:</span>{' '}
                  {selectedAttendee.designation}
                </p>
                {selectedAttendee.passedOutYear && (
                  <p>
                    <span className="font-semibold">Passed Out Year:</span>{' '}
                    {selectedAttendee.passedOutYear}
                  </p>
                )}
                <p>
                  <span className="font-semibold">Status:</span>{' '}
                  {selectedAttendee.isScanned ? 'Scanned' : 'Pending'}
                </p>
                {selectedAttendee.entryTime && (
                  <p>
                    <span className="font-semibold">Entry Time:</span>{' '}
                    {new Date(selectedAttendee.entryTime).toLocaleString()}
                  </p>
                )}
              </div>
              {!selectedAttendee.isScanned && (
                <button
                  onClick={() => handleMarkEntry(selectedAttendee._id)}
                  className="mt-4 w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700"
                >
                  Mark Entry
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendees;

