"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import swal from "../components/Swal";
import Swal from "sweetalert2";
import { getProfile } from "./action";

// Definisikan interface untuk tipe user
interface IUser {
  _id?: string;
  username: string;
  email: string;
  isPremium: boolean;
  tokenCount: number;
}

export default function Profile() {
    const router = useRouter();

    // Gunakan interface IUser untuk state user
    const [user, setUser] = useState<IUser>({
        _id: "",
        username: "",
        email: "",
        isPremium: false,
        tokenCount: 7,
    });

    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("none"); // none, pending, paid, failed

    const totalTokens = 7;

    async function fetchProfile() {
        const response = await getProfile();
        if (response.error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: response.message,
            });
            return router.push("/login");
        }        
        setUser(response.data);
    }

    async function fetchPendingOrders() {
        try {
            // Pastikan user._id ada sebelum membuat request
            if (!user._id) {
              console.error("User ID is missing");
              return;
            }
            
            const response = await fetch('/api/orders/pending', {
                headers: {
                    'x-user-id': user._id,
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.order) {
                    setPaymentStatus("pending");
                    // Simpan redirectUrl untuk digunakan nanti
                    sessionStorage.setItem('paymentRedirectUrl', data.order.midtransRedirectUrl);
                }
            }
        } catch (error) {
            console.error("Error fetching pending orders:", error);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        // Setelah profile diambil, cek apakah ada order pending
        if (user._id && !user.isPremium) {
            fetchPendingOrders();
        }
    }, [user._id, user.isPremium]);

    const openPremiumModal = () => {
        setShowPremiumModal(true);
    };

    const handleLogout = async () => {
        const res = await (await fetch("/api/logout", { method: "POST" })).json();
        if (res.ok) {
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "You have been logged out successfully",
            });

            router.push("/login");
        } else {
            swal.error(500, "Logout failed");
            console.error("Logout failed");
        }
    };

    const closePremiumModal = () => {
        setShowPremiumModal(false);
    };

    const proceedToPayment = async () => {
        try {
            setShowPremiumModal(false);
            
            // Cek apakah user._id dan email ada
            if (!user._id || !user.email) {
              throw new Error('User profile is incomplete');
            }
            
            // Tampilkan loading indicator
            Swal.fire({
                title: 'Processing',
                text: 'Preparing your payment...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            // Buat order melalui API
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': user._id,
                    'x-user-email': user.email
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to create order');
            }
            
            const data = await response.json();
            
            // Tutup loading indicator
            Swal.close();
            
            if (data.redirectUrl) {
                // Simpan status pembayaran pending
                setPaymentStatus("pending");
                
                // Redirect ke halaman pembayaran Midtrans
                window.location.href = data.redirectUrl;
            } else {
                throw new Error('No redirect URL received');
            }
            
        } catch (error) {
            console.error('Payment error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Payment Error',
                text: 'There was a problem processing your payment. Please try again later.'
            });
        }
    };
    
    const continuePayment = () => {
        const redirectUrl = sessionStorage.getItem('paymentRedirectUrl');
        if (redirectUrl) {
            window.location.href = redirectUrl;
        } else {
            // Jika URL tidak tersimpan, coba buat order baru
            proceedToPayment();
        }
    };

    return (
        <div className="container max-w-5xl mx-auto py-8 px-4">
            {/* Premium Modal */}
            {showPremiumModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-fade-in">
                        <div className="bg-gradient-to-r from-red-600 to-red-800 p-4 text-white">
                            <h2 className="text-xl font-bold">Upgrade to Premium</h2>
                        </div>
                        <div className="p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Premium Benefits</h3>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-black">Unlimited tokens for generating alternative ingredients</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-black">Unlimited tokens for generating recipes by name</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-black">Unlimited tokens for generating recipes by image</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-semibold text-black">Premium Membership</span>
                                    <span className="text-xl font-bold text-black">Rp 350.000</span>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button onClick={proceedToPayment} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium transition-colors">
                                    Let&apos;s get Premium!
                                </button>
                                <button onClick={closePremiumModal} className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md font-medium transition-colors">
                                    Try Later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-4">
                <Link href="/" className="inline-block text-gray-700 hover:text-red-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="bg-white text-red-600 rounded-full h-20 w-20 flex items-center justify-center text-3xl font-bold">{user.username.charAt(0).toUpperCase()}</div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold">{user.username}</h1>
                            {user.isPremium && (
                                <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
                                </svg>
                            )}
                        </div>
                        <p className="text-red-100">{user.email}</p>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="p-6">
                    {/* Membership Status */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Membership Status</h2>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${user.isPremium ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-600"}`}>
                                        {user.isPremium ? (
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6" viewBox="0 0 16 16">
                                                <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 1-.3.738l-4.462 2.083a.562.562 0 0 1-.758-.302l-.5-1.222a.562.562 0 0 1 .302-.758l4.057-1.893a.563.563 0 0 0 .302-.758l-1.28-3.077a.562.562 0 0 0-.758-.302L6.996 5.21a.562.562 0 0 0-.302.758l.5 1.222a.562.562 0 0 1-.302.758l-4.462 2.083a.562.562 0 0 1-.758-.302L.074 4.617a.562.562 0 0 1 .302-.758L5.337 1.32a.562.562 0 0 1 .758.302l2.398 5.793a.562.562 0 0 0 .758.302l2.398-1.115a.562.562 0 0 0 .302-.758l-.311-.746a.562.562 0 0 1 .302-.758l1.05-.49a.562.562 0 0 1 .758.302l1.736 4.187z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{user.isPremium ? "Premium Member" : "Free Member"}</h3>
                                        <p className="text-sm text-gray-600">{user.isPremium ? "Unlimited access to all recipes" : "Limited access to recipes"}</p>
                                    </div>
                                </div>
                                {!user.isPremium && paymentStatus === "none" && (
                                    <button onClick={openPremiumModal} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm inline-block transition-colors">
                                        Upgrade to Premium
                                    </button>
                                )}
                                {!user.isPremium && paymentStatus === "pending" && (
                                    <button onClick={continuePayment} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm inline-block transition-colors flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                        </svg>
                                        Complete Payment
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Token Count */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recipe Tokens</h2>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-yellow-200 text-yellow-600 p-2 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">Available Tokens</h3>
                                        <p className="text-sm text-gray-600">{user.isPremium ? "Unlimited tokens with Premium membership" : `You have ${user.tokenCount} token${user.tokenCount !== 1 ? "s" : ""} remaining`}</p>
                                    </div>
                                </div>
                                {!user.isPremium && user.tokenCount === 0 && paymentStatus === "none" && (
                                    <button onClick={openPremiumModal} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm inline-block transition-colors">
                                        Get More Tokens
                                    </button>
                                )}
                                {!user.isPremium && user.tokenCount === 0 && paymentStatus === "pending" && (
                                    <button onClick={continuePayment} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm inline-block transition-colors">
                                        Complete Payment
                                    </button>
                                )}
                            </div>

                            {!user.isPremium && (
                                <div className="mt-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${(user.tokenCount / totalTokens) * 100}%` }}></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {user.tokenCount} of {totalTokens} tokens available
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Logout Button */}
                    <div className="flex justify-end">
                        <Link href="#" onClick={handleLogout} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700">
                            <div className="bg-gray-100 p-1.5 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                </svg>
                            </div>
                            <span className="font-medium">Log Out</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}