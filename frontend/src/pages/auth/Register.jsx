import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await register(form);
            navigate("/verify-email", { state: { email: form.email } });
        } catch (err) {
            setError(err?.response?.data?.error || "Registration failed");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{ background: "#000", color: "#fff", fontFamily: "sans-serif" }}
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
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                        </svg>
                    </div>
                    <h2
                        className="text-3xl font-bold mb-2"
                        style={{ color: "#fff", letterSpacing: "0.02em" }}
                    >
                        Create Account
                    </h2>
                    <p className="text-sm" style={{ color: "#bbb" }}>
                        Sign up for full access to monitoring.
                    </p>
                </div>
                {error && (
                    <div
                        className="mb-6 p-4 rounded-lg border text-sm text-center"
                        style={{
                            background: "#111",
                            color: "#fff",
                            borderColor: "#fff"
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium mb-2"
                            style={{ color: "#fff" }}
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            placeholder="johndoe"
                            value={form.username}
                            onChange={handleChange}
                            required
                            autoComplete="username"
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
                            value={form.email}
                            onChange={handleChange}
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
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium mb-2"
                            style={{ color: "#fff" }}
                        >
                            Password
                        </label>
                        <div style={{ position: "relative" }}>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Create a password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                                className="w-full px-4 py-3 rounded-lg pr-12" // add more right padding for the icon
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
                            <button
                                type="button"
                                onClick={() => setShowPassword((show) => !show)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                style={{
                                    position: "absolute",
                                    right: "0.75rem",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "none",
                                    border: "none",
                                    padding: 0,
                                    cursor: "pointer",
                                    color: "#bbb",
                                    height: "2rem",
                                    width: "2rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                                tabIndex={0}
                            >
                                {showPassword ? (
                                    // Eye Open SVG
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                ) : (
                                    // Eye Off SVG
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="22"
                                        height="22"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M17.94 17.94C16 19.27 14.11 20 12 20c-7 0-11-8-11-8a21.32 21.32 0 0 1 5.08-5.84"/>
                                        <path d="M1 1l22 22"/>
                                        <path d="M9.53 9.53a3.5 3.5 0 0 1 4.95 4.95"/>
                                        <path d="M14.47 14.47L14.5 14.5"/>
                                    </svg>
                                )}
                            </button>
                        </div>
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
                        <div className="bg-[#dddddd] border-4 border-white w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-2 flex items-center justify-center">
                            {loading && (
                                <svg className="w-5 h-5 animate-spin mr-2" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#000" strokeWidth="4" fill="none" />
                                    <path className="opacity-80" fill="#000" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                            )}
                            <span className="text-base sm:text-[1.2rem] tracking-[0.5px] sm:tracking-[1px] text-black font-bold whitespace-nowrap">
                              {loading ? "Creating account..." : "Register"}
                            </span>
                        </div>
                    </button>
                </form>

                <div className="mt-8 text-center text-sm pb-2">
                    <span className="text-black/80 dark:text-white/70">
                        Already have an account?
                    </span>
                    <Link
                        to="/login"
                        className="inline-block font-bold ml-2 border-white border-2 p-4 text-white bg-black px-3 py-1 rounded-lg transition-all hover:bg-white hover:text-black hover:border-gray-500  hover:shadow-lg"
                        style={{
                            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                        }}
                        aria-label="Sign in to your account"
                    >
                        Sign in
                    </Link>
                </div> 
            </div>
        </div>
    );
};

export default Register;