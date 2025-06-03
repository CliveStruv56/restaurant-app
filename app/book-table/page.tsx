
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import FloorPlan from '@/components/floor-plan';
import BookingForm from '@/components/booking-form';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

interface Table {
  id: string;
  number: string;
  capacity: number;
  x: number;
  y: number;
  width: number;
  height: number;
  description?: string;
  isAvailable?: boolean;
}

interface Booking {
  id: string;
  table: Table;
  startTime: string;
  endTime: string;
  partySize: number;
  customerName: string;
}

const BookTablePage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'selection' | 'booking' | 'confirmation'>('selection');
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);
  const [isLoadingTables, setIsLoadingTables] = useState(true);
  const [availabilityFilters, setAvailabilityFilters] = useState({
    date: '',
    time: '',
    partySize: 2,
  });
  const [showAvailability, setShowAvailability] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login?redirect=/book-table');
    }
  }, [user, loading, router]);

  // Load tables
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('/api/tables');
        if (response.ok) {
          const tablesData = await response.json();
          setTables(tablesData);
        }
      } catch (error) {
        console.error('Error fetching tables:', error);
      } finally {
        setIsLoadingTables(false);
      }
    };

    fetchTables();
  }, []);

  // Set minimum date to today
  useEffect(() => {
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    if (!availabilityFilters.date) {
      setAvailabilityFilters(prev => ({ ...prev, date: minDate }));
    }
  }, []);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 11; hour <= 22; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        slots.push({ value: time, label: displayTime });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleAvailabilityCheck = async () => {
    if (!availabilityFilters.date || !availabilityFilters.time) {
      alert('Please select both date and time to check availability');
      return;
    }

    try {
      const params = new URLSearchParams({
        date: availabilityFilters.date,
        time: availabilityFilters.time,
        partySize: availabilityFilters.partySize.toString(),
      });

      const response = await fetch(`/api/bookings/availability?${params}`);
      if (response.ok) {
        const availabilityData = await response.json();
        
        // Update tables with availability information
        const updatedTables = tables.map(table => {
          const tableWithAvailability = availabilityData.tables.find((t: any) => t.id === table.id);
          return {
            ...table,
            isAvailable: tableWithAvailability?.isAvailable ?? false,
          };
        });
        
        setTables(updatedTables);
        setShowAvailability(true);
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const handleTableSelect = (table: Table) => {
    setSelectedTable(table);
    setCurrentStep('booking');
  };

  const handleBookingComplete = (booking: Booking) => {
    setCompletedBooking(booking);
    setCurrentStep('confirmation');
  };

  const handleBackToSelection = () => {
    setSelectedTable(null);
    setCurrentStep('selection');
  };

  const handleNewBooking = () => {
    setSelectedTable(null);
    setCompletedBooking(null);
    setCurrentStep('selection');
    setShowAvailability(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Book a Table</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Reserve your perfect dining experience at Savory Bites. Choose your preferred table and time.
          </p>
        </motion.div>

        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${currentStep === 'selection' ? 'text-orange-500' : currentStep === 'booking' || currentStep === 'confirmation' ? 'text-green-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'selection' ? 'bg-orange-500 text-white' : currentStep === 'booking' || currentStep === 'confirmation' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Select Table</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${currentStep === 'booking' ? 'text-orange-500' : currentStep === 'confirmation' ? 'text-green-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'booking' ? 'bg-orange-500 text-white' : currentStep === 'confirmation' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Book Details</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${currentStep === 'confirmation' ? 'text-green-500' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'confirmation' ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                <CheckCircle size={16} />
              </div>
              <span className="ml-2 font-medium">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Content */}
        {currentStep === 'selection' && (
          <div className="space-y-8">
            {/* Availability Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="text-orange-500" size={24} />
                    Check Table Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <Input
                        type="date"
                        value={availabilityFilters.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setAvailabilityFilters(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <select
                        value={availabilityFilters.time}
                        onChange={(e) => setAvailabilityFilters(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((slot) => (
                          <option key={slot.value} value={slot.value}>
                            {slot.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Party Size</label>
                      <select
                        value={availabilityFilters.partySize}
                        onChange={(e) => setAvailabilityFilters(prev => ({ ...prev, partySize: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        {Array.from({ length: 8 }, (_, i) => i + 1).map((size) => (
                          <option key={size} value={size}>
                            {size} {size === 1 ? 'person' : 'people'}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button
                      onClick={handleAvailabilityCheck}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Check Availability
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Floor Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="max-w-6xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="text-orange-500" size={24} />
                    Restaurant Floor Plan
                  </CardTitle>
                  <p className="text-gray-600">
                    Click on a table to select it for your reservation
                    {showAvailability && ` • Showing availability for ${availabilityFilters.date} at ${timeSlots.find(slot => slot.value === availabilityFilters.time)?.label}`}
                  </p>
                </CardHeader>
                <CardContent>
                  {isLoadingTables ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                    </div>
                  ) : (
                    <FloorPlan
                      tables={tables}
                      selectedTableId={selectedTable?.id}
                      onTableSelect={handleTableSelect}
                      partySize={availabilityFilters.partySize}
                      showAvailability={showAvailability}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {currentStep === 'booking' && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={handleBackToSelection}
                className="flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Table Selection
              </Button>
            </div>
            <BookingForm
              selectedTable={selectedTable}
              onBookingComplete={handleBookingComplete}
              onCancel={handleBackToSelection}
            />
          </div>
        )}

        {currentStep === 'confirmation' && completedBooking && (
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="mb-6">
                  <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
                  <p className="text-gray-600">
                    Your table reservation has been successfully confirmed.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                  <h3 className="font-bold text-lg mb-4">Booking Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Table:</span>
                      <span className="font-medium">{completedBooking.table.number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date(completedBooking.startTime).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">
                        {new Date(completedBooking.startTime).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })} - {new Date(completedBooking.endTime).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Party Size:</span>
                      <span className="font-medium">{completedBooking.partySize} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{completedBooking.customerName}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={() => router.push('/my-bookings')}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    View My Bookings
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleNewBooking}
                    className="w-full"
                  >
                    Make Another Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookTablePage;
