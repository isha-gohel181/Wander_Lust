// client/src/pages/Profile.jsx
import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/hooks/useWishlist";
import PropertyGrid from "@/components/property/PropertyGrid";
import { formatDate } from "@/utils/helpers";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, updateProfile, becomeHost, isHost } = useAuth();
  const { wishlist, toggleWishlist, wishlistIds } = useWishlist();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(profileData);
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeHost = async () => {
    setLoading(true);
    try {
      await becomeHost();
    } catch (error) {
      console.error("Become host failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Please sign in
          </h1>
          <p className="text-gray-600">
            You need to be signed in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-2xl">
                    {(user.firstName?.[0] || "") + (user.lastName?.[0] || "") ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {[user.firstName, user.lastName]
                      .filter(Boolean)
                      .join(" ") || "Unnamed User"}
                  </h1>
                  <Badge variant={isHost ? "default" : "secondary"}>
                    {isHost ? "Host" : "Guest"}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      Joined {formatDate(user.dateJoined, "MMM yyyy")}
                    </span>
                  </div>
                </div>

                {!isHost && (
                  <Button
                    onClick={handleBecomeHost}
                    disabled={loading}
                    className="mt-4 bg-wanderlust-500 hover:bg-wanderlust-600"
                  >
                    {loading ? "Processing..." : "Become a Host"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="wishlist">
                Wishlist ({wishlist.length})
              </TabsTrigger>
              {/* <TabsTrigger value="settings">Settings</TabsTrigger> */}
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          maxLength={50}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          maxLength={50}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        pattern="^[0-9]{10}$"
                        title="Enter a valid 10-digit phone number"
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px]"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {profileData.bio.length}/500 characters
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-wanderlust-500 hover:bg-wanderlust-600"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist">
              <Card>
                <CardHeader>
                  <CardTitle>Your Wishlist</CardTitle>
                </CardHeader>
                <CardContent>
                  {wishlist.length === 0 ? (
                    <div className="text-center py-12">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Your wishlist is empty
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Start exploring and save properties you love!
                      </p>
                      <Button
                        onClick={() => (window.location.href = "/search")}
                        className="bg-wanderlust-500 hover:bg-wanderlust-600"
                      >
                        Explore Properties
                      </Button>
                    </div>
                  ) : (
                    <PropertyGrid
                      properties={wishlist}
                      onWishlistToggle={toggleWishlist}
                      wishlist={wishlistIds}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* 
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Email Preferences
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Booking confirmations and updates</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Special offers and promotions</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <span>Marketing emails</span>
                  </label>
                </div>
              </div>

              <Separator />

              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Privacy
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>Show profile to other users</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded" />
                    <span>Allow search engines to index my profile</span>
                  </label>
                </div>
              </div>

              <Separator />

              
              <div>
                <h3 className="text-lg font-semibold text-red-600 mb-4">
                  Danger Zone
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Deactivate Account
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        */}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
