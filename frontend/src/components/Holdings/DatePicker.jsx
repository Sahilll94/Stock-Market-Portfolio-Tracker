import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function DatePicker({ value, onChange, error = false }) {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(value || new Date()));
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const [viewMode, setViewMode] = useState('days'); // 'days', 'months', 'years'
  const [positionAbove, setPositionAbove] = useState(false);
  const calendarRef = useRef(null);
  const inputRef = useRef(null);

  // Format date for display
  const formatDisplayDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Get days in month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const daysInPrevMonth = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    
    const days = [];
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isToday: false,
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const today = new Date();
      const isToday = 
        dateToCheck.getDate() === today.getDate() &&
        dateToCheck.getMonth() === today.getMonth() &&
        dateToCheck.getFullYear() === today.getFullYear();
      
      days.push({
        day: i,
        isCurrentMonth: true,
        isToday,
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        isToday: false,
      });
    }
    
    return days;
  };

  const handleDayClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    onChange(newDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const handlePrevMonth = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handlePrevYear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear() - 10, currentDate.getMonth()));
  };

  const handleNextYear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear() + 10, currentDate.getMonth()));
  };

  const handleMonthYearClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setViewMode('months');
  };

  const handleMonthSelect = (monthIndex, e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentDate(new Date(currentDate.getFullYear(), monthIndex));
    setViewMode('days');
  };

  const handleYearSelect = (year, e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentDate(new Date(year, currentDate.getMonth()));
    setViewMode('months');
  };

  const handleYearHeaderClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setViewMode('years');
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      
      // Check if there's enough space below, otherwise position above
      if (inputRef.current) {
        const rect = inputRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const calendarHeight = 500; // max-h-[500px]
        
        if (spaceBelow < calendarHeight + 20) {
          setPositionAbove(true);
        } else {
          setPositionAbove(false);
        }
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const calendarDays = generateCalendarDays();

  return (
    <div className="relative" ref={calendarRef}>
      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        value={formatDisplayDate(selectedDate)}
        onClick={() => setIsOpen(!isOpen)}
        readOnly
        className={`
          w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 cursor-pointer
          ${isDark 
            ? `bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${error ? 'border-red-500' : ''}`
            : `bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${error ? 'border-red-500' : ''}`
          }
        `}
        placeholder="Select a date"
      />

      {/* Calendar Popup */}
      {isOpen && (
        <div className={`
          absolute left-0 mt-2 p-4 rounded-xl shadow-xl z-50 w-80 max-h-[90vh] overflow-y-auto
          ${positionAbove ? 'bottom-full mb-2' : 'top-full'}
          ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}
          transition-all duration-300 origin-top
        `}>
          {/* Days View */}
          {viewMode === 'days' && (
            <>
              {/* Month/Year Header */}
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={handlePrevMonth}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                    isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                  type="button"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  onClick={handleMonthYearClick}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`flex-1 text-center font-semibold transition-all duration-300 px-3 py-1 rounded-lg text-sm ${
                    isDark 
                      ? 'text-white hover:bg-gray-700' 
                      : 'text-gray-900 hover:bg-gray-100'
                  }`}
                  type="button"
                  title="Select month"
                >
                  {currentDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </button>

                <button
                  onClick={handleNextMonth}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                    isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                  type="button"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className={`text-center text-xs font-bold py-2 rounded-lg ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((dayObj, idx) => {
                  const dayNum = dayObj.day;
                  const isCurrentMonth = dayObj.isCurrentMonth;
                  const isToday = dayObj.isToday;
                  
                  const dateForComparison = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
                  const isSelected = selectedDate && 
                    dateForComparison.toDateString() === selectedDate.toDateString();

                  return (
                    <button
                      key={idx}
                      onClick={() => isCurrentMonth && handleDayClick(dayNum)}
                      disabled={!isCurrentMonth}
                      type="button"
                      className={`
                        h-10 rounded-lg font-semibold transition-all duration-300 text-sm
                        ${!isCurrentMonth
                          ? isDark ? 'text-gray-600' : 'text-gray-300'
                          : isSelected
                          ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700 scale-105'
                          : isToday
                          ? isDark 
                            ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500/50 hover:bg-blue-500/30'
                            : 'bg-blue-100 text-blue-600 border-2 border-blue-300 hover:bg-blue-150'
                          : isDark
                          ? 'text-gray-300 hover:bg-gray-700/50'
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                        ${!isCurrentMonth ? 'cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                      `}
                    >
                      {dayNum}
                    </button>
                  );
                })}
              </div>

              {/* Today Button */}
              <button
                onClick={() => {
                  const today = new Date();
                  setSelectedDate(today);
                  onChange(today.toISOString().split('T')[0]);
                  setCurrentDate(today);
                  setIsOpen(false);
                }}
                onMouseDown={(e) => e.preventDefault()}
                type="button"
                className={`w-full mt-3 py-2 rounded-lg font-medium text-xs transition-all duration-300 ${
                  isDark
                    ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                Today
              </button>
            </>
          )}

          {/* Months View */}
          {viewMode === 'months' && (
            <>
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={handlePrevYear}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                    isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                  type="button"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  onClick={handleYearHeaderClick}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`flex-1 text-center font-semibold transition-all duration-300 px-3 py-1 rounded-lg text-sm ${
                    isDark 
                      ? 'text-white hover:bg-gray-700' 
                      : 'text-gray-900 hover:bg-gray-100'
                  }`}
                  type="button"
                  title="Select year"
                >
                  {currentDate.getFullYear()}
                </button>

                <button
                  onClick={handleNextYear}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                    isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                  type="button"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Months Grid */}
              <div className="grid grid-cols-3 gap-1">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => {
                  const isSelected = currentDate.getMonth() === idx;
                  return (
                    <button
                      key={month}
                      onClick={(e) => handleMonthSelect(idx, e)}
                      type="button"
                      className={`py-2 rounded-lg font-semibold transition-all duration-300 text-xs ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                          : isDark
                          ? 'text-gray-300 hover:bg-gray-700/50'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Years View */}
          {viewMode === 'years' && (
            <>
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={handlePrevYear}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                    isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                  type="button"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className={`flex-1 text-center font-semibold transition-all duration-300 px-3 py-1 text-sm ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {Math.floor(currentDate.getFullYear() / 10) * 10} - {Math.floor(currentDate.getFullYear() / 10) * 10 + 9}
                </div>

                <button
                  onClick={handleNextYear}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                    isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                  type="button"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Years Grid */}
              <div className="grid grid-cols-3 gap-1">
                {Array.from({ length: 12 }, (_, i) => {
                  const year = Math.floor(currentDate.getFullYear() / 10) * 10 + i;
                  const isSelected = currentDate.getFullYear() === year;
                  return (
                    <button
                      key={year}
                      onClick={(e) => handleYearSelect(year, e)}
                      type="button"
                      className={`py-2 rounded-lg font-semibold transition-all duration-300 text-xs ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
                          : isDark
                          ? 'text-gray-300 hover:bg-gray-700/50'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
