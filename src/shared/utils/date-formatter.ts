/**
 * Format a date with relative time and detailed information
 * @param dateString - ISO date string
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDateWithRelativeTime(
    dateString: string,
    options: {
      showRelative?: boolean;
      showTime?: boolean;
      showYear?: boolean;
    } = {}
  ): string {
    const { showRelative = true, showTime = true, showYear = true } = options;
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
    // Relative time formatting
    if (showRelative) {
      if (diffInMinutes < 1) {
        return 'Just now';
      } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
      } else if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
      }
    }
  
    // Detailed date formatting
    const dateOptions: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      ...(showYear && { year: 'numeric' }),
      ...(showTime && { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };
  
    return date.toLocaleDateString('en-US', dateOptions);
  }
  
  /**
   * Get a more detailed date format for loan applications
   * @param dateString - ISO date string
   * @returns Formatted date string with time
   */
  export function formatLoanApplicationDate(dateString: string): string {
    return formatDateWithRelativeTime(dateString, {
      showRelative: true,
      showTime: true,
      showYear: true
    });
  }
  