import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Search, Upload, Filter, TrendingUp, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MaterialCard from '../components/MaterialCard';
import UploadModal from '../components/UploadModal';
import MaterialViewer from '../components/MaterialViewer';
import { getCurrentUser, isAdmin, getMaterials, Material } from '../utils/mockData';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const [materials, setMaterials] = useState<Material[]>(getMaterials());
  
  // Get current user once
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  if (!currentUser) {
    return null;
  }

  const handleUploadSuccess = () => {
    // Refresh materials list after upload
    setMaterials(getMaterials());
  };

  const handleReportSuccess = () => {
    // Refresh materials list after report
    setMaterials(getMaterials());
  };

  const handleViewMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setViewerOpen(true);
  };

  // Filter materials
  const filteredMaterials = materials.filter(material => {
    if (material.status !== 'approved') return false;
    
    const matchesSearch = 
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.module.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCourse = courseFilter === 'all' || material.course === courseFilter;
    const matchesModule = moduleFilter === 'all' || material.module === moduleFilter;
    const matchesFileType = fileTypeFilter === 'all' || material.fileType === fileTypeFilter;
    
    return matchesSearch && matchesCourse && matchesModule && matchesFileType;
  });

  // Get popular materials (high rating)
  const popularMaterials = materials
    .filter(m => m.status === 'approved')
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  // Get unique values for filters
  const courses = Array.from(new Set(materials.map(m => m.course)));
  const modules = Array.from(new Set(materials.map(m => m.module)));
  const fileTypes = Array.from(new Set(materials.map(m => m.fileType)));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#6B1E3E] to-[#8B2F4E] text-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {currentUser.fullName}!
              </h1>
              <p className="text-white/90 text-lg">
                Discover and share study materials with your fellow Westminster students
              </p>
              
              <div className="flex flex-wrap gap-4 mt-6">
                <Button
                  onClick={() => setUploadModalOpen(true)}
                  className="bg-white text-[#6B1E3E] hover:bg-white/90"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Material
                </Button>
                {isAdmin() && (
                  <Link to="/admin">
                    <Button variant="outline" className="border-white text-white hover:bg-white/10">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by keyword, course, or module..."
                  className="pl-10 h-12 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filters:</span>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Select value={courseFilter} onValueChange={setCourseFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses.map(course => (
                        <SelectItem key={course} value={course}>{course}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={moduleFilter} onValueChange={setModuleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Modules" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modules</SelectItem>
                      {modules.map(module => (
                        <SelectItem key={module} value={module}>{module}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All File Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All File Types</SelectItem>
                      {fileTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Materials */}
          {!searchQuery && courseFilter === 'all' && moduleFilter === 'all' && fileTypeFilter === 'all' && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-[#6B1E3E]" />
                <h2 className="text-2xl font-bold">Popular & Highly Rated</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {popularMaterials.map(material => (
                  <MaterialCard key={material.id} material={material} onView={handleViewMaterial} onReportSuccess={handleReportSuccess} />
                ))}
              </div>
            </div>
          )}

          {/* All Materials */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {searchQuery || courseFilter !== 'all' || moduleFilter !== 'all' || fileTypeFilter !== 'all'
                ? 'Search Results'
                : 'Recommended Materials'}
            </h2>
            
            {filteredMaterials.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No materials found matching your search criteria.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.map(material => (
                  <MaterialCard key={material.id} material={material} onView={() => handleViewMaterial(material)} onReportSuccess={handleReportSuccess} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <UploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onUploadSuccess={handleUploadSuccess}
      />

      <MaterialViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        material={selectedMaterial}
      />

      <Footer />
    </div>
  );
}
