import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "~convex/api";
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Trophy,
  BookOpen,
  BarChart3,
  Bell,
  Search,
  Zap,
  Crown,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavbar } from "@/hooks/use-navbar";

const navigationItems = [
  {
    name: "Learn",
    href: "/learn",
    icon: BookOpen,
    description: "Interactive lessons and courses",
  },
  {
    name: "Prompt Lab",
    href: "/prompt-learning",
    icon: Lightbulb,
    description: "Practice prompt engineering",
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    description: "Track your progress",
  },
  {
    name: "Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
    description: "Compete with others",
  },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const { isScrolled, isVisible, pathname } = useNavbar();
  const location = useLocation();

  // Get sample user data from Convex
  const sampleUser = useQuery(api.users.getSampleUser);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleSignOut = () => {
    // Handle sign out logic here
    console.log("Signing out...");
  };

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  // Use sample user data or fallback to mock data
  const user = sampleUser || {
    name: "Alex Chen",
    email: "alex@example.com",
    level: 12,
    totalScore: 2450,
    currentStreak: 7,
  };

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
          : "bg-white/60 backdrop-blur-sm"
      }`}
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 group-hover:scale-110 transition-transform duration-200"
              whileHover={{ rotate: 5 }}
            >
              <span className="text-sm font-bold text-white">P</span>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Promptly
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.href);
              
              return (
                <Link key={item.name} to={item.href}>
                  <motion.div
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-100 text-indigo-700 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">Search</span>
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="relative p-2"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {hasNotifications && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  />
                )}
              </Button>
            </div>

            {/* User Stats (Desktop) */}
            <div className="hidden lg:flex items-center space-x-3 px-3 py-1 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">{user.totalScore}</span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium">{user.currentStreak}</span>
              </div>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full p-0 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 transition-all duration-200"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/avatars/alex.svg" alt={user.name} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Crown className="w-2.5 h-2.5 text-white" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        Premium
                      </Badge>
                    </div>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email || "alex@example.com"}
                    </p>
                    <div className="flex items-center space-x-4 pt-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-muted-foreground">Level</span>
                        <Badge variant="outline" className="text-xs">
                          {user.level}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs font-medium">{user.totalScore} XP</span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center space-x-2 cursor-pointer">
                    <BarChart3 className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center space-x-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center space-x-2 cursor-pointer">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                {/* User Stats Mobile */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">{user.totalScore} XP</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Trophy className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium">{user.currentStreak} streak</span>
                    </div>
                  </div>
                  <Badge variant="outline">Level {user.level}</Badge>
                </div>

                {/* Navigation Items */}
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.href);
                  
                  return (
                    <Link key={item.name} to={item.href}>
                      <motion.div
                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-colors ${
                          isActive
                            ? "bg-indigo-100 text-indigo-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="w-5 h-5" />
                        <div>
                          <div>{item.name}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}

                {/* Search Mobile */}
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-3 h-auto"
                >
                  <Search className="w-5 h-5 mr-3" />
                  <span>Search lessons...</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}