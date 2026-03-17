import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { verifyLoginOtp } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";

const VerifyLoginOtp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { loginwithTokens } = useAuth();

    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await verifyLoginOtp({ email, otp });
            loginwithTokens(data);
            navigate("/dashboard");
        } catch (err) {
            setError(err?.response?.data?.error || "OTP verification failed");
        } finally {
            setLoading(false);
        }
    };

    // Show an "invalid session" UI if the email is not set
    if (!email) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{
                    background: "#000",
                    color: "#fff",
                    fontFamily: "sans-serif",
                }}
            >
                <div
                    className="w-full max-w-md rounded-2xl p-8 shadow-lg border"
                    style={{
                        background: "#111",
                        borderColor: "#222"
                    }}
                >
                    <div className="flex flex-col items-center text-center">
                        <div
                            className="p-3 rounded-full border mb-4 flex items-center justify-center"
                            style={{
                                background: "#2a0101",
                                borderColor: "#ff4455",
                                width: 48,
                                height: 48
                            }}
                        >
                            <svg className="w-8 h-8" fill="none" stroke="#ff4455" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h2
                            className="text-xl font-bold mb-2"
                            style={{
                                color: "#fff"
                            }}
                        >
                            Invalid Session
                        </h2>
                        <p className="text-sm mb-6" style={{ color: "#bbb" }}>
                            Please try logging in again to request a new OTP.
                        </p>
                        <Link
                            to="/login"
                            className="inline-block font-bold border-white border-2 p-4 text-white bg-black px-3 py-1 rounded-lg transition-all hover:bg-white hover:text-black hover:border-gray-500 hover:shadow-lg"
                            style={{
                                boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                            }}
                            aria-label="Back to Login"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{
                background: "#000",
                color: "#fff",
                fontFamily: "sans-serif",
            }}
        >
            <div
                className="w-full max-w-md rounded-2xl p-8 shadow-lg border"
                style={{
                    background: "#111",
                    borderColor: "#222"
                }}
            >
                <div className="flex flex-col items-center text-center mb-8">
                    <div
                        className="p-3 rounded-full border mb-4 flex items-center justify-center"
                        style={{
                            background: "#001445",
                            borderColor: "#1570ef",
                            width: 48,
                            height: 48
                        }}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="#1570ef" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 16l4-4m0 0l-4-4m4 4H8m-4 4V8"
                            />
                            {/* decorative icon for OTP/security */}
                            <circle cx="12" cy="12" r="9" stroke="#1570ef" strokeWidth={1} />
                        </svg>
                    </div>
                    <h2
                        className="text-3xl font-bold mb-2"
                        style={{
                            color: "#fff",
                            letterSpacing: "0.02em"
                        }}
                    >
                        Verify Login OTP
                    </h2>
                    <p className="text-sm" style={{ color: "#bbb" }}>
                        We've sent an OTP to:
                    </p>
                    <span
                        className="mt-1 text-base font-bold break-all"
                        style={{ color: "#58a6ff" }}
                    >
                        {email}
                    </span>
                </div>

                {error && (
                    <div
                        className="mb-6 p-4 rounded-lg border text-sm text-center"
                        style={{
                            background: "#2a0101",
                            color: "#fff",
                            borderColor: "#ff4455"
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleVerify} className="space-y-5">
                    <div>
                        <label
                            htmlFor="otp"
                            className="block text-sm font-medium mb-2"
                            style={{ color: "#fff" }}
                        >
                            OTP Code
                        </label>
                        <input
                            id="otp"
                            type="text"
                            name="otp"
                            placeholder="your 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            maxLength={8}
                            className="w-full px-4 py-3 rounded-lg text-center font-mono tracking-[0.2em]"
                            style={{
                                background: "#000",
                                color: "#fff",
                                border: "1px solid #fff",
                                outline: "none",
                                transition: "border-color 0.2s",
                                fontSize: "1.15rem",
                                letterSpacing: "0.2em"
                            }}
                            onFocus={e => (e.target.style.borderColor = "#fff")}
                            onBlur={e => (e.target.style.borderColor = "#fff")}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer border-4 border-black bg-blue-600 transition-all duration-100 ease-in-out select-none active:pb-0 active:mb-[10px] active:translate-y-[10px] inline-block pb-2 sm:pb-[10px] sm:active:pb-0 sm:active:mb-[10px] sm:active:translate-y-[10px] w-full"
                        style={{
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? "not-allowed" : "pointer"
                        }}
                    >
                        <div className="bg-blue-200 border-4 border-white w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-2 flex items-center justify-center">
                            {loading && (
                                <svg className="w-5 h-5 animate-spin mr-2" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#000" strokeWidth="4" fill="none" />
                                    <path className="opacity-80" fill="#000" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                            )}
                            <span className="text-base sm:text-[1.2rem] tracking-[0.5px] sm:tracking-[1px] text-black font-bold whitespace-nowrap">
                                {loading ? "Verifying..." : "Verify & Login"}
                            </span>
                        </div>
                    </button>
                </form>

                <div className="mt-8 text-center text-sm pb-2">
                    <Link
                        to="/login"
                        className="inline-block font-bold border-white border-2 p-4 text-white bg-black px-3 py-1 rounded-lg transition-all hover:bg-white hover:text-black hover:border-gray-500 hover:shadow-lg"
                        style={{
                            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                        }}
                        aria-label="Cancel and return to login"
                    >
                        Cancel & Return to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VerifyLoginOtp;