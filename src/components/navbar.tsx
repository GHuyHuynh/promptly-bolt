import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Code,
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
import { useAuth } from "@/contexts/AuthContext";

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
  const { currentUser, userData, logout, isDevMode } = useAuth();
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  // Use user data or fallback to defaults
  const displayUser = userData || {
    name: currentUser?.displayName || "User",
    email: currentUser?.email || "",
    photoURL: currentUser?.photoURL || undefined,
    level: 1,
    totalScore: 0,
    currentStreak: 0,
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled
              ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200"
              : "bg-white/80 backdrop-blur-sm"
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Left side - Logo and Navigation */}
              <div className="flex items-center space-x-8">
                <Link to="/" className="flex items-center space-x-2">
                  <motion.div
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <span className="text-sm font-bold text-white">P</span>
                  </motion.div>
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Promptly
                  </span>
                  {/* Development Mode Indicator */}
                  {isDevMode && (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                      <Code className="w-3 h-3 mr-1" />
                      DEV MODE
                    </Badge>
                  )}
                </Link>

                {/* Desktop Navigation */}
                {currentUser && (
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
                )}
              </div>

              {/* Right side */}
              <div className="flex items-center space-x-4">
                {!currentUser ? (
                  // Sign in button for non-authenticated users
                  <Link to="/sign-in">
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                      Sign In
                    </Button>
                  </Link>
                ) : (
                  <>
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
                    <div className="hidden lg:flex items-center space-x-4 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {displayUser.totalScore.toLocaleString()} XP
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Crown className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium text-gray-700">
                          Level {displayUser.level}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {displayUser.currentStreak} day streak
                        </span>
                      </div>
                    </div>

                    {/* User Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-indigo-200 transition-all duration-200"
                        >
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={displayUser.photoURL || currentUser?.photoURL || ""}
                              alt={displayUser.name}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-medium">
                              {displayUser.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-64" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium leading-none">
                                {displayUser.name}
                              </p>
                              {isDevMode && (
                                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                                  DEV
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs leading-none text-muted-foreground">
                              {displayUser.email}
                            </p>
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center space-x-1">
                                <Crown className="w-3 h-3 text-purple-500" />
                                <span className="text-xs text-gray-600">
                                  Level {displayUser.level}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Zap className="w-3 h-3 text-yellow-500" />
                                <span className="text-xs text-gray-600">
                                  {displayUser.totalScore.toLocaleString()} XP
                                </span>
                              </div>
                            </div>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard" className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Mobile menu button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="md:hidden"
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                      {isMobileMenuOpen ? (
                        <X className="h-5 w-5" />
                      ) : (
                        <Menu className="h-5 w-5" />
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            <AnimatePresence>
              {isMobileMenuOpen && currentUser && (
                <motion.div
                  className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-2 pt-2 pb-3 space-y-1">
                    {/* User Stats (Mobile) */}
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={displayUser.photoURL || currentUser?.photoURL || ""}
                            alt={displayUser.name}
                          />
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm">
                            {displayUser.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {displayUser.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Level {displayUser.level} • {displayUser.totalScore.toLocaleString()} XP
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = isActivePath(item.href);
                      
                      return (
                        <Link key={item.name} to={item.href}>
                          <motion.div
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                              isActive
                                ? "bg-indigo-100 text-indigo-700"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Icon className="w-5 h-5" />
                            <div>
                              <div>{item.name}</div>
                              <div className="text-xs text-gray-500">
                                {item.description}
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      );
                    })}

                    {/* Mobile Actions */}
                    <div className="pt-3 border-t border-gray-200">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-600 hover:text-gray-900"
                        onClick={handleSignOut}
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign out
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}