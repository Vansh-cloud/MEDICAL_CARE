// Mock document service

export interface MedicalDocument {
  id: string;
  title: string;
  type: 'prescription' | 'labReport' | 'imaging' | 'discharge' | 'referral' | 'other';
  date: string;
  doctorName?: string;
  facilityName?: string;
  description?: string;
  fileUrl: string; // In a real app, this would be an actual file URL
  thumbnailUrl?: string;
  size: number; // Size in KB
}

const mockDocuments: MedicalDocument[] = [
  {
    id: 'doc-1',
    title: 'Cardiology Prescription',
    type: 'prescription',
    date: '2025-04-15',
    doctorName: 'Dr. Aditya Sharma',
    facilityName: 'Apollo Hospitals',
    description: 'Prescription for cardiac medication following consultation',
    fileUrl: '/sample-documents/prescription.pdf',
    thumbnailUrl: 'https://images.pexels.com/photos/3683056/pexels-photo-3683056.jpeg',
    size: 156
  },
  {
    id: 'doc-2',
    title: 'Blood Work Results',
    type: 'labReport',
    date: '2025-04-10',
    facilityName: 'SRL Diagnostics',
    description: 'Complete blood count and lipid profile',
    fileUrl: '/sample-documents/lab-report.pdf',
    thumbnailUrl: 'https://images.pexels.com/photos/4226119/pexels-photo-4226119.jpeg',
    size: 428
  },
  {
    id: 'doc-3',
    title: 'Chest X-Ray',
    type: 'imaging',
    date: '2025-03-28',
    doctorName: 'Dr. Rajesh Kumar',
    facilityName: 'Narayana Health',
    description: 'Chest X-ray for respiratory symptoms',
    fileUrl: '/sample-documents/xray.pdf',
    thumbnailUrl: 'https://images.pexels.com/photos/6749773/pexels-photo-6749773.jpeg',
    size: 1256
  }
];

// Get all documents
export const getAllDocuments = async (): Promise<MedicalDocument[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockDocuments;
};

// Get documents by type
export const getDocumentsByType = async (type: string): Promise<MedicalDocument[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockDocuments.filter(doc => doc.type === type);
};

// Get document by ID
export const getDocumentById = async (id: string): Promise<MedicalDocument | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockDocuments.find(doc => doc.id === id) || null;
};

// Download document (mock function, in real app would trigger file download)
export const downloadDocument = async (id: string): Promise<{success: boolean, message: string}> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const document = mockDocuments.find(doc => doc.id === id);
  
  if (!document) {
    return {
      success: false,
      message: 'Document not found'
    };
  }
  
  // In a real app, this would trigger the actual download
  return {
    success: true,
    message: `Document "${document.title}" downloaded successfully`
  };
};

// Upload document (mock function)
export interface DocumentUpload {
  title: string;
  type: 'prescription' | 'labReport' | 'imaging' | 'discharge' | 'referral' | 'other';
  date: string;
  doctorName?: string;
  facilityName?: string;
  description?: string;
  file: File; // This would be a File object in a real app
}

export const uploadDocument = async (documentData: DocumentUpload): Promise<MedicalDocument> => {
  // Simulate API call delay and processing
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real app, this would handle the file upload to storage
  
  const newDocument: MedicalDocument = {
    id: 'doc-' + Math.random().toString(36).substring(2, 10),
    title: documentData.title,
    type: documentData.type,
    date: documentData.date,
    doctorName: documentData.doctorName,
    facilityName: documentData.facilityName,
    description: documentData.description,
    fileUrl: '/sample-documents/uploaded-document.pdf', // Placeholder URL
    thumbnailUrl: 'https://images.pexels.com/photos/4226264/pexels-photo-4226264.jpeg', // Placeholder thumbnail
    size: Math.floor(Math.random() * 1000) + 100 // Random size between 100KB and 1100KB
  };
  
  // Add to mock data
  mockDocuments.push(newDocument);
  
  return newDocument;
};