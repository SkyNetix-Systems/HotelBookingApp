import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/actions/users";
import { useUsersStore } from "@/store/users-store";
import Header from "./header";
import Spinner from "@/components/spinner";

function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { loggedInUser, setLoggedInUser } = useUsersStore();
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const fetchUserData = async () => {
    try {
      const result = await getCurrentUser();
      if (result.success) {
        setLoggedInUser(result.data);
      } else {
        console.error("Failed to fetch user:", result.message);
        router.push("/login");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return <Spinner />
  }

  return (
    <div>
      <Header />
      <div className="p-5">{children}</div>
    </div>
  );
}

export default PrivateLayout;
