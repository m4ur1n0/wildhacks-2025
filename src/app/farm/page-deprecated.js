"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';
import ReactWeeklyDayPicker from 'react-weekly-day-picker';
import { useState, useEffect, useMemo } from 'react';

export default function LocationProfile() {
  const { id } = useParams();

  // Get today's date
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [dayInfo, setDayInfo] = useState({});
  // Keep track of the start day for the week view separately from selected date
  const [weekStartDay, setWeekStartDay] = useState(today);

  // Format function for date keys
  const formatDateKey = (date) => date.toISOString().split('T')[0];

  // Helper function to create a date with offset from today
  const dateWithOffset = (days) => {
    const date = new Date(today);
    date.setDate(today.getDate() + days);
    return date;
  };

  // Dummy data for the location pins with specific one-off dates
  const profiles = {
    '1': {
      title: 'Local Market',
      description:
        'A great local market to explore fresh produce. Enjoy a wide variety of seasonal fruits, vegetables, and artisan goods.',
      schedule: {
        // Specific dates across the month with unique inventory details
        [formatDateKey(today)]: 'Open 9am-5pm. Special delivery of fresh strawberries, heirloom tomatoes, and local honey. Limited supply of artisanal sourdough bread.',
        [formatDateKey(dateWithOffset(3))]: 'Open 10am-4pm. Just received organic blueberries, fresh farm eggs, and craft cheeses from Mountain Dairy.',
        [formatDateKey(dateWithOffset(7))]: 'Open 9am-6pm. Seasonal mushroom varieties from Forest Foragers available today. Wine tasting event with local vineyards from 2pm-5pm.',
        [formatDateKey(dateWithOffset(12))]: 'Open 8am-4pm. Citrus festival! Special shipment of blood oranges, Meyer lemons, and grapefruits. Citrus-based cooking demo at noon.',
        [formatDateKey(dateWithOffset(15))]: 'Open 9am-7pm. Fresh herbs day: basil, rosemary, thyme, and mint plants available. Herb garden workshop registration open.',
        [formatDateKey(dateWithOffset(21))]: 'Open 10am-5pm. Heirloom vegetable varieties featuring purple carrots, rainbow chard, and specialty potatoes.',
        [formatDateKey(dateWithOffset(24))]: 'Open 9am-6pm. Bakers\' day: Multiple local bakeries featuring special bread varieties, pastries, and desserts.',
        [formatDateKey(dateWithOffset(28))]: 'Open 8am-7pm. Berry bonanza with strawberries, raspberries, blackberries from River Valley Farm. Special pricing on bulk purchases.'
      }
    },
    '2': {
      title: 'Organic Farm',
      description:
        'This organic farm offers fresh vegetables and seasonal fruits. Visit for farm tours, CSA programs, and locally grown produce.',
      schedule: {
        // Specific dates across the month with unique inventory and activity details
        [formatDateKey(dateWithOffset(1))]: 'Open 10am-4pm. U-pick strawberry field open. Honey extraction demonstration at 2pm. Farm-fresh eggs and spring greens available.',
        [formatDateKey(dateWithOffset(5))]: 'Open 9am-3pm. Herb garden tour and workshop. Limited supply of herb seedlings for sale. Herbal tea tasting all day.',
        [formatDateKey(dateWithOffset(8))]: 'Open 10am-6pm. Baby goat petting day! Goat milk and cheese products available. Spring vegetable harvest: asparagus, peas, and radishes.',
        [formatDateKey(dateWithOffset(13))]: 'Open 10am-5pm. Bee keeper presentation at 1pm. Wildflower honey, beeswax products, and pollinator-friendly plant sale.',
        [formatDateKey(dateWithOffset(18))]: 'Open 8am-7pm. Farm breakfast served 8am-11am featuring our own produce. CSA pickup day. Extra vegetable bundles available for non-members.',
        [formatDateKey(dateWithOffset(22))]: 'Open 10am-4pm. Composting and soil health workshop at 11am. First summer squash of the season available today.',
        [formatDateKey(dateWithOffset(26))]: 'Open 10am-6pm. Farm-to-table cooking demonstration with Chef Martinez at 3pm. Early corn harvest celebration.',
        [formatDateKey(dateWithOffset(30))]: 'Open 9am-5pm. Children\'s gardening day. Take-home garden kits available. Stone fruit sampling with first peaches and nectarines of the season.'
      }
    },
  };

  // Memoize the profile so its reference doesn't change unless id changes
  const profile = useMemo(() => {
    return profiles[id] || {
      title: 'Unknown Location',
      description: 'No details available for this location.',
      schedule: {}
    };
  }, [id]);

  const schedule = useMemo(() => profile.schedule, [profile]);

  // Get the selected date key in ISO format for consistency
  const selectedDateKey = useMemo(() => {
    return selectedDate ? selectedDate.toISOString().split('T')[0] : null;
  }, [selectedDate]);

  // useEffect now fires because selectedDate really changes
  useEffect(() => {
    if (!selectedDate) return;

    const key = formatDateKey(selectedDate);           // "YYYY-MM-DD"
    const scheduleInfo =
      profile.schedule[key] ||
      'No special events or inventory updates for this date';

    setDayInfo({
      dayInfo: scheduleInfo,
      date: selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    });
  }, [selectedDate, profile.schedule]);

  // Handle date changes from the day picker - only update selected date, not weekStartDay
  const handleDayChange = (selectedDay) => {
    console.log('Day changed to:', selectedDay);
    var date = new Date(selectedDay);
    setSelectedDate(date);
  };
  
  // Custom handler for arrow clicks to skip weeks
  const handleArrowClick = (direction) => {
    const newWeekStart = new Date(weekStartDay);
    if (direction === 'next') {
      newWeekStart.setDate(newWeekStart.getDate() + 7); // Skip forward 7 days
    } else {
      newWeekStart.setDate(newWeekStart.getDate() - 7); // Skip backward 7 days
    }
    setWeekStartDay(newWeekStart);
  };

  // Calculate min and max dates for the day picker
  const minDate = today;
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 60); // Show next 60 days

  // Custom renderer for arrows to add week-skipping functionality
  const customArrowRenderer = (direction, onClick) => {
    return (
      <div 
        className={`rwdp__arrow-${direction}`}
        onClick={() => handleArrowClick(direction)}
        style={{ cursor: 'pointer' }}
      >
        {direction === 'left' ? '←' : '→'}
      </div>
    );
  };

  return (
    <div
      style={{
        margin: '0 auto',
        maxWidth: '600px',
        padding: '2rem',
        fontFamily: '"Geist Sans", sans-serif'
      }}
    >
      <h1>{profile.title}</h1>
      <p>{profile.description}</p>

      {/* Calendar section */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <ReactWeeklyDayPicker
            daysCount={7}
            startDay={weekStartDay}                // Use separate weekStartDay state
            selectedDays={[formatDateKey(selectedDate)]}
            selectDay={handleDayChange}
            format="YYYY-MM-DD"
            multipleDaySelect={false}
            minDate={minDate.toISOString().split('T')[0]}
            maxDate={maxDate.toISOString().split('T')[0]}
            disableNavigationOnDateClick={true}    // Prevent auto rotation on date selection
            renderArrow={customArrowRenderer}      // Use custom arrow renderer for week skipping
            classNames={{
              container: 'custom-day-picker-container',
              dayContainer: 'custom-day-container',
              monthText: 'custom-month-text',
              yearText: 'custom-year-text',
              prevNextButton: 'custom-prev-next-button',
              selectedDayItem: 'custom-selected-day',
              disabledDayItem: 'custom-disabled-day',
              currentDayItem: 'custom-current-day',
              weekDaysContainer: 'custom-week-days-container'
            }}
          />
        </div>

        {/* Separate day info section below calendar */}
        {selectedDate && dayInfo.dayInfo && (
          <div
            style={{
              backgroundColor: '#f8f9fa',
              padding: '1rem',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              marginTop: '1rem'
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem 0', textAlign: 'center' }}>{dayInfo.date}</h3>
            <p style={{ margin: 0 }}>{dayInfo.dayInfo}</p>

            {/* Visual indicator if this is a special event day */}
            {profile.schedule[selectedDateKey] && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1rem'
              }}>
                <span style={{
                  backgroundColor: '#4a90e2',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '16px',
                  fontSize: '0.85rem'
                }}>
                  Special Event Day
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <Link href="/map" style={{ color: 'blue', textDecoration: 'underline' }}>
        Back to Map
      </Link>

      <style jsx>{`
        h1, p {
          margin: 0 0 1rem 0;
        }
        
        /* Custom styles for day picker */
        :global(.custom-day-picker-container) {
          width: 100%;
          display: flex;
          font-family: 'Geist Sans', sans-serif;
          position: relative;
          align: center;
        }
        
        :global(.custom-day-container) {
          padding: 6px 0; /* Reduced padding to make circles smaller */
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 6px;
          cursor: pointer;
        }
        
        :global(.custom-month-text) {
          font-size: 0.75rem;
          color: #666;
        }
        
        :global(.custom-year-text) {
          font-size: 0.75rem;
          color: #666;
        }
        
        :global(.custom-prev-next-button) {
          background-color: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 6px 12px;
          cursor: pointer;
          z-index: 3;
          position: relative;
        }
        
        :global(.custom-selected-day) {
          background-color: #4a90e2 !important;
          color: white !important;
        }
        
        :global(.custom-disabled-day) {
          opacity: 0.5;
          cursor: not-allowed !important;
        }
        
        :global(.custom-current-day) {
          border: 2px solid #4a90e2;
        }
        
        :global(.custom-week-days-container) {
          display: flex;
          width: 100%;
          justify-content: space-between;
          position: relative;
          z-index: 1;
        }
        
        :global(.rwdp) {
          position: relative;
        }
        
        :global(.rwdp__head) {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        :global(.rwdp__title) {
          position: relative;
          z-index: 1;
          text-align: center;
          width: 100%;
        }
        
        /* Position arrows outside and away from the date circles */
        :global(.rwdp__arrow-left),
        :global(.rwdp__arrow-right) {
          position: absolute;
          z-index: 3;                /* on top of everything */
          background: #fff;
          border-radius: 50%;
          padding: 4px;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          border: 1px solid #ddd;
          top: 50%;
          transform: translateY(-50%);
        }
        
        :global(.rwdp__arrow-left) {
          left: -35px; /* Position further left, outside the calendar */
        }
        
        :global(.rwdp__arrow-right) {
          right: -35px; /* Position further right, outside the calendar */
        }

        /* Make the day items smaller by reducing their size */
        :global(.rwdp__day) {
          width: 36px; /* Smaller width */
          height: 36px; /* Smaller height */
          font-size: 0.9rem; /* Slightly smaller font */
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Add some horizontal spacing to make better fit */
        :global(.rwdp__days) {
          display: flex;
          justify-content: space-around;
          width: 100%;
        }
        
        /* lift the whole header so the arrows don't sit on the days */
        :global(.rwdp__head) {
          margin-bottom: 6px;        /* extra space below the arrows */
        }
      `}</style>
    </div>
  );
}