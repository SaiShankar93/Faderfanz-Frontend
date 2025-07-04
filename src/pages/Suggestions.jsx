import React, { useEffect, useState } from 'react';
import { CuratorCard } from '@/components/CuratorCard';
import axiosInstance from '@/configs/axiosConfig';
import { useNavigate } from 'react-router-dom';

// Local SponsorCard component (copied and simplified from AllSponsers.jsx)
const SponsorCard = ({ sponsor }) => {
  return (
    <div className="bg-[#1C1D24]/50 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-[#1C1D24]/70 transition-colors ">
      <div className="flex flex-col sm:flex-row items-stretch h-auto sm:h-60">
        {/* Sponsor Logo/Image */}
        <div className="w-full sm:w-40 h-48 sm:h-full flex-shrink-0">
          <img
            src={"/Images/sponsor-logo.png"}
            alt={sponsor.businessName}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Content Section */}
        <div className="flex-1 pl-4 sm:pl-6 flex flex-col justify-around">
          <div>
            <h3 className="text-white text-xl sm:text-2xl font-semibold mb-2">{sponsor.businessName}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{sponsor.description}</p>
            <div className="flex justify-between sm:justify-start sm:space-x-12 mb-2">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-[#C5FF32] text-lg sm:text-xl font-bold">{sponsor.eventsSponsoredCount}</span>
                  <img src="/icons/location-icon.svg" alt="Events" className="w-[14px] h-[15px] sm:w-[17px] sm:h-[18px]" />
                </div>
                <span className="text-gray-400 text-[10px] sm:text-xs mt-1">Events Sponsored</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-[#C5FF32] text-lg sm:text-xl font-bold">{sponsor.followersCount}</span>
                  <img src="/icons/Event-icon.svg" alt="Followers" className="w-[14px] h-[15px] sm:w-[17px] sm:h-[18px]" />
                </div>
                <span className="text-gray-400 text-[10px] sm:text-xs mt-1">Followers</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-[#C5FF32] text-lg sm:text-xl font-bold">{sponsor.rating}</span>
                  <img src="/icons/Star.svg" alt="Rating" className="w-[14px] h-[15px] sm:w-[17px] sm:h-[18px]" />
                </div>
                <span className="text-gray-400 text-[10px] sm:text-xs mt-1">Rating</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between min-w-0">
            <div className="text-gray-400 text-sm truncate">
              Contact: {sponsor.contactName}
            </div>
            <div className="flex-shrink-0">
              <a
                href={`/sponsor/${sponsor._id}`}
                className="px-3 py-1.5 sm:px-5 sm:py-2 bg-[#C5FF32] text-black rounded-md text-center text-xs sm:text-sm font-medium hover:bg-[#b3ff00] transition-colors whitespace-nowrap"
              >
                View Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Suggestions = () => {
  const [curators, setCurators] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch curators
    axiosInstance.get('/management/curators')
      .then(res => setCurators(res.data?.slice(0, 10) || []))
      .catch(err => console.error('Error fetching curators:', err));
    // Fetch sponsors
    axiosInstance.get('/management/sponsors')
      .then(res => setSponsors(res.data?.slice(0, 10) || []))
      .catch(() => {
        // fallback to /sponsers if /sponsors fails
        axiosInstance.get('/management/sponsers')
          .then(res => setSponsors(res.data?.slice(0, 10) || []))
          .catch(err => console.error('Error fetching sponsors:', err));
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0E0F13] text-white font-sen p-8">
      {/* Skip Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => navigate('/profile')}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-medium transition-colors"
        >
          Skip
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-8">Suggestions</h1>
      {/* Curators Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-[#C5FF32]">Curators to Follow</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {curators.map(curator => (
            <CuratorCard key={curator._id || curator.id} curator={curator} />
          ))}
        </div>
      </section>
      {/* Sponsors Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-[#C5FF32]">Sponsors to Follow</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sponsors.map((sponsor) => (
            <SponsorCard key={sponsor._id || sponsor.id} sponsor={sponsor} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Suggestions;