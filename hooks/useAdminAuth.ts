// hooks/useAdminAuth.ts - Secure Admin Authentication Hook
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import { useAuth } from '@/contexts/AuthContext';
import { 
  verifyUserRoleSecurely, 
  UserRole, 
  logSecurityAttempt,
  getCachedRole,
  setCachedRole 
} from '@/lib/auth-utils';
import { useRateLimit } from '@/hooks/useRateLimit';

interface AdminAuthState {
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  user: User | null;
  adminLevel: 'none' | 'basic' | 'full';
  sessionId: string;
}

interface AdminPermissions {
  canViewListings: boolean;
  canApproveListings: boolean;
  canDeleteListings: boolean;
  canViewOrders: boolean;
  canUpdateOrders: boolean;
  canViewSellers: boolean;
  canManageSellers: boolean;
  canAccessAnalytics: boolean;
  canManageSystem: boolean;
}

export const useAdminAuth = (requiredLevel: 'basic' | 'full' = 'basic') => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [adminState, setAdminState] = useState<AdminAuthState>({
    isAdmin: false,
    loading: true,
    error: null,
    user: null,
    adminLevel: 'none',
    sessionId: ''
  });
  
  const [permissions, setPermissions] = useState<AdminPermissions>({
    canViewListings: false,
    canApproveListings: false,
    canDeleteListings: false,
    canViewOrders: false,
    canUpdateOrders: false,
    canViewSellers: false,
    canManageSellers: false,
    canAccessAnalytics: false,
    canManageSystem: false
  });

  // Rate limiting for admin access attempts
  const rateLimitConfig = {
    maxAttempts: 3,
    windowMs: 15 * 60 * 1000, // 15 minutes
    storageKey: 'admin-access-limit'
  };
  
  const { isBlocked, remainingTime, recordAttempt } = useRateLimit(rateLimitConfig);

  // Generate session ID for audit logging
  const generateSessionId = () => {
    return `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // Calculate permissions based on admin level
  const calculatePermissions = (adminLevel: 'none' | 'basic' | 'full'): AdminPermissions => {
    switch (adminLevel) {
      case 'full':
        return {
          canViewListings: true,
          canApproveListings: true,
          canDeleteListings: true,
          canViewOrders: true,
          canUpdateOrders: true,
          canViewSellers: true,
          canManageSellers: true,
          canAccessAnalytics: true,
          canManageSystem: true
        };
      case 'basic':
        return {
          canViewListings: true,
          canApproveListings: true,
          canDeleteListings: false,
          canViewOrders: true,
          canUpdateOrders: false,
          canViewSellers: true,
          canManageSellers: false,
          canAccessAnalytics: false,
          canManageSystem: false
        };
      default:
        return {
          canViewListings: false,
          canApproveListings: false,
          canDeleteListings: false,
          canViewOrders: false,
          canUpdateOrders: false,
          canViewSellers: false,
          canManageSellers: false,
          canAccessAnalytics: false,
          canManageSystem: false
        };
    }
  };

  // Server-side admin verification
  const verifyAdminAccess = async (user: User): Promise<{ isAdmin: boolean; adminLevel: 'none' | 'basic' | 'full' }> => {
    try {
      // Check cache first (shorter cache for admin)
      const cachedRole = getCachedRole(user.uid);
      if (cachedRole === UserRole.ADMIN) {
        // For cached admin, still verify server-side but with shorter interval
        const lastVerification = localStorage.getItem(`admin-verify-${user.uid}`);
        if (lastVerification) {
          const timeSince = Date.now() - parseInt(lastVerification);
          if (timeSince < 2 * 60 * 1000) { // 2 minutes cache for admin
            return { isAdmin: true, adminLevel: 'full' };
          }
        }
      }

      // Server-side verification through secure API
      const idToken = await user.getIdToken(true); // Force refresh
      
      const response = await fetch('/api/admin/verify-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          requestedLevel: requiredLevel
        })
      });

      if (!response.ok) {
        throw new Error(`Admin verification failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.isAdmin) {
        // Cache admin status with timestamp
        setCachedRole(user.uid, UserRole.ADMIN);
        localStorage.setItem(`admin-verify-${user.uid}`, Date.now().toString());
        
        return { 
          isAdmin: true, 
          adminLevel: result.adminLevel || 'basic' 
        };
      } else {
        return { isAdmin: false, adminLevel: 'none' };
      }
      
    } catch (error) {
      console.error('Admin verification error:', error);
      logSecurityAttempt('role_check', false, user.uid);
      throw error;
    }
  };

  // Main authentication effect
  useEffect(() => {
    const checkAdminAuth = async () => {
      // Rate limit check
      if (isBlocked) {
        setAdminState(prev => ({
          ...prev,
          loading: false,
          error: `Too many failed attempts. Try again in ${Math.ceil(remainingTime / 60)} minutes.`,
          isAdmin: false,
          adminLevel: 'none'
        }));
        return;
      }

      // No user or still loading auth
      if (authLoading) {
        return;
      }

      if (!user) {
        router.push('/login?redirect=/admin');
        return;
      }

      try {
        setAdminState(prev => ({ ...prev, loading: true, error: null }));

        // Verify admin access
        const { isAdmin, adminLevel } = await verifyAdminAccess(user);

        if (!isAdmin) {
          recordAttempt(); // Record failed admin access
          
          setAdminState({
            isAdmin: false,
            loading: false,
            error: 'Admin access required. This incident has been logged.',
            user: null,
            adminLevel: 'none',
            sessionId: ''
          });

          // Log unauthorized access attempt
          logSecurityAttempt('admin_access', false, user.uid);
          
          // Redirect with error
          router.push('/?error=unauthorized');
          return;
        }

        // Check if user has required admin level
        if (requiredLevel === 'full' && adminLevel !== 'full') {
          setAdminState({
            isAdmin: false,
            loading: false,
            error: 'Higher admin privileges required.',
            user: null,
            adminLevel: adminLevel,
            sessionId: ''
          });

          logSecurityAttempt('admin_access', false, user.uid);
          router.push('/admin?error=insufficient_privileges');
          return;
        }

        // Success - set admin state
        const sessionId = generateSessionId();
        
        setAdminState({
          isAdmin: true,
          loading: false,
          error: null,
          user: user,
          adminLevel: adminLevel,
          sessionId: sessionId
        });

        setPermissions(calculatePermissions(adminLevel));

        // Log successful admin access
        logSecurityAttempt('admin_access', true, user.uid);
        
        // Log admin session start
        await fetch('/api/admin/log-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await user.getIdToken()}`
          },
          body: JSON.stringify({
            sessionId,
            action: 'session_start',
            adminLevel,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            ipAddress: 'client-side' // Will be detected server-side
          })
        }).catch(console.error);

      } catch (error) {
        recordAttempt(); // Record failed attempt
        
        setAdminState({
          isAdmin: false,
          loading: false,
          error: 'Failed to verify admin access. Please try again.',
          user: null,
          adminLevel: 'none',
          sessionId: ''
        });

        logSecurityAttempt('admin_access', false, user?.uid);
        console.error('Admin auth error:', error);
      }
    };

    checkAdminAuth();
  }, [user, authLoading, isBlocked, requiredLevel, router, recordAttempt, remainingTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (adminState.sessionId && adminState.user) {
        // Log session end
        fetch('/api/admin/log-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminState.user.getIdToken()}`
          },
          body: JSON.stringify({
            sessionId: adminState.sessionId,
            action: 'session_end',
            timestamp: new Date().toISOString()
          })
        }).catch(console.error);
      }
    };
  }, [adminState.sessionId, adminState.user]);

  // Helper function to check specific permission
  const hasPermission = (permission: keyof AdminPermissions): boolean => {
    return permissions[permission];
  };

  // Helper function to log admin action
  const logAdminAction = async (action: string, details?: any) => {
    if (!adminState.isAdmin || !adminState.user) return;

    try {
      await fetch('/api/admin/log-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await adminState.user.getIdToken()}`
        },
        body: JSON.stringify({
          sessionId: adminState.sessionId,
          action,
          details,
          timestamp: new Date().toISOString(),
          adminLevel: adminState.adminLevel
        })
      });
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  };

  return {
    ...adminState,
    permissions,
    hasPermission,
    logAdminAction,
    isBlocked,
    remainingTime: isBlocked ? remainingTime : 0
  };
};