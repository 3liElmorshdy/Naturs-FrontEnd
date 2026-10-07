import { useNavigate } from "react-router-dom";
// import lock from "../../assets/images/lock.png";

function Unauthorized() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6" data-aos="fade-down">
        {/* <i className="fa-solid fa-lock text-red-500 text-6xl mb-4"></i>  */}
        <div className="w-30 mx-auto">
          {/* <img src={lock} alt="lock" /> */}
        </div>
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-6">
          You don't have permission to view this page.
        </p>
        <button
          className="btn bg-gradient-to-r from-[var(--secondary-color)] to-[var(--stars-color)] 
                      border border-[var(--stars-color)] text-white
                      hover:bg-white hover:from-transparent hover:to-transparent hover:text-[var(--secondary-color)] 
                      transition-colors duration-300"
          onClick={() => navigate("/")}
        >
          Go Home
        </button>
    </div>
  );
}

export default Unauthorized;
