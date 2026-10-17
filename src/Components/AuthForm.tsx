import React from "react";
import { Zap } from "lucide-react";
import { authClient } from "../lib/auth-client";


export default function AuthForm() {

    const [sign, setSign] = React.useState({ email: "", name: "", password: "" });
    const [isSigningIn, setIsSigningIn] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setLoading(true);
        const { error } = isSigningIn
            ? await authClient.signIn.email({ email: sign.email, password: sign.password })
            : await authClient.signUp.email({ email: sign.email, name: sign.name, password: sign.password });
        setError(error ? error.message ?? "An unknown error occurred" : null);
        setLoading(false);
    }

    function toggleMode() {
        setIsSigningIn(!isSigningIn);
        setError(null);
    }

    return (
        <div className="auth-screen">
            <div className="auth-brand">
                <p className="app-eyebrow">
                    <Zap size={13} strokeWidth={2.5} fill="currentColor" />
                    Daily tracker
                </p>
                <h1>Calorie Plan</h1>
            </div>

            <section className="card auth-card">
                <h2 className="auth-title">{isSigningIn ? "Welcome back" : "Create your account"}</h2>
                <p className="auth-subtitle">
                    {isSigningIn
                        ? "Log in to see your targets and food log."
                        : "Save your targets and meals across devices."}
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isSigningIn && (
                        <div className="form-row">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" name="name" value={sign.name} autoComplete="name" onChange={(e) => setSign({ ...sign, name: e.target.value })} required />
                        </div>
                    )}
                    <div className="form-row">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={sign.email} autoComplete="email" onChange={(e) => setSign({ ...sign, email: e.target.value })} required />
                    </div>
                    <div className="form-row">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" minLength={8} value={sign.password} autoComplete={isSigningIn ? "current-password" : "new-password"} onChange={(e) => setSign({ ...sign, password: e.target.value })} required />
                        {!isSigningIn && <span className="auth-hint">At least 8 characters</span>}
                    </div>

                    {error && <p className="auth-error" role="alert">{error}</p>}

                    <button type="submit" className="auth-submit" disabled={loading}>
                        {loading
                            ? (isSigningIn ? "Logging in…" : "Creating account…")
                            : (isSigningIn ? "Log in" : "Create account")}
                    </button>
                </form>

                <p className="auth-switch">
                    {isSigningIn ? "No account yet?" : "Already have an account?"}{" "}
                    <button type="button" className="auth-switch-link" onClick={toggleMode}>
                        {isSigningIn ? "Create one" : "Log in"}
                    </button>
                </p>
            </section>
        </div>
    )
}
