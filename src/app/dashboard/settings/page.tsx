"use client";

import { useState } from "react";
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  LogOut, 
  Save, 
  Upload,
  Trash2,
  Check,
  AlertTriangle,
  HelpCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/lib/store/authStore";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { signOut } from "@/lib/services/auth";
import { useRouter } from "next/navigation";

// Extended User interface
interface ExtendedUser {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: "user" | "admin";
  phone?: string;
  companyName?: string;
  bio?: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore() as { user: ExtendedUser | null };
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    companyName: user?.companyName || "",
    bio: user?.bio || ""
  });
  
  // Notification states
  const [notifications, setNotifications] = useState({
    projectUpdates: true,
    newMessages: true,
    marketingEmails: false
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationChange = (name: string, checked: boolean) => {
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Reset form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    }, 1000);
  };
  
  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-lg">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6" onValueChange={setActiveTab}>
        <div className="sm:flex">
          <TabsList className="sm:flex-col h-auto p-0 sm:pr-3 sm:border-r gap-1">
            <TabsTrigger 
              value="profile" 
              className="justify-start data-[state=active]:bg-primary/10 px-4 py-3"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="justify-start data-[state=active]:bg-primary/10 px-4 py-3"
            >
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="justify-start data-[state=active]:bg-primary/10 px-4 py-3"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="billing" 
              className="justify-start data-[state=active]:bg-primary/10 px-4 py-3"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 mt-6 sm:mt-0 sm:pl-6">
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <form onSubmit={handleProfileSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your profile information and how others see you on the platform.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="flex flex-col items-center space-y-3">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={user?.photoURL || ""} alt={profileForm.displayName} />
                          <AvatarFallback className="text-2xl">
                            {profileForm.displayName
                              ? profileForm.displayName.charAt(0).toUpperCase()
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" type="button">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                          <Button variant="outline" size="sm" type="button" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="displayName">Full Name</Label>
                          <Input
                            id="displayName"
                            name="displayName"
                            value={profileForm.displayName}
                            onChange={handleProfileChange}
                            placeholder="Your full name"
                          />
                        </div>
                        
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={profileForm.email}
                            onChange={handleProfileChange}
                            placeholder="Your email address"
                          />
                          {profileForm.email && (
                            <div className="flex items-center gap-2 text-xs">
                              <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                <Check className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={profileForm.phone}
                          onChange={handleProfileChange}
                          placeholder="Your phone number"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          name="companyName"
                          value={profileForm.companyName}
                          onChange={handleProfileChange}
                          placeholder="Your company name"
                        />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        placeholder="Tell us about yourself or your business"
                        id="bio"
                        name="bio"
                        value={profileForm.bio}
                        onChange={handleTextAreaChange}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" type="button">Cancel</Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <span className="mr-2">Saving...</span>}
                      {!isLoading && (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>
            
            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <form onSubmit={handlePasswordSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                      Change your password to keep your account secure.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter your current password"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter your new password"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm your new password"
                      />
                      {passwordForm.newPassword && passwordForm.confirmPassword && 
                       passwordForm.newPassword !== passwordForm.confirmPassword && (
                        <p className="text-sm text-destructive flex items-center mt-1">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Passwords do not match
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" type="button">Cancel</Button>
                    <Button type="submit" disabled={isLoading || (passwordForm.newPassword !== passwordForm.confirmPassword && passwordForm.newPassword !== "")}>
                      {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
              
              <Card className="border-destructive/30">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>
                    Actions here can't be undone. Be careful.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <div>
                      <h4 className="font-medium">Log Out of All Devices</h4>
                      <p className="text-sm text-muted-foreground">
                        This will log you out of all devices except this one.
                      </p>
                    </div>
                    <Button variant="outline" type="button">
                      Log Out
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-destructive">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all your data.
                      </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      type="button"
                    >
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <form onSubmit={handleNotificationsSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose how and when you want to be notified.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Email Notifications</h3>
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="projectUpdates">Project Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive emails about your project status changes.
                          </p>
                        </div>
                        <Switch
                          id="projectUpdates"
                          checked={notifications.projectUpdates}
                          onCheckedChange={(checked: boolean) => handleNotificationChange("projectUpdates", checked)}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="newMessages">New Messages</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified when you receive new messages.
                          </p>
                        </div>
                        <Switch
                          id="newMessages"
                          checked={notifications.newMessages}
                          onCheckedChange={(checked: boolean) => handleNotificationChange("newMessages", checked)}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="marketingEmails">Marketing Emails</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive news, announcements, and product updates.
                          </p>
                        </div>
                        <Switch
                          id="marketingEmails"
                          checked={notifications.marketingEmails}
                          onCheckedChange={(checked: boolean) => handleNotificationChange("marketingEmails", checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" type="button">Reset to Default</Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Preferences"}
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>
            
            {/* Billing Tab */}
            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>
                    Manage your billing information and view your invoices.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted/30 rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="rounded-full bg-muted/50 p-4">
                      <HelpCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">No Billing Information Yet</h3>
                      <p className="text-muted-foreground mt-1">
                        You haven't added any billing information to your account yet.
                      </p>
                    </div>
                    <Button>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
} 