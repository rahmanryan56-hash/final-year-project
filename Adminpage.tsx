import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Shield, CheckCircle, XCircle, AlertTriangle, RotateCcw, Eye, TrendingUp, FileText, Flag, Clock, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MaterialViewer from '../components/MaterialViewer';
import { getCurrentUser, isAdmin, getMaterials, saveMaterials, Material } from '../utils/mockData';
import { generateMaterialContent, downloadMaterial } from '../utils/materialContent';
import { toast } from 'sonner';

export default function AdminPage() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<Material[]>(getMaterials());
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  
  // Get current user once
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser || !isAdmin()) {
      navigate('/admin/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  if (!currentUser || !isAdmin()) {
    return null;
  }

  const handleApprove = (materialId: string) => {
    const updatedMaterials = materials.map(m =>
      m.id === materialId ? { ...m, status: 'approved' as const } : m
    );
    setMaterials(updatedMaterials);
    saveMaterials(updatedMaterials);
    toast.success('Material approved successfully!');
  };

  const handleReject = (materialId: string) => {
    const updatedMaterials = materials.map(m =>
      m.id === materialId ? { ...m, status: 'removed' as const } : m
    );
    setMaterials(updatedMaterials);
    saveMaterials(updatedMaterials);
    toast.success('Material removed successfully!');
  };

  const handleRestore = (materialId: string) => {
    const updatedMaterials = materials.map(m =>
      m.id === materialId ? { ...m, status: 'approved' as const } : m
    );
    setMaterials(updatedMaterials);
    saveMaterials(updatedMaterials);
    toast.success('Material restored successfully!');
  };

  const handleViewDetails = (material: Material) => {
    setSelectedMaterial(material);
    setShowDetailsModal(true);
  };

  const handleViewMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setViewerOpen(true);
  };

  // Calculate KPIs
  const totalUploads = materials.length;
  const approvedCount = materials.filter(m => m.status === 'approved').length;
  const pendingCount = materials.filter(m => m.status === 'pending').length;
  const flaggedCount = materials.filter(m => m.status === 'flagged').length;
  const removedCount = materials.filter(m => m.status === 'removed').length;
  const totalReports = materials.reduce((sum, m) => sum + m.reports, 0);

  const pendingMaterials = materials.filter(m => m.status === 'pending');
  const flaggedMaterials = materials.filter(m => m.status === 'flagged');
  const removedMaterials = materials.filter(m => m.status === 'removed');
  const reportedMaterials = materials.filter(m => m.reports > 0);

  const MaterialRow = ({ material }: { material: Material }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{material.title}</h3>
              <Badge className={
                material.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                material.status === 'approved' ? 'bg-green-100 text-green-800' :
                material.status === 'flagged' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }>
                {material.status.charAt(0).toUpperCase() + material.status.slice(1)}
              </Badge>
              {material.reports > 0 && (
                <Badge variant="destructive">
                  <Flag className="w-3 h-3 mr-1" />
                  {material.reports} reports
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{material.description}</p>
            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              <span>Course: {material.course}</span>
              <span>•</span>
              <span>Module: {material.module}</span>
              <span>•</span>
              <span>By: {material.uploadedBy}</span>
              <span>•</span>
              <span>Date: {new Date(material.uploadedAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewMaterial(material)}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            
            {material.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove(material.id)}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReject(material.id)}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </>
            )}
            
            {material.status === 'flagged' && (
              <>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove(material.id)}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReject(material.id)}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </>
            )}
            
            {material.status === 'removed' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRestore(material.id)}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Restore
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-10 h-10" />
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-white/90 text-lg">
              Content moderation and platform management
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* KPI Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Uploads</p>
                    <p className="text-3xl font-bold">{totalUploads}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Approved</p>
                    <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Flagged</p>
                    <p className="text-3xl font-bold text-red-600">{flaggedCount}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Removed</p>
                    <p className="text-3xl font-bold text-gray-600">{removedCount}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-gray-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Academic Integrity Panel */}
          <Alert className="mb-8 bg-blue-50 border-blue-200">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-900">
              <strong>Academic Integrity Panel:</strong> {totalReports} materials have been reported. 
              Review flagged content to ensure compliance with university standards. 
              Last updated: {new Date().toLocaleString()}
            </AlertDescription>
          </Alert>

          {/* Notice and Takedown Policy */}
          <Card className="mb-8 border-purple-200 bg-purple-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-purple-600" />
                <div>
                  <CardTitle className="text-purple-900">Notice and Takedown Policy</CardTitle>
                  <CardDescription className="text-purple-700">
                    Institutional Liability Mitigation Framework
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">Policy Overview</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  StudyWest implements a comprehensive 'Notice and Takedown' procedure to mitigate institutional liability 
                  while facilitating academic resource sharing. Under this policy:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span><strong>Uploader Responsibility:</strong> Content creators retain full legal and academic responsibility for all uploaded materials.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span><strong>Administrative Oversight:</strong> All materials undergo automated and manual moderation to ensure academic integrity.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span><strong>Immediate Removal:</strong> Upon notice of inappropriate, infringing, or non-academic content, materials are promptly removed.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span><strong>User Reporting:</strong> Students can report inappropriate content, triggering administrative review.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span><strong>Institutional Protection:</strong> The platform acts as a neutral facilitator, not a content publisher, limiting university liability.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300">
                <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Admin Action Required
                </h4>
                <p className="text-sm text-yellow-800">
                  As an administrator, you are responsible for enforcing the Notice and Takedown policy. 
                  Review reported and flagged materials promptly. Remove content that violates academic integrity standards, 
                  infringes copyright, or contains inappropriate material. All actions are logged for compliance purposes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Moderation Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Content Moderation</CardTitle>
              <CardDescription>
                Review, approve, or remove uploaded materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="reported">
                    <Flag className="w-4 h-4 mr-1" />
                    Reported
                    <Badge variant="outline" className="ml-2">{reportedMaterials.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending
                    <Badge variant="outline" className="ml-2">{pendingCount}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="flagged">
                    Flagged
                    <Badge variant="outline" className="ml-2">{flaggedCount}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="removed">
                    Removed
                    <Badge variant="outline" className="ml-2">{removedCount}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="all">
                    All
                    <Badge variant="outline" className="ml-2">{totalUploads}</Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="reported" className="mt-6">
                  {reportedMaterials.length === 0 ? (
                    <div className="text-center py-12">
                      <Flag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No reported materials.</p>
                      <p className="text-sm text-gray-400 mt-2">Materials reported by students will appear here.</p>
                    </div>
                  ) : (
                    <div>
                      <Alert className="mb-4 bg-orange-50 border-orange-200">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-900">
                          <strong>Urgent Review Required:</strong> {reportedMaterials.length} materials have been flagged by students. 
                          Please review these items to maintain platform integrity.
                        </AlertDescription>
                      </Alert>
                      {reportedMaterials.map(material => (
                        <MaterialRow key={material.id} material={material} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="pending" className="mt-6">
                  {pendingMaterials.length === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No pending materials to review.</p>
                    </div>
                  ) : (
                    <div>
                      {pendingMaterials.map(material => (
                        <MaterialRow key={material.id} material={material} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="flagged" className="mt-6">
                  {flaggedMaterials.length === 0 ? (
                    <div className="text-center py-12">
                      <Flag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No flagged materials.</p>
                    </div>
                  ) : (
                    <div>
                      {flaggedMaterials.map(material => (
                        <MaterialRow key={material.id} material={material} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="removed" className="mt-6">
                  {removedMaterials.length === 0 ? (
                    <div className="text-center py-12">
                      <XCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No removed materials.</p>
                    </div>
                  ) : (
                    <div>
                      {removedMaterials.map(material => (
                        <MaterialRow key={material.id} material={material} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="all" className="mt-6">
                  <div>
                    {materials.map(material => (
                      <MaterialRow key={material.id} material={material} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Material Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Material Details</DialogTitle>
            <DialogDescription>
              Full information about the uploaded material
            </DialogDescription>
          </DialogHeader>
          
          {selectedMaterial && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-gray-600">Title</Label>
                <p className="text-lg">{selectedMaterial.title}</p>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-600">Description</Label>
                <p>{selectedMaterial.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-600">Course</Label>
                  <p>{selectedMaterial.course}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-600">Module</Label>
                  <p>{selectedMaterial.module}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-600">File Type</Label>
                  <p>{selectedMaterial.fileType}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-600">File Name</Label>
                  <p className="truncate">{selectedMaterial.fileName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-600">Uploaded By</Label>
                  <p>{selectedMaterial.uploadedBy}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-600">Upload Date</Label>
                  <p>{new Date(selectedMaterial.uploadedAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-600">Status</Label>
                  <div>
                    <Badge className={
                      selectedMaterial.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      selectedMaterial.status === 'approved' ? 'bg-green-100 text-green-800' :
                      selectedMaterial.status === 'flagged' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {selectedMaterial.status.charAt(0).toUpperCase() + selectedMaterial.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold text-gray-600">Reports</Label>
                  <p>{selectedMaterial.reports}</p>
                </div>
              </div>

              {selectedMaterial.status === 'approved' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Rating</Label>
                    <p>{selectedMaterial.rating.toFixed(1)} / 5.0</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-600">Rating Count</Label>
                    <p>{selectedMaterial.ratingCount} ratings</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Material Viewer Modal */}
      <MaterialViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        material={selectedMaterial}
      />

      <Footer />
    </div>
  );
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={className}>{children}</div>;
}
