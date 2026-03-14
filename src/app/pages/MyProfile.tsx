import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { User, Mail, Phone, MapPin, Briefcase } from "lucide-react";
import { toast } from "sonner";

export function MyProfile() {
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">My Profile</h1>
        <p className="text-gray-500">Manage your account information</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex size-24 items-center justify-center rounded-full bg-blue-100">
              <User className="size-12 text-blue-600" />
            </div>
            <h2 className="mb-1 text-xl font-semibold text-gray-900">Admin User</h2>
            <p className="mb-2 text-sm text-gray-500">admin@coreinventory.com</p>
            <div className="mb-4 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Administrator
            </div>
            <Button variant="outline" className="w-full">
              Change Photo
            </Button>
          </div>
        </Card>

        {/* Profile Information */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Personal Information</h2>
          <form onSubmit={handleSaveProfile}>
            <div className="grid gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="firstName"
                      defaultValue="Admin"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="lastName"
                      defaultValue="User"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    defaultValue="admin@coreinventory.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="position"
                    defaultValue="Inventory Manager"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="address"
                    defaultValue="123 Business St, City, ST 12345"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Save Changes</Button>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </Card>

        {/* Security Settings */}
        <Card className="p-6 lg:col-span-3">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">Security</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div></div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" />
            </div>
          </div>
          <div className="mt-4">
            <Button>Update Password</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}