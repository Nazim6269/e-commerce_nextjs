import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Session } from "next-auth";
import Image from "next/image";

export default async function Profile() {
  const userData: Session | null = await auth();

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 dark:text-gray-400">
        Please login to view your profile.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700">
        <CardHeader className="flex flex-col items-center">
          <Image
            width={70}
            height={128}
            src={userData?.user?.image || "/default-avatar.png"}
            alt="User avatar"
            className="w-24 h-24 rounded-full object-cover border border-gray-300 dark:border-gray-600"
          />
          <CardTitle className="mt-3 text-xl font-semibold">
            {userData?.user?.name}
          </CardTitle>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{userData?.user?.email}</p>
        </CardHeader>

        <Separator className="my-4" />

        <CardContent className="space-y-4">
          <div>
            <h2 className="font-semibold text-lg mb-2">Personal Information</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Full Name
                </label>
                <Input name="name" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Email
                </label>
                <Input name="email" disabled />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Address
                </label>
                <Input name="address" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Phone
                </label>
                <Input name="phone" />
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <h2 className="font-semibold text-lg mb-2">Order Summary</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <p>Total Orders</p>
                <p className="font-semibold">15</p>
              </div>
              <div>
                <p>Pending Orders</p>
                <p className="font-semibold text-yellow-600">2</p>
              </div>
              <div>
                <p>Delivered</p>
                <p className="font-semibold text-green-600">12</p>
              </div>
              <div>
                <p>Cancelled</p>
                <p className="font-semibold text-red-600">1</p>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex justify-end space-x-3">
            {false ? (
              <Button className="bg-green-600 hover:bg-green-700">
                Save Changes
              </Button>
            ) : (
              <Button className="bg-blue-600 hover:bg-blue-700">
                Edit Profile
              </Button>
            )}
            <Button variant="destructive">Logout</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
