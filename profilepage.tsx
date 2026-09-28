import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { User, Mail, Upload as UploadIcon, Calendar, FileText, Settings, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MaterialCard from '../components/MaterialCard';
import { getCurrentUser, mockMaterials, Material } from '../utils/mockData';
import { toast } from 'sonner';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [userMaterials, setUserMaterials] = useState<Material[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Get current user once and check if it exists
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Filter materials uploaded by current user
    const materials = mockMaterials.filter(m => m.uploadedBy === currentUser.fullName);
    setUserMaterials(materials);
    
    // Set up an interval to check for material updates every second
    const interval = setInterval(() => {
      const updatedMaterials = mockMaterials.filter(m => m.uploadedBy === currentUser.fullName);
      setUserMaterials(updatedMaterials);
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]); // Run when refreshKey changes

  if (!currentUser) {
    return null;
  }

  const handleDeleteAccount = () => {
    toast.error('Account deletion is not available in demo mode');
  };

  // Group materials by status
  const pendingMaterials = userMaterials.filter(m => m.status === 'pending');
  const approvedMaterials = userMaterials.filter(m => m.status === 'approved');
  const flaggedMaterials = userMaterials.filter(m => m.status === 'flagged');
  const removedMaterials = userMaterials.filter(m => m.status === 'removed');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <div className="w-24 h-24 bg-[#6B1E3E] rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle>{currentUser.fullName}</CardTitle>
                  <CardDescription className="flex items-center justify-center gap-1">
                    <Mail className="w-3 h-3" />
                    {currentUser.email}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-600 mb-2">Account Type</h4>
                      <Badge className={currentUser.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                        {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                      </Badge>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-semibold text-gray-600 mb-2">Upload Statistics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Total Uploads</span>
                          <Badge variant="outline">{userMaterials.length}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Approved</span>
                          <Badge className="bg-green-100 text-green-800">{approvedMaterials.length}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Pending</span>
                          <Badge className="bg-yellow-100 text-yellow-800">{pendingMaterials.length}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Flagged</span>
                          <Badge className="bg-red-100 text-red-800">{flaggedMaterials.length}</Badge>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" disabled>
                        <Settings className="w-4 h-4 mr-2" />
                        Account Settings
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleDeleteAccount}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upload History */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UploadIcon className="w-5 h-5" />
                    Upload History
                  </CardTitle>
                  <CardDescription>
                    Track the status of all your uploaded materials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      <TabsTrigger value="all">
                        All
                        <Badge variant="outline" className="ml-2">{userMaterials.length}</Badge>
                      </TabsTrigger>
                      <TabsTrigger value="pending">
                        Pending
                        <Badge variant="outline" className="ml-2">{pendingMaterials.length}</Badge>
                      </TabsTrigger>
                      <TabsTrigger value="approved">
                        Approved
                        <Badge variant="outline" className="ml-2">{approvedMaterials.length}</Badge>
                      </TabsTrigger>
                      <TabsTrigger value="flagged">
                        Flagged
                        <Badge variant="outline" className="ml-2">{flaggedMaterials.length}</Badge>
                      </TabsTrigger>
                      <TabsTrigger value="removed">
                        Removed
                        <Badge variant="outline" className="ml-2">{removedMaterials.length}</Badge>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-4 mt-6">
                      {userMaterials.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">You haven't uploaded any materials yet.</p>
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {userMaterials.map(material => (
                            <MaterialCard key={material.id} material={material} showStatus />
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="pending" className="space-y-4 mt-6">
                      {pendingMaterials.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No pending materials.</p>
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {pendingMaterials.map(material => (
                            <MaterialCard key={material.id} material={material} showStatus />
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="approved" className="space-y-4 mt-6">
                      {approvedMaterials.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No approved materials.</p>
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {approvedMaterials.map(material => (
                            <MaterialCard key={material.id} material={material} showStatus />
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="flagged" className="space-y-4 mt-6">
                      {flaggedMaterials.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No flagged materials.</p>
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {flaggedMaterials.map(material => (
                            <MaterialCard key={material.id} material={material} showStatus />
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="removed" className="space-y-4 mt-6">
                      {removedMaterials.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No removed materials.</p>
                        </div>
                      ) : (
                        <div className="grid gap-4">
                          {removedMaterials.map(material => (
                            <MaterialCard key={material.id} material={material} showStatus />
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
