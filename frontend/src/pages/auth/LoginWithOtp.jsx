import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { requestLoginOtp } from "../../api/auth.api";
 

const LoginWithOtp = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await requestLoginOtp({ email });
            navigate("/login/otp/verify", {
                state: { email },
            });
        } catch (err) {
            setError(
                err?.response?.data?.error || "Failed to send OTP"
            );
        } finally {
            setLoading(false);
        }
    };

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
                            background: "#000",
                            borderColor: "#fff",
                            width: 48,
                            height: 48
                        }}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="white" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <h2
                        className="text-3xl font-bold mb-2"
                        style={{
                            color: "#fff",
                            letterSpacing: "0.02em"
                        }}
                    >
                        Login with OTP
                    </h2>
                    <p className="text-sm" style={{ color: "#bbb" }}>
                        Enter your email to receive a one-time password.
                    </p>
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

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium mb-2"
                            style={{ color: "#fff" }}
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            className="w-full px-4 py-3 rounded-lg"
                            style={{
                                background: "#000",
                                color: "#fff",
                                border: "1px solid #fff",
                                outline: "none",
                                transition: "border-color 0.2s",
                                fontSize: "1rem"
                            }}
                            onFocus={e => (e.target.style.borderColor = "#fff")}
                            onBlur={e => (e.target.style.borderColor = "#fff")}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="cursor-pointer border-4 border-black bg-gray-500 transition-all duration-100 ease-in-out select-none active:pb-0 active:mb-[10px] active:translate-y-[10px] inline-block pb-2 sm:pb-[10px] sm:active:pb-0 sm:active:mb-[10px] sm:active:translate-y-[10px] w-full "
                        style={{
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? "not-allowed" : "pointer"
                        }}
                    >
                        <div className="bg-gray-300 border-4 border-white w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-2 flex items-center justify-center">
                            {loading && (
                                <svg className="w-5 h-5 animate-spin mr-2" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#000" strokeWidth="4" fill="none" />
                                    <path className="opacity-80" fill="#000" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                            )}
                            <span className="text-base sm:text-[1.2rem] tracking-[0.5px] sm:tracking-[1px] text-black font-bold whitespace-nowrap">
                                {loading ? "Sending OTP..." : "Send OTP"}
                            </span>
                        </div>
                    </button>
                </form>

                <div className="mt-8 text-center text-sm pb-2">
                    <Link
                        to="/login"
                        className="inline-block font-bold border-white border-2 p-4 text-white bg-black px-3 py-1 rounded-lg transition-all hover:bg-white hover:text-black hover:border-gray-500  hover:shadow-lg"
                        style={{
                            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                        }}
                        aria-label="Back to Login"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Login
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginWithOtp;