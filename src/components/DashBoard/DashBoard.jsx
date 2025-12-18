import { useAuth } from "../../context/AuthProvider";

const DashBoard = () => {
    const { user } = useAuth();
    if (!user) {
  return <p>Loading...</p>; }
    return (
        <div >
            <h2 >Welcome {user.displayName} </h2>
        </div>
    );
};

export default DashBoard;