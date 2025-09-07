// components/ProtectedAdminRoute.tsx - Admin Route Protection
import React from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { RateLimitWarning } from '@/components/RateLimitWarning';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  requiredLevel?: 'basic' | 'full';
  fallback?: React.ReactNode;
  requiredPermissions?: string[];
}

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  children,
  requiredLevel = 'basic',
  fallback,
  requiredPermissions = []
}) => {
  const { 
    isAdmin, 
    loading, 
    error, 
    adminLevel,
    permissions,
    hasPermission,
    isBlocked,
    remainingTime
  } = useAdminAuth(requiredLevel);

  // Rate limited
  if (isBlocked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Blocked</h1>
            <p className="text-gray-600 mb-4">
              Too many failed admin access attempts.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700 font-medium">
                Time remaining: {Math.ceil(remainingTime / 60)} minutes
              </p>
            </div>
            <p className="text-sm text-gray-500">
              This incident has been logged for security purposes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying admin access...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Return to Home
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Try Again
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              Contact system administrator if you believe this is an error.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="text-center">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h1>
            <p className="text-gray-600 mb-6">
              You need administrator privileges to access this page.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <div className="text-yellow-400 text-xl mr-3">⚠️</div>
                <div className="text-left">
                  <p className="text-yellow-700 font-medium text-sm">Security Notice</p>
                  <p className="text-yellow-600 text-xs">
                    Unauthorized access attempts are monitored and logged.
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check required permissions
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => 
      hasPermission(permission as any)
    );

    if (!hasAllPermissions) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🚫</div>
              <h1 className="text-2xl font-bold text-orange-600 mb-4">Insufficient Permissions</h1>
              <p className="text-gray-600 mb-4">
                Your admin level ({adminLevel}) doesn't include the required permissions for this action.
              </p>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <p className="text-orange-700 text-sm font-medium mb-2">Required Permissions:</p>
                <ul className="text-orange-600 text-xs text-left space-y-1">
                  {requiredPermissions.map(permission => (
                    <li key={permission} className="flex items-center">
                      <span className="w-1 h-1 bg-orange-400 rounded-full mr-2"></span>
                      {permission}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button
                onClick={() => window.history.back()}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  // Success - render children with admin context
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Status Bar */}
      <div className="bg-green-100 border-b border-green-200 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Admin Access Active
            </div>
            <div className="text-sm text-green-700">
              Level: <span className="font-medium capitalize">{adminLevel}</span>
            </div>
          </div>
          
          <div className="text-xs text-green-600">
            Session protected & monitored
          </div>
        </div>
      </div>
      
      {/* Admin Content */}
      <div className="relative">
        {children}
      </div>
      
      {/* Security Footer */}
      <div className="fixed bottom-0 right-0 z-50 bg-green-100 border border-green-200 rounded-tl-lg px-3 py-2 shadow-sm">
        <div className="flex items-center text-xs text-green-700">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          Secure Admin Session
        </div>
      </div>
    </div>
  );
};

// Permission Check Component
interface PermissionGateProps {
  children: React.ReactNode;
  requiredPermissions: string[];
  fallback?: React.ReactNode;
  adminLevel?: 'basic' | 'full';
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  requiredPermissions,
  fallback,
  adminLevel
}) => {
  const { hasPermission, adminLevel: currentLevel } = useAdminAuth();

  // Check if user has required permissions
  const hasAllPermissions = requiredPermissions.every(permission => 
    hasPermission(permission as any)
  );

  // Check admin level if specified
  const hasRequiredLevel = !adminLevel || currentLevel === adminLevel || 
    (adminLevel === 'basic' && currentLevel === 'full');

  if (!hasAllPermissions || !hasRequiredLevel) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-yellow-400 text-xl mr-3">⚠️</div>
          <div>
            <p className="text-yellow-700 font-medium text-sm">Access Restricted</p>
            <p className="text-yellow-600 text-xs">
              This feature requires {adminLevel ? `${adminLevel} admin level` : 'additional permissions'}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Admin Action Button with Permission Check
interface AdminActionButtonProps {
  onClick: () => void;
  requiredPermissions: string[];
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const AdminActionButton: React.FC<AdminActionButtonProps> = ({
  onClick,
  requiredPermissions,
  children,
  className = '',
  disabled = false,
  variant = 'primary'
}) => {
  const { hasPermission, logAdminAction } = useAdminAuth();

  const hasAllPermissions = requiredPermissions.every(permission => 
    hasPermission(permission as any)
  );

  const handleClick = async () => {
    if (!hasAllPermissions || disabled) return;

    // Log admin action
    await logAdminAction('button_click', {
      requiredPermissions,
      action: 'admin_button_action'
    });

    onClick();
  };

  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-300',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-gray-300'
  };

  const isDisabled = disabled || !hasAllPermissions;

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${
        isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      }`}
      title={!hasAllPermissions ? 'Insufficient permissions' : ''}
    >
      {children}
    </button>
  );
};