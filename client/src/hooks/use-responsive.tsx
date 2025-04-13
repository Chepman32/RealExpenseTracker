import { useState, useEffect } from 'react';

// Breakpoint values (in pixels)
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
};

type Breakpoint = keyof typeof breakpoints;

/**
 * Hook to check if the current viewport is at least a certain breakpoint
 * @param breakpoint - The breakpoint to check against
 * @returns boolean indicating if the viewport is at least the specified breakpoint
 */
export function useBreakpoint(breakpoint: Breakpoint): boolean {
  const [isAtLeastBreakpoint, setIsAtLeastBreakpoint] = useState<boolean>(false);

  useEffect(() => {
    const checkBreakpoint = () => {
      setIsAtLeastBreakpoint(window.innerWidth >= breakpoints[breakpoint]);
    };

    // Check on mount
    checkBreakpoint();

    // Add event listener for resize
    window.addEventListener('resize', checkBreakpoint);

    // Clean up
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, [breakpoint]);

  return isAtLeastBreakpoint;
}

/**
 * Hook to get the current active breakpoint
 * @returns The current active breakpoint
 */
export function useActiveBreakpoint(): Breakpoint {
  const [activeBreakpoint, setActiveBreakpoint] = useState<Breakpoint>('xs');

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width >= breakpoints.xxl) {
        setActiveBreakpoint('xxl');
      } else if (width >= breakpoints.xl) {
        setActiveBreakpoint('xl');
      } else if (width >= breakpoints.lg) {
        setActiveBreakpoint('lg');
      } else if (width >= breakpoints.md) {
        setActiveBreakpoint('md');
      } else if (width >= breakpoints.sm) {
        setActiveBreakpoint('sm');
      } else {
        setActiveBreakpoint('xs');
      }
    };

    // Check on mount
    checkBreakpoint();

    // Add event listener for resize
    window.addEventListener('resize', checkBreakpoint);

    // Clean up
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);

  return activeBreakpoint;
}

/**
 * Hook to check if the device is in portrait orientation
 * @returns boolean indicating if the device is in portrait orientation
 */
export function useIsPortrait(): boolean {
  const [isPortrait, setIsPortrait] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : false
  );

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    // Check on mount
    checkOrientation();

    // Add event listener for resize
    window.addEventListener('resize', checkOrientation);

    // Clean up
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  return isPortrait;
}

/**
 * Hook to check if the device is mobile based on user agent
 * @returns boolean indicating if the device is likely a mobile device
 */
export function useIsMobileDevice(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      
      // Regular expression for mobile devices
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      
      setIsMobile(mobileRegex.test(userAgent));
    };

    // Check on mount
    checkMobile();
  }, []);

  return isMobile;
}

/**
 * Hook to get responsive values based on the current breakpoint
 * @param values - Object with breakpoint keys and corresponding values
 * @param defaultValue - Default value to use if no matching breakpoint is found
 * @returns The value corresponding to the current breakpoint
 */
export function useResponsiveValue<T>(
  values: Partial<Record<Breakpoint, T>>,
  defaultValue: T
): T {
  const activeBreakpoint = useActiveBreakpoint();
  
  // Find the appropriate value based on current breakpoint
  // We check from the current breakpoint down to xs
  const breakpointOrder: Breakpoint[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];
  const currentBreakpointIndex = breakpointOrder.indexOf(activeBreakpoint);
  
  for (let i = currentBreakpointIndex; i < breakpointOrder.length; i++) {
    const breakpoint = breakpointOrder[i];
    if (values[breakpoint] !== undefined) {
      return values[breakpoint] as T;
    }
  }
  
  return defaultValue;
}