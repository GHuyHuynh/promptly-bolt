import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { useAuthContext } from '../../contexts/AuthContext';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

interface AuthButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  variant = 'primary',
  size = 'md',
  showIcon = true,
  className
}) => {
  const { isAuthenticated, signInWithGoogle, signOut, loading } = useAuthContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAuth = async () => {
    setIsProcessing(true);
    try {
      if (isAuthenticated) {
        await signOut();
      } else {
        await signInWithGoogle();
      }
    } catch (error) {
      // Error is already handled in the hook
    } finally {
      setIsProcessing(false);
    }
  };

  const isLoading = loading || isProcessing;

  return (
    <Button
      onClick={handleAuth}
      variant={variant}
      size={size}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          {isAuthenticated ? 'Signing out...' : 'Signing in...'}
        </>
      ) : (
        <>
          {showIcon && (
            isAuthenticated ? (
              <LogOut className="w-4 h-4 mr-2" />
            ) : (
              <LogIn className="w-4 h-4 mr-2" />
            )
          )}
          {isAuthenticated ? 'Sign Out' : 'Sign In with Google'}
        </>
      )}
    </Button>
  );
};