import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { resendVerifyOtp } from "../../api/auth.api";

// Helper function to mask email with asterisks
function maskEmail(email) {
    if (!email) return "";
    // Show only first character of local part and domain, mask the rest
    const [local, domain] = email.split("@");
    if (!local || !domain) return "***@***";
    let maskedLocal;
    if (local.length <= 2) {
        maskedLocal = local[0] + "*".repeat(local.length - 1);
    } else {
        maskedLocal = local[0] + "*".repeat(local.length - 2) + local[local.length - 1];
    }
    // Do similar masking for domain before dot
    const [domainName, ...domainRest] = domain.split(".");
    let maskedDomain;
    if (domainName.length <= 2) {
        maskedDomain = domainName[0] + "*".repeat(domainName.length - 1);
    } else {
        maskedDomain = domainName[0] + "*".repeat(domainName.length - 2) + domainName[domainName.length - 1];
    }
    return (
        maskedLocal +
        "@" +
        maskedDomain +
        (domainRest.length > 0 ? "." + domainRest.join(".") : "")
    );
}

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyEmail, loginwithTokens } = useAuth();

    const email = location.state?.email;

    const [otp, setOtp] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const data = await verifyEmail({ email, otp });
            loginwithTokens(data);
            navigate("/login");
        } catch (err) {
            setError(err?.response?.data?.error || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError(null);
        setResendLoading(true);

        try {
            await resendVerifyOtp({ email });
        } catch (err) {
            setError(err?.response?.data?.error || "Resend failed");
        } finally {
            setResendLoading(false);
        }
    };

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
                        borderColor: "#222",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                    }}
                >
                    <div
                        className="p-3 rounded-full border mb-4 flex items-center justify-center"
                        style={{
                            background: "#210a0a",
                            borderColor: "#ff4455",
                            width: 48,
                            height: 48,
                            marginBottom: 20,
                        }}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="#ff4455" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Invalid Session</h2>
                    <p style={{ color: "#bbb" }} className="mb-6">Please try registering again to verify your email.</p>
                    <Link
                        to="/register"
                        className="px-6 py-2 bg-black border-white border-2 rounded-lg text-white font-bold transition-all hover:bg-white hover:text-black hover:border-gray-500 hover:shadow-lg"
                        style={{
                            boxShadow: "0 1px 4px rgba(0,0,0,0.07)"
                        }}
                    >
                        Back to Register
                    </Link>
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
                            background: "#00153b",
                            borderColor: "#6eaefd",
                            width: 48,
                            height: 48
                        }}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="#6eaefd" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                        </svg>
                    </div>
                    <h2
                        className="text-3xl font-bold mb-2"
                        style={{
                            color: "#fff",
                            letterSpacing: "0.02em"
                        }}
                    >
                        Verify your email
                    </h2>
                    <p className="text-sm" style={{ color: "#bbb" }}>
                        We've sent a one-time password (OTP) to:
                    </p>
                    <span
                        className="text-blue-400 text-sm font-medium break-all mt-1"
                        style={{ wordBreak: "break-all", marginTop: 5, letterSpacing: "1px" }}
                    >
                        {maskEmail(email)}
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
                            Enter OTP
                        </label>
                        <input
                            id="otp"
                            type="text"
                            placeholder="e.g. 123456"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg text-center tracking-widest font-mono text-lg"
                            style={{
                                background: "#000",
                                color: "#fff",
                                border: "1px solid #fff",
                                outline: "none",
                                transition: "border-color 0.2s",
                                fontSize: "1rem"
                            }}
                            onFocus={e => (e.target.style.borderColor = "#6eaefd")}
                            onBlur={e => (e.target.style.borderColor = "#fff")}
                            autoComplete="one-time-code"
                            inputMode="numeric"
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
                        <div className="bg-gray-500 border-4 border-white w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-2 flex items-center justify-center">
                            {loading && (
                                <svg className="w-5 h-5 animate-spin mr-2" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#000" strokeWidth="4" fill="none" />
                                    <path className="opacity-80" fill="#000" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                            )}
                            <span className="text-base sm:text-[1.2rem] tracking-[0.5px] sm:tracking-[1px] text-black font-bold whitespace-nowrap">
                              {loading ? "Verifying..." : "Verify Email"}
                            </span>
                        </div>
                    </button>
                    
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resendLoading}
                        className="cursor-pointer border-4 border-black bg-gray-500 transition-all duration-100 ease-in-out select-none active:pb-0 active:mb-[10px] active:translate-y-[10px] inline-block pb-2 sm:pb-[10px] sm:active:pb-0 sm:active:mb-[10px] sm:active:translate-y-[10px] w-full "
                        style={{
                            opacity: resendLoading ? 0.7 : 1,
                            cursor: resendLoading ? "not-allowed" : "pointer"
                        }}
                    >
                        <div className="bg-gray-300 border-4 border-white w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-2 flex items-center justify-center">
                            {resendLoading && (
                                <svg className="w-5 h-5 animate-spin mr-2" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#000" strokeWidth="4" fill="none" />
                                    <path className="opacity-80" fill="#000" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                            )}
                            <span className="text-base sm:text-[1.2rem] tracking-[0.5px] sm:tracking-[1px] text-black font-bold whitespace-nowrap">
                              {resendLoading ? "Resending..." : "Resend OTP"}
                            </span>
                        </div>
                    </button>
                </form>
                
                <div className="mt-8 text-center text-sm pb-2">
                    <Link
                        to="/register"
                        className="inline-block font-bold ml-2 border-white border-2 p-4 text-white bg-black px-3 py-1 rounded-lg transition-all hover:bg-white hover:text-black hover:border-gray-500 hover:shadow-lg"
                        style={{
                            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                        }}
                    >
                        Wrong email? Go back
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;