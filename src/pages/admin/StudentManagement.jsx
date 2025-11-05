import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, Download, GraduationCap, Users, Search } from 'lucide-react';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Alert from '../../components/common/Alert';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Card from '../../components/common/Card';
import { studentService } from '../../api/services';

const CLASS_LEVELS = [
  'JSS1', 'JSS2', 'JSS3',
  'SS1', 'SS2', 'SS3'
];

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [alert, setAlert] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    byClass: {},
  });
  const [filters, setFilters] = useState({
    class: '',
    search: '',
  });

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    classLevel: '',
    gender: '',
    dateOfBirth: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Bulk upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadStudents();
  }, [filters]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.class) params.class_level = filters.class;
      if (filters.search) params.search = filters.search;

      const response = await studentService.getAll(params);
      const studentList = response.data?.students || response.data || [];
      setStudents(studentList);

      // Calculate stats
      const byClass = {};
      studentList.forEach((student) => {
        const classLevel = student.class_level || student.classLevel;
        byClass[classLevel] = (byClass[classLevel] || 0) + 1;
      });

      setStats({
        total: studentList.length,
        byClass,
      });
    } catch (error) {
      showAlert('error', error.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  const handleOpenModal = (student = null) => {
    if (student) {
      setSelectedStudent(student);
      setFormData({
        firstName: student.first_name || student.firstName,
        lastName: student.last_name || student.lastName,
        email: student.email || '',
        classLevel: student.class_level || student.classLevel,
        gender: student.gender || '',
        dateOfBirth: student.date_of_birth || student.dateOfBirth || '',
      });
    } else {
      setSelectedStudent(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        classLevel: '',
        gender: '',
        dateOfBirth: '',
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      classLevel: '',
      gender: '',
      dateOfBirth: '',
    });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      errors.lastName = 'Last name is required';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.classLevel) {
      errors.classLevel = 'Class level is required';
    }

    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email || undefined,
        class_level: formData.classLevel,
        gender: formData.gender,
        date_of_birth: formData.dateOfBirth || undefined,
      };

      if (selectedStudent) {
        await studentService.update(selectedStudent.id || selectedStudent.student_id, payload);
        showAlert('success', 'Student updated successfully');
      } else {
        await studentService.create(payload);
        showAlert('success', 'Student created successfully');
      }

      handleCloseModal();
      loadStudents();
    } catch (error) {
      showAlert('error', error.message || 'Failed to save student');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (student) => {
    setSelectedStudent(student);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setSubmitting(true);
      await studentService.delete(selectedStudent.id || selectedStudent.student_id);
      showAlert('success', 'Student deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedStudent(null);
      loadStudents();
    } catch (error) {
      showAlert('error', error.message || 'Failed to delete student');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await studentService.downloadTemplate();
      showAlert('success', 'Template downloaded successfully');
    } catch (error) {
      showAlert('error', error.message || 'Failed to download template');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        showAlert('error', 'Please upload an Excel file (.xlsx or .xls)');
        return;
      }
      setUploadFile(file);
    }
  };

  const handleBulkUpload = async () => {
    if (!uploadFile) {
      showAlert('error', 'Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      const response = await studentService.bulkUpload(uploadFile);
      
      const successCount = response.data?.success_count || response.data?.successCount || 0;
      const errorCount = response.data?.error_count || response.data?.errorCount || 0;

      if (errorCount > 0) {
        showAlert(
          'warning',
          `Uploaded ${successCount} students successfully. ${errorCount} failed. Check console for details.`
        );
      } else {
        showAlert('success', `Successfully uploaded ${successCount} students`);
      }

      setIsBulkUploadModalOpen(false);
      setUploadFile(null);
      loadStudents();
    } catch (error) {
      showAlert('error', error.message || 'Failed to upload students');
    } finally {
      setUploading(false);
    }
  };

  const columns = [
    {
      key: 'admissionNumber',
      label: 'Admission No',
      render: (value, row) => (
        <span className="font-mono font-semibold text-blue-600">
          {row.admission_number || row.admissionNumber}
        </span>
      ),
    },
    {
      key: 'fullName',
      label: 'Full Name',
      render: (value, row) => {
        const firstName = row.first_name || row.firstName;
        const lastName = row.last_name || row.lastName;
        return `${firstName} ${lastName}`;
      },
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => value || '-',
    },
    {
      key: 'classLevel',
      label: 'Class',
      render: (value, row) => {
        const classLevel = row.class_level || row.classLevel;
        return <Badge variant="info">{classLevel}</Badge>;
      },
    },
    {
      key: 'gender',
      label: 'Gender',
      render: (value) => (
        <span className="capitalize">{value || '-'}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Registered',
      render: (value, row) => {
        const date = new Date(row.created_at || row.createdAt);
        return date.toLocaleDateString();
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal(row)}
            className="rounded p-1 text-blue-600 hover:bg-blue-50"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="rounded p-1 text-red-600 hover:bg-red-50"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Alert */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage students across all class levels
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setIsBulkUploadModalOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card
          title="Total Students"
          value={stats.total}
          icon={GraduationCap}
        />
        <Card
          title="JSS Students"
          value={(stats.byClass.JSS1 || 0) + (stats.byClass.JSS2 || 0) + (stats.byClass.JSS3 || 0)}
          subtitle="Junior Secondary"
        />
        <Card
          title="SS Students"
          value={(stats.byClass.SS1 || 0) + (stats.byClass.SS2 || 0) + (stats.byClass.SS3 || 0)}
          subtitle="Senior Secondary"
        />
        <Card
          title="By Class"
          value={Object.keys(stats.byClass).length}
          subtitle="Active classes"
        />
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Select
            label="Class Level"
            value={filters.class}
            onChange={(e) => setFilters({ ...filters, class: e.target.value })}
            options={[
              { value: '', label: 'All Classes' },
              ...CLASS_LEVELS.map((level) => ({ value: level, label: level })),
            ]}
          />
          <Input
            label="Search"
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search by name or admission number..."
          />
          <div className="flex items-end">
            <Button
              variant="secondary"
              onClick={() => setFilters({ class: '', search: '' })}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <Table
          columns={columns}
          data={students}
          loading={loading}
          emptyMessage="No students found. Add your first student to get started."
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedStudent ? 'Edit Student' : 'Add New Student'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              error={formErrors.firstName}
              placeholder="John"
              required
            />
            <Input
              label="Last Name"
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              error={formErrors.lastName}
              placeholder="Doe"
              required
            />
          </div>

          <Input
            label="Email (Optional)"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={formErrors.email}
            placeholder="student@example.com"
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Class Level"
              value={formData.classLevel}
              onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
              error={formErrors.classLevel}
              options={CLASS_LEVELS.map((level) => ({ value: level, label: level }))}
              placeholder="Select class"
              required
            />
            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              error={formErrors.gender}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
              placeholder="Select gender"
              required
            />
          </div>

          <Input
            label="Date of Birth (Optional)"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {selectedStudent ? 'Update Student' : 'Add Student'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Bulk Upload Modal */}
      <Modal
        isOpen={isBulkUploadModalOpen}
        onClose={() => {
          setIsBulkUploadModalOpen(false);
          setUploadFile(null);
        }}
        title="Bulk Upload Students"
        size="md"
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <h4 className="font-medium text-blue-900">Instructions:</h4>
            <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-blue-800">
              <li>Download the Excel template</li>
              <li>Fill in student information</li>
              <li>Upload the completed file</li>
            </ol>
          </div>

          <Button
            variant="outline"
            onClick={handleDownloadTemplate}
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Upload Excel File
            </label>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="w-full rounded-lg border border-gray-300 p-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploadFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {uploadFile.name}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsBulkUploadModalOpen(false);
                setUploadFile(null);
              }}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button onClick={handleBulkUpload} loading={uploading} disabled={!uploadFile}>
              Upload Students
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Student"
        message={`Are you sure you want to delete ${
          selectedStudent?.first_name || selectedStudent?.firstName
        } ${selectedStudent?.last_name || selectedStudent?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
        loading={submitting}
      />
    </div>
  );
};

export default StudentManagement;