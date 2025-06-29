import React, { useEffect, useState } from "react";
import {
  Upload,
  Plus,
  Trash2,
  MapPin,
  Calendar,
  Clock,
  Ticket,
} from "lucide-react";
import FileUpload from "@/assets/svgs/FileUpload";
import axiosInstance from "@/configs/axiosConfig";
import { toast } from 'react-toastify';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateEvent() {
  const navigate = useNavigate();
  const [eventType, setEventType] = useState("single");
  const [currentStep, setcurrentStep] = useState(1); // Track which step the user is on
  const [formData, setFormData] = useState({
    eventTitle: "",
    eventCategory: "",
    eventType: "",
    date: "",
    startTime: "",
    endTime: "",
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      landmark: ""
    },
    eventDescription: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [eventTypeTicketing, setEventTypeTicketing] = useState("ticketed"); // Default: Ticketed Event
  const [tickets, setTickets] = useState([
    {
      name: "Early Bird",
      type: "Early Bird",
      price: 799,
      available: 100,
      description: "Limited early bird tickets",
      benefits: ["Entry to main event", "Welcome drink"]
    }
  ]);

  const [sponsors, setSponsors] = useState([]);
  const [sponsorIds, setSponsorIds] = useState([]);
  const [curators, setCurators] = useState([]);
  const [curatorIds, setCuratorIds] = useState([]);

  // Venue Owners
  const [venues, setVenues] = useState([]);
  const [selectedVenueId, setSelectedVenueId] = useState("");
  const [venueSearch, setVenueSearch] = useState("");
  const [sponsorSearch, setSponsorSearch] = useState("");
  const [curatorSearch, setCuratorSearch] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // data by spreading the current state and adding the new data.
  const handleNextStep = () => {
    // Save the data and move to the next step
    if (currentStep < 4) {
      setcurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
      console.log(currentStep);
    }
  };
  const handlePrevStep = () => {
    // Save the data and move to the next step
    if (currentStep > 1) {
      setcurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
      console.log(currentStep);
    }
  };

  const handleEventTypeChange = (type) => {
    setEventTypeTicketing(type);
    if (type === "free") {
      setTickets([]); // Clear tickets if it's a free event
    }
  };

  // Add a new ticket field
  const addTicket = () => {
    setTickets([...tickets, {
      name: "",
      type: "",
      price: "",
      available: "",
      description: "",
      benefits: []
    }]);
  };

  // Remove a ticket
  const removeTicket = (index) => {
    if (tickets.length > 1) {
      setTickets(tickets.filter((_, i) => i !== index));
    }
  };

  // Handle ticket input changes
  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...tickets];
    updatedTickets[index][field] = value;
    setTickets(updatedTickets);
  };

  // Handle benefits changes
  const handleBenefitsChange = (index, value) => {
    const updatedTickets = [...tickets];
    updatedTickets[index].benefits = value.split(',').map(benefit => benefit.trim());
    setTickets(updatedTickets);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Check if a file was selected
    if (file) {
      // Check file type (only allow images)
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Check file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error('File size should be less than 5MB');
        return;
      }

      // If validation passes, update the state
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  // Fetch sponsors and curators
  useEffect(() => {
    const fetchSponsors = async () => {
      const { data } = await axiosInstance.get("management/sponsors");
      setSponsors(data);
    };
    const fetchCurators = async () => {
      const { data } = await axiosInstance.get("/management/curators");
      setCurators(data);
    };
    const fetchVenues = async () => {
      try {
        const { data } = await axiosInstance.get("/venues");
        setVenues(data);
      } catch (err) {
        setVenues([]);
      }
    };
    fetchSponsors();
    fetchCurators();
    fetchVenues();
  }, []);

  // Venue selection
  const handleSelectVenue = (id) => {
    if (id) setSelectedVenueId(id);
    setVenueSearch("");
  };
  const handleRemoveVenue = () => {
    setSelectedVenueId("");
  };

  // Filter functions for search
  const filteredVenues = venues.filter(venue => 
    venue.name.toLowerCase().includes(venueSearch.toLowerCase())
  );
  const filteredSponsors = sponsors.filter(sponsor => 
    sponsor.email.toLowerCase().includes(sponsorSearch.toLowerCase())
  );
  const filteredCurators = curators.filter(curator => 
    curator.email.toLowerCase().includes(curatorSearch.toLowerCase())
  );

  // Add sponsor
  const handleAddSponsor = (e) => {
    const id = e.target.value;
    if (id && !sponsorIds.includes(id)) {
      setSponsorIds([...sponsorIds, id]);
      setSponsorSearch("");
    }
  };
  // Remove sponsor
  const handleRemoveSponsor = (id) => {
    setSponsorIds(sponsorIds.filter((sid) => sid !== id));
  };
  // Add curator
  const handleAddCurator = (e) => {
    const id = e.target.value;
    if (id && !curatorIds.includes(id)) {
      setCuratorIds([...curatorIds, id]);
      setCuratorSearch("");
    }
  };
  // Remove curator
  const handleRemoveCurator = (id) => {
    setCuratorIds(curatorIds.filter((cid) => cid !== id));
  };

  const handleSubmit = async () => {
    const fData = new FormData();
    fData.append("title", formData.eventTitle);
    fData.append("description", formData.eventDescription);
    fData.append("category", formData.eventCategory);
    fData.append("eventType", eventTypeTicketing);
    fData.append("startDate", formData.date);
    fData.append("endDate", formData.date);
    fData.append("startTime", formData.startTime);
    fData.append("endTime", formData.endTime);
    fData.append("location", JSON.stringify(formData.location));
    fData.append("tickets", JSON.stringify(tickets));
    fData.append("sponsors", JSON.stringify(sponsorIds));
    fData.append("curators", JSON.stringify(curatorIds));
    fData.append("eventImages", selectedFile);
    if (selectedVenueId) {
      fData.append("venue", selectedVenueId);
    }

    for (let pair of fData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }


    // return;
    const token = localStorage.getItem("token");

    try {
      const { data } = await axiosInstance.post(
        `/events`,
        fData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.event) {
        toast.success("Event created successfully");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Create Event failed");
    }
  };

  return (
    <div className="bg-[#0E0F13] min-h-screen flex flex-col items-center md:p-16 p-2 text-white font-sen">
      <div className="bg-2 z-0 pointer-events-none"></div>
      <div className="w-full h-min-screen flex flex-col items-center bg-[rgba(255,255,255,0.05)] rounded-lg">
        <h1 className="text-3xl font-semibold mb-8 pt-4 justify-between font-sen">
          Create a New Event
        </h1>

        <div className="w-full max-w-3xl flex items-center justify-between mb-8 p-3">
          {["Details", "Sponsors/Curators", "Ticketing", "Review"].map(
            (step, index) => (
              <React.Fragment key={step}>
                {/* Step with Circle and Label */}
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    {/* Step Circle */}
                    <div
                      className={`w-6 h-6 rounded-full border-4 ${currentStep >= index + 1
                        ? "bg-[#020C12] border-[#2FE2AF]"
                        : "bg-[#F6F6F6] border-[#6E757E]"
                        }`}
                    ></div>

                    {/* Progress Line - Only Between Steps */}
                    {index < 3 && (
                      <div className="w-16 h-1 bg-[#96A1AE] mx-2">
                        <div
                          className={`h-1 ${currentStep > index + 1
                            ? "bg-[#2FE2AF]"
                            : "bg-[#6E757E]"
                            } md:w-[300%] w-[180%]`}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Step Label Below */}
                  <p className="md:text-lg mt-2 font-sen">{step}</p>
                </div>
              </React.Fragment>
            )
          )}
        </div>

        {/* Main Form Container */}
        <div className="w-full max-w-3xl space-y-8">
          {/* Image Upload Section */}

          {/* Details Step */}
          {currentStep === 1 && (
            <>
              <div className="border-2 border-dashed border-[#96A1AE] rounded-lg h-60 flex flex-col items-center justify-center cursor-pointer hover:bg-[#20222A] transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
                  accept="image/*"
                  multiple={false}
                />

                <label
                  htmlFor="fileInput"
                  className="cursor-pointer text-center"
                >
                  <div>
                    <FileUpload />
                  </div>
                  {selectedFile ? (
                    <div className="mt-2">
                      <p className="text-white">{selectedFile.name}</p>
                      <p className="text-[#96A1AE] text-sm">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-[#96A1AE] text-lg font-sen">
                        Drag and drop your image here to upload
                      </p>
                      <p className="text-[#2FE2AF] mt-2 underline font-sen">
                        or browse for image
                      </p>
                    </>
                  )}
                </label>
              </div>

              <div className="bg-[#1A1C23] p-8 rounded-xl border border-[#2D2F36] space-y-6 max-w-3xl mx-auto">
                {/* Event Details */}
                <h2 className="text-white text-2xl font-semibold">
                  Event Details
                </h2>

                {/* Event Title & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-white mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      name="eventTitle"
                      value={formData.eventTitle}
                      onChange={handleChange}
                      placeholder="Enter the name of your event"
                      className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white mb-2">
                      Event Category *
                    </label>
                    <select
                      name="eventCategory"
                      value={formData.eventCategory}
                      onChange={handleChange}
                      className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                    >
                      <option value="" disabled>
                        Please select one
                      </option>
                      <option value="music">Music</option>
                      <option value="art">Art</option>
                      <option value="technology">Technology</option>
                    </select>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="bg-[#23252B] p-4 rounded-lg border border-[#2D2F36] mt-4">
                  <h3 className="text-white text-lg font-semibold mb-3">
                    Date & Time *
                  </h3>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-white text-sm">
                      <input
                        type="radio"
                        name="eventType"
                        value="single"
                        checked={formData.eventType === "single"}
                        onChange={handleChange}
                        className="accent-[#2FE2AF]"
                      />
                      Single Event
                    </label>
                    <label className="flex items-center gap-2 text-white text-sm">
                      <input
                        type="radio"
                        name="eventType"
                        value="recurring"
                        checked={formData.eventType === "recurring"}
                        onChange={handleChange}
                        className="accent-[#2FE2AF]"
                      />
                      Recurring Event
                    </label>
                  </div>
                </div>

                {/* Session(s) */}
                <div className="mt-4">
                  <h3 className="text-white text-lg font-semibold mb-3">
                    Session(s)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                    />
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                    />
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="mt-4">
                  <h3 className="text-white text-lg font-semibold mb-3">
                    Location *
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="location.address"
                      value={formData.location.address}
                      onChange={handleChange}
                      placeholder="Address"
                      className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="location.city"
                        value={formData.location.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                      />
                      <input
                        type="text"
                        name="location.state"
                        value={formData.location.state}
                        onChange={handleChange}
                        placeholder="State"
                        className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="location.country"
                        value={formData.location.country}
                        onChange={handleChange}
                        placeholder="Country"
                        className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                      />
                      <input
                        type="text"
                        name="location.postalCode"
                        value={formData.location.postalCode}
                        onChange={handleChange}
                        placeholder="Postal Code"
                        className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                      />
                    </div>
                    <input
                      type="text"
                      name="location.landmark"
                      value={formData.location.landmark}
                      onChange={handleChange}
                      placeholder="Landmark"
                      className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="mt-4">
                  <h3 className="text-white text-lg font-semibold mb-3">
                    Additional Information
                  </h3>
                  <textarea
                    name="eventDescription"
                    value={formData.eventDescription}
                    onChange={handleChange}
                    placeholder="Describe what's special about your event & other important details."
                    className="w-full bg-[#1F1F1F] rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF] h-32"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleNextStep}
                    className="bg-[#2FE2AF] text-[#0F172A] px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-[#24C89D] transition"
                  >
                    {currentStep === 4 ? "Submit" : "Save & Continue"}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Sponsers and Curators Step */}
          {currentStep === 2 && (
            <div className="py-6">
              <div className="p-6 bg-[#121212] rounded-lg">
                {/* Sponsors Section */}
                <div className="mb-6">
                  <h3 className="text-white text-lg font-semibold mb-3">Sponsors</h3>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-white">
                      Choose sponsor(s)<span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {sponsorIds.map((id) => {
                      const sponsor = sponsors.find((s) => s._id === id);
                      return (
                        <span key={id} className="bg-[#2FE2AF] text-black px-3 py-1 rounded-full flex items-center mr-2 mb-2">
                          {sponsor?.email || id}
                          <button type="button" className="ml-2 text-black" onClick={() => handleRemoveSponsor(id)}>&times;</button>
                        </span>
                      );
                    })}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search sponsors..."
                      value={sponsorSearch}
                      onChange={(e) => setSponsorSearch(e.target.value)}
                      className="w-full bg-[#1F1F1F] text-white rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                    />
                    {sponsorSearch && (
                      <div className="absolute z-10 w-full mt-1 bg-[#1F1F1F] border border-[#2D2F36] rounded-lg max-h-48 overflow-y-auto">
                        {filteredSponsors.filter(s => !sponsorIds.includes(s._id)).length > 0 ? (
                          filteredSponsors.filter(s => !sponsorIds.includes(s._id)).map((sponsor) => (
                            <div
                              key={sponsor._id}
                              onClick={() => handleAddSponsor({ target: { value: sponsor._id } })}
                              className="p-3 hover:bg-[#2D2F36] cursor-pointer text-white border-b border-[#2D2F36] last:border-b-0"
                            >
                              {sponsor.email}
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-[#96A1AE] text-center">
                            No sponsors found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* Venues Section */}
                <div className="mb-6">
                  <h3 className="text-white text-lg font-semibold mb-3">Venues</h3>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-white">
                      Choose a venue<span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {selectedVenueId && (
                      <span className="bg-[#2FE2AF] text-black px-3 py-1 rounded-full flex items-center mr-2 mb-2">
                        {venues.find((v) => v._id === selectedVenueId)?.name || selectedVenueId}
                        <button type="button" className="ml-2 text-black" onClick={handleRemoveVenue}>&times;</button>
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search venues..."
                      value={venueSearch}
                      onChange={(e) => setVenueSearch(e.target.value)}
                      className="w-full bg-[#1F1F1F] text-white rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                    />
                    {venueSearch && (
                      <div className="absolute z-10 w-full mt-1 bg-[#1F1F1F] border border-[#2D2F36] rounded-lg max-h-48 overflow-y-auto">
                        {filteredVenues.length > 0 ? (
                          filteredVenues.map((venue) => (
                            <div
                              key={venue._id}
                              onClick={() => handleSelectVenue(venue._id)}
                              className="p-3 hover:bg-[#2D2F36] cursor-pointer text-white border-b border-[#2D2F36] last:border-b-0"
                            >
                              {venue.name}
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-[#96A1AE] text-center">
                            No venues found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* Curators Section */}
                <div className="mb-6">
                  <h3 className="text-white text-lg font-semibold mb-3">Curators</h3>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-white">
                      Choose curator(s)<span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="flex gap-2 mb-2 flex-wrap">
                    {curatorIds.map((id) => {
                      const curator = curators.find((c) => c._id === id);
                      return (
                        <span key={id} className="bg-[#2FE2AF] text-black px-3 py-1 rounded-full flex items-center mr-2 mb-2">
                          {curator?.email || curator?.stageName || id}
                          <button type="button" className="ml-2 text-black" onClick={() => handleRemoveCurator(id)}>&times;</button>
                        </span>
                      );
                    })}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search curators..."
                      value={curatorSearch}
                      onChange={(e) => setCuratorSearch(e.target.value)}
                      className="w-full bg-[#1F1F1F] text-white rounded-lg p-3 border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                    />
                    {curatorSearch && (
                      <div className="absolute z-10 w-full mt-1 bg-[#1F1F1F] border border-[#2D2F36] rounded-lg max-h-48 overflow-y-auto">
                        {filteredCurators.filter(c => !curatorIds.includes(c._id)).length > 0 ? (
                          filteredCurators.filter(c => !curatorIds.includes(c._id)).map((curator) => (
                            <div
                              key={curator._id}
                              onClick={() => handleAddCurator({ target: { value: curator._id } })}
                              className="p-3 hover:bg-[#2D2F36] cursor-pointer text-white border-b border-[#2D2F36] last:border-b-0"
                            >
                              {curator.email}
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-[#96A1AE] text-center">
                            No curators found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-6">
                  <button
                    className="text-white text-sm hover:underline"
                    onClick={handlePrevStep}
                  >
                    Go back to Edit Event
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="bg-[#2FE2AF] text-[#0F172A] px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-[#24C89D] transition"
                  >
                    Save & Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Ticketing Step */}
          {currentStep === 3 && (
            <>
              <div className="p-6 bg-[#121212] rounded-lg">
                {/* Event Type Selection */}
                <h3 className="text-white text-lg font-semibold mb-4">
                  What type of event are you running?
                </h3>
                <div className="flex gap-4 mb-6">
                  <button
                    className={`flex-1 p-4 border rounded-lg text-white flex flex-col items-center 
            ${eventTypeTicketing === "ticketed"
                        ? "border-[#2FE2AF]"
                        : "border-[#666] hover:border-white"
                      }`}
                    onClick={() => handleEventTypeChange("ticketed")}
                  >
                    <span className="text-2xl">
                      <svg
                        width="86"
                        height="86"
                        viewBox="0 0 86 86"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <mask id="path-1-inside-1_153_18699" fill="white">
                          <path d="M84.164 29.8864L76.4068 22.1291C75.781 21.5117 74.9465 21.1512 74.0679 21.1187C73.1894 21.0861 72.3305 21.3839 71.6607 21.9534C70.6266 22.8336 69.2996 23.2931 67.9426 23.2411C66.5856 23.189 65.2977 22.629 64.3342 21.6721C63.3778 20.7086 62.8181 19.4211 62.766 18.0645C62.7139 16.7079 63.1732 15.3813 64.0529 14.3473C64.6224 13.6775 64.9202 12.8186 64.8876 11.9401C64.8551 11.0615 64.4946 10.2271 63.8771 9.60121L56.1129 1.8352C55.4567 1.18031 54.5676 0.8125 53.6405 0.8125C52.7135 0.8125 51.8243 1.18031 51.1682 1.8352L38.802 14.1996C38.0385 14.9659 37.4627 15.8984 37.1197 16.9243C37.053 17.1215 36.9416 17.3007 36.7944 17.4479C36.6471 17.5952 36.4679 17.7065 36.2707 17.7733C35.2445 18.1162 34.3118 18.6927 33.5461 19.4573L1.8352 51.1682C1.18031 51.8243 0.8125 52.7135 0.8125 53.6406C0.8125 54.5676 1.18031 55.4568 1.8352 56.1129L9.60121 63.8701C10.2271 64.4876 11.0615 64.8481 11.9401 64.8806C12.8186 64.9132 13.6775 64.6154 14.3473 64.0459C15.3789 63.1586 16.7078 62.6939 18.0676 62.745C19.4273 62.796 20.7176 63.3591 21.6798 64.3213C22.642 65.2834 23.205 66.5737 23.2561 67.9335C23.3071 69.2933 22.8424 70.6221 21.9551 71.6537C21.3857 72.3235 21.0879 73.1824 21.1204 74.061C21.1529 74.9395 21.5135 75.774 22.1309 76.3998L29.8881 84.1571C30.5443 84.8119 31.4334 85.1797 32.3605 85.1797C33.2875 85.1797 34.1767 84.8119 34.8328 84.1571L66.5437 52.4461C67.3079 51.6808 67.8843 50.7488 68.2277 49.7233C68.2942 49.5254 68.4056 49.3456 68.5532 49.198C68.7008 49.0504 68.8806 48.939 69.0785 48.8725C70.1038 48.5294 71.0358 47.9537 71.8014 47.1903L84.1658 34.8241C84.8183 34.168 85.1844 33.2802 85.1841 32.3548C85.1838 31.4295 84.817 30.542 84.164 29.8864ZM44.0209 24.6744C43.7597 24.9357 43.4497 25.1429 43.1084 25.2843C42.7671 25.4257 42.4013 25.4984 42.0319 25.4984C41.6625 25.4984 41.2968 25.4257 40.9555 25.2843C40.6142 25.1429 40.3042 24.9357 40.043 24.6744L38.0197 22.6512C37.5051 22.1211 37.2198 21.4098 37.2253 20.671C37.2309 19.9322 37.5269 19.2253 38.0495 18.703C38.572 18.1807 39.279 17.885 40.0178 17.8798C40.7566 17.8745 41.4678 18.1602 41.9977 18.675L44.0209 20.6965C44.2821 20.9577 44.4894 21.2678 44.6307 21.609C44.7721 21.9503 44.8449 22.3161 44.8449 22.6855C44.8449 23.0549 44.7721 23.4207 44.6307 23.7619C44.4894 24.1032 44.2821 24.4133 44.0209 24.6744ZM51.7553 32.4088C51.2279 32.9359 50.5128 33.2319 49.7672 33.2319C49.0216 33.2319 48.3065 32.9359 47.7791 32.4088L45.8455 30.4752C45.5843 30.214 45.3771 29.904 45.2358 29.5627C45.0944 29.2214 45.0217 28.8556 45.0217 28.4863C45.0217 28.1169 45.0944 27.7511 45.2358 27.4098C45.3771 27.0686 45.5843 26.7585 45.8455 26.4973C46.373 25.9698 47.0885 25.6734 47.8345 25.6734C48.2039 25.6734 48.5696 25.7462 48.9109 25.8876C49.2522 26.0289 49.5622 26.2361 49.8234 26.4973L51.757 28.4309C52.0192 28.692 52.2272 29.0024 52.3692 29.3441C52.5112 29.6858 52.5844 30.0521 52.5845 30.4221C52.5847 30.7922 52.5119 31.1586 52.3702 31.5004C52.2285 31.8422 52.0207 32.1527 51.7588 32.4141L51.7553 32.4088ZM59.4896 40.1432C59.2285 40.4044 58.9184 40.6117 58.5771 40.753C58.2359 40.8944 57.8701 40.9672 57.5007 40.9672C57.1313 40.9672 56.7655 40.8944 56.4242 40.753C56.083 40.6117 55.7729 40.4044 55.5117 40.1432L53.5781 38.2096C53.0635 37.6795 52.7782 36.9682 52.7837 36.2294C52.7893 35.4906 53.0853 34.7837 53.6078 34.2614C54.1304 33.7391 54.8374 33.4434 55.5762 33.4382C56.315 33.4329 57.0262 33.7186 57.5561 34.2334L59.4896 36.167C59.7525 36.4277 59.9613 36.7378 60.1041 37.0794C60.2468 37.421 60.3207 37.7874 60.3216 38.1577C60.3224 38.5279 60.2501 38.8947 60.1088 39.2369C59.9676 39.5791 59.7601 39.8901 59.4984 40.152L59.4896 40.1432ZM67.2996 47.9725C67.0384 48.2337 66.7283 48.4409 66.3871 48.5823C66.0458 48.7237 65.68 48.7965 65.3106 48.7965C64.9412 48.7965 64.5755 48.7237 64.2342 48.5823C63.8929 48.4409 63.5828 48.2337 63.3217 47.9725L61.3107 45.951C61.044 45.6906 60.8317 45.3798 60.6862 45.0366C60.5407 44.6934 60.4648 44.3248 60.463 43.952C60.4613 43.5793 60.5336 43.2099 60.6758 42.8653C60.8181 42.5208 61.0274 42.208 61.2916 41.945C61.5558 41.6821 61.8697 41.4743 62.2149 41.3337C62.5601 41.1932 62.9299 41.1226 63.3026 41.1262C63.6753 41.1298 64.0437 41.2075 64.3861 41.3547C64.7286 41.5018 65.0384 41.7156 65.2975 41.9836L67.3101 44.0033C67.5713 44.2646 67.7784 44.5748 67.9196 44.9161C68.0608 45.2575 68.1334 45.6233 68.1333 45.9927C68.1331 46.3621 68.0602 46.7278 67.9186 47.069C67.7771 47.4102 67.5697 47.7202 67.3084 47.9813L67.2996 47.9725Z" />
                        </mask>
                        <path
                          d="M84.164 29.8864L76.4068 22.1291C75.781 21.5117 74.9465 21.1512 74.0679 21.1187C73.1894 21.0861 72.3305 21.3839 71.6607 21.9534C70.6266 22.8336 69.2996 23.2931 67.9426 23.2411C66.5856 23.189 65.2977 22.629 64.3342 21.6721C63.3778 20.7086 62.8181 19.4211 62.766 18.0645C62.7139 16.7079 63.1732 15.3813 64.0529 14.3473C64.6224 13.6775 64.9202 12.8186 64.8876 11.9401C64.8551 11.0615 64.4946 10.2271 63.8771 9.60121L56.1129 1.8352C55.4567 1.18031 54.5676 0.8125 53.6405 0.8125C52.7135 0.8125 51.8243 1.18031 51.1682 1.8352L38.802 14.1996C38.0385 14.9659 37.4627 15.8984 37.1197 16.9243C37.053 17.1215 36.9416 17.3007 36.7944 17.4479C36.6471 17.5952 36.4679 17.7065 36.2707 17.7733C35.2445 18.1162 34.3118 18.6927 33.5461 19.4573L1.8352 51.1682C1.18031 51.8243 0.8125 52.7135 0.8125 53.6406C0.8125 54.5676 1.18031 55.4568 1.8352 56.1129L9.60121 63.8701C10.2271 64.4876 11.0615 64.8481 11.9401 64.8806C12.8186 64.9132 13.6775 64.6154 14.3473 64.0459C15.3789 63.1586 16.7078 62.6939 18.0676 62.745C19.4273 62.796 20.7176 63.3591 21.6798 64.3213C22.642 65.2834 23.205 66.5737 23.2561 67.9335C23.3071 69.2933 22.8424 70.6221 21.9551 71.6537C21.3857 72.3235 21.0879 73.1824 21.1204 74.061C21.1529 74.9395 21.5135 75.774 22.1309 76.3998L29.8881 84.1571C30.5443 84.8119 31.4334 85.1797 32.3605 85.1797C33.2875 85.1797 34.1767 84.8119 34.8328 84.1571L66.5437 52.4461C67.3079 51.6808 67.8843 50.7488 68.2277 49.7233C68.2942 49.5254 68.4056 49.3456 68.5532 49.198C68.7008 49.0504 68.8806 48.939 69.0785 48.8725C70.1038 48.5294 71.0358 47.9537 71.8014 47.1903L84.1658 34.8241C84.8183 34.168 85.1844 33.2802 85.1841 32.3548C85.1838 31.4295 84.817 30.542 84.164 29.8864ZM44.0209 24.6744C43.7597 24.9357 43.4497 25.1429 43.1084 25.2843C42.7671 25.4257 42.4013 25.4984 42.0319 25.4984C41.6625 25.4984 41.2968 25.4257 40.9555 25.2843C40.6142 25.1429 40.3042 24.9357 40.043 24.6744L38.0197 22.6512C37.5051 22.1211 37.2198 21.4098 37.2253 20.671C37.2309 19.9322 37.5269 19.2253 38.0495 18.703C38.572 18.1807 39.279 17.885 40.0178 17.8798C40.7566 17.8745 41.4678 18.1602 41.9977 18.675L44.0209 20.6965C44.2821 20.9577 44.4894 21.2678 44.6307 21.609C44.7721 21.9503 44.8449 22.3161 44.8449 22.6855C44.8449 23.0549 44.7721 23.4207 44.6307 23.7619C44.4894 24.1032 44.2821 24.4133 44.0209 24.6744ZM51.7553 32.4088C51.2279 32.9359 50.5128 33.2319 49.7672 33.2319C49.0216 33.2319 48.3065 32.9359 47.7791 32.4088L45.8455 30.4752C45.5843 30.214 45.3771 29.904 45.2358 29.5627C45.0944 29.2214 45.0217 28.8556 45.0217 28.4863C45.0217 28.1169 45.0944 27.7511 45.2358 27.4098C45.3771 27.0686 45.5843 26.7585 45.8455 26.4973C46.373 25.9698 47.0885 25.6734 47.8345 25.6734C48.2039 25.6734 48.5696 25.7462 48.9109 25.8876C49.2522 26.0289 49.5622 26.2361 49.8234 26.4973L51.757 28.4309C52.0192 28.692 52.2272 29.0024 52.3692 29.3441C52.5112 29.6858 52.5844 30.0521 52.5845 30.4221C52.5847 30.7922 52.5119 31.1586 52.3702 31.5004C52.2285 31.8422 52.0207 32.1527 51.7588 32.4141L51.7553 32.4088ZM59.4896 40.1432C59.2285 40.4044 58.9184 40.6117 58.5771 40.753C58.2359 40.8944 57.8701 40.9672 57.5007 40.9672C57.1313 40.9672 56.7655 40.8944 56.4242 40.753C56.083 40.6117 55.7729 40.4044 55.5117 40.1432L53.5781 38.2096C53.0635 37.6795 52.7782 36.9682 52.7837 36.2294C52.7893 35.4906 53.0853 34.7837 53.6078 34.2614C54.1304 33.7391 54.8374 33.4434 55.5762 33.4382C56.315 33.4329 57.0262 33.7186 57.5561 34.2334L59.4896 36.167C59.7525 36.4277 59.9613 36.7378 60.1041 37.0794C60.2468 37.421 60.3207 37.7874 60.3216 38.1577C60.3224 38.5279 60.2501 38.8947 60.1088 39.2369C59.9676 39.5791 59.7601 39.8901 59.4984 40.152L59.4896 40.1432ZM67.2996 47.9725C67.0384 48.2337 66.7283 48.4409 66.3871 48.5823C66.0458 48.7237 65.68 48.7965 65.3106 48.7965C64.9412 48.7965 64.5755 48.7237 64.2342 48.5823C63.8929 48.4409 63.5828 48.2337 63.3217 47.9725L61.3107 45.951C61.044 45.6906 60.8317 45.3798 60.6862 45.0366C60.5407 44.6934 60.4648 44.3248 60.463 43.952C60.4613 43.5793 60.5336 43.2099 60.6758 42.8653C60.8181 42.5208 61.0274 42.208 61.2916 41.945C61.5558 41.6821 61.8697 41.4743 62.2149 41.3337C62.5601 41.1932 62.9299 41.1226 63.3026 41.1262C63.6753 41.1298 64.0437 41.2075 64.3861 41.3547C64.7286 41.5018 65.0384 41.7156 65.2975 41.9836L67.3101 44.0033C67.5713 44.2646 67.7784 44.5748 67.9196 44.9161C68.0608 45.2575 68.1334 45.6233 68.1333 45.9927C68.1331 46.3621 68.0602 46.7278 67.9186 47.069C67.7771 47.4102 67.5697 47.7202 67.3084 47.9813L67.2996 47.9725Z"
                          stroke="white"
                          stroke-width="8"
                          mask="url(#path-1-inside-1_153_18699)"
                        />
                      </svg>
                    </span>
                    <p className="mt-2">Ticketed Event</p>
                    <p className="text-xs text-[#999]">
                      My event requires tickets for entry
                    </p>
                  </button>
                  <button
                    className={`flex-1 p-4 border rounded-lg text-white flex flex-col items-center 
            ${eventTypeTicketing === "free"
                        ? "border-[#2FE2AF]"
                        : "border-[#666] hover:border-white"
                      }`}
                    onClick={() => handleEventTypeChange("free")}
                  >
                    <span className="text-2xl">
                      <img src="freeevent.png" className="w-[90px] h-[90px]" />
                    </span>
                    <p className="mt-2">Free Event</p>
                    <p className="text-xs text-[#999]">
                      I'm running a free event
                    </p>
                  </button>
                </div>

                {/* Ticket Section (only for paid events) */}
                {eventTypeTicketing === "ticketed" && (
                  <>
                    <h3 className="text-white text-lg font-semibold mb-4">
                      What tickets are you selling?
                    </h3>
                    {tickets.map((ticket, index) => (
                      <div key={index} className="mb-6 p-4 border border-[#2D2F36] rounded-lg">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm text-white mb-2">Ticket Name</label>
                            <input
                              type="text"
                              placeholder="e.g. Early Bird"
                              value={ticket.name}
                              onChange={(e) => handleTicketChange(index, "name", e.target.value)}
                              className="w-full bg-[#1F1F1F] text-white p-3 rounded-lg border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-white mb-2">Ticket Type</label>
                            <select
                              value={ticket.type}
                              onChange={(e) => handleTicketChange(index, "type", e.target.value)}
                              className="w-full bg-[#1F1F1F] text-white p-3 rounded-lg border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                            >
                              <option value="">Select ticket type</option>
                              <option value="Standard">Standard</option>
                              <option value="VIP">VIP</option>
                              <option value="Early Bird">Early Bird</option>
                              <option value="Group">Group</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm text-white mb-2">Price (₹)</label>
                            <input
                              type="number"
                              placeholder="0"
                              value={ticket.price}
                              onChange={(e) => handleTicketChange(index, "price", e.target.value)}
                              className="w-full bg-[#1F1F1F] text-white p-3 rounded-lg border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-white mb-2">Available Tickets</label>
                            <input
                              type="number"
                              placeholder="0"
                              value={ticket.available}
                              onChange={(e) => handleTicketChange(index, "available", e.target.value)}
                              className="w-full bg-[#1F1F1F] text-white p-3 rounded-lg border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm text-white mb-2">Description</label>
                          <textarea
                            placeholder="Describe what's included in this ticket"
                            value={ticket.description}
                            onChange={(e) => handleTicketChange(index, "description", e.target.value)}
                            className="w-full bg-[#1F1F1F] text-white p-3 rounded-lg border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF] h-20"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm text-white mb-2">Benefits (comma-separated)</label>
                          <input
                            type="text"
                            placeholder="e.g. Entry to main event, Welcome drink"
                            value={ticket.benefits.join(', ')}
                            onChange={(e) => handleBenefitsChange(index, e.target.value)}
                            className="w-full bg-[#1F1F1F] text-white p-3 rounded-lg border border-[#2D2F36] focus:outline-none focus:border-[#2FE2AF]"
                          />
                        </div>
                        {tickets.length > 1 && (
                          <button
                            onClick={() => removeTicket(index)}
                            className="text-[#FF6B6B] hover:text-red-500 flex items-center"
                          >
                            <Trash2 size={18} className="mr-2" /> Remove Ticket
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addTicket}
                      className="flex items-center text-[#2FE2AF] text-lg hover:underline mb-6"
                    >
                      <Plus size={18} className="mr-2" /> Add Ticket
                    </button>
                  </>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-6">
                  <button
                    className="text-white text-sm hover:underline"
                    onClick={handlePrevStep}
                  >
                    Go back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="bg-[#2FE2AF] text-[#0F172A] px-6 py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-[#24C89D] transition"
                  >
                    Save & Continue
                  </button>
                </div>
              </div>
            </>
          )}
          {/* Review Step */}
          {currentStep === 4 && (
            <>
              <div className="bg-[#1A1C23] p-8 rounded-xl border border-[#2D2F36] text-white">
                <p className="text-gray-300">
                  Nearly there! Check everything's correct.
                </p>
                <div className="mt-4">
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Uploaded Event"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                  <h2 className="text-3xl font-semibold my-8">
                    {formData.eventTitle}
                  </h2>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mt-4">
                    {/* Date and Time Section */}
                    <div className="md:w-1/2">
                      <h2 className="text-2xl my-4 text-[#96A1AE]">
                        Date and Time
                      </h2>
                      <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
                        <Calendar size={16} /> {formData.date}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                        <Clock size={16} /> {formData.startTime} -{" "}
                        {formData.endTime}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                        <MapPin size={16} /> {formData.location.address}, {formData.location.city}, {formData.location.state}, {formData.location.country}
                      </div>
                    </div>

                    {/* Ticket Information Section */}
                    <div className="md:w-1/2">
                      <h2 className="text-2xl my-4 text-[#96A1AE]">
                        Ticket Information
                      </h2>
                      {eventTypeTicketing === "ticketed" ? (
                        <div className="space-y-4">
                          {tickets.map((ticket, index) => (
                            <div key={index} className="bg-[#23252B] p-4 rounded-lg">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="text-white font-medium">{ticket.name}</h3>
                                  <p className="text-[#96A1AE] text-sm">{ticket.type}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-white font-medium">₹{ticket.price}</p>
                                  <p className="text-[#96A1AE] text-sm">{ticket.available} available</p>
                                </div>
                              </div>
                              <p className="text-[#96A1AE] text-sm mt-2">{ticket.description}</p>
                              <div className="mt-2">
                                <p className="text-[#96A1AE] text-sm">Benefits:</p>
                                <ul className="list-disc list-inside text-[#96A1AE] text-sm">
                                  {ticket.benefits.map((benefit, idx) => (
                                    <li key={idx}>{benefit}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-[#23252B] p-4 rounded-lg">
                          <p className="text-white">Free Event</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl  my-4 text-[#96A1AE]">Location</h2>
                    <h2 className="text-xl font-semibold my-4">
                      {formData.location.address}, {formData.location.city}, {formData.location.state}, {formData.location.country}
                    </h2>
                    <iframe
                      src={`https://www.google.com/maps?q=${encodeURIComponent(
                        `${formData.location.address}, ${formData.location.city}, ${formData.location.state}, ${formData.location.country}`
                      )}&output=embed`}
                      className="w-full h-48 rounded-lg border"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
                <div className="mt-6 bg-[#1A1C23] p-6 rounded-xl border border-[#2D2F36]">
                  <h3 className="text-white text-lg font-semibold">
                    Hosted by
                  </h3>
                  <div className="flex items-center mt-2">
                    <img
                      src={previewUrl}
                      alt="Host"
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="ml-4">
                      <h4 className="text-white font-medium">
                        City Youth Movement
                      </h4>
                      <button className="bg-[#2FE2AF] text-black px-4 py-1 rounded-md text-sm">
                        Contact
                      </button>
                      <button className="ml-2 bg-gray-700 text-white px-4 py-1 rounded-md text-sm">
                        + Follow
                      </button>
                    </div>
                  </div>
                  <h3 className="text-white text-lg font-semibold">
                    Event Descriptions
                  </h3>

                  <div className="mt-4 text-gray-300 text-sm">
                    <p>{formData.eventDescription}</p>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button
                      className="text-white text-sm hover:underline"
                      onClick={handlePrevStep}
                    >
                      Go back
                    </button>

                    <button className="bg-black text-[#CAEB0E] px-6 py-2 rounded-lg">
                      Save for later
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="bg-[#2FE2AF] text-black px-6 py-2 rounded-lg"
                    >
                      Publish Event
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
