import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaShare, FaStar } from 'react-icons/fa';
import { BiChevronDown } from 'react-icons/bi';
import './CrowdfundingDetail.css';
import { toast } from 'react-hot-toast';
import axiosInstance from '@/configs/axiosConfig';
const countryCurrencyList = [
    { code: "IN", name: "India", currency: { code: "INR", symbol: "₹" } },
    { code: "US", name: "United States", currency: { code: "USD", symbol: "$" } },
    { code: "GB", name: "United Kingdom", currency: { code: "GBP", symbol: "£" } },
    { code: "JP", name: "Japan", currency: { code: "JPY", symbol: "¥" } },
    { code: "AU", name: "Australia", currency: { code: "AUD", symbol: "$" } },
    { code: "CA", name: "Canada", currency: { code: "CAD", symbol: "$" } },
    { code: "CH", name: "Switzerland", currency: { code: "CHF", symbol: "₣" } },
    { code: "CN", name: "China", currency: { code: "CNY", symbol: "¥" } },
    { code: "DE", name: "Germany", currency: { code: "EUR", symbol: "€" } },
    { code: "FR", name: "France", currency: { code: "EUR", symbol: "€" } },
    { code: "IT", name: "Italy", currency: { code: "EUR", symbol: "€" } },
    { code: "ES", name: "Spain", currency: { code: "EUR", symbol: "€" } },
    { code: "BG", name: "Bulgaria", currency: { code: "BGN", symbol: "лв" } },
    { code: "BR", name: "Brazil", currency: { code: "BRL", symbol: "R$" } },
    { code: "CZ", name: "Czech Republic", currency: { code: "CZK", symbol: "Kč" } },
    { code: "DK", name: "Denmark", currency: { code: "DKK", symbol: "kr" } },
    { code: "HK", name: "Hong Kong", currency: { code: "HKD", symbol: "$" } },
    { code: "HU", name: "Hungary", currency: { code: "HUF", symbol: "Ft" } },
    { code: "ID", name: "Indonesia", currency: { code: "IDR", symbol: "Rp" } },
    { code: "IL", name: "Israel", currency: { code: "ILS", symbol: "₪" } },
    { code: "IS", name: "Iceland", currency: { code: "ISK", symbol: "kr" } },
    { code: "KR", name: "South Korea", currency: { code: "KRW", symbol: "₩" } },
    { code: "MX", name: "Mexico", currency: { code: "MXN", symbol: "$" } },
    { code: "MY", name: "Malaysia", currency: { code: "MYR", symbol: "RM" } },
    { code: "NO", name: "Norway", currency: { code: "NOK", symbol: "kr" } },
    { code: "NZ", name: "New Zealand", currency: { code: "NZD", symbol: "$" } },
    { code: "PH", name: "Philippines", currency: { code: "PHP", symbol: "₱" } },
    { code: "PL", name: "Poland", currency: { code: "PLN", symbol: "zł" } },
    { code: "RO", name: "Romania", currency: { code: "RON", symbol: "lei" } },
    { code: "SE", name: "Sweden", currency: { code: "SEK", symbol: "kr" } },
    { code: "SG", name: "Singapore", currency: { code: "SGD", symbol: "$" } },
    { code: "TH", name: "Thailand", currency: { code: "THB", symbol: "฿" } },
    { code: "TR", name: "Turkey", currency: { code: "TRY", symbol: "₺" } },
    { code: "ZA", name: "South Africa", currency: { code: "ZAR", symbol: "R" } },
    { code: "EU", name: "Eurozone", currency: { code: "EUR", symbol: "€" } },
  ];
const CrowdfundingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('recent');
    const [isFavorited, setIsFavorited] = useState(false);
    const [campaign, setCampaign] = useState({
        title: '',
        description: '',
        amountRaised: 0,
        goal: 0,
        endDate: '',
        event: null,
        rewards: [],
        updates: [],
        donors: []
    });

    const [otherCampaigns, setOtherCampaigns] = useState([]);
    const [country, setCountry] = useState(() => {
        return localStorage.getItem("country") || "IN";
    });
    const [userCurrency, setUserCurrency] = useState({ code: "INR", symbol: "₹" });
    const [exchangeRate, setExchangeRate] = useState(1);

    useEffect(() => {
        const fetchOtherCampaigns = async () => {
            const { data } = await axiosInstance.get(`management/campaigns`);
            setOtherCampaigns(data);
        };
        fetchOtherCampaigns();
    }, []);

    useEffect(() => {
        const fetchCampaignDetails = async () => {
            try {
                setLoading(true);
                const { data } = await axiosInstance.get(`/crowdfunding/${id}`);
                setCampaign(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load campaign details');
                setLoading(false);
            }
        };

        fetchCampaignDetails();
    }, [id]);

    useEffect(() => {
        const getLocation = async () => {
            const res = await fetch("https://ipapi.co/json");
            const data = await res.json();
            setCountry(data.country_name);
            localStorage.setItem("country", data.country_name);
        };
        if (!localStorage.getItem("country")) {
            getLocation();
        }
    }, []);

    useEffect(() => {
        const selected = countryCurrencyList.find((c) => c.name === country);
        if (!selected || selected.currency.code === "INR") {
            setExchangeRate(1);
            return;
        }
        fetch(`https://api.frankfurter.app/latest?amount=1&from=INR&to=${selected.currency.code}`)
            .then((res) => res.json())
            .then((data) => setExchangeRate(data.rates[selected.currency.code] || 1))
            .catch(() => setExchangeRate(1));
    }, [country]);

    useEffect(() => {
        const currencyObj = countryCurrencyList.find((c) => c.name === country);
        if (currencyObj) {
            setUserCurrency({ code: currencyObj.currency.code, symbol: currencyObj.currency.symbol });
        }
    }, [country]);

    const handleCountryChange = (e) => {
        const countryName = e.target.value;
        setCountry(countryName);
        localStorage.setItem("country", countryName);
        const currencyObj = countryCurrencyList.find((c) => c.name === countryName);
        if (currencyObj) {
            setUserCurrency({ code: currencyObj.currency.code, symbol: currencyObj.currency.symbol });
        }
    };

    console.log(campaign, "campaign");

    const calculateProgress = (raised, target) => {
        return Math.round((raised / target) * 100);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: campaign.title,
                    text: campaign.description,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
            }
        } catch (error) {
            toast.error('Failed to share campaign');
        }
    };

    const handleFavorite = () => {
        setIsFavorited(!isFavorited);
        toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
    };

    const handleSortChange = () => {
        const newSortBy = sortBy === 'recent' ? 'highest' : 'recent';
        setSortBy(newSortBy);

        const sortedDonors = [...campaign.donors].sort((a, b) => {
            if (newSortBy === 'highest') {
                return b.amount - a.amount;
            }
            // Sort by date for recent
            return new Date(b.date) - new Date(a.date);
        });

        setCampaign(prev => ({ ...prev, donors: sortedDonors }));
    };

    const handleContribute = () => {
        // Navigate to contribution page
        // navigate(`/crowdfunding/${id}/contribute`);
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <img src="/Images/loader.svg" alt="loading..." className="w-[60px] h-[60px]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-red-500">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-[#00FFB2] text-black rounded-lg"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#0E0F13] text-white font-sen">
            {/* Background Gradient */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <img
                    src="/Images/crowd.svg"
                    alt=""
                    className="absolute w-full h-full object-cover"
                    style={{
                        opacity: '0.4',
                        mixBlendMode: 'normal',
                    }}
                />
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-[1200px] mx-auto px-4 py-6">
                {/* Back Button */}
                <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
                    • Back
                </Link>

                {/* Main Content */}
                <div className="space-y-8">
                    {/* Campaign Image Section */}
                    <div className="relative rounded-2xl overflow-hidden">
                        <img
                            src={import.meta.env.VITE_SERVER_URL + campaign?.banner?.url}
                            alt="Campaign"
                            className="w-full h-[250px] sm:h-[300px] md:h-[400px] object-cover"
                        />
                        <div className="absolute bottom-4 right-4 flex gap-2">
                            <button
                                onClick={handleShare}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#C5FF32] flex items-center justify-center hover:opacity-90 transition-opacity"
                            >
                                <FaShare className="text-lg md:text-xl text-black" />
                            </button>
                            <button
                                onClick={handleFavorite}
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:opacity-90 transition-all ${isFavorited ? 'bg-[#00FFB2]' : 'bg-[#C5FF32]'
                                    }`}
                            >
                                <FaStar className="text-lg md:text-xl text-black" />
                            </button>
                        </div>
                    </div>

                    {/* Campaign Title and Description */}
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-4">{campaign.title}</h1>
                        <p className="text-gray-400 text-sm md:text-base">{campaign.description}</p>
                    </div>

                    {/* Campaign Stats and Progress */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-2xl md:text-3xl font-bold">
                                    {userCurrency.symbol}{(campaign.amountRaised * exchangeRate).toLocaleString()}
                                </div>
                                <div className="text-gray-400 text-xs md:text-sm">raised</div>
                            </div>
                            <div className="text-right">
                                <div className="text-gray-400 text-xs md:text-sm">Target</div>
                                <div className="text-lg md:text-xl">
                                    {userCurrency.symbol}{(campaign.goal * exchangeRate).toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                            <div
                                className="absolute top-0 left-0 h-full bg-[#00FFB2] transition-all duration-300 ease-in-out"
                                style={{ width: `${calculateProgress(campaign.amountRaised || 0, campaign.goal || 0)}%` }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white"></div>
                            </div>
                        </div>
                        <div className="flex justify-between text-xs md:text-sm text-gray-400">
                            <span>{calculateProgress(campaign.amountRaised || 0, campaign.goal || 0)}%</span>
                            <span>Deadline: {formatDate(campaign.endDate)}</span>
                        </div>
                    </div>

                    {/* Created By and Contribute Button */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:justify-between">
                        <div className="flex items-center gap-2">
                            {/* replace \ with / */}
                            <img src={import.meta.env.VITE_SERVER_URL +'/'+ campaign.creator?.businessLogo.replace(/\\/g, '/') } alt={campaign.createdBy} className="w-6 h-6 rounded-full object-cover" />
                            <span className="text-gray-400 text-sm">Created by</span>
                            <span className="text-sm">{campaign.creator?.businessName}</span>
                        </div>
                        <button
                            onClick={handleContribute}
                            className="w-full sm:w-auto px-8 py-2 bg-[#00FFB2] text-black font-semibold rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Contribute now
                        </button>
                    </div>

                    {/* Donors and Other Crowdfundings Side by Side */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Donors Section */}
                        <div className="lg:col-span-7">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Donors</h2>
                                <button
                                    onClick={handleSortChange}
                                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {sortBy === 'highest' ? 'Highest' : 'Recent'}
                                    <BiChevronDown className="text-xl" />
                                </button>
                            </div>
                            <div className="space-y-3">
                                {campaign.donors?.map((donor) => (
                                    <div key={donor._id} className="flex items-center justify-between bg-[#1A1A1A]/80 backdrop-blur-sm border border-white/5 rounded-xl p-4 hover:bg-[#1A1A1A]/90 transition-all duration-300">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center border border-white/10">
                                                <span className="text-lg">👤</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm md:text-base text-white/90">Anonymous Donor</p>
                                                <p className="text-xs md:text-sm text-white/60">{formatDate(donor.date)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs md:text-sm text-white/60">Amount Donated</p>
                                            <p className="font-medium text-sm md:text-base text-white/90">
                                                {userCurrency.symbol}{(donor.amount * exchangeRate).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Other Crowdfundings Section */}
                        <div className="lg:col-span-5">
                            <h2 className="text-xl font-bold mb-6">Other Crowdfundings</h2>
                            <div className="space-y-3">
                                {otherCampaigns.map((campaign) => (
                                    <div
                                        key={campaign._id}
                                        onClick={() => navigate(`/crowdfunding/${campaign._id}`)}
                                        className="bg-[#1A1A1A]/80 backdrop-blur-sm border border-white/5 rounded-xl p-4 space-y-3 cursor-pointer hover:bg-[#1A1A1A]/90 transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img src={import.meta.env.VITE_SERVER_URL +campaign?.banner?.url} alt={campaign.banner?.alt || campaign.title} className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                                            <h3 className="font-medium text-sm md:text-base text-white/90">{campaign.title}</h3>
                                        </div>
                                        <div>
                                            <div className="text-xs md:text-sm text-white/60">
                                                {userCurrency.symbol}{(campaign.amountRaised * exchangeRate).toLocaleString()} raised
                                            </div>
                                            <div className="relative h-1 bg-[#1A1A1A] rounded-full overflow-hidden mt-2">
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-[#00FFB2] transition-all duration-300 ease-in-out"
                                                    style={{ width: `${calculateProgress(campaign.amountRaised || 0, campaign.goal || 0)}%` }}
                                                >
                                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white"></div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between text-xs md:text-sm mt-1">
                                                <span className="text-white/60"></span>
                                                <span className="text-white/60">
                                                    {userCurrency.symbol}{(campaign.goal * exchangeRate).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs md:text-sm text-white/60">
                                            <div className="flex items-center gap-2">
                                                <div className="rounded-full bg-[#1A1A1A] flex items-center justify-center border border-white/10">
                                                <img src={import.meta.env.VITE_SERVER_URL+'/' +campaign?.creator?.businessLogo.replace(/\\/g, '/')} alt={campaign.banner?.alt || campaign.title} className="w-8 h-8 rounded-full object-cover border border-white/10" />

                                                </div>
                                                <span>{campaign?.creator?.businessName || `${campaign.creator?.firstName} ${campaign.creator?.lastName}`}</span>
                                            </div>
                                            <span>{formatDate(campaign.endDate)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrowdfundingDetail;
