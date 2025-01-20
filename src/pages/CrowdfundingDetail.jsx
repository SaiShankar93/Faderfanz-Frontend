import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaShare, FaHeart, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { MdContentCopy } from 'react-icons/md';
import './CrowdfundingDetail.css';

const CrowdfundingDetail = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [showDonateModal, setShowDonateModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [donationAmount, setDonationAmount] = useState('');
    const [showCopiedToast, setShowCopiedToast] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [donorName, setDonorName] = useState('');
    const [campaign, setCampaign] = useState({
        title: "Support DJ Night Event Production",
        organizer: "John Smith",
        location: "Mumbai, India",
        createdAt: "December 2023",
        target: 150000,
        raised: 0,
        donors: 0,
        story: `We're organizing an incredible DJ night that aims to bring together music lovers and create unforgettable memories. However, we need your support to make this event truly spectacular.

    The funds will be used for:
    - Professional sound equipment
    - Venue decoration
    - Light shows
    - Security arrangements
    - Artist fees
    
    Your contribution will help create an amazing experience for everyone involved.`,
        recentDonations: []
    });
    const [showAllDonations, setShowAllDonations] = useState(false);
    const [showTopDonations, setShowTopDonations] = useState(false);
    const [displayedDonations, setDisplayedDonations] = useState([]);

    // Predefined donation amounts
    const predefinedAmounts = [
        { amount: 1000, label: '₹1,000' },
        { amount: 2000, label: '₹2,000' },
        { amount: 5000, label: '₹5,000' },
        { amount: 10000, label: '₹10,000' },
    ];

    // Share URL (replace with actual URL in production)
    const shareUrl = window.location.href;

    // Share functions
    const handleShare = (platform) => {
        const text = `Check out this crowdfunding campaign: ${campaign.title}`;
        const urls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`
        };

        window.open(urls[platform], '_blank', 'width=600,height=400');
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setShowCopiedToast(true);
            setTimeout(() => setShowCopiedToast(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // Handle donation submission with donor details
    const handleDonateSubmit = () => {
        // Create new donation object
        const newDonation = {
            name: isAnonymous ? "Anonymous" : donorName || "Anonymous",
            amount: `₹${Number(donationAmount).toLocaleString()}`,
            type: "Recent donation",
            timestamp: new Date().toISOString()
        };

        // Update campaign state
        setCampaign(prev => ({
            ...prev,
            raised: prev.raised + Number(donationAmount),
            donors: prev.donors + 1,
            recentDonations: [newDonation, ...prev.recentDonations].slice(0, 10) // Keep only latest 10 donations
        }));

        // Reset form
        setShowDonateModal(false);
        setDonationAmount('');
        setDonorName('');
        setIsAnonymous(false);
    };

    // Function to sort donations by amount
    const sortDonationsByAmount = (donations) => {
        return [...donations].sort((a, b) => {
            const amountA = parseFloat(a.amount.replace('₹', '').replace(',', ''));
            const amountB = parseFloat(b.amount.replace('₹', '').replace(',', ''));
            return amountB - amountA;
        });
    };

    // Function to handle "See all" click
    const handleSeeAll = () => {
        setShowAllDonations(true);
        setShowTopDonations(false);
        setDisplayedDonations(campaign.recentDonations);
    };

    // Function to handle "See top" click
    const handleSeeTop = () => {
        setShowTopDonations(true);
        setShowAllDonations(false);
        const topDonations = sortDonationsByAmount(campaign.recentDonations).slice(0, 5); // Show top 5
        setDisplayedDonations(topDonations);
    };

    // Function to handle "Show less" click
    const handleShowLess = () => {
        setShowAllDonations(false);
        setShowTopDonations(false);
        setDisplayedDonations(campaign.recentDonations.slice(0, 3)); // Show recent 3
    };

    // Update displayed donations when campaign.recentDonations changes
    useEffect(() => {
        setDisplayedDonations(campaign.recentDonations.slice(0, 3)); // Show recent 3 by default
    }, [campaign.recentDonations]);

    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <img src="/Images/loader.svg" alt="loading..." className="w-[60px] h-[60px]" />
            </div>
        );
    }

    const calculateProgress = () => {
        return (campaign.raised / campaign.target) * 100;
    };

    return (
        <div className="min-h-screen bg-[#0E0F13] text-white pt-24 relative overflow-hidden">
            {/* Background Effects Container */}
            <div className="background-effects-container">
                {/* Beam Lights */}
                <div className="beam beam-1"></div>
                <div className="beam beam-2"></div>
                <div className="beam beam-3"></div>

                {/* Glitter Effects */}
                {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className={`glitter glitter-${i + 1}`}></div>
                ))}

                {/* Gradient Overlay */}
                <div className="gradient-overlay"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-20">
                <div className="max-w-[1200px] mx-auto px-4 pb-20 md:pb-32">
                    {/* Title - Full width on mobile */}
                    <h1 className="text-2xl md:text-4xl font-bold mb-6 px-4 md:px-0">
                        {campaign.title}
                    </h1>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column - Main Content */}
                        <div className="flex-1 px-4 md:pl-4 md:pr-0">
                            {/* Main Image */}
                            <div className="rounded-xl overflow-hidden mb-6 -mx-4 md:mx-0">
                                <img
                                    src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070"
                                    alt="Campaign"
                                    className="w-full h-auto"
                                />
                            </div>

                            {/* Organizer Info */}
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                                <div className="text-gray-400">
                                    <p>{campaign.organizer} is organizing this fundraiser</p>
                                    <p>Created {campaign.createdAt} • {campaign.location}</p>
                                </div>
                            </div>

                            {/* Story */}
                            <div className="prose prose-invert max-w-none">
                                <p className="text-gray-300 whitespace-pre-line">
                                    {campaign.story}
                                </p>
                            </div>
                        </div>

                        {/* Right Column - Donation Card */}
                        {/* On mobile, this appears between image and organizer info */}
                        <div className="w-full lg:w-[380px] order-2 lg:order-none px-4 md:px-0 mb-10 lg:mb-0">
                            <div className="lg:sticky lg:top-24 space-y-4">
                                {/* Progress Section */}
                                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
                                    <div className="mb-4">
                                        <h2 className="text-3xl font-bold">
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                                                ₹{campaign.raised.toLocaleString()}
                                            </span>
                                            <span className="text-gray-400 text-xl"> raised</span>
                                        </h2>
                                        <p className="text-gray-400">of ₹{campaign.target.toLocaleString()} target</p>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden mb-4">
                                        <div
                                            className="h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transition-all duration-300"
                                            style={{ width: `${calculateProgress()}%` }}
                                        />
                                    </div>

                                    <p className="text-gray-400 mb-6">
                                        {campaign.donors.toLocaleString()} donations
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => setShowDonateModal(true)}
                                            className="relative w-full py-3 bg-gray-900/80 backdrop-blur-sm rounded-xl text-white font-bold border border-white/20 transition-all duration-200 hover:bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E]"
                                        >
                                            Donate now
                                        </button>
                                        <button
                                            onClick={() => setShowShareModal(true)}
                                            className="relative w-full py-3 bg-gray-900/80 backdrop-blur-sm rounded-xl text-white font-bold border border-white/20 transition-all duration-200 hover:bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E]"
                                        >
                                            Share
                                        </button>
                                    </div>
                                </div>

                                {/* Recent Donations */}
                                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6">
                                    <h3 className="font-bold text-xl mb-4">
                                        {showTopDonations ? "Top Donations" : "Recent Donations"}
                                    </h3>

                                    {displayedDonations.length > 0 ? (
                                        <>
                                            {displayedDonations.map((donation, index) => (
                                                <div key={index} className="flex items-center gap-3 mb-4 last:mb-0">
                                                    <div className="w-10 h-10 bg-gray-700 rounded-full flex-shrink-0">
                                                        {/* Avatar or initials could go here */}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold">{donation.name}</p>
                                                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-bold">
                                                            {donation.amount}
                                                        </p>
                                                        <p className="text-sm text-gray-400">
                                                            {showTopDonations ? "Top donation" : donation.type}
                                                        </p>
                                                        {donation.timestamp && (
                                                            <p className="text-xs text-gray-500">
                                                                {new Date(donation.timestamp).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="mt-4 flex justify-between">
                                                {!showAllDonations && !showTopDonations ? (
                                                    <>
                                                        <button
                                                            onClick={handleSeeAll}
                                                            className="text-sm text-gray-400 hover:text-white transition-colors"
                                                        >
                                                            See all
                                                        </button>
                                                        <button
                                                            onClick={handleSeeTop}
                                                            className="text-sm text-gray-400 hover:text-white transition-colors"
                                                        >
                                                            See top
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        onClick={handleShowLess}
                                                        className="text-sm text-gray-400 hover:text-white transition-colors w-full text-center"
                                                    >
                                                        Show less
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-gray-400 text-center py-4">No donations yet. Be the first to donate!</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Updated Donation Modal */}
            {showDonateModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1A1A1A] rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-2xl font-bold mb-4">Select Donation Amount</h3>

                        {/* Predefined amounts */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {predefinedAmounts.map(({ amount, label }) => (
                                <button
                                    key={amount}
                                    onClick={() => setDonationAmount(amount)}
                                    className={`p-3 rounded-xl border ${donationAmount === amount
                                        ? 'border-[#8B33FE] bg-[#8B33FE]/20'
                                        : 'border-gray-700 hover:border-[#8B33FE]/50'
                                        } transition-all duration-200`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Custom amount input */}
                        <div className="mb-4">
                            <label className="text-sm text-gray-400 mb-2 block">Or enter custom amount</label>
                            <input
                                type="number"
                                value={donationAmount}
                                onChange={(e) => setDonationAmount(e.target.value)}
                                placeholder="Enter amount"
                                className="w-full p-3 bg-gray-800 rounded-xl border border-gray-700 focus:border-[#8B33FE] outline-none"
                            />
                        </div>

                        {/* Donor Name Input - Hidden if Anonymous */}
                        {!isAnonymous && (
                            <div className="mb-4">
                                <label className="text-sm text-gray-400 mb-2 block">Your Name</label>
                                <input
                                    type="text"
                                    value={donorName}
                                    onChange={(e) => setDonorName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full p-3 bg-gray-800 rounded-xl border border-gray-700 focus:border-[#8B33FE] outline-none"
                                />
                            </div>
                        )}

                        {/* Anonymous Option */}
                        <div className="mb-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-[#8B33FE] focus:ring-[#8B33FE]"
                                />
                                <span className="text-gray-400">Make donation anonymous</span>
                            </label>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDonateModal(false)}
                                className="flex-1 py-3 rounded-xl border border-gray-700 hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDonateSubmit}
                                disabled={!donationAmount}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] font-bold disabled:opacity-50"
                            >
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#1A1A1A] rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-2xl font-bold mb-4">Share Campaign</h3>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <button
                                onClick={() => handleShare('facebook')}
                                className="flex items-center gap-2 p-3 rounded-xl border border-gray-700 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all"
                            >
                                <FaFacebook className="text-blue-500" /> Facebook
                            </button>
                            <button
                                onClick={() => handleShare('twitter')}
                                className="flex items-center gap-2 p-3 rounded-xl border border-gray-700 hover:border-sky-500/50 hover:bg-sky-500/10 transition-all"
                            >
                                <FaTwitter className="text-sky-500" /> Twitter
                            </button>
                            <button
                                onClick={() => handleShare('whatsapp')}
                                className="flex items-center gap-2 p-3 rounded-xl border border-gray-700 hover:border-green-500/50 hover:bg-green-500/10 transition-all"
                            >
                                <FaWhatsapp className="text-green-500" /> WhatsApp
                            </button>
                            <button
                                onClick={() => handleShare('linkedin')}
                                className="flex items-center gap-2 p-3 rounded-xl border border-gray-700 hover:border-blue-600/50 hover:bg-blue-600/10 transition-all"
                            >
                                <FaLinkedin className="text-blue-600" /> LinkedIn
                            </button>
                        </div>

                        <div className="relative mb-4">
                            <input
                                type="text"
                                value={shareUrl}
                                readOnly
                                className="w-full p-3 pr-12 bg-gray-800 rounded-xl border border-gray-700 outline-none"
                            />
                            <button
                                onClick={copyToClipboard}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                <MdContentCopy size={20} />
                            </button>
                        </div>

                        <button
                            onClick={() => setShowShareModal(false)}
                            className="w-full py-3 rounded-xl border border-gray-700 hover:bg-gray-800 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Copied Toast */}
            {showCopiedToast && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg">
                    Copied to clipboard!
                </div>
            )}
        </div>
    );
};

export default CrowdfundingDetail;
