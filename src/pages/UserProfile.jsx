import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaShare, FaStar, FaRegHeart, FaRegComment, FaHeart, FaEllipsisH } from 'react-icons/fa';
import { IoLocationOutline, IoTimeOutline, IoCalendarOutline, IoEyeOutline } from 'react-icons/io5';
import { BsCalendarEvent, BsNewspaper } from 'react-icons/bs';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { RiFileList2Line, RiSettings4Line } from 'react-icons/ri';
import { MdEvent, MdPhotoLibrary } from 'react-icons/md';
import { Dialog, Menu } from '@headlessui/react';
import { CuratorCard } from "../components/CuratorCard";
import { VenueOwnerCard } from "../components/VenueOwnerCard";
import { toast } from 'react-hot-toast';

const UserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Navigation and UI States
    const [activeTab, setActiveTab] = useState("recent");
    const [selectedNav, setSelectedNav] = useState("news_feed");
    const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

    // User Data States
    const [userData, setUserData] = useState({
        name: "Sannidhan",
        role: "Event Owner",
        avatar: "/Images/testimonial.png",
        stats: {
            favorites: 23,
            events: 7,
            followers: 200
        }
    });

    // Content States
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: "George Lobko",
            timeAgo: "2 hours ago",
            content: "Hi Everyone, today i was at the most interesting event in the world. It was a great time spent with @Selena @essar and @essar",
            images: [
                "/Images/post.png",
                "/Images/post.png",
                "/Images/post.png"
            ],
            views: 3445,
            likes: 32,
            comments: 45,
            isLiked: false
        },
        {
            id: 2,
            author: "Sharon Drakes",
            timeAgo: "2 hours ago",
            content: "Hi Everyone, today i was on the most beautiful mountain in the world. I also want to say hi to @Selena @essar and @essar",
            views: 3445,
            likes: 0,
            comments: 0,
            isLiked: false
        }
    ]);

    const [upcomingEvents] = useState([
        {
            _id: 1,
            title: "The Kazi-culture show",
            location: "12 Lake Avenue, Mumbai, India",
            date: "25th Jan, 2023",
            time: "8:30 AM - 7:30 PM",
            interested: 14,
            image: "/Images/blogcard.jpg"
        },
        {
            _id: 2,
            title: "The Kazi-culture show",
            location: "12 Lake Avenue, Mumbai, India",
            date: "25th Jan, 2023",
            time: "8:30 AM - 7:30 PM",
            interested: 14,
            image: "/Images/blogcard.jpg"
        }
    ]);

    const [suggestions] = useState([
        {
            id: 1,
            name: "Nick Ramsy",
            rating: 4.6,
            image: "/Images/default-avatar.jpg"
        },
        {
            id: 2,
            name: "Nick Ramsy",
            rating: 4.6,
            image: "/Images/default-avatar.jpg"
        },
        {
            id: 3,
            name: "Nick Ramsy",
            rating: 4.6,
            image: "/Images/default-avatar.jpg"
        }
    ]);

    // Add these state variables after other state declarations
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [isFileInputVisible, setIsFileInputVisible] = useState(false);
    const [isImageInputVisible, setIsImageInputVisible] = useState(false);
    const [isMapInputVisible, setIsMapInputVisible] = useState(false);
    const [postVisibility, setPostVisibility] = useState('public');

    // Add this after other state declarations
    const [selectedFavTab, setSelectedFavTab] = useState('events');
    const [showAllEvents, setShowAllEvents] = useState(false);

    const [favoriteEvents] = useState([
        {
            id: 1,
            title: "The Kazi-culture show",
            location: "12 Lake Avenue, Mumbai, India",
            date: { month: "NOV", days: "25 - 26" },
            time: "8:30 AM - 7:30 PM",
            interested: 14,
            image: "/Images/post.png",
            isFree: true
        },
        {
            id: 2,
            title: "The Kazi-culture show",
            location: "12 Lake Avenue, Mumbai, India",
            date: { month: "NOV", days: "25 - 26" },
            time: "8:30 AM - 7:30 PM",
            interested: 14,
            image: "/Images/post.png",
            isFree: false
        },
        {
            id: 3,
            title: "Music Festival 2024",
            location: "Central Park, New York, USA",
            date: { month: "DEC", days: "15 - 16" },
            time: "7:00 PM - 11:00 PM",
            interested: 28,
            image: "/Images/post.png",
            isFree: false
        },
        {
            id: 4,
            title: "Summer Beach Party",
            location: "Miami Beach, Florida, USA",
            date: { month: "JUL", days: "10 - 11" },
            time: "2:00 PM - 10:00 PM",
            interested: 42,
            image: "/Images/post.png",
            isFree: true
        },
        {
            id: 5,
            title: "Electronic Music Night",
            location: "Club Matrix, London, UK",
            date: { month: "OCT", days: "05 - 06" },
            time: "9:00 PM - 3:00 AM",
            interested: 35,
            image: "/Images/post.png",
            isFree: false
        }
    ]);

    // Add this after other state declarations
    const [showAllCurators, setShowAllCurators] = useState(false);

    // Update favoriteCurators with more items
    const [favoriteCurators] = useState([
        {
            id: 1,
            name: "DJ Kazi",
            image: "/Images/post.png",
            performances: 235,
            followers: 235,
            rating: 4.6,
            socialLinks: {
                facebook: "#",
                instagram: "#",
                twitter: "#"
            }
        },
        {
            id: 2,
            name: "DJ Kazi",
            image: "/Images/post.png",
            performances: 235,
            followers: 235,
            rating: 4.6,
            socialLinks: {
                facebook: "#",
                instagram: "#",
                twitter: "#"
            }
        },
        {
            id: 3,
            name: "DJ Kazi",
            image: "/Images/post.png",
            performances: 235,
            followers: 235,
            rating: 4.6,
            socialLinks: {
                facebook: "#",
                instagram: "#",
                twitter: "#"
            }
        },
        {
            id: 4,
            name: "DJ Kazi",
            image: "/Images/post.png",
            performances: 235,
            followers: 235,
            rating: 4.6,
            socialLinks: {
                facebook: "#",
                instagram: "#",
                twitter: "#"
            }
        },
        {
            id: 5,
            name: "DJ Kazi",
            image: "/Images/post.png",
            performances: 235,
            followers: 235,
            rating: 4.6,
            socialLinks: {
                facebook: "#",
                instagram: "#",
                twitter: "#"
            }
        },
        {
            id: 6,
            name: "DJ Kazi",
            image: "/Images/post.png",
            performances: 235,
            followers: 235,
            rating: 4.6,
            socialLinks: {
                facebook: "#",
                instagram: "#",
                twitter: "#"
            }
        }
    ]);

    // Add this after other state declarations
    const [showAllSponsors, setShowAllSponsors] = useState(false);

    // Update favoriteSponsors state with appropriate data structure
    const [favoriteSponsors] = useState([
        {
            id: 1,
            name: "Zomato Events",
            image: "/Images/Venueownercard.png",
            venuesOwned: 235,
            eventsHosted: 180,
            rating: 4.6,
            socialLinks: {
                facebook: "#",
                instagram: "#",
                twitter: "#"
            }
        },
        {
            id: 2,
            name: "Nike Sports",
            image: "/Images/Venueownercard.png",
            venuesOwned: 450,
            eventsHosted: 320,
            rating: 4.8,
            socialLinks: {
                facebook: "#",
                instagram: "#",
                twitter: "#"
            }
        },
        {
            id: 3,
            name: "Spotify Music",
            image: "/Images/Venueownercard.png",
            venuesOwned: 320,
            eventsHosted: 275,
            rating: 4.7,
            socialLinks: {
                facebook: "#",
                instagram: "#",
                twitter: "#"
            }
        },
        {
            id: 4,
            name: "Red Bull Events",
            image: "/Images/Venueownercard.png",
            venuesOwned: 520,
            eventsHosted: 420,
            rating: 4.9,
            socialLinks: {
                facebook: "#",
                instagram: "#",
                twitter: "#"
            }
        },
        {
            id: 5,
            name: "Adobe Create",
            image: "/Images/sponsors/adobe.png",
            venuesOwned: 280,
            eventsHosted: 230,
            rating: 4.5,
            socialLinks: {
                facebook: "#",
                instagram: "#",
                twitter: "#"
            }
        },
        {
            id: 6,
            name: "Samsung Tech",
            image: "/Images/sponsors/samsung.png",
            venuesOwned: 410,
            eventsHosted: 350,
            rating: 4.7,
            socialLinks: {
                facebook: "#",
                instagram: "#",
                twitter: "#"
            }
        }
    ]);

    // Add these state declarations after other state declarations
    const [selectedEventTab, setSelectedEventTab] = useState('upcoming');
    const [showAllMyEvents, setShowAllMyEvents] = useState(false);

    // Add myEvents state with sample data
    const [myEvents, setMyEvents] = useState([
        {
            id: 1,
            title: "The Kazi-culture show",
            location: "12 Lake Avenue, Mumbai, India",
            date: { month: "NOV", days: "25 - 26" },
            time: "8:30 AM - 7:30 PM",
            interested: 14,
            image: "/Images/post.png",
            isFree: true,
            status: "upcoming"
        },
        {
            id: 2,
            title: "Music Festival 2024",
            location: "Central Park, New York, USA",
            date: { month: "DEC", days: "15 - 16" },
            time: "7:00 PM - 11:00 PM",
            interested: 28,
            image: "/Images/post.png",
            isFree: false,
            status: "upcoming"
        },
        {
            id: 3,
            title: "Summer Beach Party",
            location: "Miami Beach, Florida, USA",
            date: { month: "JUL", days: "10 - 11" },
            time: "2:00 PM - 10:00 PM",
            interested: 42,
            image: "/Images/post.png",
            isFree: true,
            status: "past"
        },
        {
            id: 4,
            title: "Electronic Music Night",
            location: "Club Matrix, London, UK",
            date: { month: "OCT", days: "05 - 06" },
            time: "9:00 PM - 3:00 AM",
            interested: 35,
            image: "/Images/post.png",
            isFree: false,
            status: "past"
        },
        {
            id: 5,
            title: "Winter Wonderland",
            location: "Hyde Park, London, UK",
            date: { month: "DEC", days: "20 - 21" },
            time: "11:00 AM - 9:00 PM",
            interested: 56,
            image: "/Images/post.png",
            isFree: false,
            status: "upcoming"
        },
        {
            id: 6,
            title: "Jazz in the Park",
            location: "Central Park, New York, USA",
            date: { month: "AUG", days: "12 - 13" },
            time: "6:00 PM - 10:00 PM",
            interested: 89,
            image: "/Images/post.png",
            isFree: true,
            status: "upcoming"
        },
        {
            id: 7,
            title: "Tech Conference 2024",
            location: "Convention Center, San Francisco, USA",
            date: { month: "SEP", days: "18 - 20" },
            time: "9:00 AM - 6:00 PM",
            interested: 145,
            image: "/Images/post.png",
            isFree: false,
            status: "upcoming"
        },
        {
            id: 8,
            title: "Food & Wine Festival",
            location: "Waterfront Park, Seattle, USA",
            date: { month: "JUL", days: "22 - 24" },
            time: "12:00 PM - 8:00 PM",
            interested: 78,
            image: "/Images/post.png",
            isFree: false,
            status: "upcoming"
        }
    ]);

    // Add these new states after other state declarations
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [editFormData, setEditFormData] = useState({
        title: '',
        location: '',
        date: { month: '', days: '' },
        time: '',
        isFree: false,
        image: ''
    });

    // Add these state declarations after other state declarations
    const [myProducts, setMyProducts] = useState([
        {
            id: 1,
            title: "BASE BALL T-SHIRT",
            price: 200,
            stock: 32,
            image: "/Images/post.png",
            description: "High-quality baseball t-shirt with custom design"
        },
        {
            id: 2,
            title: "BASE BALL T-SHIRT",
            price: 200,
            stock: 32,
            image: "/Images/post.png"
        },
        {
            id: 3,
            title: "BASE BALL T-SHIRT",
            price: 200,
            stock: 32,
            image: "/Images/post.png"
        },
        {
            id: 4,
            title: "BASE BALL T-SHIRT",
            price: 200,
            stock: 32,
            image: "/Images/post.png"
        },
        {
            id: 5,
            title: "BASE BALL T-SHIRT",
            price: 200,
            stock: 32,
            image: "/Images/post.png"
        }
    ]);

    // Add these state declarations after other state declarations
    const [isProductEditModalOpen, setIsProductEditModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [productEditFormData, setProductEditFormData] = useState({
        title: '',
        price: 0,
        stock: 0,
        image: '',
        description: ''
    });

    // Add these state declarations after other state declarations
    const [selectedUserType, setSelectedUserType] = useState('all_users');
    const [searchQuery, setSearchQuery] = useState('');
    const [followers] = useState([
        {
            id: 1,
            name: "George Williams",
            role: "Curator",
            image: "/Images/default-avatar.jpg",
            isFollowing: true,
            type: "curator",
            rating: 4.8
        },
        {
            id: 2,
            name: "Nike Sports",
            role: "Sponsor",
            image: "/Images/default-avatar.jpg",
            isFollowing: false,
            type: "sponsor",
            eventsSponsored: 45
        },
        {
            id: 3,
            name: "Sarah Johnson",
            role: "Fan",
            image: "/Images/default-avatar.jpg",
            isFollowing: true,
            type: "fan",
            eventsAttended: 12
        },
        {
            id: 4,
            name: "DJ Maxwell",
            role: "Curator",
            image: "/Images/default-avatar.jpg",
            isFollowing: false,
            type: "curator",
            rating: 4.6
        },
        {
            id: 5,
            name: "Red Bull Events",
            role: "Sponsor",
            image: "/Images/default-avatar.jpg",
            isFollowing: true,
            type: "sponsor",
            eventsSponsored: 89
        }
    ]);

    // Add these state declarations after other state declarations
    const [selectedFollowTab, setSelectedFollowTab] = useState('followers');
    const [following] = useState([
        {
            id: 1,
            name: "Spotify Events",
            role: "Sponsor",
            image: "/Images/default-avatar.jpg",
            isFollowing: true,
            type: "sponsor",
            eventsSponsored: 67
        },
        {
            id: 2,
            name: "John Smith",
            role: "Curator",
            image: "/Images/default-avatar.jpg",
            isFollowing: true,
            type: "curator",
            rating: 4.9
        },
        {
            id: 3,
            name: "Emma Davis",
            role: "Fan",
            image: "/Images/default-avatar.jpg",
            isFollowing: true,
            type: "fan",
            eventsAttended: 8
        }
    ]);

    // Add these state declarations after other state declarations
    const [showAllProducts, setShowAllProducts] = useState(false);
    const [showAllFollowers, setShowAllFollowers] = useState(false);
    const [followLoading, setFollowLoading] = useState({});

    // Add these state declarations after other state declarations
    const [selectedMediaTab, setSelectedMediaTab] = useState('images');
    const [showAllMedia, setShowAllMedia] = useState(false);
    const [mediaItems] = useState([
        {
            id: 1,
            type: 'image',
            url: '/Images/post.png',
            views: 3445,
            likes: 32
        },
        {
            id: 2,
            type: 'video',
            url: 'https://www.example.com/sample-video-1.mp4',
            thumbnail: '/Images/post.png',
            views: 2890,
            likes: 45
        },
        {
            id: 3,
            type: 'image',
            url: '/Images/post.png',
            views: 3445,
            likes: 32
        },
        {
            id: 4,
            type: 'video',
            url: 'https://www.example.com/sample-video-2.mp4',
            thumbnail: '/Images/post.png',
            views: 1567,
            likes: 89
        },
        {
            id: 5,
            type: 'image',
            url: '/Images/post.png',
            views: 3445,
            likes: 32
        },
        {
            id: 6,
            type: 'video',
            url: 'https://www.example.com/sample-video-3.mp4',
            thumbnail: '/Images/post.png',
            views: 4231,
            likes: 156
        }
    ]);

    // Navigation Items
    const navItems = [
        { id: 'news_feed', label: 'News Feed', icon: BsNewspaper },
        { id: 'favorites', label: 'My Favourites', icon: AiOutlineHeart, count: userData.stats.favorites },
        { id: 'events', label: 'My Events', icon: MdEvent, count: userData.stats.events },
        { id: 'products', label: 'My Products', icon: RiFileList2Line },
        { id: 'followers', label: 'Followers', icon: FaShare, count: userData.stats.followers },
        { id: 'media', label: 'Media', icon: MdPhotoLibrary },
        { id: 'settings', label: 'Settings', icon: RiSettings4Line }
    ];

    // Post Actions
    const handleLikePost = useCallback((postId) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
                    : post
            )
        );
    }, []);

    const handleCommentPost = useCallback((postId) => {
        // Implement comment functionality
    }, []);

    // Share Post State and Handler
    const [newPost, setNewPost] = useState({
        content: '',
        files: [],
        images: [],
        location: '',
        visibility: 'public'
    });

    // Add these refs for file inputs
    const fileInputRef = React.useRef(null);
    const imageInputRef = React.useRef(null);

    // Add file handling functions
    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setNewPost(prev => ({
            ...prev,
            files: [...prev.files, ...files]
        }));
        setIsFileInputVisible(false);
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        const imageUrls = files.map(file => URL.createObjectURL(file));
        setNewPost(prev => ({
            ...prev,
            images: [...prev.images, ...imageUrls]
        }));
        setIsImageInputVisible(false);
    };

    const handleLocationInput = (location) => {
        setNewPost(prev => ({
            ...prev,
            location
        }));
    };

    const handleRemoveFile = (index, type) => {
        setNewPost(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
    };

    const handleSharePost = useCallback(() => {
        if (!newPost.content.trim() && !newPost.images.length && !newPost.files.length) return;

        // Add new post to the list
        const post = {
            id: Date.now(),
            author: userData.name,
            timeAgo: "Just now",
            content: newPost.content,
            images: newPost.images,
            files: newPost.files,
            location: newPost.location,
            views: 0,
            likes: 0,
            comments: 0,
            isLiked: false
        };

        setPosts(prev => [post, ...prev]);
        setNewPost({
            content: '',
            files: [],
            images: [],
            location: '',
            visibility: 'public'
        });
        setIsFileInputVisible(false);
        setIsImageInputVisible(false);
        setIsMapInputVisible(false);
    }, [newPost, userData.name]);

    const formatPostContent = useCallback((content) => {
        const parts = content.split(/(@\w+)/g);
        return (
            <div className="text-white/80">
                {parts.map((part, index) => {
                    if (part.startsWith('@')) {
                        return (
                            <span key={index} className="text-[#00FFB2] cursor-pointer hover:underline">
                                {part}
                            </span>
                        );
                    }
                    return part;
                })}
            </div>
        );
    }, []);

    // Add these functions after other function declarations
    const openImageViewer = (image, index) => {
        setSelectedImage(image);
        setSelectedImageIndex(index);
        setIsImageViewerOpen(true);
    };

    const closeImageViewer = () => {
        setSelectedImage(null);
        setSelectedImageIndex(0);
        setIsImageViewerOpen(false);
    };

    const navigateImage = (direction) => {
        const currentPost = posts.find(post => post.images?.some(img => img === selectedImage));
        if (!currentPost?.images) return;

        let newIndex;
        if (direction === 'next') {
            newIndex = (selectedImageIndex + 1) % currentPost.images.length;
        } else {
            newIndex = selectedImageIndex - 1;
            if (newIndex < 0) newIndex = currentPost.images.length - 1;
        }
        setSelectedImageIndex(newIndex);
        setSelectedImage(currentPost.images[newIndex]);
    };

    // Add these functions after other function declarations
    const handleEditEvent = (event) => {
        setEventToEdit(event);
        setEditFormData({
            title: event.title,
            location: event.location,
            date: event.date,
            time: event.time,
            isFree: event.isFree,
            image: event.image
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateEvent = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // TODO: Replace with actual API call
            // const response = await axios.put(`/api/events/${eventToEdit.id}`, editFormData);

            // Update local state
            setMyEvents(prevEvents =>
                prevEvents.map(event =>
                    event.id === eventToEdit.id
                        ? { ...event, ...editFormData }
                        : event
                )
            );

            setIsEditModalOpen(false);
            setEventToEdit(null);
            setEditFormData({
                title: '',
                location: '',
                date: { month: '', days: '' },
                time: '',
                isFree: false,
                image: ''
            });

            // Show success message
            toast.success('Event updated successfully');
        } catch (err) {
            setError(err.message || 'Failed to update event');
            toast.error('Failed to update event');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteEvent = (event) => {
        setEventToDelete(event);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // TODO: Replace with actual API call
            // await axios.delete(`/api/events/${eventToDelete.id}`);

            // Update local state
            setMyEvents(prevEvents => prevEvents.filter(event => event.id !== eventToDelete.id));

            setIsDeleteModalOpen(false);
            setEventToDelete(null);

            // Update event count in userData
            setUserData(prev => ({
                ...prev,
                stats: {
                    ...prev.stats,
                    events: prev.stats.events - 1
                }
            }));

            // Show success message
            toast.success('Event deleted successfully');
        } catch (err) {
            setError(err.message || 'Failed to delete event');
            toast.error('Failed to delete event');
        } finally {
            setIsLoading(false);
        }
    };

    // Add useEffect for initial data fetching
    useEffect(() => {
        const fetchUserEvents = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // TODO: Replace with actual API calls
                // const response = await axios.get('/api/events');
                // setMyEvents(response.data);

                // For now, we're using the static data

            } catch (err) {
                setError(err.message || 'Failed to fetch events');
                toast.error('Failed to fetch events');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserEvents();
    }, []);

    // Add this function to render different content based on selected nav
    const renderMainContent = () => {
        switch (selectedNav) {
            case 'followers':
                const filteredUsers = filterUsers(selectedFollowTab === 'followers' ? followers : following);
                const displayedUsers = showAllFollowers ? filteredUsers : filteredUsers.slice(0, 5);

                return (
                    <div className="space-y-4 md:space-y-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <h2 className="text-white text-xl md:text-2xl font-medium">
                                    {selectedFollowTab === 'followers' ? 'Followers' : 'Following'} ({userData.stats.followers})
                                </h2>
                                <div className="flex gap-2 bg-[#231D30] rounded-lg p-1">
                                    {['Followers', 'Following'].map((tab) => (
                                        <button
                                            key={tab.toLowerCase()}
                                            onClick={() => setSelectedFollowTab(tab.toLowerCase())}
                                            className={`px-3 py-1 md:px-4 md:py-1 rounded-lg transition-all duration-300 text-sm md:text-base ${selectedFollowTab === tab.toLowerCase()
                                                ? 'bg-[#00FFB2] text-black'
                                                : 'text-white hover:bg-[#2a2339]'
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Menu as="div" className="relative w-full sm:w-auto">
                                <Menu.Button className="w-full sm:w-auto flex items-center justify-between gap-2 bg-[#2A2339] text-white px-4 py-2 rounded-lg text-sm md:text-base">
                                    {selectedUserType === 'all_users' ? 'All users' :
                                        selectedUserType === 'curator' ? 'Curators' :
                                            selectedUserType === 'sponsor' ? 'Sponsors' : 'Fans'}
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Menu.Button>
                                <Menu.Items className="absolute right-0 mt-2 w-48 bg-[#2A2339] rounded-lg shadow-lg py-1 z-10">
                                    {[
                                        { id: 'all_users', label: 'All users' },
                                        { id: 'curator', label: 'Curators' },
                                        { id: 'sponsor', label: 'Sponsors' },
                                        { id: 'fan', label: 'Fans' }
                                    ].map((type) => (
                                        <Menu.Item key={type.id}>
                                            {({ active }) => (
                                                <button
                                                    onClick={() => setSelectedUserType(type.id)}
                                                    className={`${active ? 'bg-[#231D30]' : ''
                                                        } text-white group flex w-full items-center px-4 py-2 text-sm`}
                                                >
                                                    {type.label}
                                                </button>
                                            )}
                                        </Menu.Item>
                                    ))}
                                </Menu.Items>
                            </Menu>
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name or role"
                                className="w-full bg-[#231D30] text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00FFB2]"
                            />
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>

                        <div className="space-y-4">
                            {displayedUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between bg-[#231D30] rounded-lg p-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={user.image}
                                            alt={user.name}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div>
                                            <h3 className="text-white font-medium">{user.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <p className="text-gray-400 text-sm">{user.role}</p>
                                                {user.type === 'curator' && (
                                                    <span className="text-[#C5FF32] text-sm">★ {user.rating}</span>
                                                )}
                                                {user.type === 'sponsor' && (
                                                    <span className="text-[#C5FF32] text-sm">{user.eventsSponsored} events</span>
                                                )}
                                                {user.type === 'fan' && (
                                                    <span className="text-[#C5FF32] text-sm">{user.eventsAttended} events attended</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {user.isFollowing && (
                                            <span className="text-[#00FFB2]">Following</span>
                                        )}
                                        <button
                                            onClick={() => handleFollowToggle(user.id, selectedFollowTab)}
                                            disabled={followLoading[user.id]}
                                            className={`px-6 py-2 rounded-lg transition-colors ${user.isFollowing
                                                ? 'border border-[#C5FF32] text-[#C5FF32] hover:bg-[#C5FF32] hover:text-black'
                                                : 'bg-[#00FFB2] text-black hover:bg-[#00FFB2]/90'
                                                } disabled:opacity-50`}
                                        >
                                            {followLoading[user.id] ? 'Loading...' : user.isFollowing ? 'Unfollow' : 'Follow'}
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {filteredUsers.length === 0 && (
                                <div className="text-center text-gray-400 py-8">
                                    No users found matching your criteria
                                </div>
                            )}

                            {filteredUsers.length > 5 && (
                                <div className="flex justify-center mt-6">
                                    <button
                                        onClick={() => setShowAllFollowers(!showAllFollowers)}
                                        className="bg-transparent border border-[#00FFB2] text-[#00FFB2] px-6 py-2 rounded-lg hover:bg-[#00FFB2] hover:text-black transition-all duration-300 flex items-center gap-2"
                                    >
                                        {showAllFollowers ? 'Show Less' : 'See More'}
                                        {!showAllFollowers && (
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'favorites':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-white text-2xl font-medium">My Favourites ({userData.stats.favorites})</h2>
                            <div className="flex gap-2">
                                {['Events', 'Curators', 'Sponsors'].map((tab) => (
                                    <button
                                        key={tab.toLowerCase()}
                                        onClick={() => setSelectedFavTab(tab.toLowerCase())}
                                        className={`px-4 py-1 rounded-lg transition-all duration-300 ${selectedFavTab === tab.toLowerCase()
                                            ? 'bg-[#00FFB2] text-black shadow-[0_0_15px_rgba(0,255,178,0.5)]'
                                            : 'bg-[#231D30] text-white hover:bg-[#2a2339]'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {selectedFavTab === 'events' && (
                            <>
                                <div className="grid grid-cols-1 gap-4">
                                    {(showAllEvents ? favoriteEvents : favoriteEvents.slice(0, 3)).map((event) => (
                                        <Link
                                            key={event.id}
                                            to={`/event/${event.id}`}
                                            className="block bg-[#231D30] rounded-lg p-4 hover:bg-[#231D30]/90 transition-colors"
                                        >
                                            <div className="flex gap-4">
                                                <div className="relative w-[200px] h-[120px] flex-shrink-0">
                                                    <img
                                                        src={event.image}
                                                        alt={event.title}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                    {event.isFree && (
                                                        <span className="absolute top-2 left-2 bg-[#00FFB2] text-black text-xs px-2 py-1 rounded">
                                                            FREE
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <div className="bg-[#1A1625] px-3 py-1 rounded text-center">
                                                            <div className="text-[#00FFB2] text-sm font-medium">{event.date.month}</div>
                                                            <div className="text-white text-sm">{event.date.days}</div>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                // Add your like/unlike logic here
                                                            }}
                                                            className="text-[#00FFB2] hover:text-[#00FFB2]/80"
                                                        >
                                                            <AiFillHeart className="w-5 h-5" />
                                                        </button>
                                                    </div>

                                                    <h3 className="text-white text-lg font-medium mt-2">{event.title}</h3>

                                                    <div className="space-y-2 mt-2">
                                                        <div className="flex items-center gap-2 text-gray-400">
                                                            <IoLocationOutline className="w-5 h-5 flex-shrink-0" />
                                                            <span className="text-sm">{event.location}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-400">
                                                            <IoTimeOutline className="w-5 h-5 flex-shrink-0" />
                                                            <span className="text-sm">{event.time}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <FaStar className="w-4 h-4 text-[#7c7d7b]" />
                                                            <span className="text-[#C5FF32] text-sm">{event.interested} interested</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {favoriteEvents.length > 3 && (
                                    <div className="flex justify-center mt-6">
                                        <button
                                            onClick={() => setShowAllEvents(!showAllEvents)}
                                            className="bg-transparent border border-[#00FFB2] text-[#00FFB2] px-6 py-2 rounded-lg hover:bg-[#00FFB2] hover:text-black transition-all duration-300 flex items-center gap-2"
                                        >
                                            {showAllEvents ? 'Show Less' : 'See More'}
                                            {!showAllEvents && (
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {selectedFavTab === 'curators' && (
                            <>
                                <div className="grid grid-cols-2 gap-6">
                                    {(showAllCurators ? favoriteCurators : favoriteCurators.slice(0, 4)).map((curator) => (
                                        <div key={curator.id} className="bg-[#231D30]/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-[#231D30]/60 transition-colors">
                                            <CuratorCard event={curator} />
                                        </div>
                                    ))}
                                </div>

                                {favoriteCurators.length > 4 && (
                                    <div className="flex justify-center mt-6">
                                        <button
                                            onClick={() => setShowAllCurators(!showAllCurators)}
                                            className="bg-transparent border border-[#00FFB2] text-[#00FFB2] px-6 py-2 rounded-lg hover:bg-[#00FFB2] hover:text-black transition-all duration-300 flex items-center gap-2"
                                        >
                                            {showAllCurators ? 'Show Less' : 'See More'}
                                            {!showAllCurators && (
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {selectedFavTab === 'sponsors' && (
                            <>
                                <div className="grid grid-cols-2 gap-6">
                                    {(showAllSponsors ? favoriteSponsors : favoriteSponsors.slice(0, 4)).map((sponsor) => (
                                        <div key={sponsor.id}>
                                            <VenueOwnerCard event={sponsor} />
                                        </div>
                                    ))}
                                </div>

                                {favoriteSponsors.length > 4 && (
                                    <div className="flex justify-center mt-6">
                                        <button
                                            onClick={() => setShowAllSponsors(!showAllSponsors)}
                                            className="bg-transparent border border-[#00FFB2] text-[#00FFB2] px-6 py-2 rounded-lg hover:bg-[#00FFB2] hover:text-black transition-all duration-300 flex items-center gap-2"
                                        >
                                            {showAllSponsors ? 'Show Less' : 'See More'}
                                            {!showAllSponsors && (
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                );
            case 'events':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-white text-2xl font-medium">My Events ({userData.stats.events})</h2>
                            <div className="flex gap-2">
                                {['Upcoming', 'Past'].map((tab) => (
                                    <button
                                        key={tab.toLowerCase()}
                                        onClick={() => setSelectedEventTab(tab.toLowerCase())}
                                        className={`px-4 py-1 rounded-lg transition-all duration-300 ${selectedEventTab === tab.toLowerCase()
                                            ? 'bg-[#00FFB2] text-black shadow-[0_0_15px_rgba(0,255,178,0.5)]'
                                            : 'bg-[#231D30] text-white hover:bg-[#2a2339]'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {(showAllMyEvents ? myEvents : myEvents.slice(0, 3))
                                .filter(event => event.status === selectedEventTab)
                                .map((event) => (
                                    <div
                                        key={event.id}
                                        className="block bg-[#231D30] rounded-lg p-4 hover:bg-[#231D30]/90 transition-colors"
                                    >
                                        <div className="flex gap-4">
                                            <div className="relative w-[200px] h-[120px] flex-shrink-0">
                                                <img
                                                    src={event.image}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                {event.isFree && (
                                                    <span className="absolute top-2 left-2 bg-[#00FFB2] text-black text-xs px-2 py-1 rounded">
                                                        FREE
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div className="bg-[#1A1625] px-3 py-1 rounded text-center">
                                                        <div className="text-[#00FFB2] text-sm font-medium">{event.date.month}</div>
                                                        <div className="text-white text-sm">{event.date.days}</div>
                                                    </div>
                                                    <Menu as="div" className="relative">
                                                        <Menu.Button className="text-[#00FFB2] hover:text-[#00FFB2]/80 p-1">
                                                            <FaEllipsisH className="w-5 h-5" />
                                                        </Menu.Button>
                                                        <Menu.Items className="absolute right-0 mt-2 w-36 bg-[#1A1625] rounded-lg shadow-lg py-1 z-10">
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <button
                                                                        onClick={() => handleEditEvent(event)}
                                                                        className={`${active ? 'bg-[#231D30]' : ''
                                                                            } text-white group flex w-full items-center px-4 py-2 text-sm`}
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <button
                                                                        onClick={() => handleDeleteEvent(event)}
                                                                        className={`${active ? 'bg-[#231D30]' : ''
                                                                            } text-red-500 group flex w-full items-center px-4 py-2 text-sm`}
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                        </Menu.Items>
                                                    </Menu>
                                                </div>

                                                <h3 className="text-white text-lg font-medium mt-2">{event.title}</h3>

                                                <div className="space-y-2 mt-2">
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <IoLocationOutline className="w-5 h-5 flex-shrink-0" />
                                                        <span className="text-sm">{event.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <IoTimeOutline className="w-5 h-5 flex-shrink-0" />
                                                        <span className="text-sm">{event.time}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <FaStar className="w-4 h-4 text-[#7c7d7b]" />
                                                        <span className="text-[#C5FF32] text-sm">{event.interested} interested</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {myEvents.filter(event => event.status === selectedEventTab).length > 3 && (
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => setShowAllMyEvents(!showAllMyEvents)}
                                    className="bg-transparent border border-[#00FFB2] text-[#00FFB2] px-6 py-2 rounded-lg hover:bg-[#00FFB2] hover:text-black transition-all duration-300 flex items-center gap-2"
                                >
                                    {showAllMyEvents ? 'Show Less' : 'See More'}
                                    {!showAllMyEvents && (
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                );
            case 'products':
                const displayedProducts = showAllProducts ? myProducts : myProducts.slice(0, 3);

                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-white text-2xl font-medium">Products</h2>
                        </div>

                        <div className="space-y-4">
                            {displayedProducts.map((product) => (
                                <div key={product.id} className="bg-[#231D30] rounded-lg p-4">
                                    <div className="flex gap-4">
                                        <div className="relative w-[200px] h-[200px] flex-shrink-0">
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-white text-xl font-medium">{product.title}</h3>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEditProduct(product)}
                                                        className="bg-[#00FFB2] text-black px-8 py-2 rounded-lg hover:bg-[#00FFB2]/90 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-4 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-400">Price:</span>
                                                    <span className="text-white">${product.price}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-400">Stock:</span>
                                                    <span className="text-white">{product.stock}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {myProducts.length > 3 && (
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => setShowAllProducts(!showAllProducts)}
                                    className="bg-transparent border border-[#00FFB2] text-[#00FFB2] px-6 py-2 rounded-lg hover:bg-[#00FFB2] hover:text-black transition-all duration-300 flex items-center gap-2"
                                >
                                    {showAllProducts ? 'Show Less' : 'See More'}
                                    {!showAllProducts && (
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                );
            case 'news_feed':
                return (
                    <div className="space-y-4 md:space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-white text-xl md:text-2xl font-medium">Welcome back,</h1>
                                <p className="text-gray-400 text-sm md:text-base">Username</p>
                            </div>
                            <div className="relative w-full sm:w-auto">
                                <button
                                    onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
                                    className="w-full sm:w-auto bg-[#00FFB2] text-black px-4 py-2 rounded-lg flex items-center justify-center sm:justify-start gap-2 text-sm md:text-base"
                                >
                                    Create new
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>

                                {isCreateMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-full sm:w-48 bg-[#231D30] rounded-lg shadow-lg py-2 z-10">
                                        <button className="w-full text-left px-4 py-2 text-sm md:text-base text-white hover:bg-[#1E1B33]">
                                            Create Post
                                        </button>
                                        <button className="w-full text-left px-4 py-2 text-sm md:text-base text-white hover:bg-[#1E1B33]">
                                            Create Event
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-white text-lg md:text-xl font-medium mb-4">Feeds</h2>
                            <div className="flex gap-4 md:gap-6 border-b border-white/10 overflow-x-auto pb-2 md:pb-0">
                                {['Recent', 'Friends', 'Popular'].map((tab) => (
                                    <button
                                        key={tab.toLowerCase()}
                                        onClick={() => setActiveTab(tab.toLowerCase())}
                                        className={`pb-2 relative whitespace-nowrap text-sm md:text-base ${activeTab === tab.toLowerCase()
                                            ? 'text-[#00FFB2]'
                                            : 'text-white/60'
                                            }`}
                                    >
                                        {tab}
                                        {activeTab === tab.toLowerCase() && (
                                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00FFB2]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Share Something Box and Posts */}
                        <div className="space-y-4 md:space-y-6">
                            {/* Share Something Box */}
                            <div className="bg-[#231D30] rounded-lg p-3 md:p-4">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <img
                                        src={userData.avatar}
                                        alt="Profile"
                                        className="w-8 h-8 md:w-10 md:h-10 rounded-full"
                                    />
                                    <input
                                        type="text"
                                        value={newPost.content}
                                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                        placeholder="Share something"
                                        className="flex-1 bg-transparent text-white/60 text-sm md:text-base outline-none"
                                    />
                                </div>

                                {/* Preview area for selected files/images */}
                                {(newPost.files.length > 0 || newPost.images.length > 0 || newPost.location) && (
                                    <div className="mt-3 md:mt-4 space-y-2">
                                        {newPost.images.length > 0 && (
                                            <div className="grid grid-cols-2 gap-2">
                                                {newPost.images.map((image, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={image}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-24 md:h-32 object-cover rounded-lg"
                                                        />
                                                        <button
                                                            onClick={() => handleRemoveFile(index, 'images')}
                                                            className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {newPost.files.length > 0 && (
                                            <div className="space-y-2">
                                                {newPost.files.map((file, index) => (
                                                    <div key={index} className="flex items-center justify-between bg-[#1A1625] p-2 rounded-lg">
                                                        <span className="text-white/60 text-sm md:text-base truncate">{file.name}</span>
                                                        <button
                                                            onClick={() => handleRemoveFile(index, 'files')}
                                                            className="text-white/60 hover:text-white ml-2"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {newPost.location && (
                                            <div className="flex items-center justify-between bg-[#1A1625] p-2 rounded-lg">
                                                <span className="text-white/60 text-sm md:text-base">{newPost.location}</span>
                                                <button
                                                    onClick={() => handleLocationInput('')}
                                                    className="text-white/60 hover:text-white ml-2"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex flex-wrap justify-between mt-3 md:mt-4">
                                    <div className="flex flex-wrap gap-3 md:gap-4">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            multiple
                                        />
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`text-sm md:text-base text-white/60 hover:text-white ${newPost.files.length > 0 ? 'text-[#00FFB2]' : ''}`}
                                        >
                                            File
                                        </button>
                                        <input
                                            type="file"
                                            ref={imageInputRef}
                                            onChange={handleImageSelect}
                                            accept="image/*"
                                            className="hidden"
                                            multiple
                                        />
                                        <button
                                            onClick={() => imageInputRef.current?.click()}
                                            className={`text-sm md:text-base text-white/60 hover:text-white ${newPost.images.length > 0 ? 'text-[#00FFB2]' : ''}`}
                                        >
                                            Image
                                        </button>
                                        <button
                                            onClick={() => setIsMapInputVisible(!isMapInputVisible)}
                                            className={`text-sm md:text-base text-white/60 hover:text-white ${newPost.location ? 'text-[#00FFB2]' : ''}`}
                                        >
                                            Map
                                        </button>
                                        <div className="relative">
                                            <button
                                                onClick={() => setPostVisibility(postVisibility === 'public' ? 'private' : 'public')}
                                                className="text-sm md:text-base text-white/60 hover:text-white flex items-center gap-1"
                                            >
                                                {postVisibility === 'public' ? 'Public' : 'Private'}
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleSharePost}
                                        className="bg-[#00FFB2] text-black px-4 py-1 rounded-lg text-sm md:text-base hover:bg-[#00FFB2]/90"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>

                            {/* Posts List */}
                            {posts.map((post) => (
                                <div key={post.id} className="bg-[#231D30] rounded-lg p-4 md:p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <img
                                                src={userData.avatar}
                                                alt={post.author}
                                                className="w-10 h-10 md:w-12 md:h-12 rounded-full"
                                            />
                                            <div>
                                                <h3 className="text-white text-sm md:text-base font-medium">{post.author}</h3>
                                                <p className="text-white/60 text-xs md:text-sm">{post.timeAgo}</p>
                                            </div>
                                        </div>
                                        <button className="text-white/60 hover:text-white">•••</button>
                                    </div>

                                    <div className="mb-4">
                                        <div className="text-sm md:text-base text-white/80">
                                            {formatPostContent(post.content)}
                                        </div>
                                    </div>

                                    {post.images && (
                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            {post.images.map((image, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => openImageViewer(image, index)}
                                                    className="relative overflow-hidden rounded-lg group"
                                                >
                                                    <img
                                                        src={image}
                                                        alt={`Post ${index + 1}`}
                                                        className="w-full h-32 md:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 md:gap-6 text-white/60 text-sm md:text-base">
                                        <div className="flex items-center gap-1 md:gap-2">
                                            <IoEyeOutline className="w-4 h-4 md:w-5 md:h-5" />
                                            <span>{post.views}</span>
                                        </div>
                                        <button
                                            onClick={() => handleLikePost(post.id)}
                                            className="flex items-center gap-1 md:gap-2 hover:text-[#00FFB2]"
                                        >
                                            {post.isLiked ? (
                                                <AiFillHeart className="w-4 h-4 md:w-5 md:h-5 text-[#00FFB2]" />
                                            ) : (
                                                <AiOutlineHeart className="w-4 h-4 md:w-5 md:h-5" />
                                            )}
                                            <span className={post.isLiked ? "text-[#00FFB2]" : ""}>
                                                {post.likes} Like
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => handleCommentPost(post.id)}
                                            className="flex items-center gap-1 md:gap-2 hover:text-[#00FFB2]"
                                        >
                                            <FaRegComment className="w-4 h-4 md:w-5 md:h-5" />
                                            <span>{post.comments} Comment</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'media':
                return (
                    <div className="space-y-4 md:space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <h2 className="text-white text-xl md:text-2xl font-medium">
                                Media {selectedMediaTab === 'image' ? '(3)' : '(3)'}
                            </h2>
                            <div className="flex gap-2">
                                {['Images', 'Videos'].map((tab) => (
                                    <button
                                        key={tab.toLowerCase()}
                                        onClick={() => setSelectedMediaTab(tab.toLowerCase().slice(0, -1))}
                                        className={`px-3 py-1 md:px-4 md:py-1 rounded-lg transition-all duration-300 text-sm md:text-base ${selectedMediaTab === tab.toLowerCase().slice(0, -1)
                                            ? 'bg-[#6E6B7B] text-white'
                                            : 'bg-transparent text-white/60 hover:bg-[#2a2339]'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            {mediaItems.filter(item => selectedMediaTab === item.type).map((item) => (
                                <div
                                    key={item.id}
                                    className="relative group cursor-pointer"
                                    onClick={() => {
                                        if (item.type === 'video') {
                                            console.log('Play video:', item.url);
                                        } else {
                                            openImageViewer(item.url, 0);
                                        }
                                    }}
                                >
                                    <div className="relative aspect-square overflow-hidden rounded-lg">
                                        <img
                                            src={item.type === 'video' ? item.thumbnail : item.url}
                                            alt={`Media ${item.id}`}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {item.type === 'video' && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <img
                                                    src="/icons/play.svg"
                                                    alt="Play"
                                                    className="w-8 h-8 md:w-12 md:h-12"
                                                />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                    <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 right-2 md:right-3 flex items-center justify-between text-xs md:text-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="flex items-center gap-1 md:gap-2">
                                            <IoEyeOutline className="w-3 h-3 md:w-4 md:h-4" />
                                            <span>{item.views}</span>
                                        </div>
                                        <div className="flex items-center gap-1 md:gap-2">
                                            <AiOutlineHeart className="w-3 h-3 md:w-4 md:h-4" />
                                            <span>{item.likes}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {mediaItems.filter(item => selectedMediaTab === item.type).length > 6 && (
                            <div className="flex justify-center mt-4 md:mt-6">
                                <button
                                    onClick={() => setShowAllMedia(!showAllMedia)}
                                    className="bg-transparent border border-[#00FFB2] text-[#00FFB2] px-4 py-2 md:px-6 md:py-2 text-sm md:text-base rounded-lg hover:bg-[#00FFB2] hover:text-black transition-all duration-300 flex items-center gap-2"
                                >
                                    {showAllMedia ? 'Show Less' : 'See More'}
                                    {!showAllMedia && (
                                        <svg className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        };
    };

    // Add these functions after other function declarations
    const handleEditProduct = (product) => {
        setProductToEdit(product);
        setProductEditFormData({
            title: product.title,
            price: product.price,
            stock: product.stock,
            image: product.image,
            description: product.description || ''
        });
        setIsProductEditModalOpen(true);
    };

    const handleUpdateProduct = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // TODO: Replace with actual API call
            // const response = await axios.put(`/api/products/${productToEdit.id}`, productEditFormData);

            // Update local state
            setMyProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === productToEdit.id
                        ? { ...product, ...productEditFormData }
                        : product
                )
            );

            setIsProductEditModalOpen(false);
            setProductToEdit(null);
            setProductEditFormData({
                title: '',
                price: 0,
                stock: 0,
                image: '',
                description: ''
            });

            // Show success message
            toast.success('Product updated successfully');
        } catch (err) {
            setError(err.message || 'Failed to update product');
            toast.error('Failed to update product');
        } finally {
            setIsLoading(false);
        }
    };

    // Add this function after other function declarations
    const handleFollowToggle = async (userId, currentList) => {
        try {
            setFollowLoading(prev => ({ ...prev, [userId]: true }));

            // TODO: Replace with actual API call
            // const response = await axios.post(`/api/users/${userId}/follow`);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            if (currentList === 'followers') {
                setFollowers(prevFollowers =>
                    prevFollowers.map(follower =>
                        follower.id === userId
                            ? { ...follower, isFollowing: !follower.isFollowing }
                            : follower
                    )
                );
            } else {
                setFollowing(prevFollowing =>
                    prevFollowing.map(user =>
                        user.id === userId
                            ? { ...user, isFollowing: !user.isFollowing }
                            : user
                    )
                );
            }

            // Update user stats if unfollowing
            const targetUser = [...followers, ...following].find(user => user.id === userId);
            if (targetUser?.isFollowing) {
                setUserData(prev => ({
                    ...prev,
                    stats: {
                        ...prev.stats,
                        followers: prev.stats.followers - 1
                    }
                }));
            } else {
                setUserData(prev => ({
                    ...prev,
                    stats: {
                        ...prev.stats,
                        followers: prev.stats.followers + 1
                    }
                }));
            }

            toast.success(targetUser?.isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
        } catch (err) {
            toast.error('Failed to update follow status');
        } finally {
            setFollowLoading(prev => ({ ...prev, [userId]: false }));
        }
    };

    // Add this function to filter users based on type and search query
    const filterUsers = (users) => {
        return users.filter(user => {
            const matchesType = selectedUserType === 'all_users' || user.type === selectedUserType;
            const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.role.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesType && matchesSearch;
        });
    };

    return (
        <div className="min-h-screen bg-[#1E1B33] p-4 md:p-6 font-sen">
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr_380px] gap-4 md:gap-6">
                {/* Left Sidebar */}
                <div className="space-y-4">
                    {/* Profile Card */}
                    <div className="bg-[#231D30] rounded-lg p-4 text-center">
                        <img
                            src={userData.avatar}
                            alt="Profile"
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto mb-2"
                        />
                        <h2 className="text-white font-medium">{userData.name}</h2>
                        <p className="text-gray-400 text-sm">{userData.role}</p>
                    </div>

                    {/* Navigation Links */}
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                        {navItems.map(item => {
                            const Icon = item.icon;
                            return (
                                item.id === 'settings' ? (
                                    <Link
                                        key={item.id}
                                        to="/settings"
                                        className={`w-full flex items-center gap-3 p-2 md:p-3 rounded-lg text-sm md:text-base text-white/80 hover:bg-[#231D30]`}
                                    >
                                        <Icon className="w-4 h-4 md:w-5 md:h-5" />
                                        <span className="flex-1 text-left">{item.label}</span>
                                    </Link>
                                ) : (
                                    <button
                                        key={item.id}
                                        onClick={() => setSelectedNav(item.id)}
                                        className={`w-full flex items-center gap-3 p-2 md:p-3 rounded-lg text-sm md:text-base ${selectedNav === item.id
                                            ? 'bg-[#00FFB2] text-black font-medium'
                                            : 'text-white/80 hover:bg-[#231D30]'
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 md:w-5 md:h-5 ${selectedNav === item.id ? 'text-black' : ''}`} />
                                        <span className="flex-1 text-left">{item.label}</span>
                                        {item.count && (
                                            <span className={`text-xs md:text-sm ${selectedNav === item.id ? 'text-black' : 'text-white/60'}`}>
                                                ({item.count})
                                            </span>
                                        )}
                                    </button>
                                )
                            );
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-4 md:space-y-6">
                    {renderMainContent()}
                </div>

                {/* Right Sidebar - Hidden on mobile, visible on large screens */}
                <div className="hidden lg:block w-full space-y-6">
                    {/* Upcoming Events */}
                    <div className="bg-[#231D30] rounded-lg p-6">
                        <h2 className="text-white text-xl mb-4">Upcoming Events</h2>
                        <div className="space-y-4">
                            {upcomingEvents.map((event) => (
                                <Link
                                    key={event._id}
                                    to={`/event/${event._id}`}
                                    className="block bg-[#1A1625] rounded-lg p-4 hover:bg-[#1A1625]/70 transition-colors"
                                >
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 flex-shrink-0">
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white text-lg font-medium mb-2">{event.title}</h3>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <IoLocationOutline className="w-5 h-5 flex-shrink-0" />
                                                    <span className="text-sm">{event.location}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <IoCalendarOutline className="w-5 h-5 flex-shrink-0" />
                                                    <span className="text-sm">{event.date}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <IoTimeOutline className="w-5 h-5 flex-shrink-0" />
                                                    <span className="text-sm">{event.time}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <FaStar className="w-4 h-4 text-[#7c7d7b]" />
                                                    <span className="text-[#C5FF32] text-sm">{event.interested} interested</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-[#231D30] rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-white text-xl">Suggestions</h2>
                            <Link to="/suggestions" className="text-gray-400 text-sm hover:text-[#00FFB2]">
                                See All
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {suggestions.map((suggestion) => (
                                <div key={suggestion.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={suggestion.image}
                                            alt={suggestion.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <h3 className="text-white">{suggestion.name}</h3>
                                            <div className="flex items-center">
                                                <span className="text-yellow-400 text-sm">★</span>
                                                <span className="text-gray-400 text-sm ml-1">{suggestion.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="bg-[#3FE1B6] text-black px-4 py-1 rounded-md text-sm hover:bg-[#3FE1B6]/90">
                                        Follow
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Popular Event Owners */}
                    <div className="bg-[#231D30] rounded-lg p-6">
                        <h2 className="text-white text-xl mb-4">Popular Event Owners</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 1, image: '/Images/Crowdcard.png', link: '/venue/:id' },
                                { id: 2, image: '/Images/Crowdcard.png', link: '/venue/:id' },
                                { id: 3, image: '/Images/Crowdcard.png', link: '/venue/:id' },
                                { id: 4, image: '/Images/Crowdcard.png', link: '/venue/:id' }
                            ].map((owner) => (
                                <Link
                                    key={owner.id}
                                    to={owner.link}
                                    className="flex flex-col items-center"
                                >
                                    <div className="w-32 h-32 rounded-full overflow-hidden">
                                        <img
                                            src={owner.image}
                                            alt="Event Owner"
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Viewer Dialog */}
            <Dialog
                open={isImageViewerOpen}
                onClose={closeImageViewer}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/90" aria-hidden="true" />

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="relative w-full h-full flex items-center justify-center">
                        <button
                            onClick={closeImageViewer}
                            className="absolute top-2 md:top-4 right-2 md:right-4 text-white hover:text-gray-300 z-10"
                        >
                            <span className="text-xl md:text-2xl">✕</span>
                        </button>

                        <button
                            onClick={() => navigateImage('prev')}
                            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
                        >
                            <span className="text-2xl md:text-4xl">‹</span>
                        </button>

                        <button
                            onClick={() => navigateImage('next')}
                            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 z-10"
                        >
                            <span className="text-2xl md:text-4xl">›</span>
                        </button>

                        <div className="relative max-w-5xl w-full mx-2 md:mx-4">
                            <img
                                src={selectedImage}
                                alt="Enlarged view"
                                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                            />
                        </div>

                        <div className="absolute bottom-4 md:bottom-8 left-0 right-0 flex justify-center gap-1 md:gap-2">
                            {posts.find(post => post.images?.some(img => img === selectedImage))?.images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setSelectedImageIndex(index);
                                        setSelectedImage(posts.find(post => post.images?.some(img => img === selectedImage)).images[index]);
                                    }}
                                    className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full transition-all ${index === selectedImageIndex
                                        ? 'bg-[#00FFB2] w-3 md:w-4'
                                        : 'bg-white/50 hover:bg-white/80'
                                        }`}
                                />
                            ))}
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-[#1A1625] rounded-lg p-4 md:p-6 max-w-sm w-full mx-4">
                        <Dialog.Title className="text-lg md:text-xl font-medium text-white mb-3 md:mb-4">
                            Delete Event
                        </Dialog.Title>
                        <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6">
                            Are you sure you want to delete "{eventToDelete?.title}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3 md:gap-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-lg text-white hover:bg-[#231D30] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={isLoading}
                                className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Edit Event Modal */}
            <Dialog
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-[#1A1625] rounded-lg p-4 md:p-6 max-w-lg w-full mx-4">
                        <Dialog.Title className="text-lg md:text-xl font-medium text-white mb-4">
                            Edit Event
                        </Dialog.Title>
                        <div className="space-y-3 md:space-y-4">
                            <div>
                                <label className="block text-white text-sm mb-2">Title</label>
                                <input
                                    type="text"
                                    value={editFormData.title}
                                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                    className="w-full bg-[#231D30] text-white text-sm md:text-base rounded-lg px-3 md:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00FFB2]"
                                />
                            </div>
                            <div>
                                <label className="block text-white text-sm mb-2">Location</label>
                                <input
                                    type="text"
                                    value={editFormData.location}
                                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                                    className="w-full bg-[#231D30] text-white text-sm md:text-base rounded-lg px-3 md:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00FFB2]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <div>
                                    <label className="block text-white text-sm mb-2">Month</label>
                                    <input
                                        type="text"
                                        value={editFormData.date.month}
                                        onChange={(e) => setEditFormData({
                                            ...editFormData,
                                            date: { ...editFormData.date, month: e.target.value }
                                        })}
                                        className="w-full bg-[#231D30] text-white text-sm md:text-base rounded-lg px-3 md:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00FFB2]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white text-sm mb-2">Days</label>
                                    <input
                                        type="text"
                                        value={editFormData.date.days}
                                        onChange={(e) => setEditFormData({
                                            ...editFormData,
                                            date: { ...editFormData.date, days: e.target.value }
                                        })}
                                        className="w-full bg-[#231D30] text-white text-sm md:text-base rounded-lg px-3 md:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00FFB2]"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-white text-sm mb-2">Time</label>
                                <input
                                    type="text"
                                    value={editFormData.time}
                                    onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                                    className="w-full bg-[#231D30] text-white text-sm md:text-base rounded-lg px-3 md:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00FFB2]"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={editFormData.isFree}
                                    onChange={(e) => setEditFormData({ ...editFormData, isFree: e.target.checked })}
                                    className="mr-2"
                                />
                                <label className="text-white text-sm">Free Event</label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 md:gap-4 mt-4 md:mt-6">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-lg text-white hover:bg-[#231D30] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateEvent}
                                disabled={isLoading}
                                className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base rounded-lg bg-[#00FFB2] text-black hover:bg-[#00FFB2]/90 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>

            {/* Edit Product Modal */}
            <Dialog
                open={isProductEditModalOpen}
                onClose={() => setIsProductEditModalOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-[#1A1625] rounded-lg p-4 md:p-6 max-w-lg w-full mx-4">
                        <div className="flex justify-between items-center mb-4 md:mb-6">
                            <Dialog.Title className="text-lg md:text-xl font-medium text-white">
                                Edit Product
                            </Dialog.Title>
                            <button
                                onClick={() => setIsProductEditModalOpen(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <span className="text-xl md:text-2xl">×</span>
                            </button>
                        </div>

                        {/* Image Section */}
                        <div className="mb-6 md:mb-8">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">
                                <div className="w-[160px] h-[160px] md:w-[200px] md:h-[200px] bg-[#00FFB2]/10 rounded-lg overflow-hidden">
                                    <img
                                        src={productEditFormData.image}
                                        alt={productEditFormData.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        // Handle image change
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*';
                                        input.onchange = (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (e) => {
                                                    setProductEditFormData({
                                                        ...productEditFormData,
                                                        image: e.target.result
                                                    });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        };
                                        input.click();
                                    }}
                                    className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base border border-[#00FFB2] text-[#00FFB2] rounded-lg hover:bg-[#00FFB2] hover:text-black transition-colors"
                                >
                                    Change image
                                </button>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4 md:space-y-6">
                            <div>
                                <label className="block text-gray-400 text-sm md:text-base mb-2">Product name</label>
                                <input
                                    type="text"
                                    value={productEditFormData.title}
                                    onChange={(e) => setProductEditFormData({ ...productEditFormData, title: e.target.value })}
                                    placeholder="Enter name here"
                                    className="w-full bg-transparent text-white text-sm md:text-base border border-gray-700 rounded-lg px-3 md:px-4 py-2 md:py-3 focus:outline-none focus:border-[#00FFB2]"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm md:text-base mb-2">Price</label>
                                <input
                                    type="text"
                                    value={productEditFormData.price}
                                    onChange={(e) => setProductEditFormData({ ...productEditFormData, price: e.target.value })}
                                    placeholder="Enter price here"
                                    className="w-full bg-transparent text-white text-sm md:text-base border border-gray-700 rounded-lg px-3 md:px-4 py-2 md:py-3 focus:outline-none focus:border-[#00FFB2]"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm md:text-base mb-2">Description</label>
                                <textarea
                                    value={productEditFormData.description}
                                    onChange={(e) => setProductEditFormData({ ...productEditFormData, description: e.target.value })}
                                    placeholder="Enter product description here"
                                    className="w-full bg-transparent text-white text-sm md:text-base border border-gray-700 rounded-lg px-3 md:px-4 py-2 md:py-3 focus:outline-none focus:border-[#00FFB2] min-h-[80px] md:min-h-[100px]"
                                />
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="mt-6 md:mt-8">
                            <button
                                onClick={handleUpdateProduct}
                                disabled={isLoading}
                                className="w-full bg-[#00FFB2] text-black py-3 md:py-4 rounded-lg text-base md:text-lg font-medium hover:bg-[#00FFB2]/90 transition-colors disabled:opacity-50"
                            >
                                Save
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

export default UserProfile; 