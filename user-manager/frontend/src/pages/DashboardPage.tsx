import Header from "../components/layout/Header";
import UserManagement from "../components/users/UserManagement";

const DashboardPage = () => {
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
        <h1 className="text-3xl font-semibold mb-6 text-gray-900">
          User Management
        </h1>
        <UserManagement />
      </main>
    </>
  );
};

export default DashboardPage;
