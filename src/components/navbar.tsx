import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Home,
  BookOpen,
  Trophy,
  BarChart3,
} from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser, useClerk, UserButton } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { cn } from "../lib/utils";
import { useNavbar } from "../hooks/use-navbar";
import { NavbarSkeleton } from "./navbar-skeleton";

// Navigation configuration
const publicNavigation = [
  { name: "Features", href: "/#features", icon: Home },
  { name: "Pricing", href: "/#pricing", icon: BarChart3 },
  { name: "Stories", href: "/#success-stories", icon: Trophy },
];

const protectedNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Learn", href: "/learn", icon: BookOpen },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}

function MobileMenu({ isOpen, onClose, pathname }: MobileMenuProps) {
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
          
          <motion.div
            className="fixed right-0 top-0 h-full w-full max-w-xs bg-white shadow-lg"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="flex h-16 items-center justify-between px-6">
              <span className="text-lg font-semibold">Menu</span>
              <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="px-6 py-4">
              {clerkUser ? (
                <div className="mb-6">
                  {protectedNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100",
                        pathname === item.href && "bg-gray-100 font-medium text-gray-900"
                      )}
                      onClick={onClose}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="mb-6">
                  {publicNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100",
                        pathname === item.href && "bg-gray-100 font-medium text-gray-900"
                      )}
                      onClick={onClose}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}

              {clerkUser ? (
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center space-x-3 px-3">
                    <Avatar>
                      <AvatarImage src={clerkUser.imageUrl} />
                      <AvatarFallback>
                        {clerkUser.firstName?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{clerkUser.firstName} {clerkUser.lastName}</p>
                      <p className="text-sm text-gray-500">{clerkUser.primaryEmailAddress?.emailAddress}</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-1">
                    <Link
                      to="/settings"
                      className="flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={onClose}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        signOut();
                        onClose();
                      }}
                      className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { isScrolled, isVisible, pathname } = useNavbar();
  const { user: clerkUser } = useUser();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  if (!isLoaded) {
    return (
      <>
        <NavbarSkeleton />
        <div className="h-16" />
      </>
    );
  }

  return (
    <>
      <motion.nav
        className={cn(
          "fixed top-0 w-full z-40 transition-all duration-300",
          isScrolled
            ? "bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm"
            : "bg-white/60 backdrop-blur-sm"
        )}
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                  <span className="text-sm font-bold text-white">P</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Promptly
                </span>
              </Link>
            </div>

            <div className="hidden lg:block">
              {clerkUser ? (
                <div className="flex items-center space-x-6">
                  {protectedNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900",
                        pathname === item.href && "text-gray-900"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex items-center space-x-6">
                  {publicNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900",
                        pathname === item.href && "text-gray-900"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {clerkUser ? (
                <div className="hidden lg:block">
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/settings"
                      className={cn(
                        "flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900",
                        pathname === "/settings" && "text-gray-900"
                      )}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </Link>
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "h-8 w-8"
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="hidden lg:block">
                  <div className="flex items-center space-x-4">
                    <Link to="/sign-in">
                      <Button variant="ghost">Sign in</Button>
                    </Link>
                    <Link to="/sign-up">
                      <Button>Get started</Button>
                    </Link>
                  </div>
                </div>
              )}

              <div className="lg:hidden">
                <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(true)} className="h-8 w-8 p-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        pathname={pathname}
      />

      <div className="h-16" />
    </>
  );
}