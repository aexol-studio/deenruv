'use client';

import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  PageBlock,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  usePluginStore,
} from '@deenruv/react-ui-devkit';
import {
  BarChart3,
  Box,
  Check,
  ChevronDown,
  Code2,
  Cog,
  Download,
  ExternalLink,
  FileCode,
  Filter,
  Grid3X3,
  Info,
  LayoutDashboard,
  List,
  MessageSquare,
  Puzzle,
  RefreshCw,
  Search,
  Settings,
  Table,
  Trash2,
  X,
} from 'lucide-react';
import { Separator } from '@radix-ui/react-dropdown-menu';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'visualization':
      return <BarChart3 className="size-4" />;
    case 'forms':
      return <FileCode className="size-4" />;
    case 'security':
      return <Cog className="size-4" />;
    case 'integration':
      return <RefreshCw className="size-4" />;
    case 'ui':
      return <Puzzle className="size-4" />;
    case 'data':
      return <Table className="size-4" />;
    case 'communication':
      return <MessageSquare className="size-4" />;
    default:
      return <Box className="size-4" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
    case 'inactive':
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Inactive
        </Badge>
      );
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};
export const Extensions = () => {
  const { plugins: _plugins, changePluginStatus } = usePluginStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState('grid');

  const plugins = useMemo(
    () =>
      _plugins.map((plugin) => ({
        ...plugin,
        description: 'No description provided',
        category: 'unknown',
        author: 'Unknown',
      })),
    [_plugins],
  );

  const filteredPlugins = plugins.filter((plugin) => {
    const matchesSearch =
      plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || plugin.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || plugin.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPlugins = plugins.length;
  const activePlugins = plugins.filter((p) => p).length;
  const totalWidgets = plugins.reduce((sum, plugin) => sum + (plugin.widgets?.length || 0), 0);
  const totalComponents = plugins.reduce((sum, plugin) => sum + (plugin.components?.length || 0), 0);

  const categories = ['all', ...new Set(plugins.map((p) => p.category))];

  return (
    <PageBlock>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Extensions Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage and monitor your installed plugins</p>
            </div>
            <Button>
              <Download className="mr-2 size-4" />
              Install New Extension
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Extensions</CardTitle>
              <Puzzle className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPlugins}</div>
              <p className="text-muted-foreground text-xs">
                {activePlugins} active, {totalPlugins - activePlugins} inactive
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Widgets</CardTitle>
              <Grid3X3 className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalWidgets}</div>
              <p className="text-muted-foreground text-xs">
                Across {plugins.filter((p) => (p.widgets?.length || 0) > 0).length} extensions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Components</CardTitle>
              <Code2 className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalComponents}</div>
              <p className="text-muted-foreground text-xs">
                Across {plugins.filter((p) => (p.components?.length || 0) > 0).length} extensions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <LayoutDashboard className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length - 1}</div>
              <p className="text-muted-foreground text-xs">Different extension types</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Search extensions..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startAdornment={<Search className="text-muted-foreground size-4" />}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <Filter className="mr-2 size-4" />
                  Filter
                  <ChevronDown className="ml-2 size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className="flex items-center justify-between"
                  >
                    <span className="capitalize">{category === 'all' ? 'All Categories' : category}</span>
                    {categoryFilter === category && <Check className="size-4" />}
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => setStatusFilter('all')} className="flex items-center justify-between">
                  All Statuses
                  {statusFilter === 'all' && <Check className="size-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter('active')}
                  className="flex items-center justify-between"
                >
                  Active
                  {statusFilter === 'active' && <Check className="size-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter('inactive')}
                  className="flex items-center justify-between"
                >
                  Inactive
                  {statusFilter === 'inactive' && <Check className="size-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('beta')} className="flex items-center justify-between">
                  Beta
                  {statusFilter === 'beta' && <Check className="size-4" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={view === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setView('grid')}
              className="size-8"
            >
              <Grid3X3 className="size-4" />
            </Button>
            <Button
              variant={view === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setView('list')}
              className="size-8"
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>

        {(categoryFilter !== 'all' || statusFilter !== 'all' || searchTerm) && (
          <div className="flex flex-wrap gap-2">
            {categoryFilter !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: <span className="capitalize">{categoryFilter}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 size-4 p-0"
                  onClick={() => setCategoryFilter('all')}
                >
                  <X className="size-3" />
                </Button>
              </Badge>
            )}
            {statusFilter !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Status: <span className="capitalize">{statusFilter}</span>
                <Button variant="ghost" size="icon" className="ml-1 size-4 p-0" onClick={() => setStatusFilter('all')}>
                  <X className="size-3" />
                </Button>
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchTerm}
                <Button variant="ghost" size="icon" className="ml-1 size-4 p-0" onClick={() => setSearchTerm('')}>
                  <X className="size-3" />
                </Button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => {
                setCategoryFilter('all');
                setStatusFilter('all');
                setSearchTerm('');
              }}
            >
              Clear all
            </Button>
          </div>
        )}

        {filteredPlugins.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <Info className="text-muted-foreground size-10" />
            <h3 className="mt-4 text-lg font-semibold">No extensions found</h3>
            <p className="text-muted-foreground mt-2 text-sm">Try adjusting your search or filter criteria</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setCategoryFilter('all');
                setStatusFilter('all');
                setSearchTerm('');
              }}
            >
              Reset filters
            </Button>
          </div>
        ) : view === 'grid' ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPlugins.map((plugin) => (
              <Card key={plugin.name} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 rounded-md p-2">{getCategoryIcon(plugin.category)}</div>
                      <CardTitle className="text-lg">{plugin.name}</CardTitle>
                    </div>
                    {getStatusBadge(plugin.status)}
                  </div>
                  <CardDescription className="mt-2">{plugin.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Version:</span>
                      <span>{plugin.version}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Author:</span>
                      <span>{plugin.author}</span>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="grid grid-cols-4 gap-2 text-center text-sm">
                    <div>
                      <div className="font-medium">{plugin.tables?.length}</div>
                      <div className="text-muted-foreground text-xs">Tables</div>
                    </div>
                    <div>
                      <div className="font-medium">{plugin.tabs?.length}</div>
                      <div className="text-muted-foreground text-xs">Tabs</div>
                    </div>
                    <div>
                      <div className="font-medium">{plugin.components?.length}</div>
                      <div className="text-muted-foreground text-xs">Components</div>
                    </div>
                    <div>
                      <div className="font-medium">{plugin.widgets?.length}</div>
                      <div className="text-muted-foreground text-xs">Widgets</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <Info className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View details</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div className="flex gap-2">
                    <Switch
                      checked={plugin.status === 'active'}
                      onCheckedChange={(checked) => {
                        changePluginStatus(plugin.name, checked ? 'active' : 'inactive');
                      }}
                      className="h-6 w-11"
                    >
                      <span className="sr-only">Toggle plugin status</span>
                      <span className="bg-primary absolute left-0 top-0 size-6 rounded-full transition-transform duration-200 ease-in-out" />
                    </Switch>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="grid grid-cols-12 gap-4 p-4 font-medium">
              <div className="col-span-4">Name</div>
              <div className="col-span-3">Author</div>
              <div className="col-span-1 text-center">Version</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>
            <Separator />
            {filteredPlugins.map((plugin, index) => (
              <div key={plugin.name}>
                <div className="grid grid-cols-12 items-center gap-4 p-4">
                  <div className="col-span-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-md p-2">{getCategoryIcon(plugin.category)}</div>
                      <div>
                        <div className="font-medium">{plugin.name}</div>
                        <div className="text-muted-foreground text-xs">{plugin.description}</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-3">{plugin.author}</div>
                  <div className="col-span-1 text-center">{plugin.version}</div>
                  <div className="col-span-1 text-center">{getStatusBadge(plugin.status)}</div>
                  <div className="col-span-3 flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="mr-2 size-3" />
                      Configure
                    </Button>
                    <Switch
                      checked={plugin.status === 'active'}
                      onCheckedChange={(checked) => {
                        changePluginStatus(plugin.name, checked ? 'active' : 'inactive');
                      }}
                      className="h-6 w-11"
                    >
                      <span className="sr-only">Toggle plugin status</span>
                      <span className="bg-primary absolute left-0 top-0 size-6 rounded-full transition-transform duration-200 ease-in-out" />
                    </Switch>
                  </div>
                </div>
                {index < filteredPlugins.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageBlock>
  );
};
