import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  MoreVertical, 
  Download, 
  Trash2, 
  Search, 
  Filter, 
  Clock, 
  Calendar, 
  CheckCircle, 
  X, 
  AlertTriangle
} from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import { getAllDocuments, getDocumentsByType, downloadDocument, uploadDocument, type MedicalDocument } from '../services/documentService';

type DocumentType = 'all' | 'prescription' | 'labReport' | 'imaging' | 'discharge' | 'referral' | 'other';

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<MedicalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<DocumentType>('all');
  
  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    type: 'prescription' as DocumentType,
    date: new Date().toISOString().split('T')[0],
    doctorName: '',
    facilityName: '',
    description: '',
    file: null as File | null
  });
  
  // Download state
  const [downloadStatus, setDownloadStatus] = useState<{
    loading: boolean;
    success: boolean;
    error: string | null;
    documentId: string | null;
  }>({
    loading: false,
    success: false,
    error: null,
    documentId: null
  });
  
  // Load documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const docs = await getAllDocuments();
        setDocuments(docs);
        setFilteredDocuments(docs);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, []);
  
  // Filter documents when activeFilter changes
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredDocuments(documents);
    } else {
      getDocumentsByType(activeFilter).then((docs) => {
        setFilteredDocuments(docs);
      });
    }
  }, [activeFilter, documents]);
  
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      if (activeFilter === 'all') {
        setFilteredDocuments(documents);
      } else {
        setFilteredDocuments(documents.filter(doc => doc.type === activeFilter));
      }
      return;
    }
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    const results = documents.filter(doc => {
      // Filter by type if needed
      if (activeFilter !== 'all' && doc.type !== activeFilter) {
        return false;
      }
      
      // Search in various fields
      return (
        doc.title.toLowerCase().includes(lowerSearchTerm) ||
        (doc.doctorName && doc.doctorName.toLowerCase().includes(lowerSearchTerm)) ||
        (doc.facilityName && doc.facilityName.toLowerCase().includes(lowerSearchTerm)) ||
        (doc.description && doc.description.toLowerCase().includes(lowerSearchTerm))
      );
    });
    
    setFilteredDocuments(results);
  };
  
  const handleDownload = async (documentId: string) => {
    setDownloadStatus({
      loading: true,
      success: false,
      error: null,
      documentId: documentId
    });
    
    try {
      const result = await downloadDocument(documentId);
      
      if (result.success) {
        setDownloadStatus({
          loading: false,
          success: true,
          error: null,
          documentId: documentId
        });
        
        // Reset success status after 3 seconds
        setTimeout(() => {
          setDownloadStatus(prev => ({
            ...prev,
            success: false,
            documentId: null
          }));
        }, 3000);
      } else {
        setDownloadStatus({
          loading: false,
          success: false,
          error: result.message,
          documentId: documentId
        });
      }
    } catch (error: any) {
      setDownloadStatus({
        loading: false,
        success: false,
        error: error.message || 'Failed to download document',
        documentId: documentId
      });
    }
  };
  
  const handleUploadFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUploadFormData({
      ...uploadFormData,
      [name]: value
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadFormData({
        ...uploadFormData,
        file: e.target.files[0]
      });
    }
  };
  
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadFormData.title || !uploadFormData.date || !uploadFormData.file) {
      return;
    }
    
    try {
      const newDocument = await uploadDocument({
        ...uploadFormData,
        file: uploadFormData.file
      });
      
      // Add the new document to state
      setDocuments([...documents, newDocument]);
      
      // Update filtered documents if needed
      if (activeFilter === 'all' || activeFilter === newDocument.type) {
        setFilteredDocuments([...filteredDocuments, newDocument]);
      }
      
      // Close modal and reset form
      setIsUploadModalOpen(false);
      setUploadFormData({
        title: '',
        type: 'prescription',
        date: new Date().toISOString().split('T')[0],
        doctorName: '',
        facilityName: '',
        description: '',
        file: null
      });
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };
  
  const getDocumentTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      prescription: 'Prescription',
      labReport: 'Lab Report',
      imaging: 'Imaging',
      discharge: 'Discharge Summary',
      referral: 'Referral',
      other: 'Other'
    };
    return labels[type] || 'Document';
  };
  
  const getDocumentTypeIcon = (type: string, className = '') => {
    switch (type) {
      case 'prescription':
        return <FileText className={`text-blue-500 ${className}`} />;
      case 'labReport':
        return <FileText className={`text-purple-500 ${className}`} />;
      case 'imaging':
        return <FileText className={`text-indigo-500 ${className}`} />;
      case 'discharge':
        return <FileText className={`text-green-500 ${className}`} />;
      case 'referral':
        return <FileText className={`text-orange-500 ${className}`} />;
      default:
        return <FileText className={`text-gray-500 ${className}`} />;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Medical Documents
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage and access your healthcare documents
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <Button
                  variant="primary"
                  onClick={() => setIsUploadModalOpen(true)}
                  leftIcon={<Plus size={16} />}
                >
                  Upload Document
                </Button>
              </div>
            </div>
            
            {/* Search and filters */}
            <div className="mt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Search by document name, doctor, or facility"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm('');
                          handleSearch();
                        }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <X className="h-5 w-5 text-gray-400 hover:text-gray-500" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    onClick={handleSearch}
                    leftIcon={<Search size={16} />}
                  >
                    Search
                  </Button>
                </div>
              </div>
              
              {/* Document type filters */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    activeFilter === 'all'
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Documents
                </button>
                <button
                  onClick={() => setActiveFilter('prescription')}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    activeFilter === 'prescription'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Prescriptions
                </button>
                <button
                  onClick={() => setActiveFilter('labReport')}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    activeFilter === 'labReport'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Lab Reports
                </button>
                <button
                  onClick={() => setActiveFilter('imaging')}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    activeFilter === 'imaging'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Imaging
                </button>
                <button
                  onClick={() => setActiveFilter('discharge')}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    activeFilter === 'discharge'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Discharge Summaries
                </button>
                <button
                  onClick={() => setActiveFilter('referral')}
                  className={`px-3 py-1.5 rounded-full text-sm ${
                    activeFilter === 'referral'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Referrals
                </button>
              </div>
            </div>
          </motion.div>
          
          {/* Documents grid */}
          <div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                    <div className="h-40 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredDocuments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((document) => (
                  <motion.div
                    key={document.id}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    <div className="relative h-48 bg-gray-100">
                      {document.thumbnailUrl ? (
                        <img
                          src={document.thumbnailUrl}
                          alt={document.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          {getDocumentTypeIcon(document.type, 'h-16 w-16')}
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          document.type === 'prescription' ? 'bg-blue-100 text-blue-800' :
                          document.type === 'labReport' ? 'bg-purple-100 text-purple-800' :
                          document.type === 'imaging' ? 'bg-indigo-100 text-indigo-800' :
                          document.type === 'discharge' ? 'bg-green-100 text-green-800' :
                          document.type === 'referral' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {getDocumentTypeLabel(document.type)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 text-lg">{document.title}</h3>
                      
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        <span>{new Date(document.date).toLocaleDateString()}</span>
                      </div>
                      
                      {document.doctorName && (
                        <div className="mt-1 text-sm text-gray-500">
                          {document.doctorName}
                        </div>
                      )}
                      
                      {document.facilityName && (
                        <div className="text-sm text-gray-500">
                          {document.facilityName}
                        </div>
                      )}
                      
                      <div className="mt-2 text-sm text-gray-500">
                        {(document.size / 1024).toFixed(2)} MB
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Download size={16} />}
                          onClick={() => handleDownload(document.id)}
                          isLoading={downloadStatus.loading && downloadStatus.documentId === document.id}
                        >
                          {downloadStatus.success && downloadStatus.documentId === document.id ? (
                            <span className="flex items-center">
                              <CheckCircle size={16} className="mr-1 text-green-500" />
                              Downloaded
                            </span>
                          ) : (
                            'Download'
                          )}
                        </Button>
                        
                        <div className="relative">
                          <button className="text-gray-400 hover:text-gray-500">
                            <MoreVertical size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-4">
                  <FileText size={24} className="text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No documents found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? 
                    "We couldn't find any documents matching your search" : 
                    activeFilter !== 'all' ? 
                      `You don't have any ${getDocumentTypeLabel(activeFilter).toLowerCase()} documents` : 
                      "You haven't uploaded any documents yet"
                  }
                </p>
                {searchTerm || activeFilter !== 'all' ? (
                  <div className="flex justify-center gap-3">
                    {searchTerm && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchTerm('');
                          handleSearch();
                        }}
                      >
                        Clear Search
                      </Button>
                    )}
                    {activeFilter !== 'all' && (
                      <Button variant="outline" onClick={() => setActiveFilter('all')}>
                        Show All Documents
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => setIsUploadModalOpen(true)}
                    leftIcon={<Plus size={16} />}
                  >
                    Upload Your First Document
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Upload document modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Upload Medical Document
                </h2>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleUploadSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Document Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={uploadFormData.title}
                    onChange={handleUploadFormChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Enter document title"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Document Type*
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={uploadFormData.type}
                    onChange={handleUploadFormChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    required
                  >
                    <option value="prescription">Prescription</option>
                    <option value="labReport">Lab Report</option>
                    <option value="imaging">Imaging</option>
                    <option value="discharge">Discharge Summary</option>
                    <option value="referral">Referral</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Document Date*
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={uploadFormData.date}
                    onChange={handleUploadFormChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700 mb-1">
                      Doctor Name (optional)
                    </label>
                    <input
                      type="text"
                      id="doctorName"
                      name="doctorName"
                      value={uploadFormData.doctorName}
                      onChange={handleUploadFormChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="e.g. Dr. Sharma"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="facilityName" className="block text-sm font-medium text-gray-700 mb-1">
                      Facility Name (optional)
                    </label>
                    <input
                      type="text"
                      id="facilityName"
                      name="facilityName"
                      value={uploadFormData.facilityName}
                      onChange={handleUploadFormChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="e.g. Apollo Hospital"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={2}
                    value={uploadFormData.description}
                    onChange={handleUploadFormChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Brief description of the document"
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                    Document File*
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <FileText size={36} className="mx-auto text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, JPEG, PNG, DOC up to 10MB
                      </p>
                      {uploadFormData.file && (
                        <p className="text-sm text-primary-600">
                          Selected: {uploadFormData.file.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="mr-2"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={!uploadFormData.title || !uploadFormData.date || !uploadFormData.file}
                  >
                    Upload Document
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default DocumentsPage;