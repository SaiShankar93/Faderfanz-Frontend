import React, { useEffect, useState } from 'react';
import PopularEventCard from '@/components/PopularEventCard';
import axiosInstance from '@/configs/axiosConfig';
import { toast } from 'react-toastify';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/events');
      console.log(data.data,'data')
      setEvents(data?.data || []);
    } catch (err) {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleApprove = async (eventId, approve) => {
    try {
      setLoading(true);
      const {data} = await axiosInstance.put(`/events/${eventId}/approval`, { approved: approve });
      if(data.success){
        fetchEvents();
        toast.success(data.message);
      }
      else{
        toast.error(data.message);
      }

    } catch (err) {
      setError('Failed to update approval status');
    } finally {
      setLoading(false);
    }
  };

  console.log(events,'events')

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Events</h2>
      {loading && <div>Loading events...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && events.length === 0 && <div>No events found.</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event._id || event.id} className="relative">
            <PopularEventCard event={event} />
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
              {event.approved ? (
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                  disabled={loading}
                  onClick={() => handleApprove(event._id || event.id, false)}
                >
                  Reject
                </button>
              ) : (
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-xs"
                  disabled={loading}
                  onClick={() => handleApprove(event._id || event.id, true)}
                >
                  Approve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEvents;
