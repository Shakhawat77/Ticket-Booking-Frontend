import { useAuth } from "../../context/AuthProvider";

const DashBoard = () => {
    const { user } = useAuth();
    return (
        <div>
            <h2>Welcome to {user.displayName} </h2>
        </div>
    );
};

export default DashBoard;