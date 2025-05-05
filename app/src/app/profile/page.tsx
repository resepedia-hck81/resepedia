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

// Interface untuk resep yang ditampilkan di tabel
interface IRecipe {
  _id: string;
  name: string;
  slug: string;
  region: string;
  createdAt: string;
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

  const [pageDetail, setPageDetail] = useState({
    totalPage: 0,
    dataCount: 0,
    totalDataCount: 0,
  });

  // State untuk menyimpan resep user
  const [userRecipes, setUserRecipes] = useState<IRecipe[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);

  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("none"); // none, pending, paid, failed

  const [loading, setLoading] = useState(true);

  const totalTokens = 7;

  async function fetchProfile() {
    setLoading(true);
    const response = await getProfile();
    if (response.error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: response.message,
      });
      setLoading(false);
      return router.push("/login");
    }
    setUser(response.data);
    setLoading(false);
  }

  async function fetchUserRecipes() {
    if (!user._id) return;

    try {
      const response = await fetch(
        `/api/recipes/?profilePage=true&limit=10&page=${pageNumber}`
      );
      if (response.ok) {
        const data = await response.json();
        setUserRecipes(data.result || []);
        setPageDetail({
          totalPage: data.totalPages,
          dataCount: data.dataCount,
          totalDataCount: data.totalDataCount,
        });
      } else {
        console.error("Failed to fetch user recipes");
      }
    } catch (error) {
      console.error("Error fetching user recipes:", error);
    } finally {
      setIsLoadingRecipes(false);
    }
  }

  async function fetchPendingOrders() {
    try {
      // Pastikan user._id ada sebelum membuat request
      if (!user._id) {
        console.error("User ID is missing");
        return;
      }

      const response = await fetch("/api/orders/pending", {
        headers: {
          "x-user-id": user._id,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.order) {
          setPaymentStatus("pending");
          // Simpan redirectUrl untuk digunakan nanti
          sessionStorage.setItem(
            "paymentRedirectUrl",
            data.order.midtransRedirectUrl
          );
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
    if (user._id) {
      fetchUserRecipes();
    }
  }, [pageNumber]);

  useEffect(() => {
    // Setelah profile diambil, cek apakah ada order pending dan ambil resep user
    if (user._id) {
      if (!user.isPremium) {
        fetchPendingOrders();
      }
      fetchUserRecipes();
    }
  }, [user._id, user.isPremium]);

  if (loading) {
    // Show loading spinner while profile data is being fetched
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-bars loading-lg text-red-600"></span>
      </div>
    );
  }

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
        throw new Error("User profile is incomplete");
      }

      // Tampilkan loading indicator
      Swal.fire({
        title: "Processing",
        text: "Preparing your payment...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Buat order melalui API
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user._id,
          "x-user-email": user.email,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
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
        throw new Error("No redirect URL received");
      }
    } catch (error) {
      console.error("Payment error:", error);
      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text: "There was a problem processing your payment. Please try again later.",
      });
    }
  };

  const continuePayment = () => {
    const redirectUrl = sessionStorage.getItem("paymentRedirectUrl");
    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      // Jika URL tidak tersimpan, coba buat order baru
      proceedToPayment();
    }
  };

  const handleDeleteRecipe = async (slug: string) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Show loading
          Swal.fire({
            title: "Deleting...",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

          const response = await fetch(`/api/recipes/${slug}`, {
            method: "DELETE",
          });

          if (response.ok) {
            Swal.fire("Deleted!", "Your recipe has been deleted.", "success");
            if (userRecipes.length === 1 && pageNumber > 1) {
              setPageNumber((prev) => Math.max(prev - 1, 1));
            } else {
              fetchUserRecipes();
            }
          } else {
            const error = await response.json();
            throw new Error(error.message || "Failed to delete recipe");
          }
        }
      });
    } catch (error) {
      console.error("Error deleting recipe:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error instanceof Error ? error.message : "Failed to delete recipe",
      });
    }
  };

  const handleEditRecipe = (slug: string) => {
    router.push(`/edit-recipe/${slug}`);
  };

  const paginateRecipes = () => {
    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing
              <span className="font-medium">{` ${
                (pageNumber - 1) * 10 + 1
              } `}</span>
              to
              <span className="font-medium">{` ${
                (pageNumber - 1) * 10 + pageDetail.dataCount
              } `}</span>
              of
              <span className="font-medium">{` ${pageDetail.totalDataCount} `}</span>
              recipes
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-xs"
              aria-label="Pagination"
            >
              <button
                type="button"
                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                disabled={pageNumber === 1}
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="size-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {Array.from({ length: pageDetail.totalPage }, (_, index) => {
                if (
                  index === 0 ||
                  index === pageDetail.totalPage - 1 ||
                  (pageNumber >= index - 1 && pageNumber <= index + 3)
                ) {
                  return (
                    <button
                      key={index + 1}
                      onClick={() => setPageNumber(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                        pageNumber === index + 1
                          ? "bg-indigo-600 text-white"
                          : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                } else if (pageNumber == index - 2 || pageNumber == index + 4) {
                  return (
                    <span
                      key={index + 1}
                      className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      ...
                    </span>
                  );
                }
              })}
              <button
                type="button"
                onClick={() => setPageNumber((prev) => prev + 1)}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                disabled={pageNumber === pageDetail.totalPage}
              >
                <span className="sr-only">Next</span>
                <svg
                  className="size-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
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
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Premium Benefits
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-black">
                      Unlimited tokens for generating alternative ingredients
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-black">
                      Unlimited tokens for generating recipes by name
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-black">
                      Unlimited tokens for generating recipes by image
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-black">
                    Premium Membership
                  </span>
                  <span className="text-xl font-bold text-black">
                    Rp 350.000
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={proceedToPayment}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
                >
                  Let&apos;s get Premium!
                </button>
                <button
                  onClick={closePremiumModal}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md font-medium transition-colors"
                >
                  Try Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white text-red-600 rounded-full h-20 w-20 flex items-center justify-center text-3xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{user.username}</h1>
                {user.isPremium && (
                  <svg
                    className="w-6 h-6 text-yellow-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
                  </svg>
                )}
              </div>
              <p className="text-red-100">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {/* Membership Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Membership Status
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${
                      user.isPremium
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.isPremium ? (
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="w-6 h-6"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 1-.3.738l-4.462 2.083a.562.562 0 0 1-.758-.302l-.5-1.222a.562.562 0 0 1 .302-.758l4.057-1.893a.563.563 0 0 0 .302-.758l-1.28-3.077a.562.562 0 0 0-.758-.302L6.996 5.21a.562.562 0 0 0-.302.758l.5 1.222a.562.562 0 0 1-.302.758l-4.462 2.083a.562.562 0 0 1-.758-.302L.074 4.617a.562.562 0 0 1 .302-.758L5.337 1.32a.562.562 0 0 1 .758.302l2.398 5.793a.562.562 0 0 0 .758.302l2.398-1.115a.562.562 0 0 0 .302-.758l-.311-.746a.562.562 0 0 1 .302-.758l1.05-.49a.562.562 0 0 1 .758.302l1.736 4.187z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {user.isPremium ? "Premium Member" : "Free Member"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {user.isPremium
                        ? "Unlimited access to all recipes"
                        : "Limited access to recipes"}
                    </p>
                  </div>
                </div>
                {!user.isPremium && paymentStatus === "none" && (
                  <button
                    onClick={openPremiumModal}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm inline-block transition-colors"
                  >
                    Upgrade to Premium
                  </button>
                )}
                {!user.isPremium && paymentStatus === "pending" && (
                  <button
                    onClick={continuePayment}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm inline-block transition-colors flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                      />
                    </svg>
                    Complete Payment
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Token Count */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Recipe Tokens
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-200 text-yellow-600 p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Available Tokens
                    </h3>
                    <p className="text-sm text-gray-600">
                      {user.isPremium
                        ? "Unlimited tokens with Premium membership"
                        : `You have ${user.tokenCount} token${
                            user.tokenCount !== 1 ? "s" : ""
                          } remaining`}
                    </p>
                  </div>
                </div>
                {!user.isPremium &&
                  user.tokenCount === 0 &&
                  paymentStatus === "none" && (
                    <button
                      onClick={openPremiumModal}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm inline-block transition-colors"
                    >
                      Get More Tokens
                    </button>
                  )}
                {!user.isPremium &&
                  user.tokenCount === 0 &&
                  paymentStatus === "pending" && (
                    <button
                      onClick={continuePayment}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm inline-block transition-colors"
                    >
                      Complete Payment
                    </button>
                  )}
              </div>

              {!user.isPremium && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-yellow-500 h-2.5 rounded-full"
                      style={{
                        width: `${(user.tokenCount / totalTokens) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {user.tokenCount} of {totalTokens} tokens available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* My Recipes Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                My Recipes
              </h2>
            </div>

            <div className="bg-white overflow-hidden border border-gray-200 rounded-lg">
              {isLoadingRecipes ? (
                <div className="p-8 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  <p className="mt-4 text-gray-600">Loading your recipes...</p>
                </div>
              ) : userRecipes.length === 0 ? (
                <div className="p-8 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12 mx-auto text-gray-400 mb-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">
                    No recipes yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start by adding your first recipe
                  </p>
                  <Link
                    href="/add-recipe"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm inline-block transition-colors"
                  >
                    Add Recipe
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          No
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Region
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userRecipes.map((recipe, index) => (
                        <tr key={recipe._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {(pageNumber - 1) * 10 + index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link
                              href={`/recipes/${recipe.slug}`}
                              className="text-sm font-medium text-gray-900 hover:text-red-600 transition-colors"
                            >
                              {recipe.name}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              {recipe.region}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditRecipe(recipe.slug)}
                                className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-1.5 rounded-md"
                                title="Edit Recipe"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteRecipe(recipe.slug)}
                                className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded-md"
                                title="Delete Recipe"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {paginateRecipes()}
            </div>
          </div>

          {/* Logout Button */}
          <div className="flex justify-end">
            <Link
              href="#"
              onClick={handleLogout}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700"
            >
              <div className="bg-gray-100 p-1.5 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                  />
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
